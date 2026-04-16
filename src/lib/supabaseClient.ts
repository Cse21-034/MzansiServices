import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Client-side configuration (uses public environment variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_T || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// Server-side configuration (uses service role for admin operations)
const supabaseServiceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase service role environment variables');
}

export const supabaseAdmin = createSupabaseClient(supabaseServiceUrl, supabaseServiceKey);
