import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

// Obtener conversaciones (para el panel admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    let query;
    if (email) {
      // Buscar conversación por email del cliente
      query = await sql`
        SELECT * FROM conversations 
        WHERE user_email = ${email}
        ORDER BY updated_at DESC
        LIMIT 1
      `;
    } else {
      // Todas las conversaciones (para admin)
      query = await sql`
        SELECT c.*, 
               (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = false AND sender_type = 'cliente') as unread_count
        FROM conversations c
        ORDER BY updated_at DESC
      `;
    }
    
    return NextResponse.json(query);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Error al cargar conversaciones' }, { status: 500 });
  }
}

// Crear nueva conversación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, user_email, user_name, user_phone } = body;
    
    // Verificar si ya existe una conversación activa
    const existing = await sql`
      SELECT * FROM conversations 
      WHERE user_email = ${user_email} AND status = 'activo'
      LIMIT 1
    `;
    
    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }
    
    const result = await sql`
      INSERT INTO conversations (lead_id, user_email, user_name, user_phone)
      VALUES (${lead_id || null}, ${user_email}, ${user_name}, ${user_phone || null})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Error al crear conversación' }, { status: 500 });
  }
}