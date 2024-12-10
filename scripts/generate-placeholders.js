const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const categories = [
  {
    name: 'electronics',
    icon: `<path d="M10,2V22H14V2ZM4,8V16H8V8ZM16,14V20H20V14Z" fill="#666"/>`,
    color: { r: 66, g: 153, b: 225, alpha: 0.1 }
  },
  {
    name: 'fashion',
    icon: `<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="#666"/>`,
    color: { r: 245, g: 124, b: 124, alpha: 0.1 }
  },
  {
    name: 'home',
    icon: `<path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" fill="#666"/>`,
    color: { r: 146, g: 151, b: 247, alpha: 0.1 }
  },
  {
    name: 'beauty',
    icon: `<path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12M22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" fill="#666"/>`,
    color: { r: 240, g: 144, b: 161, alpha: 0.1 }
  },
  {
    name: 'sports',
    icon: `<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9" fill="#666"/>`,
    color: { r: 72, g: 187, b: 120, alpha: 0.1 }
  },
  {
    name: 'books',
    icon: `<path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V6.5C10.55,5.4 8.45,5 6.5,5Z" fill="#666"/>`,
    color: { r: 159, g: 122, b: 234, alpha: 0.1 }
  },
  {
    name: 'toys',
    icon: `<path d="M12,3C8.69,3 6,5.69 6,9C6,11.1 7.1,12.9 8.7,13.8L8,14.5C6.4,16.1 5,17.5 5,20H19C19,17.5 17.6,16.1 16,14.5L15.3,13.8C16.9,12.9 18,11.1 18,9C18,5.69 15.31,3 12,3M12,5C14.21,5 16,6.79 16,9C16,11.21 14.21,13 12,13C9.79,13 8,11.21 8,9C8,6.79 9.79,5 12,5M14,17V19H10V17H14Z" fill="#666"/>`,
    color: { r: 246, g: 173, b: 85, alpha: 0.1 }
  },
  {
    name: 'food',
    icon: `<path d="M12,6C8.69,6 6,8.69 6,12C6,15.31 8.69,18 12,18C15.31,18 18,15.31 18,12C18,8.69 15.31,6 12,6M12,16C9.79,16 8,14.21 8,12C8,9.79 9.79,8 12,8C14.21,8 16,9.79 16,12C16,14.21 14.21,16 12,16M12,10C10.9,10 10,10.9 10,12C10,13.1 10.9,14 12,14C13.1,14 14,13.1 14,12C14,10.9 13.1,10 12,10Z" fill="#666"/>`,
    color: { r: 255, g: 159, b: 64, alpha: 0.1 }
  },
  {
    name: 'art',
    icon: `<path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10A2,2 0 0,1 7,8M17,8A2,2 0 0,1 15,10A2,2 0 0,1 17,8M7,16A2,2 0 0,1 5,18A2,2 0 0,1 7,16M17,16A2,2 0 0,1 15,18A2,2 0 0,1 17,16Z" fill="#666"/>`,
    color: { r: 236, g: 72, b: 153, alpha: 0.1 }
  },
  {
    name: 'jewelry',
    icon: `<path d="M16,9H19L14,16M10,9H14L12,17M5,9H8L10,16M15,4H17L19,7H16M11,4H13L14,7H10M7,4H9L8,7H5M6,2L2,8L12,22L22,8L18,2H6Z" fill="#666"/>`,
    color: { r: 212, g: 175, b: 55, alpha: 0.1 }
  }
];

const PLACEHOLDER_SIZE = 500;
const CAROUSEL_WIDTH = 1200;
const CAROUSEL_HEIGHT = 600;
const OUTPUT_QUALITY = 80;

async function generatePlaceholders() {
  // Create directories if they don't exist
  const dirs = [
    'assets/images/placeholders',
    'assets/images/categories',
    'assets/images/carousel'
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Generate category placeholders with modern design
  for (const category of categories) {
    await sharp({
      create: {
        width: PLACEHOLDER_SIZE,
        height: PLACEHOLDER_SIZE,
        channels: 4,
        background: category.color
      }
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${PLACEHOLDER_SIZE}" height="${PLACEHOLDER_SIZE}">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
              <g transform="translate(${PLACEHOLDER_SIZE/2}, ${PLACEHOLDER_SIZE/2})">
                <g transform="scale(8)">
                  ${category.icon}
                </g>
              </g>
              <rect x="10%" y="75%" width="80%" height="15%" rx="10" fill="rgba(255,255,255,0.9)"/>
              <text x="50%" y="85%" font-family="Arial" font-size="32" fill="#333" text-anchor="middle" font-weight="bold">
                ${category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </text>
            </svg>`
          ),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ quality: OUTPUT_QUALITY })
      .toFile(path.join(__dirname, `../assets/images/categories/${category.name}.jpg`));
  }

  // Generate default product placeholder
  await sharp({
    create: {
      width: PLACEHOLDER_SIZE,
      height: PLACEHOLDER_SIZE,
      channels: 4,
      background: { r: 245, g: 245, b: 245, alpha: 1 }
    }
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${PLACEHOLDER_SIZE}" height="${PLACEHOLDER_SIZE}">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            <circle cx="50%" cy="40%" r="100" fill="#666" opacity="0.1"/>
            <path d="M250,150 C250,150 350,250 250,350 C150,250 250,150 250,150Z" fill="#666" opacity="0.1"/>
            <rect x="10%" y="75%" width="80%" height="15%" rx="10" fill="rgba(255,255,255,0.9)"/>
            <text x="50%" y="85%" font-family="Arial" font-size="32" fill="#666" text-anchor="middle">
              Product Image
            </text>
          </svg>`
        ),
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: OUTPUT_QUALITY })
    .toFile(path.join(__dirname, '../assets/images/placeholders/product-default.jpg'));

  // Generate carousel images with photographic style
  const carouselImages = [
    {
      name: 'local-deals',
      text: 'Local Deals',
      scene: `
        <!-- Shopping Scene with Products -->
        <defs>
          <linearGradient id="productGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#E0E0E0;stop-opacity:0.8" />
          </linearGradient>
          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Lifestyle Product Photography Style Background -->
        <rect width="100%" height="100%" fill="#F8F9FA"/>
        <!-- Product Group 1 - Electronics -->
        <g transform="translate(200,150)" filter="url(#softShadow)">
          <rect width="300" height="400" rx="20" fill="url(#productGlow)"/>
          <rect width="240" height="160" x="30" y="30" rx="10" fill="#333"/>
          <circle cx="150" cy="250" r="50" fill="#4A90E2"/>
          <text x="150" y="320" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Latest Tech</text>
        </g>
        <!-- Product Group 2 - Fashion -->
        <g transform="translate(600,200)" filter="url(#softShadow)">
          <rect width="400" height="300" rx="20" fill="url(#productGlow)"/>
          <path d="M200,50 L300,150 L250,250 L150,250 L100,150 Z" fill="#FF6B6B"/>
          <text x="200" y="200" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Fashion</text>
        </g>
      `,
      overlay: 'rgba(0,0,0,0.4)'
    },
    {
      name: 'artisans',
      text: 'Meet Local Artisans',
      scene: `
        <!-- Artisan Products Scene -->
        <defs>
          <linearGradient id="warmGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFF5E6;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#FFE0B2;stop-opacity:0.9" />
          </linearGradient>
          <filter id="ceramicTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3"/>
            <feColorMatrix type="saturate" values="0.1"/>
          </filter>
        </defs>
        <!-- Warm Background -->
        <rect width="100%" height="100%" fill="#FFF5E6"/>
        <!-- Ceramic Pieces -->
        <g transform="translate(300,200)" filter="url(#softShadow)">
          <circle cx="0" cy="0" r="120" fill="url(#warmGlow)" filter="url(#ceramicTexture)"/>
          <circle cx="200" cy="50" r="80" fill="url(#warmGlow)" filter="url(#ceramicTexture)"/>
          <circle cx="400" cy="-50" r="100" fill="url(#warmGlow)" filter="url(#ceramicTexture)"/>
        </g>
        <!-- Textiles -->
        <g transform="translate(200,400)" filter="url(#softShadow)">
          <rect width="600" height="150" rx="10" fill="#F8F9FA"/>
          <path d="M0,0 L600,0 L600,150 L0,150 Z" fill="none" stroke="#DEB887" stroke-width="5" stroke-dasharray="10,5"/>
        </g>
      `,
      overlay: 'rgba(0,0,0,0.3)'
    },
    {
      name: 'seasonal',
      text: 'Seasonal Specials',
      scene: `
        <!-- Seasonal Products Scene -->
        <defs>
          <linearGradient id="seasonalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#E8F5E9;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#C8E6C9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E8F5E9;stop-opacity:1" />
          </linearGradient>
          <filter id="productShine">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Fresh Background -->
        <rect width="100%" height="100%" fill="url(#seasonalGlow)"/>
        <!-- Product Display -->
        <g transform="translate(150,100)" filter="url(#productShine)">
          <rect width="900" height="400" rx="20" fill="#FFFFFF" opacity="0.9"/>
          <!-- Product Shapes -->
          <g transform="translate(50,50)">
            <rect width="200" height="300" rx="10" fill="#FFD700" opacity="0.8"/>
            <rect x="250" width="200" height="300" rx="10" fill="#FF6B6B" opacity="0.8"/>
            <rect x="500" width="200" height="300" rx="10" fill="#4169E1" opacity="0.8"/>
          </g>
        </g>
      `,
      overlay: 'rgba(0,0,0,0.3)'
    }
  ];

  for (const carousel of carouselImages) {
    await sharp({
      create: {
        width: CAROUSEL_WIDTH,
        height: CAROUSEL_HEIGHT,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${CAROUSEL_WIDTH}" height="${CAROUSEL_HEIGHT}">
              ${carousel.scene}
              <!-- Overlay for text readability -->
              <rect width="100%" height="100%" fill="${carousel.overlay}" />
              <!-- Main Text -->
              <text x="50%" y="50%" font-family="Arial" font-size="72" fill="#FFFFFF" text-anchor="middle" font-weight="bold" filter="url(#softShadow)">
                ${carousel.text}
              </text>
              <text x="50%" y="50%" font-family="Arial" font-size="72" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
                ${carousel.text}
              </text>
            </svg>`
          ),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ 
        quality: OUTPUT_QUALITY,
        chromaSubsampling: '4:4:4'
      })
      .toFile(path.join(__dirname, `../assets/images/carousel/${carousel.name}.jpg`));
  }

  console.log('✅ Generated all placeholder images');
}

generatePlaceholders().catch(console.error); 