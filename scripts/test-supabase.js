
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env.local
try {
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }
} catch (e) {
    console.error('Could not load .env.local', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('--- TEST 1: Simple Select ---');
    const { data: products, error: productError } = await supabase.from('products').select('*').limit(1);

    if (productError) {
        console.error('Error fetching products table:', JSON.stringify(productError, null, 2));
        if (productError.code === 'PGRST205') {
            console.error('FATAL: Table "products" does not exist.');
        }
        return;
    }
    console.log('Success! Products found:', products.length);

    console.log('\n--- TEST 2: Relationship Select ---');
    // Test the exact query causing issues
    const { data: detailed, error: joinError } = await supabase
        .from('products')
        .select(`
      *,
      categories (
        name
      )
    `)
        .limit(1);

    if (joinError) {
        console.error('Error fetching with relationship:', JSON.stringify(joinError, null, 2));
        console.log('Hint: Check if the foreign key relationship exists and is named "categories".');
    } else {
        console.log('Success! Relationship query worked.');
    }
}

testConnection();
