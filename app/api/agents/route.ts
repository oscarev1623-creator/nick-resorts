import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET() {
  try {
    const agents = await sql`
      SELECT id, name, email, color, is_active, created_at
      FROM agents 
      WHERE is_active = true
      ORDER BY name ASC
    `;
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Error al cargar agentes' }, { status: 500 });
  }
}