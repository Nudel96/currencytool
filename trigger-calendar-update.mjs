// Trigger calendar update function manually
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔄 Triggering Calendar Update Function...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function triggerCalendarUpdate() {
  try {
    // Extract project reference from URL
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    
    const functionUrl = `${supabaseUrl}/functions/v1/update_calendar`;
    
    console.log(`📡 Calling function: ${functionUrl}`);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const responseText = await response.text();
    
    if (response.ok) {
      console.log('✅ Calendar update function executed successfully');
      console.log('📄 Response:', responseText);
    } else {
      console.error('❌ Function execution failed');
      console.error('Status:', response.status);
      console.error('Response:', responseText);
    }
    
  } catch (error) {
    console.error('❌ Error triggering function:', error);
  }
}

triggerCalendarUpdate();
