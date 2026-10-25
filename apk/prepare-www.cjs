// Собирает папку www для APK из файлов сайта (корень репозитория).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(__dirname, 'www');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'manifest.json', 'version.json', 'frame4.jpg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.cpSync(path.join(root, 'pages'), path.join(out, 'pages'), { recursive: true });
console.log('www ready:', fs.readdirSync(path.join(out, 'pages')).length, 'pages');
