const cloudinary = require('cloudinary').v2;
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SOURCE_CONFIG = {
  cloud_name: 'demo761',
  api_key: '441876885629929',
  api_secret: 'gJR5mDaNeTNE9LCFsV2CTTj5H_U',
  secure: true,
};

const TARGET_CONFIG = {
  cloud_name: 'pphrkuol',
  api_key: '612749661821151',
  api_secret: 'URRPjGzIoLvFsewfcBw0B2-p3Ds',
  secure: true,
};

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vrushahiimpex_db_user:LPCEQYrFcpwF5KNM@cluster0.wel06jb.mongodb.net/Vruimpexdb?retryWrites=true&w=majority';

// Helper to replace recursive demo761 string occurrences in an object/array
function replaceCloudinaryInObject(obj) {
  if (!obj) return { modified: false, value: obj };
  let hasModified = false;

  if (typeof obj === 'string') {
    if (obj.includes('demo761')) {
      const newStr = obj.replace(/demo761/g, 'pphrkuol');
      return { modified: true, value: newStr };
    }
    return { modified: false, value: obj };
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (let item of obj) {
      const res = replaceCloudinaryInObject(item);
      if (res.modified) hasModified = true;
      newArr.push(res.value);
    }
    return { modified: hasModified, value: newArr };
  }

  if (typeof obj === 'object' && obj !== null) {
    // Check if it's a BSON type (like ObjectId or Date) that shouldn't be recursed like normal objects
    if (obj._bsontype || obj instanceof Date) {
      return { modified: false, value: obj };
    }
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const res = replaceCloudinaryInObject(obj[key]);
      if (res.modified) hasModified = true;
      newObj[key] = res.value;
    }
    return { modified: hasModified, value: newObj };
  }

  return { modified: false, value: obj };
}

// Helper to extract all demo761 URLs from DB documents
function extractUrls(obj, foundUrls = new Set()) {
  if (!obj) return foundUrls;
  if (typeof obj === 'string') {
    if (obj.includes('res.cloudinary.com/demo761')) {
      foundUrls.add(obj);
    }
    return foundUrls;
  }
  if (Array.isArray(obj)) {
    for (let item of obj) extractUrls(item, foundUrls);
  } else if (typeof obj === 'object' && obj !== null && !obj._bsontype && !(obj instanceof Date)) {
    for (let k of Object.keys(obj)) extractUrls(obj[k], foundUrls);
  }
  return foundUrls;
}

async function fetchAllCloudinaryAssets(resourceType) {
  let assets = [];
  let nextCursor = null;

  try {
    do {
      const res = await cloudinary.api.resources(
        {
          resource_type: resourceType,
          type: 'upload',
          max_results: 500,
          next_cursor: nextCursor,
        },
        SOURCE_CONFIG
      );

      if (res.resources && res.resources.length > 0) {
        assets = assets.concat(res.resources);
      }
      nextCursor = res.next_cursor;
    } while (nextCursor);
  } catch (err) {
    console.warn(`⚠️ Warning fetching ${resourceType} list from source Cloudinary API:`, err.message);
  }

  return assets;
}

async function migrateCloudinary() {
  console.log('🚀 Starting Cloudinary Migration & Database URL Update...\n');
  console.log(`Source Cloud: ${SOURCE_CONFIG.cloud_name}`);
  console.log(`Target Cloud: ${TARGET_CONFIG.cloud_name}\n`);

  // Step 1: Connect to MongoDB
  console.log('⏳ Connecting to MongoDB...');
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db();
  console.log(`✅ Connected to DB: ${db.databaseName}\n`);

  // Step 2: Discover all assets from Source Cloudinary API
  console.log('🔍 Scanning Source Cloudinary for all assets (image, video, raw)...');
  const [images, videos, raws] = await Promise.all([
    fetchAllCloudinaryAssets('image'),
    fetchAllCloudinaryAssets('video'),
    fetchAllCloudinaryAssets('raw'),
  ]);

  const allAssetsMap = new Map();
  for (const item of images) allAssetsMap.set(item.secure_url, { ...item, resource_type: 'image' });
  for (const item of videos) allAssetsMap.set(item.secure_url, { ...item, resource_type: 'video' });
  for (const item of raws) allAssetsMap.set(item.secure_url, { ...item, resource_type: 'raw' });

  console.log(`Found via Cloudinary API: ${images.length} image(s), ${videos.length} video(s), ${raws.length} raw file(s).`);

  // Step 3: Discover all URLs mentioned in MongoDB
  console.log('🔍 Scanning MongoDB documents for Cloudinary URLs...');
  const collections = await db.listCollections().toArray();
  const dbUrls = new Set();

  for (const col of collections) {
    if (col.name.startsWith('system.')) continue;
    const docs = await db.collection(col.name).find({}).toArray();
    for (const doc of docs) {
      extractUrls(doc, dbUrls);
    }
  }

  console.log(`Found ${dbUrls.size} unique Cloudinary URL(s) in MongoDB database.`);

  // Combine URLs found in DB that might not have been returned by API
  for (const url of dbUrls) {
    if (!allAssetsMap.has(url)) {
      // Determine resource_type from url
      let resType = 'image';
      if (url.includes('/video/upload/')) resType = 'video';
      else if (url.includes('/raw/upload/')) resType = 'raw';

      // Extract public_id from url
      // e.g. https://res.cloudinary.com/demo761/image/upload/v12345/vrushahi/products/sample.jpg
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      const publicId = match ? match[1] : undefined;

      allAssetsMap.set(url, {
        secure_url: url,
        public_id: publicId,
        resource_type: resType,
      });
    }
  }

  console.log(`\n📦 Total unique asset(s) to migrate: ${allAssetsMap.size}\n`);

  // Step 4: Transfer assets to Target Cloudinary
  let successCount = 0;
  let failCount = 0;
  const assetList = Array.from(allAssetsMap.values());

  for (let i = 0; i < assetList.length; i++) {
    const asset = assetList[i];
    console.log(`[${i + 1}/${assetList.length}] Transferring ${asset.resource_type}: ${asset.public_id || asset.secure_url}...`);

    try {
      const uploadOptions = {
        resource_type: asset.resource_type || 'auto',
        overwrite: true,
        invalidate: true,
        ...TARGET_CONFIG,
      };

      if (asset.public_id) {
        uploadOptions.public_id = asset.public_id;
      }

      const result = await cloudinary.uploader.upload(asset.secure_url, uploadOptions);
      console.log(`   ✅ Transferred -> ${result.secure_url}`);
      successCount++;
    } catch (uploadErr) {
      console.error(`   ❌ Failed to transfer ${asset.secure_url}:`, uploadErr.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Asset Transfer Complete: ${successCount} succeeded, ${failCount} failed.\n`);

  // Step 5: Update MongoDB database URLs
  console.log('🔄 Updating database document URLs (demo761 -> pphrkuol)...');
  let totalDocsUpdated = 0;

  for (const col of collections) {
    if (col.name.startsWith('system.')) continue;
    const collection = db.collection(col.name);
    const docs = await collection.find({}).toArray();
    let colUpdated = 0;

    for (const doc of docs) {
      const { modified, value: newDoc } = replaceCloudinaryInObject(doc);
      if (modified) {
        const { _id, ...updateFields } = newDoc;
        await collection.replaceOne({ _id: doc._id }, newDoc);
        colUpdated++;
        totalDocsUpdated++;
      }
    }

    if (colUpdated > 0) {
      console.log(`   📝 Collection [${col.name}]: updated ${colUpdated} document(s).`);
    }
  }

  console.log(`\n✅ Database update complete. Total ${totalDocsUpdated} document(s) updated across all collections.\n`);

  await mongoClient.close();
  console.log('🔒 MongoDB connection closed.');
}

migrateCloudinary().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
