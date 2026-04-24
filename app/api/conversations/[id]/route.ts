import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = await sql`
      SELECT * FROM conversations 
      WHERE id = ${params.id}::uuid
    `;
    
    if (conversation.length === 0) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(conversation[0]);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Error al cargar conversación' }, { status: 500 });
  }
}