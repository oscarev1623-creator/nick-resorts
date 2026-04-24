import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

// Obtener mensajes de una conversación
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId requerido' }, { status: 400 });
    }
    
    const messages = await sql`
      SELECT * FROM messages 
      WHERE conversation_id = ${conversationId}::uuid
      ORDER BY created_at ASC
    `;
    
    // Marcar mensajes como leídos
    await sql`
      UPDATE messages 
      SET is_read = true 
      WHERE conversation_id = ${conversationId}::uuid AND sender_type = 'cliente' AND is_read = false
    `;
    
    // Actualizar contador en conversación
    await sql`
      UPDATE conversations 
      SET unread_count = 0, updated_at = NOW()
      WHERE id = ${conversationId}::uuid
    `;
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Error al cargar mensajes' }, { status: 500 });
  }
}

// Enviar mensaje
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation_id, sender_type, sender_name, content } = body;
    
    const result = await sql`
      INSERT INTO messages (conversation_id, sender_type, sender_name, content)
      VALUES (${conversation_id}::uuid, ${sender_type}, ${sender_name}, ${content})
      RETURNING *
    `;
    
    // Actualizar updated_at de la conversación
    await sql`
      UPDATE conversations 
      SET updated_at = NOW(),
          unread_count = unread_count + 1
      WHERE id = ${conversation_id}::uuid
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}