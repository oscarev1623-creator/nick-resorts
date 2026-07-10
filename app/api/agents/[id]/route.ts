import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();

    await sql`
      UPDATE agents
      SET is_active = ${Boolean(isActive)}
      WHERE id = ${id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar asesor' }, { status: 500 });
  }
}
