import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  return <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
    <div className="container"><Link className="navbar-brand fw-bold fs-4" to="/">electro<span className="brand-dot">.</span></Link>
      <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav"><span className="navbar-toggler-icon"/></button>
      <div className="collapse navbar-collapse" id="mainNav">
        <div className="navbar-nav mx-auto gap-lg-3"><NavLink className="nav-link" to="/">Home</NavLink><a className="nav-link" href="/#products">Products</a><NavLink className="nav-link" to="/orders">My orders</NavLink></div>
        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          {user ? <><span className="small text-secondary">Hi, {user.name.split(' ')[0]}</span><button className="btn btn-outline-dark btn-sm" onClick={() => { logout(); navigate('/'); }}>Sign out</button></> : <Link className="btn btn-dark btn-sm px-3" to="/login">Sign in</Link>}
          <Link to="/cart" className="icon-link" aria-label="Shopping cart"><i className="bi bi-bag fs-5"/></Link>
        </div>
      </div>
    </div>
  </nav>;
}
