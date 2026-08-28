import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('families')
    .select('*');

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  console.log('Supabase connected:', data);
}
