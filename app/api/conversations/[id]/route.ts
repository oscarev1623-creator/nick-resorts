import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ IMPORTANTE: await params antes de usarlo
    const { id } = await params;
    
    // Primero eliminar mensajes de esa conversación
    await sql`
      DELETE FROM messages 
      WHERE conversation_id = ${id}::uuid
    `;
    
    // Luego eliminar la conversación
    await sql`
      DELETE FROM conversations 
      WHERE id = ${id}::uuid
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Error al eliminar conversación' }, { status: 500 });
  }
}