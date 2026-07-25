import { NextRequest, NextResponse } from 'next/server';
import { np } from '@/lib/nowpayments';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const signature = request.headers.get('x-nowpayments-sig');

        // Verificar firma del webhook
        const isValid = np.verifyIpnSignature(body, signature);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Firma inválida' },
                { status: 401 }
            );
        }

        const { payment_id, payment_status, order_id } = body;

        // Actualizar el estado del lead según el webhook
        let status = 'pending';
        if (payment_status === 'finished' || payment_status === 'confirmed') {
            status = 'paid';
        } else if (payment_status === 'failed' || payment_status === 'expired') {
            status = 'failed';
        }

        await sql`
            UPDATE leads 
            SET 
                payment_status = ${payment_status},
                status = ${status},
                updated_at = NOW()
            WHERE payment_id = ${payment_id}::text
        `;

        console.log(`✅ Pago ${payment_id} actualizado a ${payment_status}`);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error en webhook:', error);
        return NextResponse.json(
            { error: 'Error interno' },
            { status: 500 }
        );
    }
}