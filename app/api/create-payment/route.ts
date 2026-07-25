import { NextRequest, NextResponse } from 'next/server';
import { np } from '@/lib/nowpayments';
import sql from '@/lib/neon';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { leadId, totalPrice, currency = 'USD' } = body;

        if (!leadId) {
            return NextResponse.json(
                { error: 'leadId es requerido' },
                { status: 400 }
            );
        }

        // 1. Obtener el lead
        const leadResult = await sql`
            SELECT * FROM leads WHERE id = ${leadId}::uuid
        `;

        if (leadResult.length === 0) {
            return NextResponse.json(
                { error: 'Lead no encontrado' },
                { status: 404 }
            );
        }

        const lead = leadResult[0];

        // 2. Crear factura en NowPayments
        const invoice = await np.payment.createInvoice({
            price_amount: totalPrice,
            price_currency: currency,
            order_id: leadId,
            order_description: `Reserva Nick Resorts - ${lead.full_name}`,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pago-exitoso?leadId=${leadId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pago-cancelado?leadId=${leadId}`,
            is_fixed_rate: true,
        });

        // 3. Guardar el payment_id en el lead
        await sql`
            UPDATE leads 
            SET 
                payment_id = ${invoice.id},
                payment_status = 'waiting',
                payment_amount = ${totalPrice}
            WHERE id = ${leadId}::uuid
        `;

        return NextResponse.json({
            success: true,
            invoice_url: invoice.invoice_url,
            payment_id: invoice.id,
        });

    } catch (error) {
        console.error('Error creating payment:', error);
        return NextResponse.json(
            { error: 'Error al crear el pago' },
            { status: 500 }
        );
    }
}