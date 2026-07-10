import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('leadId');
    
    if (!leadId) {
      return NextResponse.json({ error: 'leadId requerido' }, { status: 400 });
    }
    
    const conversations = await sql`
      SELECT id FROM conversations 
      WHERE lead_id = ${leadId}::uuid
      LIMIT 1
    `;
    
    if (conversations.length > 0) {
      return NextResponse.json({ success: true, conversationId: conversations[0].id });
    }
    
    return NextResponse.json({ success: false, conversationId: null });
  } catch (error) {
    console.error('Error finding conversation by lead:', error);
    return NextResponse.json({ error: 'Error al buscar conversación' }, { status: 500 });
  }
}