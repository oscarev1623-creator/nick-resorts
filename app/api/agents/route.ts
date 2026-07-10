import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get('all') === 'true';
    const agents = showAll
      ? await sql`
          SELECT id, name, email, color, is_active, created_at
          FROM agents
          ORDER BY name ASC
        `
      : await sql`
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, color } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Nombre y email son requeridos' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO agents (name, email, color, is_active)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${color || 'orange'}, true)
      RETURNING id, name, email, color, is_active, created_at
    `;

    return NextResponse.json({ success: true, agent: inserted[0] });
  } catch (error: any) {
    console.error('Error creating agent:', error);
    const message = error?.message?.includes('duplicate') ? 'El email del asesor ya existe' : 'Error al crear asesor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}