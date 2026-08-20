const { MongoClient } = require('mongodb');

const SOURCE_URI = 'mongodb+srv://lovelysingh8966_db_user:admin123@cluster0.vtcscof.mongodb.net/Vrudatabase?retryWrites=true&w=majority';
const TARGET_URI = 'mongodb+srv://vrushahiimpex_db_user:LPCEQYrFcpwF5KNM@cluster0.wel06jb.mongodb.net/Vruimpexdb?retryWrites=true&w=majority';

async function migrate() {
  console.log('🚀 Starting MongoDB Migration...\n');

  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(TARGET_URI);

  try {
    console.log('⏳ Connecting to Source Database (Vrudatabase)...');
    await sourceClient.connect();
    console.log('✅ Connected to Source Database.');

    console.log('⏳ Connecting to Target Database (Vruimpexdb)...');
    await targetClient.connect();
    console.log('✅ Connected to Target Database.\n');

    const sourceDb = sourceClient.db('Vrudatabase');
    const targetDb = targetClient.db('Vruimpexdb');

    // Get all collections from source
    const collections = await sourceDb.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collection(s) in source database:\n`);

    const summary = [];

    for (const colInfo of collections) {
      const colName = colInfo.name;

      // Skip system collections
      if (colName.startsWith('system.')) {
        console.log(`⏩ Skipping system collection: ${colName}`);
        continue;
      }

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📦 Processing collection: [${colName}]`);

      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      const sourceDocCount = await sourceCol.countDocuments();
      console.log(`   Source document count: ${sourceDocCount}`);

      // Clear existing docs in target collection to prevent duplicate key errors on fresh migration
      const existingTargetCount = await targetCol.countDocuments();
      if (existingTargetCount > 0) {
        console.log(`   ⚠️ Target collection already has ${existingTargetCount} docs. Clearing target collection...`);
        await targetCol.deleteMany({});
      }

      if (sourceDocCount > 0) {
        // Fetch all documents in batches or all if fitting in memory
        const docs = await sourceCol.find({}).toArray();
        console.log(`   Transferring ${docs.length} documents to target...`);
        
        // Insert docs in batches of 500
        const batchSize = 500;
        for (let i = 0; i < docs.length; i += batchSize) {
          const batch = docs.slice(i, i + batchSize);
          await targetCol.insertMany(batch, { ordered: false });
        }
      }

      // Recreate custom indexes
      try {
        const indexes = await sourceCol.indexes();
        for (const index of indexes) {
          if (index.name === '_id_') continue; // skip default _id index
          const { key, name, unique, sparse, background, expireAfterSeconds } = index;
          const options = { name };
          if (unique !== undefined) options.unique = unique;
          if (sparse !== undefined) options.sparse = sparse;
          if (background !== undefined) options.background = background;
          if (expireAfterSeconds !== undefined) options.expireAfterSeconds = expireAfterSeconds;

          await targetCol.createIndex(key, options);
          console.log(`   🔑 Index recreated: ${name}`);
        }
      } catch (idxErr) {
        console.warn(`   ⚠️ Could not copy indexes for ${colName}:`, idxErr.message);
      }

      // Verification count
      const targetDocCount = await targetCol.countDocuments();
      const isMatch = sourceDocCount === targetDocCount;
      console.log(`   Target document count: ${targetDocCount} (${isMatch ? '✅ MATCH' : '❌ MISMATCH'})`);

      summary.push({
        collection: colName,
        sourceCount: sourceDocCount,
        targetCount: targetDocCount,
        status: isMatch ? 'SUCCESS' : 'FAILED',
      });
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log('🎉 MIGRATION SUMMARY REPORT:');
    console.table(summary);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  } finally {
    await sourceClient.close();
    await targetClient.close();
    console.log('🔒 Database connections closed.');
  }
}

migrate();
