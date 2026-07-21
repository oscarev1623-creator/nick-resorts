import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export const sendReservationEmail = async (lead: any, cart: any) => {
  const templateParams = {
    full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    destination: lead.destination === 'punta-cana' ? 'Punta Cana' : 'Riviera Maya',
    arrival_date: new Date(lead.arrival_date).toLocaleDateString('es-ES'),
    departure_date: new Date(lead.departure_date).toLocaleDateString('es-ES'),
    package_name: cart.packageName || 'Sin paquete',
    room_name: cart.roomName,
    nights: cart.nights,
    adults: cart.adults,
    kids: cart.kids,
    total_price: cart.totalPrice.toLocaleString(),
    message: lead.message || 'Ninguno',
    aeropuerto: lead.aeropuerto_salida || 'No especificado',
    lead_id: lead.id?.slice(0, 8) || '',
    app_url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    console.log('📧 Correo enviado:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return { success: false, error };
  }
};