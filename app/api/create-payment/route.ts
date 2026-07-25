import { NextRequest, NextResponse } from 'next/server';
import { np } from '@/lib/nowpayments';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
    try {
        // Verificar que np existe
        if (!np) {
            console.warn('⚠️ NowPayments no está configurado');
            return NextResponse.json({
                success: false,
                error: 'El sistema de pagos no está disponible temporalmente',
                invoice_url: '/pago-simulado'
            }, { status: 503 });
        }

        const body = await request.json();
        // ... resto del código
    } catch (error) {
        console.error('Error creating payment:', error);
        return NextResponse.json(
            { error: 'Error al crear el pago' },
            { status: 500 }
        );
    }
}