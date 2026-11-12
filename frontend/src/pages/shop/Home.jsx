import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
const categories = ['All', 'Smartphones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Accessories'];
export default function Home() {
  const [products, setProducts] = useState([]); const [category, setCategory] = useState('All'); const [q, setQ] = useState(''); const [error, setError] = useState('');
  const { user } = useAuth();
  const load = () => api.get('/products', { params: { category, q } }).then(r => setProducts(r.data)).catch(() => setError('Could not load products. Is the API running?'));
  useEffect(() => { load(); }, [category, q]);
  const add = async product => { if (!user) return window.location.assign('/login'); try { await api.post('/cart/items', { productId: product.id, quantity: 1 }); alert('Added to your bag'); } catch (e) { alert(e.response?.data?.message || 'Could not add item'); } };
  return <><section className="hero-section"><div className="container hero-inner"><div className="hero-copy"><span className="eyebrow">THE NEXT GENERATION IS HERE</span><h1> Goodtech.<br/><span>Better living.</span></h1><p>Discover devices designed to make your everyday extraordinary.</p><a href="#products" className="btn btn-dark btn-lg px-4">Explore collection <i className="bi bi-arrow-right ms-2"/></a></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000" onError={e => e.currentTarget.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000'} alt="Featured smartphone"/></div></div></section>
    <section className="container py-5" id="products"><div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4"><div><span className="eyebrow">CURATED FOR YOU</span><h2 className="section-title mb-0">Find your next upgrade</h2></div><div className="search-box"><i className="bi bi-search"/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..."/></div></div>
    <div className="category-row mb-4">{categories.map(c => <button key={c} className={`category-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {error && <div className="alert alert-warning">{error}</div>}<div className="row g-4">{products.map(p => <div className="col-6 col-md-4 col-lg-3" key={p.id}><ProductCard product={p} onAdd={add}/></div>)}</div>{!products.length && !error && <p className="text-secondary py-5 text-center">No products found. Try another search.</p>}</section>
    <section className="container pb-5"><div className="promo-strip"><div><span className="eyebrow text-white-50">MADE FOR YOUR EVERYDAY</span><h2>Small details.<br/>Big difference.</h2><p>Explore accessories that complete your setup.</p><Link to="/#products" className="btn btn-light">Shop accessories</Link></div><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900" alt="Electronics setup"/></div></section>
    <footer className="site-footer"><div className="container d-flex flex-wrap justify-content-between gap-3"><strong className="fs-4">electro<span className="brand-dot">.</span></strong><span>Thoughtfully chosen technology. © 2026 ElectroMart.</span></div></footer></>;
}
