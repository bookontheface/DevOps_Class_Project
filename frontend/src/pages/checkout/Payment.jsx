import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { money } from '../../components/ProductCard';

export default function Payment() {
  const { orderId } = useParams(); const [order,setOrder] = useState(null); const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  useEffect(() => { api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(e => setError(e.response?.data?.message || 'Could not load order')); }, [orderId]);
  const pay = async () => {
    setBusy(true); setError('');
    try {
      const { data } = await api.post(`/payments/${orderId}/snap-token`);
      const key = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
      if (!key) throw new Error('Set VITE_MIDTRANS_CLIENT_KEY in frontend environment and restart Vite.');
      if (!window.snap) {
        await new Promise((resolve,reject) => {
          const s = document.createElement('script');
          s.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
          s.setAttribute('data-client-key', key); s.onload = resolve; s.onerror = reject;
          document.body.appendChild(s);
        });
      }
      window.snap.pay(data.token, {
        onSuccess: () => alert('Payment submitted. Your order status will update after Midtrans verification.'),
        onPending: () => alert('Payment is pending. You can check your order status later.'),
        onError: () => alert('Payment could not be completed.'),
        onClose: () => {}
      });
    } catch(e) { setError(e.response?.data?.message || e.message || 'Payment could not start'); }
    finally { setBusy(false); }
  };
  if (!order) return <main className="container py-5">{error || 'Loading order...'}</main>;
  return <main className="container py-5"><span className="eyebrow">SECURE CHECKOUT</span><h1 className="section-title mb-4">Complete your payment</h1><div className="row g-4"><div className="col-lg-7"><div className="summary-card"><div className="d-flex justify-content-between"><h5>Order {order.orderNumber}</h5><span className="status-pill">{order.status}</span></div><hr/>{order.OrderItems?.map(i=><div className="d-flex justify-content-between py-2" key={i.id}><span>{i.productName} × {i.quantity}</span><strong>{money(i.unitPrice*i.quantity)}</strong></div>)}<hr/><div className="d-flex justify-content-between fs-5"><strong>Total</strong><strong>{money(order.total)}</strong></div><p className="small text-secondary mt-3 mb-0">Payment is processed securely by Midtrans Sandbox.</p>{error && <div className="alert alert-danger mt-3">{error}</div>}<button className="btn btn-dark btn-lg w-100 mt-4" disabled={busy || order.status !== 'pending'} onClick={pay}>{busy?'Preparing payment...':'Pay with Midtrans'}</button></div></div><div className="col-lg-5"><div className="summary-card"><h5>Shipping to</h5><strong>{order.shippingAddress.recipient}</strong><p className="text-secondary mb-1">{order.shippingAddress.phone}</p><p className="text-secondary">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p><Link to="/orders">View your orders</Link></div></div></div></main>;
}
