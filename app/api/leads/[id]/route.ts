import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ await params
    const { id } = await params;
    
    await sql`
      DELETE FROM leads 
      WHERE id = ${id}::uuid
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Error al eliminar lead' }, { status: 500 });
  }
}