// Правит сгенерированный `cap add android`: подпись постоянным ключом, номер сборки, альбомная ориентация, JPEG без сжатия.
const fs = require('fs'), path = require('path');
const A = path.join(__dirname, 'android');
function patch(rel, fn) {
  const f = path.join(A, rel); let s = fs.readFileSync(f, 'utf8'); const n = fn(s);
  if (n === s) throw new Error('не удалось изменить ' + rel);
  fs.writeFileSync(f, n); console.log('patched', rel);
}
const must = (s, a, b) => { if (!s.includes(a)) throw new Error('нет фрагмента: ' + a); return s.replace(a, b); };
patch('app/build.gradle', (s) => {
  s = must(s, 'defaultConfig {', "androidResources { noCompress 'jpg' }\n    defaultConfig {");
  s = s.replace(/versionCode\s+\d+/, "versionCode System.getenv('APK_BUILD') ? System.getenv('APK_BUILD').toInteger() : 1");
  s = s.replace(/versionName\s+\"[^\"]*\"/, "versionName System.getenv('APK_VERSION') ?: '1.0'");
  s = must(s, 'buildTypes {', "signingConfigs {\n        release {\n            storeFile file('quran.keystore')\n            storePassword System.getenv('KS_PASS')\n            keyAlias 'quran'\n            keyPassword System.getenv('KS_PASS')\n        }\n    }\n    buildTypes {");
  s = must(s, 'minifyEnabled false', 'signingConfig signingConfigs.release\n            minifyEnabled false');
  return s;
});
patch('gradle.properties', (s) => s + '\norg.gradle.jvmargs=-Xmx3g -Dfile.encoding=UTF-8\n');
patch('app/src/main/AndroidManifest.xml', (s) => must(s, '<activity', '<activity\n            android:screenOrientation="sensorLandscape"'));
