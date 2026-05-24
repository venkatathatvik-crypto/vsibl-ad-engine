const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, '../src/app/api'),
    path.join(__dirname, '../src/lib')
];

const replacementMap = {
    "'http://localhost:5173'": "'https://vsibl-ad-engine-qf4k.vercel.app'",
    '"http://localhost:5173"': '"https://vsibl-ad-engine-qf4k.vercel.app"',
    "'http://localhost:8080'": "'https://vsibl-ad-engine-qf4k.vercel.app'",
    '"http://localhost:8080"': '"https://vsibl-ad-engine-qf4k.vercel.app"',
    "'http://localhost:8081'": "'https://vsibl-ad-engine-qf4k.vercel.app'",
    '"http://localhost:8081"': '"https://vsibl-ad-engine-qf4k.vercel.app"',
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;

    // Replace the exact localhost fallbacks
    for (const [target, replacement] of Object.entries(replacementMap)) {
        if (content.includes(target)) {
            content = content.split(target).join(replacement);
            hasChanged = true;
        }
    }

    // Also strip quotes/whitespace from ALLOWED_ORIGIN in getCorsHeaders to be extra safe
    if (content.includes('process.env.ALLOWED_ORIGIN')) {
        // Let's add sanitization logic to getCorsHeaders if it doesn't already have it
        // Or make sure that any parsing of process.env.ALLOWED_ORIGIN cleans quotes
    }

    if (hasChanged) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    }
}

function traverseDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
            processFile(fullPath);
        }
    }
}

console.log('🚀 Running CORS and Localhost Fallback Replacements...');
targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        traverseDir(dir);
    } else {
        console.warn(`⚠️ Directory not found: ${dir}`);
    }
});
console.log('🎉 CORS Replacements Complete.');
