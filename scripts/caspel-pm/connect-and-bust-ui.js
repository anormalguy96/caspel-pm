const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

console.log('=== Step 1: Patching dev/docker-compose.yaml to mount ./prod/dist ===');
const composePath = path.resolve('dev/docker-compose.yaml');
let composeContent = fs.readFileSync(composePath, 'utf8');

if (!composeContent.includes('./prod/dist:/app/dist')) {
  // Find "front:" and its ports or links
  const target = `    ports:
      - 8087:8080
      - 8088:8080`;
  const replacement = `    ports:
      - 8087:8080
      - 8088:8080
    volumes:
      - ./prod/dist:/app/dist`;
  if (composeContent.includes(target)) {
    composeContent = composeContent.replace(target, replacement);
    fs.writeFileSync(composePath, composeContent, 'utf8');
    console.log('Successfully added volume mount to dev/docker-compose.yaml');
  } else {
    console.error('Could not find target ports block in dev/docker-compose.yaml');
  }
} else {
  console.log('dev/docker-compose.yaml already has ./prod/dist:/app/dist volume mount');
}

console.log('\n=== Step 2: Webpack Chunk Hash Busting in dev/prod/dist ===');
const distDir = path.resolve('dev/prod/dist');
const bundlePath = path.join(distDir, 'bundle.0854079362ce43d3ef8a.js');

let bundleContent = fs.readFileSync(bundlePath, 'utf8');

const oldLoginChunkKey = '29614:"d85bc7d194e7b0cfc6f6"';
const newLoginChunkKey = '29614:"caspelrev1loginchunk"';

const oldSelectWsChunkKey = '81373:"a2dc27c3c90c4ba900b1"';
const newSelectWsChunkKey = '81373:"caspelrev1selectwsch"';

let bundleUpdated = false;
if (bundleContent.includes(oldLoginChunkKey)) {
  bundleContent = bundleContent.replace(oldLoginChunkKey, newLoginChunkKey);
  bundleUpdated = true;
  console.log('Replaced chunk 29614 hash mapping in bundle.js');
} else if (bundleContent.includes(newLoginChunkKey)) {
  console.log('chunk 29614 hash already busted to caspelrev1loginchunk');
}

if (bundleContent.includes(oldSelectWsChunkKey)) {
  bundleContent = bundleContent.replace(oldSelectWsChunkKey, newSelectWsChunkKey);
  bundleUpdated = true;
  console.log('Replaced chunk 81373 hash mapping in bundle.js');
} else if (bundleContent.includes(newSelectWsChunkKey)) {
  console.log('chunk 81373 hash already busted to caspelrev1selectwsch');
}

// Write updated bundle.0854079362ce43d3ef8a.js
fs.writeFileSync(bundlePath, bundleContent, 'utf8');
const bundleGz = zlib.gzipSync(Buffer.from(bundleContent, 'utf8'), { level: 9 });
fs.writeFileSync(bundlePath + '.gz', bundleGz);
console.log('Saved and gzipped bundle.0854079362ce43d3ef8a.js');

// Also create a cache-busted bundle copy: bundle.caspelrev1000000000.js
const bustedBundleName = 'bundle.caspelrev1000000000.js';
const bustedBundlePath = path.join(distDir, bustedBundleName);
fs.writeFileSync(bustedBundlePath, bundleContent, 'utf8');
fs.writeFileSync(bustedBundlePath + '.gz', bundleGz);
console.log(`Saved and gzipped cache-busted ${bustedBundleName}`);

// Copy chunk 29614 to caspelrev1loginchunk
const chunk29614Src = path.join(distDir, '29614.d85bc7d194e7b0cfc6f6.js');
const chunk29614Dest = path.join(distDir, '29614.caspelrev1loginchunk.js');
const chunk29614Content = fs.readFileSync(chunk29614Src, 'utf8');
fs.writeFileSync(chunk29614Dest, chunk29614Content, 'utf8');
const chunk29614Gz = zlib.gzipSync(Buffer.from(chunk29614Content, 'utf8'), { level: 9 });
fs.writeFileSync(chunk29614Dest + '.gz', chunk29614Gz);
console.log('Saved and gzipped 29614.caspelrev1loginchunk.js');

// Copy chunk 81373 to caspelrev1selectwsch
const chunk81373Src = path.join(distDir, '81373.a2dc27c3c90c4ba900b1.js');
const chunk81373Dest = path.join(distDir, '81373.caspelrev1selectwsch.js');
const chunk81373Content = fs.readFileSync(chunk81373Src, 'utf8');
fs.writeFileSync(chunk81373Dest, chunk81373Content, 'utf8');
const chunk81373Gz = zlib.gzipSync(Buffer.from(chunk81373Content, 'utf8'), { level: 9 });
fs.writeFileSync(chunk81373Dest + '.gz', chunk81373Gz);
console.log('Saved and gzipped 81373.caspelrev1selectwsch.js');

console.log('\n=== Step 3: Updating dev/prod/dist/index.html with cache-busted bundle ===');
const indexPath = path.join(distDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
// Update bundle script to use the fresh bundle name
indexContent = indexContent.replace(/bundle\.[a-zA-Z0-9_-]+\.js/, bustedBundleName);
fs.writeFileSync(indexPath, indexContent, 'utf8');
const indexGz = zlib.gzipSync(Buffer.from(indexContent, 'utf8'), { level: 9 });
fs.writeFileSync(indexPath + '.gz', indexGz);
console.log('Saved and gzipped index.html pointing to', bustedBundleName);

console.log('\n=== Step 4: Patching container /app/bundle.js maxAge to 000s ===');
try {
  let containerServerBundle = execSync('docker exec dev-front-1 cat /app/bundle.js', { maxBuffer: 30 * 1024 * 1024 }).toString();
  if (containerServerBundle.includes('maxAge:"365d"')) {
    containerServerBundle = containerServerBundle.replace('maxAge:"365d"', 'maxAge:"000s"');
    const tempServerBundlePath = path.resolve('scratch/container-server-bundle.js');
    if (!fs.existsSync(path.resolve('scratch'))) fs.mkdirSync(path.resolve('scratch'), { recursive: true });
    fs.writeFileSync(tempServerBundlePath, containerServerBundle, 'utf8');
    execSync(`docker cp ${tempServerBundlePath} dev-front-1:/app/bundle.js`);
    console.log('Patched container /app/bundle.js maxAge to 000s');
  } else {
    console.log('Container /app/bundle.js already patched or does not contain maxAge:"365d"');
  }
} catch (err) {
  console.error('Error patching /app/bundle.js:', err.message);
}

console.log('\n=== Step 5: Copying files to container /app/dist as well ===');
try {
  execSync(`docker cp ${distDir}/. dev-front-1:/app/dist/`);
  console.log('Files copied to dev-front-1:/app/dist/');
} catch (err) {
  console.error('Error copying to container /app/dist:', err.message);
}

console.log('\nDone!');
