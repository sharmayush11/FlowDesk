import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import api from '../../api/axios';

const Navbar = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { user } = useSelector((s) => s.auth);

const handleLogout = async () => {
try {
await api.post('/auth/logout');
} catch (error) {
console.error('Logout request failed:', error.message);
} finally {
dispatch(logout());
navigate('/login');
}
};

return ( <nav className="navbar"> <Link to="/dashboard" className="navbar-logo">
FlowDesk </Link>


  <div className="navbar-right">
    <span className="navbar-user">👋 {user?.name}</span>
    <button className="btn-logout" onClick={handleLogout}>
      Logout
    </button>
  </div>
</nav>


);
};

export default Navbar;
