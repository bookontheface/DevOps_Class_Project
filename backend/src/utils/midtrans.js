import midtransClient from 'midtrans-client';

export function getSnap() {
  if (!process.env.MIDTRANS_SERVER_KEY) throw Object.assign(new Error('Midtrans is not configured'), { status: 503 });
  return new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });
}
