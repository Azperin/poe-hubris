const fs = require('fs');
const zlib = require('node:zlib');

let a = fs.readFileSync('./htmlseedsinfo.js')
fs.writeFileSync(`./htmlseedsinfo.js.gz`, zlib.gzipSync(a), { level: 9 });