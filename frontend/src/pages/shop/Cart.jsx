import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { money } from '../../components/ProductCard';
export default function Cart() {
  const [items,setItems] = useState([]); const [error,setError] = useState('');
  const load = () => api.get('/cart').then(r => setItems(r.data)).catch(e => setError(e.response?.data?.message || 'Please sign in to view your cart.'));
  useEffect(() => { load(); }, []);
  const update = async (id, quantity) => { try { await api.put(`/cart/items/${id}`,{quantity}); load(); } catch(e) { alert(e.response?.data?.message || 'Update failed'); } };
  const remove = async id => { await api.delete(`/cart/items/${id}`); load(); };
  const total = items.reduce((s,i) => s + (i.Product?.price || 0)*i.quantity,0);
  return <main className="container py-5"><span className="eyebrow">YOUR SELECTION</span><h1 className="section-title mb-4">Shopping bag</h1>{error && <div className="alert alert-warning">{error} <Link to="/login">Sign in</Link></div>}{items.length ? <div className="row g-4"><div className="col-lg-8">{items.map(i=><div className="cart-row" key={i.id}><img src={i.Product?.imageUrl} alt={i.Product?.name}/><div className="flex-grow-1"><strong>{i.Product?.name}</strong><div className="text-secondary small">{money(i.Product?.price)}</div><div className="quantity-control mt-2"><button onClick={()=>update(i.id,Math.max(1,i.quantity-1))}>−</button><span>{i.quantity}</span><button onClick={()=>update(i.id,i.quantity+1)}>+</button></div></div><div className="text-end"><strong>{money(i.Product?.price*i.quantity)}</strong><button className="btn btn-link text-danger d-block ms-auto" onClick={()=>remove(i.id)}>Remove</button></div></div>)}</div><div className="col-lg-4"><div className="summary-card"><h5>Order summary</h5><div className="d-flex justify-content-between my-3"><span>Subtotal</span><strong>{money(total)}</strong></div><div className="d-flex justify-content-between text-secondary small"><span>Shipping</span><span>Calculated at checkout</span></div><hr/><div className="d-flex justify-content-between mb-3"><strong>Total</strong><strong>{money(total)}</strong></div><Link to="/checkout" className="btn btn-dark btn-lg w-100">Continue to checkout</Link></div></div></div> : !error && <div className="empty-state"><i className="bi bi-bag display-4"/><h4 className="mt-3">Your bag is empty</h4><Link to="/" className="btn btn-dark mt-2">Explore products</Link></div>}</main>;
}
