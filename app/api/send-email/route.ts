import { NextRequest, NextResponse } from 'next/server';
import { sendReservationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, cart } = body;

    if (!lead || !cart) {
      return NextResponse.json(
        { error: 'Faltan datos necesarios' },
        { status: 400 }
      );
    }

    const result = await sendReservationEmail(lead, cart);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Error al enviar el correo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error en la API de email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}