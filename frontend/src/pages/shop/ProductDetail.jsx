import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { money } from '../../components/ProductCard';
export default function ProductDetail() {
  const { id } = useParams(); const [p, setP] = useState(null); const [qty, setQty] = useState(1); const { user } = useAuth();
  useEffect(() => { api.get(`/products/${id}`).then(r => setP(r.data)).catch(() => setP(false)); }, [id]);
  const add = async () => { if (!user) return window.location.assign('/login'); try { await api.post('/cart/items', { productId: p.id, quantity: qty }); alert('Added to your bag'); } catch (e) { alert(e.response?.data?.message || 'Could not add item'); } };
  if (p === false) return <main className="container py-5">Product not found. <Link to="/">Back to store</Link></main>;
  if (!p) return <main className="container py-5">Loading product...</main>;
  return <main className="container py-5"><Link to="/" className="text-secondary text-decoration-none"><i className="bi bi-arrow-left"/> Back to products</Link><div className="row g-5 mt-2 align-items-center"><div className="col-md-6"><div className="detail-image"><img src={p.imageUrl} alt={p.name}/></div></div><div className="col-md-6"><span className="eyebrow">{p.category}</span><h1 className="display-5 fw-bold mt-2">{p.name}</h1><h3 className="my-3">{money(p.price)}</h3><p className="text-secondary lh-lg">{p.description}</p><p className="small text-secondary">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p><div className="d-flex gap-3 align-items-center my-4"><div className="quantity-control"><button onClick={() => setQty(Math.max(1,qty-1))}>−</button><span>{qty}</span><button onClick={() => setQty(Math.min(p.stock,qty+1))}>+</button></div><button className="btn btn-dark btn-lg flex-grow-1" disabled={!p.stock} onClick={add}>Add to bag</button></div></div></div></main>;
}
