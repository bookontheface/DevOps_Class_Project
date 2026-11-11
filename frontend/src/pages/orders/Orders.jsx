import { useEffect, useState } from 'react';
import api from '../../services/api';
import { money } from '../../components/ProductCard';
export default function Orders() {
  const [orders,setOrders] = useState([]); const [error,setError] = useState('');
  const load = () => api.get('/orders').then(r => setOrders(r.data)).catch(e => setError(e.response?.data?.message || 'Unable to load orders'));
  useEffect(() => { load(); }, []);
  return <main className="container py-5"><span className="eyebrow">YOUR PURCHASES</span><h1 className="section-title mb-4">Order history</h1>{error && <div className="alert alert-warning">{error}</div>}{orders.map(o=><div className="summary-card mb-3" key={o.id}><div className="d-flex flex-wrap justify-content-between gap-2"><div><strong>{o.orderNumber}</strong><div className="small text-secondary">{new Date(o.createdAt).toLocaleString()}</div></div><span className="status-pill">{o.status}</span></div><hr/><div className="d-flex justify-content-between"><span>{o.OrderItems?.length} product line(s)</span><strong>{money(o.total)}</strong></div></div>)}{!orders.length && !error && <div className="empty-state">No orders yet.</div>}</main>;
}
