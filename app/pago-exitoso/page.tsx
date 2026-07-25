"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PagoExitoso() {
    const searchParams = useSearchParams();
    const leadId = searchParams.get('leadId');
    const [lead, setLead] = useState(null);

    useEffect(() => {
        if (leadId) {
            fetch(`/api/leads/${leadId}`)
                .then(res => res.json())
                .then(data => setLead(data));
        }
    }, [leadId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-6">
                    Tu reserva ha sido confirmada. Te enviaremos un correo con los detalles.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm text-gray-500">ID de reserva</p>
                    <p className="font-mono text-sm font-bold">{leadId}</p>
                </div>
                <Link
                    href="/"
                    className="inline-block w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold hover:bg-[#E55A00] transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}