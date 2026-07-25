import { NowPayments } from 'nowpayments-js';

export const np = new NowPayments({
    apiKey: process.env.NOWPAYMENTS_API_KEY!,
    ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET!,
    email: process.env.NOWPAYMENTS_EMAIL!,
    password: process.env.NOWPAYMENTS_PASSWORD!,
    sandbox: process.env.NODE_ENV === 'development',
    ipnCallbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/nowpayments`
});