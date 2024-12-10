const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Free stock photos from Pexels
const stockPhotos = [
  {
    name: 'shopping-people',
    url: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'Photo by Karolina Grabowska from Pexels'
  },
  {
    name: 'artisan-workshop',
    url: 'https://images.pexels.com/photos/3094041/pexels-photo-3094041.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'Photo by Rodnae Productions from Pexels'
  },
  {
    name: 'seasonal-products',
    url: 'https://images.pexels.com/photos/5945559/pexels-photo-5945559.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'Photo by Karolina Grabowska from Pexels'
  }
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const writeStream = fs.createWriteStream(filepath);
      response.pipe(writeStream);

      writeStream.on('finish', () => {
        writeStream.close();
        resolve();
      });

      writeStream.on('error', reject);
    }).on('error', reject);
  });
}

async function processImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(1200, 600, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({
      quality: 85,
      chromaSubsampling: '4:4:4'
    })
    .toFile(outputPath);
}

async function downloadAndProcessImages() {
  const tempDir = path.join(__dirname, '../assets/images/temp');
  const carouselDir = path.join(__dirname, '../assets/images/carousel');

  // Create directories if they don't exist
  [tempDir, carouselDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Download and process each image
  for (const photo of stockPhotos) {
    const tempPath = path.join(tempDir, `${photo.name}-original.jpg`);
    const finalPath = path.join(carouselDir, `${photo.name}.jpg`);

    console.log(`Downloading ${photo.name}...`);
    await downloadImage(photo.url, tempPath);

    console.log(`Processing ${photo.name}...`);
    await processImage(tempPath, finalPath);

    // Save photo credit
    fs.appendFileSync(
      path.join(carouselDir, 'credits.txt'),
      `${photo.name}.jpg: ${photo.credit}\n`
    );
  }

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('✅ All carousel images downloaded and processed');
}

downloadAndProcessImages().catch(console.error); 