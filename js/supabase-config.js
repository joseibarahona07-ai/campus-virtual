const SUPABASE_URL = 'https://xhzihaysqyzuulwaxcpy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoemloYXlzcXl6dXVsd2F4Y3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNDk4MTMsImV4cCI6MjA5OTcyNTgxM30.C4LJBnNK229CvToV7coK-L7v-PWyDhARf91ZnQeWa1o';

window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
