
import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = 'https://qspyyepcxmjnhmkholmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcHl5ZXBjeG1qbmhta2hvbG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjEwMzQsImV4cCI6MjA4NjAzNzAzNH0.TujE9Ih_wA3pla31TCWm-Th1xtmy0V0ed0FesLsXe34';

// Safety Wrapper
// This ensures that if the app is run in an environment without internet (Offline APK)
// or if keys are rotated/invalid, the app doesn't white-screen crash.
let client;

try {
    if (supabaseUrl && supabaseKey) {
        client = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
            global: {
                // Prevent throwing on network errors, handled in storage.ts
                headers: { 'x-application-name': 'nexus-chess' }
            }
        });
    } else {
        console.warn("Supabase credentials missing. Running in Offline Mode.");
        client = null;
    }
} catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    client = null;
}

// Export a proxy or the client. If client is null, any usage will throw, 
// so we export a dummy object if initialization failed, ensuring the app keeps running via LocalStorage.
export const supabase = client || {
    from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: 'Offline' }) }) }),
        insert: () => Promise.resolve({ error: 'Offline' }),
        update: () => ({ eq: () => Promise.resolve({ error: 'Offline' }) }),
    })
} as any;
