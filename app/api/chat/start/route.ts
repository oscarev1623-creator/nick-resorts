import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Verificar si ya existe una conversación activa
    const existing = await sql`
      SELECT * FROM conversations 
      WHERE user_email = ${email} AND status = 'active'
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({ 
        success: true, 
        conversationId: existing[0].id,
        conversation: existing[0]
      });
    }

    // Crear nueva conversación
    const result = await sql`
      INSERT INTO conversations (user_name, user_email, user_phone, status)
      VALUES (${name}, ${email}, ${phone || null}, 'active')
      RETURNING *
    `;

    return NextResponse.json({ 
      success: true, 
      conversationId: result[0].id,
      conversation: result[0]
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al iniciar conversación' 
    }, { status: 500 });
  }
}