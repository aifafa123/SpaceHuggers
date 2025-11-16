// Simple build script to combine modules into dist.js

const fs = require('fs');
const path = require('path');

// Define the order of modules to concatenate
const modules = [
  'utils.js',
  'debug.js',
  'engine.js',
  'engine-object.js',
  'webgl.js',
  'drawing.js',
  'input.js',
  'audio.js',
  'tile.js',
  'particle.js',
  'game-objects.js',
  'characters.js',
  'effects.js',
  'level.js',
  'tiles.js',
  'main.js'
];

// Files that need to be included before the modules
const includeFiles = [
  'joystick.js',
  'skill-button.js',
  'control-layer.js'  // Add control-layer.js back
];

// Read all include files and concatenate them
let distContent = '';
for (const file of includeFiles) {
  const filePath = path.join(__dirname, 'modules', file);
  if (fs.existsSync(filePath)) {
    console.log(`Adding file: ${file}`);
    distContent += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.error(`File not found: ${file}`);
  }
}

// Add all modules
for (const module of modules) {
  const modulePath = path.join(__dirname, 'modules', module);
  if (fs.existsSync(modulePath)) {
    console.log(`Adding module: ${module}`);
    distContent += fs.readFileSync(modulePath, 'utf8') + '\n';
  } else {
    console.error(`Module not found: ${module}`);
  }
}

// Write the combined content to dist.js
const distPath = path.join(__dirname, 'dist.js');
fs.writeFileSync(distPath, distContent);

console.log('Build complete! dist.js has been created.');