const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Product images by category
const productImages = [
  // Electronics
  {
    category: 'electronics',
    products: [
      {
        name: 'Premium Wireless Headphones',
        price: 199.99,
        url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
        credit: 'Photo by Alin Luna from Pexels'
      },
      {
        name: 'Smart Watch Series 5',
        price: 299.99,
        url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
        credit: 'Photo by Marcus Aurelius from Pexels'
      },
      {
        name: 'Professional Camera Kit',
        price: 899.99,
        url: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
        credit: 'Photo by Pixabay from Pexels'
      }
    ]
  },
  // Fashion
  {
    category: 'fashion',
    products: [
      {
        name: 'Classic Leather Bag',
        price: 149.99,
        url: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg',
        credit: 'Photo by Godisable Jacob from Pexels'
      },
      {
        name: 'Designer Sunglasses',
        price: 129.99,
        url: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
        credit: 'Photo by Min An from Pexels'
      },
      {
        name: 'Handcrafted Watch',
        price: 199.99,
        url: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
        credit: 'Photo by Fernando Arcos from Pexels'
      }
    ]
  },
  // Home & Living
  {
    category: 'home',
    products: [
      {
        name: 'Artisan Coffee Table',
        price: 399.99,
        url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
        credit: 'Photo by Designecologist from Pexels'
      },
      {
        name: 'Handwoven Throw Blanket',
        price: 79.99,
        url: 'https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg',
        credit: 'Photo by Karolina Grabowska from Pexels'
      },
      {
        name: 'Ceramic Vase Set',
        price: 89.99,
        url: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg',
        credit: 'Photo by Ksenia Chernaya from Pexels'
      }
    ]
  },
  // Art
  {
    category: 'art',
    products: [
      {
        name: 'Original Abstract Painting',
        price: 599.99,
        url: 'https://images.pexels.com/photos/1569076/pexels-photo-1569076.jpeg',
        credit: 'Photo by Steve Johnson from Pexels'
      },
      {
        name: 'Handmade Pottery Set',
        price: 149.99,
        url: 'https://images.pexels.com/photos/4992829/pexels-photo-4992829.jpeg',
        credit: 'Photo by Cats Coming from Pexels'
      },
      {
        name: 'Limited Edition Print',
        price: 199.99,
        url: 'https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg',
        credit: 'Photo by Steve Johnson from Pexels'
      }
    ]
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
    .resize(800, 800, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({
      quality: 85,
      chromaSubsampling: '4:4:4'
    })
    .toFile(outputPath);
}

async function uploadToSupabase(filepath, filename) {
  const fileBuffer = fs.readFileSync(filepath);
  const { data, error } = await supabase.storage
    .from('products')
    .upload(`product-images/${filename}`, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(`product-images/${filename}`);

  return publicUrl;
}

async function updateDatabase(products) {
  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          price: product.price,
          image_url: product.publicUrl,
          category: product.category,
          description: `High-quality ${product.name.toLowerCase()} from local artisans.`,
          stock: Math.floor(Math.random() * 50) + 10
        }
      ]);

    if (error) {
      console.error(`Error inserting product ${product.name}:`, error);
    } else {
      console.log(`Added product: ${product.name}`);
    }
  }
}

async function downloadAndProcessProducts() {
  const tempDir = path.join(__dirname, '../assets/images/temp');
  const productsDir = path.join(__dirname, '../assets/images/products');

  // Create directories if they don't exist
  [tempDir, productsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Process all products
  const processedProducts = [];

  for (const category of productImages) {
    for (const product of category.products) {
      const safeName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const tempPath = path.join(tempDir, `${safeName}-original.jpg`);
      const finalPath = path.join(productsDir, `${safeName}.jpg`);

      console.log(`Downloading ${product.name}...`);
      await downloadImage(product.url, tempPath);

      console.log(`Processing ${product.name}...`);
      await processImage(tempPath, finalPath);

      // Upload to Supabase storage
      console.log(`Uploading ${product.name} to Supabase...`);
      const publicUrl = await uploadToSupabase(finalPath, `${safeName}.jpg`);

      // Save photo credit
      fs.appendFileSync(
        path.join(productsDir, 'credits.txt'),
        `${safeName}.jpg: ${product.credit}\n`
      );

      processedProducts.push({
        ...product,
        publicUrl,
        category: category.category
      });
    }
  }

  // Update database with new products
  console.log('Updating database...');
  await updateDatabase(processedProducts);

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('✅ All product images downloaded, processed, and database updated');
}

downloadAndProcessProducts().catch(console.error); 