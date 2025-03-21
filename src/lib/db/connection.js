import { createClient } from '@supabase/supabase-js';

// Create a Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection with a simple query
supabase
  .from('_dummy_query')
  .select('*')
  .limit(1)
  .then(() => {
    console.log('Supabase connected successfully');
  })
  .catch((err) => {
    console.error('Supabase connection error:', err);
  });

export default supabase; 