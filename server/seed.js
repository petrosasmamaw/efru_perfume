import bcrypt from 'bcryptjs';
import sql from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create tables
    console.log('📋 Creating tables...');

    await sql`
      CREATE TABLE IF NOT EXISTS perfumes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL,
        image_url TEXT,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        perfume_id INTEGER REFERENCES perfumes(id),
        perfume_name VARCHAR(150) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(30) NOT NULL,
        customer_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS owner (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `;

    // Seed owner account
    console.log('👤 Seeding owner account...');

    const ownerExists = await sql`SELECT id FROM owner WHERE username = 'efru_owner'`;

    if (ownerExists.length === 0) {
      const hashedPassword = await bcrypt.hash('owner123', 10);
      await sql`INSERT INTO owner (username, password) VALUES ('efru_owner', ${hashedPassword})`;
      console.log('✅ Owner account created: username=efru_owner, password=owner123');
    } else {
      console.log('⚠️  Owner account already exists');
    }

    // Seed sample perfumes
    console.log('🧴 Seeding sample perfumes...');

    const perfumesExist = await sql`SELECT COUNT(*) as count FROM perfumes`;

    if (perfumesExist[0].count === 0) {
      const perfumes = [
        {
          name: 'Midnight Oud',
          category: 'Oud',
          description: 'A luxurious blend of oud and amber with hints of vanilla. Perfect for evening wear.',
          price: 120.00,
          image_url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&h=500&fit=crop',
        },
        {
          name: 'Floral Dream',
          category: 'Floral',
          description: 'Elegant floral notes of rose, jasmine, and gardenia. A timeless classic.',
          price: 95.00,
          image_url: 'https://images.unsplash.com/photo-1508042659980-63b57d1f3c51?w=500&h=500&fit=crop',
        },
        {
          name: 'Woodland Essence',
          category: 'Woody',
          description: 'Deep woody notes with cedarwood and sandalwood. Sophisticated and grounding.',
          price: 105.00,
          image_url: 'https://images.unsplash.com/photo-1590080876556-e82b5caf6e60?w=500&h=500&fit=crop',
        },
        {
          name: 'Ocean Breeze',
          category: 'Fresh',
          description: 'Crisp and fresh with notes of sea salt and citrus. Perfect for daytime.',
          price: 85.00,
          image_url: 'https://images.unsplash.com/photo-1606147629646-85a8bada45f9?w=500&h=500&fit=crop',
        },
        {
          name: 'Golden Paradise',
          category: 'Oriental',
          description: 'Warm and sensual with vanilla, amber, and musk. An enchanting fragrance.',
          price: 110.00,
          image_url: 'https://images.unsplash.com/photo-1617638924702-92521c7db620?w=500&h=500&fit=crop',
        },
      ];

      for (const perfume of perfumes) {
        await sql`
          INSERT INTO perfumes (name, category, description, price, image_url, available)
          VALUES (${perfume.name}, ${perfume.category}, ${perfume.description}, ${perfume.price}, ${perfume.image_url}, true)
        `;
      }

      console.log('✅ Sample perfumes created');
    } else {
      console.log('⚠️  Perfumes already exist');
    }

    console.log('\n✨ Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();
