import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.resolve('node_modules', '@phosphor-icons', 'webcomponents', 'package.json');

function fail(msg) {
  console.error(`[patch-phosphor-exports] ${msg}`);
  process.exitCode = 1;
}

if (!fs.existsSync(pkgPath)) {
  // Nothing to patch (e.g., dependency not installed).
  process.exit(0);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (e) {
  fail(`Failed to read/parse ${pkgPath}: ${e?.message ?? e}`);
  process.exit(1);
}

pkg.exports = pkg.exports ?? {};

// Ensure per-icon subpath imports like:
//   import('@phosphor-icons/webcomponents/PhArrowCircleDown')
// work with the 2.0.0 distribution files that are named *.es.js.
// This matches @reown/appkit-ui's dynamic imports.
const desired = {
  './*': {
    import: './dist/icons/*.es.js',
    types: './dist/icons/*.d.ts'
  },
  '.': {
    import: './dist/index.es.js',
    types: './dist/index.d.ts'
  }
};

const current = pkg.exports;
const alreadyOk =
  current?.['./*']?.import === desired['./*'].import &&
  current?.['.']?.import === desired['.'].import;

if (alreadyOk) process.exit(0);

pkg.exports = desired;

try {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[patch-phosphor-exports] Patched @phosphor-icons/webcomponents exports map');
} catch (e) {
  fail(`Failed to write ${pkgPath}: ${e?.message ?? e}`);
  process.exit(1);
}
