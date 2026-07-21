import nodemailer from 'nodemailer';

export const sendReservationEmail = async (lead: any, cart: any) => {
  // Crear transporter con Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Tu correo Gmail
      pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación de Gmail
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Reserva - Nick Resorts</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #FF6B00, #FF8C42); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 900; }
        .header p { color: rgba(255,255,255,0.9); margin: 5px 0 0; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: 700; color: #FF6B00; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .row-label { color: #666; font-weight: 500; }
        .row-value { color: #222; font-weight: 600; }
        .total { font-size: 24px; font-weight: 900; color: #FF6B00; text-align: center; padding: 20px; background: #fff3e8; border-radius: 10px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 2px solid #f0f0f0; margin-top: 30px; }
        .badge { display: inline-block; background: #3DB54A; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧡 NICK RESORTS</h1>
          <p>Donde los sueños se vuelven slime</p>
        </div>

        <div class="content">
          <h2 style="font-size: 22px; text-align: center;">¡Reserva Confirmada!</h2>
          <p style="text-align: center; color: #666;">Hemos recibido tu solicitud. Un asesor te contactará en breve.</p>

          <div class="section">
            <div class="section-title">👤 Datos del Huésped</div>
            <div class="row">
              <span class="row-label">Nombre Completo</span>
              <span class="row-value">${lead.full_name}</span>
            </div>
            <div class="row">
              <span class="row-label">Correo Electrónico</span>
              <span class="row-value">${lead.email}</span>
            </div>
            <div class="row">
              <span class="row-label">Teléfono</span>
              <span class="row-value">${lead.phone}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🏖️ Detalles de la Estancia</div>
            <div class="row">
              <span class="row-label">Paquete</span>
              <span class="row-value">${cart.packageName || 'Sin paquete'}</span>
            </div>
            <div class="row">
              <span class="row-label">Habitación</span>
              <span class="row-value">${cart.roomName}</span>
            </div>
            <div class="row">
              <span class="row-label">Noches</span>
              <span class="row-value">${cart.nights}</span>
            </div>
            <div class="row">
              <span class="row-label">Huéspedes</span>
              <span class="row-value">${cart.adults} adultos, ${cart.kids} niños</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📅 Fechas de Viaje</div>
            <div class="row">
              <span class="row-label">Llegada</span>
              <span class="row-value">${new Date(lead.arrival_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="row">
              <span class="row-label">Salida</span>
              <span class="row-value">${new Date(lead.departure_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">✈️ Transporte</div>
            <div class="row">
              <span class="row-label">Aeropuerto de Salida</span>
              <span class="row-value">${lead.aeropuerto_salida || 'No especificado'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💬 Requisitos Especiales</div>
            <p style="color: #555; font-size: 14px; margin: 0;">${lead.message || 'Ninguno'}</p>
          </div>

          <div class="total">
            Total a Pagar: $${cart.totalPrice.toLocaleString()}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/carrito" style="background: #FF6B00; color: white; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; display: inline-block;">
              Ver mi reserva
            </a>
          </div>
        </div>

        <div class="footer">
          <p>💚🧡 Nick Resorts - Donde los sueños se vuelven slime</p>
          <p>Punta Cana, República Dominicana | Riviera Maya, México</p>
          <p style="margin-top: 10px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #FF6B00; text-decoration: none;">Visitar sitio web</a> | 
            <a href="https://t.me/NickResortOficial" style="color: #0088cc; text-decoration: none;">Telegram</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Nick Resorts" <${process.env.EMAIL_USER}>`,
      to: lead.email,
      subject: `🧡 Confirmación de Reserva - Nick Resorts #${lead.id?.slice(0, 8)}`,
      html: htmlContent,
    });

    console.log('📧 Correo enviado:', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return { success: false, error };
  }
};