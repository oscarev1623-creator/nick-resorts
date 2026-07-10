import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

const EXTERNAL_TO_DB_SENDER_TYPE: Record<string, string> = {
  user: 'cliente',
  agent: 'asesor',
  system: 'asesor',
};

const DB_TO_EXTERNAL_SENDER_TYPE: Record<string, string> = {
  cliente: 'user',
  asesor: 'agent',
};

const VALID_SENDER_TYPES = new Set(Object.keys(EXTERNAL_TO_DB_SENDER_TYPE));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const markAsRead = searchParams.get('markAsRead') === 'true';

    console.log('API /api/chat/messages called, conversationId:', conversationId, 'markAsRead:', markAsRead);
    
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId requerido' }, { status: 400 });
    }

    const conversations = await sql`
      SELECT c.*, a.id as agent_id, a.name as agent_name, a.color as agent_color
      FROM conversations c
      LEFT JOIN agents a ON c.assigned_to = a.id
      WHERE c.id = ${conversationId}::uuid
      LIMIT 1
    `;

    if (conversations.length === 0) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }
    
    const messages = await sql`
      SELECT * FROM messages 
      WHERE conversation_id = ${conversationId}::uuid
      ORDER BY created_at ASC
    `;

    if (markAsRead) {
      await sql`
        UPDATE messages
        SET is_read = true
        WHERE conversation_id = ${conversationId}::uuid
          AND sender_type IN ('user', 'cliente')
          AND is_read = false
      `;

      await sql`
        UPDATE conversations
        SET unread_count = 0
        WHERE id = ${conversationId}::uuid
      `;
    }

    const conversation = conversations[0];
    
    return NextResponse.json({
      success: true,
      messages: messages.map((msg: any) => ({
        id: msg.id,
        message: msg.content,
        senderType: msg.sender_type === 'cliente' ? 'user' : msg.sender_type === 'asesor' ? 'agent' : msg.sender_type,
        createdAt: msg.created_at,
        isRead: msg.is_read,
        fileUrl: null,
        fileType: null,
        fileName: null,
      })),
      conversation: {
        id: conversation.id,
        status: conversation.status,
        userName: conversation.user_name,
        userEmail: conversation.user_email,
        userPhone: conversation.user_phone,
        unreadCount: conversation.unread_count,
        updatedAt: conversation.updated_at,
        assignedTo: conversation.agent_id
          ? {
              id: conversation.agent_id,
              name: conversation.agent_name,
              color: conversation.agent_color,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Error al cargar mensajes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, message, senderType } = body;

    if (!conversationId || !senderType) {
      return NextResponse.json({ success: false, error: 'Faltan datos requeridos' }, { status: 400 });
    }

    if (!VALID_SENDER_TYPES.has(senderType)) {
      return NextResponse.json(
        {
          success: false,
          error: `senderType inválido. Valores válidos: ${Array.from(VALID_SENDER_TYPES).join(', ')}`,
        },
        { status: 400 }
      );
    }
    
    const messageText = message || '';
    const dbSenderType = EXTERNAL_TO_DB_SENDER_TYPE[senderType];
    const isRead = senderType === 'agent';
    let result: any[] = [];

    result = await sql`
      INSERT INTO messages (conversation_id, sender_type, content, is_read)
      VALUES (${conversationId}::uuid, ${dbSenderType}, ${messageText}, ${isRead})
      RETURNING *
    `;
    
    if (senderType === 'user') {
      await sql`
        UPDATE conversations
        SET updated_at = NOW(), unread_count = unread_count + 1
        WHERE id = ${conversationId}::uuid
      `;
    } else {
      await sql`
        UPDATE conversations
        SET updated_at = NOW()
        WHERE id = ${conversationId}::uuid
      `;
    }
    
    return NextResponse.json({
      success: true,
      message: {
        id: result[0].id,
        message: result[0].content,
        senderType: DB_TO_EXTERNAL_SENDER_TYPE[result[0].sender_type] || result[0].sender_type,
        createdAt: result[0].created_at,
        isRead: result[0].is_read ?? isRead,
        fileUrl: null,
        fileType: null,
        fileName: null,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}