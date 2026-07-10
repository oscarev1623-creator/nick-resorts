import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();
    
    // Reparto balanceado + prioridad al asesor con mas tiempo sin nueva asignacion.
    const agents = await sql`
      SELECT
        a.*,
        COUNT(c_active.id) as active_count,
        MAX(c_all.created_at) as last_assignment_at
      FROM agents a
      LEFT JOIN conversations c_active
        ON c_active.assigned_to = a.id
        AND c_active.status = 'active'
      LEFT JOIN conversations c_all
        ON c_all.assigned_to = a.id
      WHERE a.is_active = true
      GROUP BY a.id
      ORDER BY active_count ASC, last_assignment_at ASC NULLS FIRST, a.created_at ASC
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