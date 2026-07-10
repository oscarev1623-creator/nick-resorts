import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await sql`
      DELETE FROM messages
      WHERE conversation_id = ${id}::uuid
    `;

    await sql`
      DELETE FROM conversations
      WHERE id = ${id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar conversación' }, { status: 500 });
  }
}
