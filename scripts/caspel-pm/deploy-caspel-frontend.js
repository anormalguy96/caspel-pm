const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');

async function main() {
  console.log('=== Caspel PM Frontend Final Deployment ===');

  // 1. Copy authentic logo assets to public and dist
  console.log('\n--- Step 1: Deploying Authentic Caspel Logo Assets ---');
  const darkLogoSrc = path.join(root, 'logos/caspel_logo_no_bg-recolored.png');
  const lightLogoSrc = path.join(root, 'logos/caspel_logo_no_bg.png');

  const targets = [
    { src: darkLogoSrc, dsts: ['dev/prod/public/caspel-pm/caspel-logo-dark.png', 'dev/prod/public/caspel-pm/logo-dark.png', 'dev/prod/dist/caspel-pm/caspel-logo-dark.png', 'dev/prod/dist/caspel-pm/logo-dark.png'] },
    { src: lightLogoSrc, dsts: ['dev/prod/public/caspel-pm/caspel-logo-light.png', 'dev/prod/public/caspel-pm/logo-light.png', 'dev/prod/dist/caspel-pm/caspel-logo-light.png', 'dev/prod/dist/caspel-pm/logo-light.png'] }
  ];

  for (const t of targets) {
    for (const rel of t.dsts) {
      const full = path.join(root, rel);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.copyFileSync(t.src, full);
      console.log('Copied to', rel);
    }
  }

  // Copy to container /app/dist/caspel-pm
  execSync('docker cp "dev/prod/dist/caspel-pm" dev-front-1:/app/dist/');
  console.log('Copied caspel-pm assets into dev-front-1:/app/dist/caspel-pm');

  // 2. Patch 29614.d85bc7d194e7b0cfc6f6.js
  console.log('\n--- Step 2: Patching 29614.d85bc7d194e7b0cfc6f6.js ---');
  let js29614 = execSync('docker exec dev-front-1 cat /app/dist/29614.d85bc7d194e7b0cfc6f6.js', { maxBuffer: 20 * 1024 * 1024 }).toString();

  // Fix any accidental a.$.fragment from previous run
  if (js29614.includes('a.$.fragment')) {
    js29614 = js29614.replaceAll('a.$.fragment', () => 'a.$$.fragment');
    console.log('Repaired a.$$.fragment in 29614');
  }

  // A. Replace 3-stripe SVG na(e) functions
  const oldSvgNa = 'function na(e){let t,n,o,a,i;return{c(){t=(0,r.QQy)("svg"),n=(0,r.QQy)("rect"),o=(0,r.QQy)("rect"),a=(0,r.QQy)("rect"),i=(0,r.QQy)("rect"),(0,r.CFu)(n,"width","64"),(0,r.CFu)(n,"height","64"),(0,r.CFu)(n,"rx","14"),(0,r.CFu)(n,"fill","#0A2A3D"),(0,r.CFu)(o,"x","14"),(0,r.CFu)(o,"y","16"),(0,r.CFu)(o,"width","10"),(0,r.CFu)(o,"height","32"),(0,r.CFu)(o,"rx","3"),(0,r.CFu)(o,"fill","#FFFFFF"),(0,r.CFu)(a,"x","27"),(0,r.CFu)(a,"y","16"),(0,r.CFu)(a,"width","10"),(0,r.CFu)(a,"height","22"),(0,r.CFu)(a,"rx","3"),(0,r.CFu)(a,"fill","#FFFFFF"),(0,r.CFu)(i,"x","40"),(0,r.CFu)(i,"y","16"),(0,r.CFu)(i,"width","10"),(0,r.CFu)(i,"height","14"),(0,r.CFu)(i,"rx","3"),(0,r.CFu)(i,"fill","#4CAF50"),(0,r.CFu)(t,"xmlns","http://www.w3.org/2000/svg"),(0,r.CFu)(t,"width","20"),(0,r.CFu)(t,"height","20"),(0,r.CFu)(t,"viewBox","0 0 64 64"),(0,r.CFu)(t,"aria-hidden","true")},m(e,s){(0,r.Yry)(e,t,s),(0,r.BCw)(t,n),(0,r.BCw)(t,o),(0,r.BCw)(t,a),(0,r.BCw)(t,i)},p:r.lQ1,i:r.lQ1,o:r.lQ1,d(e){e&&(0,r.YoD)(t)}}}';
  const newImgNa = 'function na(e){let t;return{c(){t=(0,r.ND4)("img"),(0,r.CFu)(t,"src","/caspel-pm/caspel-logo-dark.png"),(0,r.CFu)(t,"alt","Caspel PM"),(0,r.CFu)(t,"style","height:38px;width:auto;max-width:280px;object-fit:contain;vertical-align:middle;")},m(e,s){(0,r.Yry)(e,t,s)},p:r.lQ1,i:r.lQ1,o:r.lQ1,d(e){e&&(0,r.YoD)(t)}}}';

  if (js29614.includes(oldSvgNa)) {
    js29614 = js29614.replaceAll(oldSvgNa, () => newImgNa);
    console.log('Replaced 3-stripe SVG in 29614 with authentic Caspel logo');
  }

  // B. Hide the text span so only the authentic Caspel logo is displayed
  const oldSpanTexts = [
    'c=(0,r.ND4)("span"),c.textContent="PM"',
    'c=(0,r.ND4)("span"),c.textContent=`${(0,l.getMetadata)(A.default.metadata.PlatformTitle)}`'
  ];
  for (const t of oldSpanTexts) {
    if (js29614.includes(t)) {
      js29614 = js29614.replaceAll(t, () => 'c=(0,r.ND4)("span"),c.textContent=""');
      console.log('Cleared span text in 29614');
    }
  }

  const oldSpanClasses = [
    '(0,r.CFu)(c,"class","fs-title ml-2"),(0,r.CFu)(c,"style","font-weight:700;font-size:1.15rem;color:#4CAF50;letter-spacing:1px;vertical-align:middle;")',
    '(0,r.CFu)(c,"class","fs-title ml-2")'
  ];
  for (const c of oldSpanClasses) {
    if (js29614.includes(c)) {
      js29614 = js29614.replaceAll(c, () => '(0,r.CFu)(c,"class","fs-title ml-2"),(0,r.hgi)(c,"display","none")');
      console.log('Hidden fs-title ml-2 span in 29614');
    }
  }

  // C. Eradicate Sign Up tab: replace tn(e) and nn(e)
  const oldTnNn = 'function tn(e){let t,n,o,a,i;return n=new u.Label({props:{label:g.string.SignUp}}),{c(){t=(0,r.ND4)("a"),(0,r.N0i)(n.$$.fragment),(0,r.CFu)(t,"class","title svelte-1yk7gsb"),(0,r.CFu)(t,"href","."),(0,r.goL)(t,"selected","signup"===e[0])},m(s,l){(0,r.Yry)(s,t,l),(0,r.wSR)(n,t,null),o=!0,a||(i=(0,r.KTR)(t,"click",(0,r.xZN)(e[3])),a=!0)},p(e,n){(!o||1&n)&&(0,r.goL)(t,"selected","signup"===e[0])},i(e){o||((0,r.c7F)(n.$$.fragment,e),o=!0)},o(e){(0,r.Tn8)(n.$$.fragment,e),o=!1},d(e){e&&(0,r.YoD)(t),(0,r.Hbl)(n),a=!1,i()}}}function nn(e){let t,n,o,a,i,s,l,c=!e[1]&&tn(e);return a=new u.Label({props:{label:g.string.LogIn}}),{c(){t=(0,r.ND4)("div"),c&&c.c(),n=(0,r.xem)(),o=(0,r.ND4)("a"),(0,r.N0i)(a.$$.fragment),(0,r.CFu)(o,"class","title svelte-1yk7gsb"),(0,r.CFu)(o,"href","."),(0,r.goL)(o,"selected","login"===e[0]),(0,r.CFu)(t,"class","flex-row-center caption svelte-1yk7gsb")},m(u,d){(0,r.Yry)(u,t,d),c&&c.m(t,null),(0,r.BCw)(t,n),(0,r.BCw)(t,o),(0,r.wSR)(a,o,null),i=!0,s||(l=(0,r.KTR)(o,"click",(0,r.xZN)(e[4])),s=!0)},p(e,[a]){e[1]?c&&((0,r.V44)(),(0,r.Tn8)(c,1,1,()=>{c=null}),(0,r.GYV)()):c?(c.p(e,a),2&a&&(0,r.c7F)(c,1)):(c=tn(e),c.c(),(0,r.c7F)(c,1),c.m(t,n)),(!i||1&a)&&(0,r.goL)(o,"selected","login"===e[0])},i(e){i||((0,r.c7F)(c),(0,r.c7F)(a.$$.fragment,e),i=!0)},o(e){(0,r.Tn8)(c),(0,r.Tn8)(a.$$.fragment,e),i=!1},d(e){e&&(0,r.YoD)(t),c&&c.d(),(0,r.Hbl)(a),s=!1,l()}}}';
  const newTnNn = 'function tn(e){return{c(){},m(){},p(){},i(){},o(){},d(){}}}function nn(e){let t,n,o,a,i;return a=new u.Label({props:{label:g.string.LogIn}}),{c(){t=(0,r.ND4)("div"),n=(0,r.xem)(),o=(0,r.ND4)("h2"),(0,r.N0i)(a.$$.fragment),(0,r.CFu)(o,"class","title svelte-1yk7gsb"),(0,r.CFu)(t,"class","flex-row-center caption svelte-1yk7gsb")},m(u,d){(0,r.Yry)(u,t,d),(0,r.BCw)(t,n),(0,r.BCw)(t,o),(0,r.wSR)(a,o,null),i=!0},p:r.lQ1,i(e){i||((0,r.c7F)(a.$$.fragment,e),i=!0)},o(e){(0,r.Tn8)(a.$$.fragment,e),i=!1},d(e){e&&(0,r.YoD)(t),(0,r.Hbl)(a)}}}';

  if (js29614.includes(oldTnNn)) {
    js29614 = js29614.replaceAll(oldTnNn, () => newTnNn);
    console.log('Eradicated Sign Up tab from 29614 (only Log In remains)');
  }

  // Write patched 29614 chunk and all cache-busted copies
  const chunk29614Files = [
    '29614.d85bc7d194e7b0cfc6f6.js',
    '29614.caspelrev1loginchunk.js',
    '29614.caspelrev2loginchunk.js',
    '29614.caspelrev3loginchunk.js'
  ];
  const gz29614 = zlib.gzipSync(Buffer.from(js29614));
  for (const name of chunk29614Files) {
    const p = path.join(root, 'dev/prod/dist', name);
    fs.writeFileSync(p, js29614);
    fs.writeFileSync(p + '.gz', gz29614);
    try {
      execSync(`docker cp "${p}" dev-front-1:/app/dist/${name}`);
      execSync(`docker cp "${p}.gz" dev-front-1:/app/dist/${name}.gz`);
      console.log(`Deployed patched ${name} and .gz to container`);
    } catch (e) {
      console.log(`(docker cp for ${name}: ${e.message})`);
    }
  }

  // 3. Patch 81373.a2dc27c3c90c4ba900b1.js
  console.log('\n--- Step 3: Patching 81373.a2dc27c3c90c4ba900b1.js ---');
  let js81373 = execSync('docker exec dev-front-1 cat /app/dist/81373.a2dc27c3c90c4ba900b1.js', { maxBuffer: 20 * 1024 * 1024 }).toString();

  const oldSvgH = 'function h(e){let t,n,r,a,s;return{c(){t=(0,o.QQy)("svg"),n=(0,o.QQy)("rect"),r=(0,o.QQy)("rect"),a=(0,o.QQy)("rect"),s=(0,o.QQy)("rect"),(0,o.CFu)(n,"width","64"),(0,o.CFu)(n,"height","64"),(0,o.CFu)(n,"rx","14"),(0,o.CFu)(n,"fill","#0A2A3D"),(0,o.CFu)(r,"x","14"),(0,o.CFu)(r,"y","16"),(0,o.CFu)(r,"width","10"),(0,o.CFu)(r,"height","32"),(0,o.CFu)(r,"rx","3"),(0,o.CFu)(r,"fill","#FFFFFF"),(0,o.CFu)(a,"x","27"),(0,o.CFu)(a,"y","16"),(0,o.CFu)(a,"width","10"),(0,o.CFu)(a,"height","22"),(0,o.CFu)(a,"rx","3"),(0,o.CFu)(a,"fill","#FFFFFF"),(0,o.CFu)(s,"x","40"),(0,o.CFu)(s,"y","16"),(0,o.CFu)(s,"width","10"),(0,o.CFu)(s,"height","14"),(0,o.CFu)(s,"rx","3"),(0,o.CFu)(s,"fill","#4CAF50"),(0,o.CFu)(t,"xmlns","http://www.w3.org/2000/svg"),(0,o.CFu)(t,"width","20"),(0,o.CFu)(t,"height","20"),(0,o.CFu)(t,"viewBox","0 0 64 64"),(0,o.CFu)(t,"aria-hidden","true")},m(e,i){(0,o.Yry)(e,t,i),(0,o.BCw)(t,n),(0,o.BCw)(t,r),(0,o.BCw)(t,a),(0,o.BCw)(t,s)},p:o.lQ1,i:o.lQ1,o:o.lQ1,d(e){e&&(0,o.YoD)(t)}}}';
  const newImgH = 'function h(e){let t;return{c(){t=(0,o.ND4)("img"),(0,o.CFu)(t,"src","/caspel-pm/caspel-logo-dark.png"),(0,o.CFu)(t,"alt","Caspel PM"),(0,o.CFu)(t,"style","height:38px;width:auto;max-width:280px;object-fit:contain;vertical-align:middle;")},m(e,i){(0,o.Yry)(e,t,i)},p:o.lQ1,i:o.lQ1,o:o.lQ1,d(e){e&&(0,o.YoD)(t)}}}';

  if (js81373.includes(oldSvgH)) {
    js81373 = js81373.replaceAll(oldSvgH, () => newImgH);
    console.log('Replaced 3-stripe SVG in 81373 with authentic Caspel logo');
  }

  // Hide the text span so only the authentic Caspel logo is displayed
  const old81373SpanTexts = [
    'u=(0,o.ND4)("span"),u.textContent="PM"',
    'u=(0,o.ND4)("span"),u.textContent=`${(0,s.getMetadata)(l.default.metadata.PlatformTitle)}`'
  ];
  for (const t of old81373SpanTexts) {
    if (js81373.includes(t)) {
      js81373 = js81373.replaceAll(t, () => 'u=(0,o.ND4)("span"),u.textContent=""');
      console.log('Cleared span text in 81373');
    }
  }

  const old81373SpanClasses = [
    '(0,o.CFu)(u,"class","fs-title ml-2"),(0,o.CFu)(u,"style","font-weight:700;font-size:1.15rem;color:#4CAF50;letter-spacing:1px;vertical-align:middle;")',
    '(0,o.CFu)(u,"class","fs-title ml-2")'
  ];
  for (const c of old81373SpanClasses) {
    if (js81373.includes(c)) {
      js81373 = js81373.replaceAll(c, () => '(0,o.CFu)(u,"class","fs-title ml-2"),(0,o.hgi)(u,"display","none")');
      console.log('Hidden fs-title ml-2 span in 81373');
    }
  }

  // Write patched 81373 chunk and all cache-busted copies
  const chunk81373Files = [
    '81373.a2dc27c3c90c4ba900b1.js',
    '81373.caspelrev1selectwsch.js',
    '81373.caspelrev2selectwsch.js',
    '81373.caspelrev3selectwsch.js'
  ];
  const gz81373 = zlib.gzipSync(Buffer.from(js81373));
  for (const name of chunk81373Files) {
    const p = path.join(root, 'dev/prod/dist', name);
    fs.writeFileSync(p, js81373);
    fs.writeFileSync(p + '.gz', gz81373);
    try {
      execSync(`docker cp "${p}" dev-front-1:/app/dist/${name}`);
      execSync(`docker cp "${p}.gz" dev-front-1:/app/dist/${name}.gz`);
      console.log(`Deployed patched ${name} and .gz to container`);
    } catch (e) {
      console.log(`(docker cp for ${name}: ${e.message})`);
    }
  }

  // 4. Update and verify demo users in CockroachDB
  console.log('\n--- Step 4: Ensuring 4 Demo Users & Guest Access in Database ---');
  execSync('node scripts/caspel-pm/seed-demo-users.js', { stdio: 'inherit' });

  console.log('\n=== Final Deployment Complete! ===');
}

main().catch(console.error);
