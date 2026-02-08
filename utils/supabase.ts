import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://qspyyepcxmjnhmkholmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcHl5ZXBjeG1qbmhta2hvbG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjEwMzQsImV4cCI6MjA4NjAzNzAzNH0.TujE9Ih_wA3pla31TCWm-Th1xtmy0V0ed0FesLsXe34';

export const supabase = createClient(supabaseUrl, supabaseKey);