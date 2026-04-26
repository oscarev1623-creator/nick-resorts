import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }
    
    const conversations = await sql`
      SELECT id FROM conversations 
      WHERE user_email = ${email} AND status = 'active'
      LIMIT 1
    `;
    
    if (conversations.length > 0) {
      return NextResponse.json({ success: true, conversationId: conversations[0].id });
    }
    
    return NextResponse.json({ success: false, conversationId: null });
  } catch (error) {
    console.error('Error finding conversation:', error);
    return NextResponse.json({ error: 'Error al buscar conversación' }, { status: 500 });
  }
}