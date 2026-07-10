import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (email) {
      // Buscar lead específico por email
      const leads = await sql`
        SELECT * FROM leads
        WHERE email = ${email}
        ORDER BY created_at DESC
        LIMIT 1
      `;
      return NextResponse.json(leads);
    } else {
      // Obtener todos los leads
      const leads = await sql`
        SELECT * FROM leads
        ORDER BY created_at DESC
      `;
      return NextResponse.json(leads);
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error al cargar leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      destination,
      aeropuerto_salida,
      aeropuerto_codigo,
      arrival_date,
      departure_date,
      adults,
      kids,
      message,
      accept_promos,
      // New fields
      selected_room,
      selected_package,
      nights,
      total_price,
      payment_method,
      price_breakdown
    } = body;

    const result = await sql`
      INSERT INTO leads (
        full_name,
        email,
        phone,
        destination,
        aeropuerto_salida,
        aeropuerto_codigo,
        arrival_date,
        departure_date,
        adults,
        kids,
        message,
        accept_promos,
        selected_room,
        selected_package,
        nights,
        total_price,
        payment_method,
        price_breakdown
      ) VALUES (
        ${full_name},
        ${email},
        ${phone},
        ${destination},
        ${aeropuerto_salida},
        ${aeropuerto_codigo},
        ${arrival_date},
        ${departure_date},
        ${adults},
        ${kids},
        ${message},
        ${accept_promos},
        ${selected_room || null},
        ${selected_package || null},
        ${nights || null},
        ${total_price || null},
        ${payment_method || null},
        ${price_breakdown || null}
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