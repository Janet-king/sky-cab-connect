import { supabase } from '../supabaseClient';

export async function createRide(data) {
  const { name, source, destination, distance, fare } = data;

  const { error } = await supabase
    .from('flycab_rides')
    .insert([
      { name, source, destination, distance, fare }
    ]);

  return { error };
}
export async function getLatestRide() {
  const { data, error } = await supabase
    .from('flycab_rides')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  return { data: data?.[0], error };
}

