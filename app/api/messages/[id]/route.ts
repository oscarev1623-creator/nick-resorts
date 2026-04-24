import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`
      DELETE FROM messages 
      WHERE id = ${params.id}::uuid
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Error al eliminar mensaje' }, { status: 500 });
  }
}