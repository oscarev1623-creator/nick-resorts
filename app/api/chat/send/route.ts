import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

const EXTERNAL_TO_DB_SENDER_TYPE: Record<string, string> = {
  user: 'cliente',
  agent: 'asesor',
  system: 'asesor',
}

const DB_TO_EXTERNAL_SENDER_TYPE: Record<string, string> = {
  cliente: 'user',
  asesor: 'agent',
}

const VALID_SENDER_TYPES = new Set(Object.keys(EXTERNAL_TO_DB_SENDER_TYPE))

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type debe ser application/json' },
        { status: 415 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch (error) {
      console.error('Invalid JSON body in /api/chat/send:', error)
      return NextResponse.json(
        { success: false, error: 'JSON inválido en el cuerpo de la petición' },
        { status: 400 }
      )
    }

    const {
      conversationId,
      message,
      senderType,
      fileUrl,
      fileType,
      fileName,
    } = body

    console.log('/api/chat/send called', {
      conversationId,
      senderType,
      messageLength: typeof message === 'string' ? message.trim().length : 0,
      hasFile: !!fileUrl || !!fileType || !!fileName,
    })

    if (!conversationId || !senderType || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'conversationId, senderType y message son campos requeridos',
        },
        { status: 400 }
      )
    }

    if (!VALID_SENDER_TYPES.has(senderType)) {
      return NextResponse.json(
        {
          success: false,
          error: `senderType inválido. Valores válidos: ${Array.from(VALID_SENDER_TYPES).join(', ')}`,
        },
        { status: 400 }
      )
    }

    const dbSenderType = EXTERNAL_TO_DB_SENDER_TYPE[senderType]

    const conversations = await sql`
      SELECT id, unread_count
      FROM conversations
      WHERE id = ${conversationId}::uuid
      LIMIT 1
    `

    if (!conversations || conversations.length === 0) {
      console.error('Conversation not found in /api/chat/send:', conversationId)
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const isRead = senderType === 'agent'
    let result: any[] = []

    try {
      result = await sql`
        INSERT INTO messages (
          conversation_id,
          sender_type,
          content,
          is_read
        ) VALUES (
          ${conversationId}::uuid,
          ${dbSenderType},
          ${message.trim()},
          ${isRead}
        )
        RETURNING *
      `
    } catch (error: any) {
      console.warn('Insert into messages failed:', error?.message)
      throw error
    }

    if (senderType === 'user') {
      await sql`
        UPDATE conversations
        SET updated_at = NOW(), unread_count = COALESCE(unread_count, 0) + 1
        WHERE id = ${conversationId}::uuid
      `
    } else {
      await sql`
        UPDATE conversations
        SET updated_at = NOW()
        WHERE id = ${conversationId}::uuid
      `
    }

    const insertedMessage = result[0]
    const externalSenderType = DB_TO_EXTERNAL_SENDER_TYPE[insertedMessage.sender_type] || insertedMessage.sender_type

    return NextResponse.json({
      success: true,
      message: {
        id: insertedMessage.id,
        message: insertedMessage.content,
        senderType: externalSenderType,
        createdAt: insertedMessage.created_at,
        isRead: insertedMessage.is_read ?? isRead,
        fileUrl: null,
        fileType: null,
        fileName: null,
      },
    })
  } catch (error) {
    console.error('Error in /api/chat/send:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar mensaje' },
      { status: 500 }
    )
  }
}
