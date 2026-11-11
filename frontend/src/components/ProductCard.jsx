import { Link } from 'react-router-dom';
export const money = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
export default function ProductCard({ product, onAdd }) {
  return <div className="product-card h-100">
    <Link to={`/products/${product.id}`} className="product-image-wrap"><img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy"/></Link>
    <div className="pt-3"><div className="text-secondary small mb-1">{product.category}</div><Link to={`/products/${product.id}`} className="product-title">{product.name}</Link>
      <div className="d-flex align-items-center justify-content-between mt-2"><strong>{money(product.price)}</strong><button className="btn btn-sm btn-light rounded-circle" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}><i className="bi bi-plus-lg"/></button></div>
    </div>
  </div>;
}
