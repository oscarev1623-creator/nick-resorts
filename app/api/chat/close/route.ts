import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();
    
    await sql`
      UPDATE conversations 
      SET status = 'closed', updated_at = NOW()
      WHERE id = ${conversationId}::uuid
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error closing conversation:', error);
    return NextResponse.json({ error: 'Error al cerrar conversación' }, { status: 500 });
  }
}