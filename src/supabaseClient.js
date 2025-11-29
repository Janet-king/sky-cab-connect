import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https://jzaxtfxpsytelqpglwxx.supabase.co;
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6YXh0Znhwc3l0ZWxxcGdsd3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjkyMTQsImV4cCI6MjA3OTIwNTIxNH0.rKlFLIlgAkNMXLNnPcKmWC0kVAzdqsDRJWGme7ebrJc;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

