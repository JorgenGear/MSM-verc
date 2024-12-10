-- First create the user
INSERT INTO auth.users (id, email)
VALUES ('4c6ee42c-1234-4444-8888-b71c009e636b', 'sample_seller@example.com')
ON CONFLICT (id) DO NOTHING;

-- Then create the profile
INSERT INTO profiles (id, username, full_name, is_seller)
VALUES ('4c6ee42c-1234-4444-8888-b71c009e636b', 'sample_seller', 'Sample Seller', true)
ON CONFLICT (id) DO NOTHING;

-- Then insert sample shops
INSERT INTO shops (id, name, description, owner_id, location, category, rating, image_url)
VALUES
  -- Home & Kitchen Shop
  ('f733c41d-4246-477c-8387-f04094d1de21', 'Artisan Home Crafts', 'Handcrafted home decor and kitchenware', '4c6ee42c-1234-4444-8888-b71c009e636b', 'Downtown Artisan District', 'Home & Kitchen', 4.8, 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg'),
  -- Furniture Shop
  ('7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Vintage Finds', 'Restored and vintage furniture', '4c6ee42c-1234-4444-8888-b71c009e636b', 'Antique Row', 'Home & Kitchen', 4.7, 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'),
  -- Electronics Shop
  ('9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Tech Haven', 'Latest gadgets and electronics', '4c6ee42c-1234-4444-8888-b71c009e636b', 'Tech District', 'Electronics', 4.9, 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg'),
  -- Fashion Shop
  ('b45a12ed-4444-1234-ab67-c89d123ef456', 'Urban Style', 'Contemporary fashion and accessories', '4c6ee42c-1234-4444-8888-b71c009e636b', 'Fashion Avenue', 'Fashion', 4.8, 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg'),
  -- Beauty Shop
  ('d67e45fa-5555-4321-bc89-f12d345e6789', 'Glow Beauty', 'Premium beauty and skincare products', '4c6ee42c-1234-4444-8888-b71c009e636b', 'Beauty Boulevard', 'Beauty', 4.9, 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg'),
  -- Sports Shop
  ('e89f12cd-6666-7777-de90-123456789abc', 'Active Life', 'Sports equipment and activewear', '4c6ee42c-1234-4444-8888-b71c009e636b', 'Sports Center', 'Sports', 4.7, 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg');

-- Insert products with high-quality images
INSERT INTO products (id, shop_id, name, description, price, category, image_url, stock)
VALUES
  -- TechVibe Products
  (
    'a1b2c3d4-1111-4444-8888-123456789abc',
    'c47b4cdc-1111-4444-8888-123456789abc',
    'Wireless Noise-Canceling Headphones',
    'Premium sound quality with active noise cancellation',
    249.99,
    'Electronics & Tech',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    45
  ),
  (
    'a1b2c3d4-2222-4444-8888-123456789abc',
    'c47b4cdc-1111-4444-8888-123456789abc',
    'Smart Home Hub',
    'Control your entire home with voice commands',
    179.99,
    'Electronics & Tech',
    'https://images.pexels.com/photos/4219830/pexels-photo-4219830.jpeg',
    30
  ),
  
  -- Gadget Grove Products
  (
    'a1b2c3d4-3333-4444-8888-123456789abc',
    'c47b4cdc-2222-4444-8888-123456789abc',
    'Ultra HD Action Camera',
    '4K video recording with image stabilization',
    299.99,
    'Electronics & Tech',
    'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
    25
  ),
  (
    'a1b2c3d4-4444-4444-8888-123456789abc',
    'c47b4cdc-2222-4444-8888-123456789abc',
    'Smart Fitness Watch',
    'Track your health and stay connected',
    199.99,
    'Electronics & Tech',
    'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    40
  ),
  
  -- Urban Threads Products
  (
    'a1b2c3d4-5555-4444-8888-123456789abc',
    'c47b4cdc-3333-4444-8888-123456789abc',
    'Designer Leather Tote',
    'Handcrafted leather bag for everyday use',
    159.99,
    'Fashion & Accessories',
    'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg',
    20
  ),
  (
    'a1b2c3d4-6666-4444-8888-123456789abc',
    'c47b4cdc-3333-4444-8888-123456789abc',
    'Aviator Sunglasses',
    'Classic style with UV protection',
    129.99,
    'Fashion & Accessories',
    'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
    35
  ),
  
  -- Luxe & Co Products
  (
    'a1b2c3d4-7777-4444-8888-123456789abc',
    'c47b4cdc-4444-4444-8888-123456789abc',
    'Handcrafted Watch',
    'Swiss movement with Italian leather strap',
    299.99,
    'Fashion & Accessories',
    'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    15
  ),
  (
    'a1b2c3d4-8888-4444-8888-123456789abc',
    'c47b4cdc-4444-4444-8888-123456789abc',
    'Pearl Necklace Set',
    'Freshwater pearls with sterling silver',
    199.99,
    'Fashion & Accessories',
    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    25
  ),
  
  -- Cozy Corner Products
  (
    'a1b2c3d4-9999-4444-8888-123456789abc',
    'c47b4cdc-5555-4444-8888-123456789abc',
    'Artisan Coffee Table',
    'Solid wood with modern design',
    399.99,
    'Home & Living',
    'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
    10
  ),
  (
    'a1b2c3d4-aaaa-4444-8888-123456789abc',
    'c47b4cdc-5555-4444-8888-123456789abc',
    'Handwoven Throw Blanket',
    'Soft merino wool in contemporary patterns',
    89.99,
    'Home & Living',
    'https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg',
    50
  ),
  
  -- Modern Nest Products
  (
    'a1b2c3d4-bbbb-4444-8888-123456789abc',
    'c47b4cdc-6666-4444-8888-123456789abc',
    'Ceramic Vase Set',
    'Hand-painted ceramic vases',
    79.99,
    'Home & Living',
    'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg',
    30
  ),
  (
    'a1b2c3d4-cccc-4444-8888-123456789abc',
    'c47b4cdc-6666-4444-8888-123456789abc',
    'Modern Wall Art',
    'Abstract canvas prints',
    149.99,
    'Home & Living',
    'https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg',
    20
  ),
  
  -- Artisan's Gallery Products
  (
    'a1b2c3d4-dddd-4444-8888-123456789abc',
    'c47b4cdc-7777-4444-8888-123456789abc',
    'Abstract Oil Painting',
    'Original artwork on canvas',
    599.99,
    'Art & Crafts',
    'https://images.pexels.com/photos/1569076/pexels-photo-1569076.jpeg',
    5
  ),
  (
    'a1b2c3d4-eeee-4444-8888-123456789abc',
    'c47b4cdc-7777-4444-8888-123456789abc',
    'Handmade Pottery Set',
    'Artisanal ceramic dinnerware',
    189.99,
    'Art & Crafts',
    'https://images.pexels.com/photos/4992829/pexels-photo-4992829.jpeg',
    15
  );

-- Add some sample reviews
INSERT INTO reviews (id, user_id, shop_id, product_id, rating, comment)
SELECT
  gen_random_uuid() as id,
  '4c6ee42c-1234-4444-8888-b71c009e636b' as user_id,
  s.id as shop_id,
  p.id as product_id,
  ROUND((RANDOM() * 2 + 3)::numeric, 1) as rating,
  CASE floor(RANDOM() * 3)
    WHEN 0 THEN 'Great product! Exactly as described.'
    WHEN 1 THEN 'Excellent quality and fast shipping.'
    ELSE 'Very satisfied with my purchase.'
  END as comment
FROM
  shops s
  CROSS JOIN products p
WHERE
  p.shop_id = s.id
LIMIT 20; 

-- Additional Products for Existing Shops

-- More Home & Kitchen Products (Artisan Home Crafts)
INSERT INTO products (id, shop_id, name, description, price, category, image_url, stock, created_at)
VALUES
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Kitchen Utensil Set', 'Bamboo cooking utensil set', 42.99, 'Home & Kitchen', 'https://images.pexels.com/photos/4226805/pexels-photo-4226805.jpeg', 25, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Tea Towel Set', 'Set of 4 linen tea towels', 28.99, 'Home & Kitchen', 'https://images.pexels.com/photos/4226863/pexels-photo-4226863.jpeg', 40, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Spice Jar Set', 'Set of 12 glass spice jars', 36.99, 'Home & Kitchen', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 30, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Ceramic Planter', 'Hand-painted ceramic planter', 32.99, 'Home & Kitchen', 'https://images.pexels.com/photos/4226882/pexels-photo-4226882.jpeg', 20, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Bread Box', 'Bamboo bread storage box', 44.99, 'Home & Kitchen', 'https://images.pexels.com/photos/4226873/pexels-photo-4226873.jpeg', 15, NOW()),

-- More Furniture Products (Vintage Finds)
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Console Table', 'Vintage console table', 229.99, 'Home & Kitchen', 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg', 4, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Wall Mirror', 'Antique framed wall mirror', 169.99, 'Home & Kitchen', 'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg', 6, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Bedside Table', 'Vintage bedside table', 139.99, 'Home & Kitchen', 'https://images.pexels.com/photos/1457840/pexels-photo-1457840.jpeg', 8, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Coffee Table', 'Mid-century coffee table', 259.99, 'Home & Kitchen', 'https://images.pexels.com/photos/1457839/pexels-photo-1457839.jpeg', 5, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Desk Chair', 'Restored wooden desk chair', 189.99, 'Home & Kitchen', 'https://images.pexels.com/photos/1457838/pexels-photo-1457838.jpeg', 7, NOW()),

-- More Electronics Products (Tech Haven)
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Smart Home Hub', 'Voice-controlled home assistant', 149.99, 'Electronics', 'https://images.pexels.com/photos/4219830/pexels-photo-4219830.jpeg', 35, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Gaming Mouse', 'RGB gaming mouse', 59.99, 'Electronics', 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg', 45, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Mechanical Keyboard', 'RGB mechanical keyboard', 89.99, 'Electronics', 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg', 30, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Webcam', 'HD webcam with microphone', 69.99, 'Electronics', 'https://images.pexels.com/photos/2115255/pexels-photo-2115255.jpeg', 40, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'USB Hub', '7-port USB hub', 29.99, 'Electronics', 'https://images.pexels.com/photos/2115254/pexels-photo-2115254.jpeg', 50, NOW()),

-- More Fashion Products (Urban Style)
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Canvas Backpack', 'Vintage style canvas backpack', 69.99, 'Fashion', 'https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg', 25, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Leather Belt', 'Handcrafted leather belt', 44.99, 'Fashion', 'https://images.pexels.com/photos/1545998/pexels-photo-1545998.jpeg', 35, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Beanie Hat', 'Wool blend beanie hat', 24.99, 'Fashion', 'https://images.pexels.com/photos/1545997/pexels-photo-1545997.jpeg', 50, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Phone Case', 'Leather phone case', 34.99, 'Fashion', 'https://images.pexels.com/photos/1545996/pexels-photo-1545996.jpeg', 40, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Travel Wallet', 'RFID blocking travel wallet', 54.99, 'Fashion', 'https://images.pexels.com/photos/1545995/pexels-photo-1545995.jpeg', 30, NOW()),

-- More Beauty Products (Glow Beauty)
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Sheet Mask Set', 'Set of 10 hydrating sheet masks', 29.99, 'Beauty', 'https://images.pexels.com/photos/3785169/pexels-photo-3785169.jpeg', 60, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Facial Roller', 'Rose quartz facial roller', 24.99, 'Beauty', 'https://images.pexels.com/photos/3785168/pexels-photo-3785168.jpeg', 40, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Lip Care Set', 'Natural lip care kit', 19.99, 'Beauty', 'https://images.pexels.com/photos/3785167/pexels-photo-3785167.jpeg', 45, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Hand Cream', 'Intensive hand repair cream', 14.99, 'Beauty', 'https://images.pexels.com/photos/3785166/pexels-photo-3785166.jpeg', 70, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Bath Bomb Set', 'Set of 6 aromatherapy bath bombs', 26.99, 'Beauty', 'https://images.pexels.com/photos/3785165/pexels-photo-3785165.jpeg', 50, NOW()),

-- More Sports Products (Active Life)
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Fitness Tracker', 'Smart fitness activity tracker', 79.99, 'Sports', 'https://images.pexels.com/photos/4397838/pexels-photo-4397838.jpeg', 40, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Gym Bag', 'Waterproof sports duffel bag', 44.99, 'Sports', 'https://images.pexels.com/photos/4397837/pexels-photo-4397837.jpeg', 35, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Exercise Ball', 'Anti-burst yoga ball', 29.99, 'Sports', 'https://images.pexels.com/photos/4397836/pexels-photo-4397836.jpeg', 45, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Workout Gloves', 'Weight lifting gloves', 19.99, 'Sports', 'https://images.pexels.com/photos/4397834/pexels-photo-4397834.jpeg', 55, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Sports Towel', 'Quick-dry microfiber towel', 14.99, 'Sports', 'https://images.pexels.com/photos/4397832/pexels-photo-4397832.jpeg', 65, NOW()); 

-- Final batch of products

-- More Home & Kitchen Products (Artisan Home Crafts)
INSERT INTO products (id, shop_id, name, description, price, category, image_url, stock, created_at)
VALUES
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Serving Tray', 'Wooden serving tray with handles', 38.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6270083/pexels-photo-6270083.jpeg', 20, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Fruit Bowl', 'Handcrafted ceramic fruit bowl', 32.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6270084/pexels-photo-6270084.jpeg', 25, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Wine Rack', 'Bamboo wine bottle holder', 46.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6270085/pexels-photo-6270085.jpeg', 15, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Napkin Rings', 'Set of 6 brass napkin rings', 24.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6270086/pexels-photo-6270086.jpeg', 30, NOW()),
  (gen_random_uuid(), 'f733c41d-4246-477c-8387-f04094d1de21', 'Coaster Set', 'Set of 4 marble coasters', 29.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6270087/pexels-photo-6270087.jpeg', 35, NOW()),

-- More Furniture Products (Vintage Finds)
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Magazine Rack', 'Vintage magazine holder', 89.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6207770/pexels-photo-6207770.jpeg', 8, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Plant Stand', 'Mid-century plant stand', 79.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6207771/pexels-photo-6207771.jpeg', 10, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Wall Shelf', 'Floating wood wall shelf', 69.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6207772/pexels-photo-6207772.jpeg', 12, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Ottoman', 'Vintage leather ottoman', 149.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6207773/pexels-photo-6207773.jpeg', 6, NOW()),
  (gen_random_uuid(), '7389a735-f355-473f-8c9c-43ab6aa5cf1b', 'Coat Rack', 'Antique wooden coat rack', 119.99, 'Home & Kitchen', 'https://images.pexels.com/photos/6207774/pexels-photo-6207774.jpeg', 7, NOW()),

-- More Electronics Products (Tech Haven)
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Phone Stand', 'Adjustable phone holder', 19.99, 'Electronics', 'https://images.pexels.com/photos/4526406/pexels-photo-4526406.jpeg', 45, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Cable Organizer', 'Cable management system', 15.99, 'Electronics', 'https://images.pexels.com/photos/4526405/pexels-photo-4526405.jpeg', 55, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Laptop Stand', 'Ergonomic laptop riser', 39.99, 'Electronics', 'https://images.pexels.com/photos/4526404/pexels-photo-4526404.jpeg', 35, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Power Bank', '10000mAh portable charger', 49.99, 'Electronics', 'https://images.pexels.com/photos/4526403/pexels-photo-4526403.jpeg', 40, NOW()),
  (gen_random_uuid(), '9abc2887-9602-4f5e-a54a-9e789c77e48c', 'Desk Lamp', 'LED desk lamp with USB port', 44.99, 'Electronics', 'https://images.pexels.com/photos/4526402/pexels-photo-4526402.jpeg', 30, NOW()),

-- More Fashion Products (Urban Style)
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Card Holder', 'Slim leather card holder', 29.99, 'Fashion', 'https://images.pexels.com/photos/1545994/pexels-photo-1545994.jpeg', 40, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Key Chain', 'Leather key fob', 19.99, 'Fashion', 'https://images.pexels.com/photos/1545993/pexels-photo-1545993.jpeg', 45, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Laptop Sleeve', 'Canvas laptop sleeve', 39.99, 'Fashion', 'https://images.pexels.com/photos/1545992/pexels-photo-1545992.jpeg', 35, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Travel Pouch', 'Water-resistant travel pouch', 24.99, 'Fashion', 'https://images.pexels.com/photos/1545991/pexels-photo-1545991.jpeg', 40, NOW()),
  (gen_random_uuid(), 'b45a12ed-4444-1234-ab67-c89d123ef456', 'Coin Purse', 'Small leather coin purse', 14.99, 'Fashion', 'https://images.pexels.com/photos/1545990/pexels-photo-1545990.jpeg', 50, NOW()),

-- More Beauty Products (Glow Beauty)
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Eye Mask Set', 'Cooling gel eye masks', 16.99, 'Beauty', 'https://images.pexels.com/photos/3785164/pexels-photo-3785164.jpeg', 55, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Foot Cream', 'Intensive foot repair cream', 18.99, 'Beauty', 'https://images.pexels.com/photos/3785163/pexels-photo-3785163.jpeg', 45, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Body Oil', 'Natural body massage oil', 22.99, 'Beauty', 'https://images.pexels.com/photos/3785162/pexels-photo-3785162.jpeg', 40, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Hair Mask', 'Deep conditioning hair mask', 21.99, 'Beauty', 'https://images.pexels.com/photos/3785161/pexels-photo-3785161.jpeg', 50, NOW()),
  (gen_random_uuid(), 'd67e45fa-5555-4321-bc89-f12d345e6789', 'Nail Care Kit', 'Complete nail care set', 28.99, 'Beauty', 'https://images.pexels.com/photos/3785160/pexels-photo-3785160.jpeg', 35, NOW()),

-- More Sports Products (Active Life)
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Massage Ball', 'Deep tissue massage ball', 12.99, 'Sports', 'https://images.pexels.com/photos/4397831/pexels-photo-4397831.jpeg', 60, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Wrist Wraps', 'Weight lifting wrist support', 16.99, 'Sports', 'https://images.pexels.com/photos/4397830/pexels-photo-4397830.jpeg', 50, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Resistance Loop', 'Mini resistance band', 9.99, 'Sports', 'https://images.pexels.com/photos/4397829/pexels-photo-4397829.jpeg', 70, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Yoga Block', 'High-density foam block', 14.99, 'Sports', 'https://images.pexels.com/photos/4397828/pexels-photo-4397828.jpeg', 55, NOW()),
  (gen_random_uuid(), 'e89f12cd-6666-7777-de90-123456789abc', 'Stretching Strap', 'Yoga stretching strap', 11.99, 'Sports', 'https://images.pexels.com/photos/4397827/pexels-photo-4397827.jpeg', 65, NOW()); 

-- Update all references to the Sports shop ID
UPDATE products 
SET shop_id = 'e89f12cd-6666-7777-de90-123456789abc'
WHERE shop_id = 'e89f12cd-6666-7777-de90-g34h567i8901';

-- Add discount column to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'products' AND column_name = 'discount') THEN
        ALTER TABLE products ADD COLUMN discount INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update products with categories and discounts
UPDATE products
SET 
  category = CASE 
    WHEN name LIKE '%Coffee%' OR name LIKE '%Tea%' OR name LIKE '%Pastry%' OR name LIKE '%Cake%' THEN 'Food'
    WHEN name LIKE '%Table%' OR name LIKE '%Blanket%' OR name LIKE '%Vase%' THEN 'Handmade'
    WHEN name LIKE '%Painting%' OR name LIKE '%Art%' OR name LIKE '%Print%' THEN 'Crafts'
    WHEN name LIKE '%Service%' OR name LIKE '%Consultation%' OR name LIKE '%Class%' THEN 'Services'
    ELSE 'Local Shops'
  END,
  discount = CASE 
    WHEN RANDOM() < 0.3 THEN (ARRAY[10, 15, 20, 25, 30, 40, 50])[FLOOR(RANDOM() * 7 + 1)]
    ELSE 0
  END;

-- Ensure we have at least some products with discounts
UPDATE products 
SET discount = 25 
WHERE id IN (
  SELECT id FROM products 
  WHERE discount = 0 
  ORDER BY RANDOM() 
  LIMIT 5
);