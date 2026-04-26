import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

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
    
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Error al cargar mensajes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, message, senderType, fileUrl, fileType, fileName } = body;
    
    const result = await sql`
      INSERT INTO messages (conversation_id, sender_type, content, file_url, file_type, file_name)
      VALUES (${conversationId}::uuid, ${senderType}, ${message}, ${fileUrl || null}, ${fileType || null}, ${fileName || null})
      RETURNING *
    `;
    
    // Actualizar updated_at y unread_count
    await sql`
      UPDATE conversations 
      SET updated_at = NOW(), unread_count = unread_count + 1
      WHERE id = ${conversationId}::uuid
    `;
    
    return NextResponse.json({ success: true, message: result[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}