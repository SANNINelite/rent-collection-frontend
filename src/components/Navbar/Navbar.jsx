import { NavLink, useNavigate } from "react-router-dom";
import { getToken, logout } from "../../utils/auth";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.nav}>
      <h2 className={styles.logo}>RentFlow</h2>

      <div className={styles.links}>
        {!isLoggedIn ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup" className={styles.primary}>
              Sign Up
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/properties">Properties</NavLink>
            <NavLink to="/tenants">Tenants</NavLink>
            <NavLink to="/rent-history">Rent</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
