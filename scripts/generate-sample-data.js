const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Initialize Supabase client (you'll need to provide these)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const shops = [
  {
    category: 'Electronics & Tech',
    shops: [
      {
        name: 'TechVibe',
        description: 'Premium electronics and gadgets for the modern lifestyle',
        location: 'Downtown Tech District',
        image_url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
        products: [
          {
            name: 'Wireless Noise-Canceling Headphones',
            description: 'Premium sound quality with active noise cancellation',
            price: 249.99,
            image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
          },
          {
            name: 'Smart Home Hub',
            description: 'Control your entire home with voice commands',
            price: 179.99,
            image_url: 'https://images.pexels.com/photos/4219830/pexels-photo-4219830.jpeg'
          }
        ]
      },
      {
        name: 'Gadget Grove',
        description: 'Your one-stop shop for all things tech',
        location: 'Innovation Park',
        image_url: 'https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg',
        products: [
          {
            name: 'Ultra HD Action Camera',
            description: '4K video recording with image stabilization',
            price: 299.99,
            image_url: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg'
          },
          {
            name: 'Smart Fitness Watch',
            description: 'Track your health and stay connected',
            price: 199.99,
            image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'
          }
        ]
      }
    ]
  },
  {
    category: 'Fashion & Accessories',
    shops: [
      {
        name: 'Urban Threads',
        description: 'Contemporary fashion for the modern individual',
        location: 'Fashion District',
        image_url: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg',
        products: [
          {
            name: 'Designer Leather Tote',
            description: 'Handcrafted leather bag for everyday use',
            price: 159.99,
            image_url: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg'
          },
          {
            name: 'Aviator Sunglasses',
            description: 'Classic style with UV protection',
            price: 129.99,
            image_url: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg'
          }
        ]
      },
      {
        name: 'Luxe & Co',
        description: 'Luxury accessories for discerning customers',
        location: 'Luxury Row',
        image_url: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
        products: [
          {
            name: 'Handcrafted Watch',
            description: 'Swiss movement with Italian leather strap',
            price: 299.99,
            image_url: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg'
          },
          {
            name: 'Pearl Necklace Set',
            description: 'Freshwater pearls with sterling silver',
            price: 199.99,
            image_url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg'
          }
        ]
      }
    ]
  },
  {
    category: 'Home & Living',
    shops: [
      {
        name: 'Cozy Corner',
        description: 'Beautiful furniture and decor for your home',
        location: 'Home Design District',
        image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        products: [
          {
            name: 'Artisan Coffee Table',
            description: 'Solid wood with modern design',
            price: 399.99,
            image_url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg'
          },
          {
            name: 'Handwoven Throw Blanket',
            description: 'Soft merino wool in contemporary patterns',
            price: 89.99,
            image_url: 'https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg'
          }
        ]
      },
      {
        name: 'Modern Nest',
        description: 'Contemporary home furnishings',
        location: 'Design Center',
        image_url: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg',
        products: [
          {
            name: 'Ceramic Vase Set',
            description: 'Hand-painted ceramic vases',
            price: 79.99,
            image_url: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg'
          },
          {
            name: 'Modern Wall Art',
            description: 'Abstract canvas prints',
            price: 149.99,
            image_url: 'https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg'
          }
        ]
      }
    ]
  },
  {
    category: 'Art & Crafts',
    shops: [
      {
        name: 'Artisan\'s Gallery',
        description: 'Unique handcrafted art pieces',
        location: 'Arts District',
        image_url: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg',
        products: [
          {
            name: 'Abstract Oil Painting',
            description: 'Original artwork on canvas',
            price: 599.99,
            image_url: 'https://images.pexels.com/photos/1569076/pexels-photo-1569076.jpeg'
          },
          {
            name: 'Handmade Pottery Set',
            description: 'Artisanal ceramic dinnerware',
            price: 189.99,
            image_url: 'https://images.pexels.com/photos/4992829/pexels-photo-4992829.jpeg'
          }
        ]
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

async function processImage(inputPath, outputPath, width, height) {
  await sharp(inputPath)
    .resize(width, height, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({
      quality: 85,
      chromaSubsampling: '4:4:4'
    })
    .toFile(outputPath);
}

async function uploadToSupabase(filepath, filename, bucket) {
  const fileBuffer = fs.readFileSync(filepath);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicUrl;
}

async function generateSampleData() {
  const tempDir = path.join(__dirname, '../assets/images/temp');
  const shopImagesDir = path.join(__dirname, '../assets/images/shops');
  const productImagesDir = path.join(__dirname, '../assets/images/products');

  // Create directories if they don't exist
  [tempDir, shopImagesDir, productImagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Get a sample user to be the owner
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  if (userError) throw userError;

  for (const category of shops) {
    for (const shop of category.shops) {
      console.log(`Processing shop: ${shop.name}`);

      // Download and process shop image
      const shopImageName = `${shop.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
      const shopTempPath = path.join(tempDir, `shop-${shopImageName}`);
      const shopFinalPath = path.join(shopImagesDir, shopImageName);

      await downloadImage(shop.image_url, shopTempPath);
      await processImage(shopTempPath, shopFinalPath, 800, 600);
      const shopImageUrl = await uploadToSupabase(shopFinalPath, `shop-images/${shopImageName}`, 'shops');

      // Create shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .insert({
          name: shop.name,
          description: shop.description,
          owner_id: user.id,
          location: shop.location,
          category: category.category,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
          image_url: shopImageUrl,
        })
        .select()
        .single();

      if (shopError) throw shopError;

      // Process products for this shop
      for (const product of shop.products) {
        console.log(`Processing product: ${product.name}`);

        const productImageName = `${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
        const productTempPath = path.join(tempDir, `product-${productImageName}`);
        const productFinalPath = path.join(productImagesDir, productImageName);

        await downloadImage(product.image_url, productTempPath);
        await processImage(productTempPath, productFinalPath, 800, 800);
        const productImageUrl = await uploadToSupabase(productFinalPath, `product-images/${productImageName}`, 'products');

        // Create product
        const { error: productError } = await supabase
          .from('products')
          .insert({
            shop_id: shopData.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: category.category,
            image_url: productImageUrl,
            stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10 and 60
          });

        if (productError) throw productError;
      }
    }
  }

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('✅ Sample data generated successfully');
}

generateSampleData().catch(console.error); 