const fs = require('fs');
const path = require('path');

// Chemins source et destination
const sourceDir = path.join(__dirname, '../../node_modules/leaflet/dist/images');
const destDir = path.join(__dirname, '../../public');

// Créer le dossier de destination s'il n'existe pas
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copier les fichiers
const files = ['marker-icon.png', 'marker-icon-2x.png', 'marker-shadow.png'];
files.forEach(file => {
  fs.copyFileSync(
    path.join(sourceDir, file),
    path.join(destDir, file)
  );
});

console.log('Leaflet assets copied successfully!'); 