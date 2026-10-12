import {NextResponse} from 'next/server';import {z} from 'zod';import {createClient} from '@/lib/supabase/server';
export async function POST(req:Request){const db=await createClient();if(!db)return NextResponse.json({error:'Authentication is not configured.'},{status:503});const data=z.object({email:z.string().email()}).safeParse(await req.json().catch(()=>null));if(!data.success)return NextResponse.json({error:'Enter a valid email address.'},{status:400});const {error}=await db.auth.signInWithOtp({email:data.data.email,options:{emailRedirectTo:new URL('/auth/callback',req.url).toString()}});if(error){
  // Keep provider diagnostics in server logs without logging the student's email.
  console.error('Supabase magic-link delivery failed', {code:error.code,status:error.status,message:error.message});
  const code=error.code||'';
  const message=code==='email_address_not_authorized'
    ? 'Supabase’s default email service only sends to project team members. Configure custom SMTP under Authentication → Emails → SMTP Settings.'
    : code.includes('rate_limit')||code.includes('over_email_send_rate_limit')
      ? 'Supabase’s email rate limit was reached. Wait before trying again, or configure custom SMTP.'
      : 'Supabase could not send the link. Check Supabase Authentication logs for the exact provider error.';
  return NextResponse.json({error:message},{status:400});
}return NextResponse.json({ok:true});}
