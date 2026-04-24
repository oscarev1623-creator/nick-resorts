import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET() {
  try {
    const leads = await sql`
      SELECT * FROM leads 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error al cargar leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      full_name, email, phone, destination, aeropuerto_salida,
      arrival_date, departure_date, adults, kids, message, accept_promos
    } = body;

    const result = await sql`
      INSERT INTO leads (
        full_name, email, phone, destination, aeropuerto_salida,
        arrival_date, departure_date, adults, kids, message, accept_promos
      ) VALUES (
        ${full_name}, ${email}, ${phone}, ${destination}, ${aeropuerto_salida},
        ${arrival_date}, ${departure_date}, ${adults}, ${kids}, ${message}, ${accept_promos}
      ) RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Error al crear lead' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    const result = await sql`
      UPDATE leads 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `;
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error al actualizar lead' }, { status: 500 });
  }
}