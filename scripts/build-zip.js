
const fs = require('fs');
const archiver = require('archiver');

const out = fs.createWriteStream('SellSmart-Final-Launch.zip');
const archive = archiver('zip');

out.on('close', () => console.log('ZIP created successfully.'));
archive.pipe(out);
archive.directory('.', false);
archive.finalize();
