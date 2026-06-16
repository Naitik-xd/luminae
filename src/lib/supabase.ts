import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://lxijmxhrtimxgvqosgvx.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWpteGhydGlteGd2cW9zZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzM2MTgsImV4cCI6MjA5NzE0OTYxOH0.LOf3fEM8x2c7jiCOimVk99XEFZ0LDnMSsGiB6dAhht0';

export const supabase = createClient(supabaseUrl, supabaseKey);
