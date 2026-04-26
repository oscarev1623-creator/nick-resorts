import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();
    
    // Buscar el asesor con menos conversaciones activas
    const agents = await sql`
      SELECT a.*, COUNT(c.id) as active_count
      FROM agents a
      LEFT JOIN conversations c ON c.assigned_to = a.id AND c.status = 'active'
      WHERE a.is_active = true
      GROUP BY a.id
      ORDER BY active_count ASC
      LIMIT 1
    `;
    
    const assignedAgent = agents[0] || null;
    
    if (assignedAgent) {
      await sql`
        UPDATE conversations 
        SET assigned_to = ${assignedAgent.id}
        WHERE id = ${conversationId}::uuid
      `;
    }
    
    return NextResponse.json({ success: true, agent: assignedAgent });
  } catch (error) {
    console.error('Error assigning agent:', error);
    return NextResponse.json({ error: 'Error al asignar agente' }, { status: 500 });
  }
}