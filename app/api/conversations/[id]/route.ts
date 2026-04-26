import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Primero eliminar mensajes
    await sql`
      DELETE FROM messages 
      WHERE conversation_id = ${params.id}::uuid
    `;
    
    // Luego eliminar conversación
    await sql`
      DELETE FROM conversations 
      WHERE id = ${params.id}::uuid
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Error al eliminar conversación' }, { status: 500 });
  }
}