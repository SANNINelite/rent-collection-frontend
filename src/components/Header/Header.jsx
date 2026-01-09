import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Rent Manager</h2>

      <nav className={styles.nav}>
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/properties">
          Properties
        </NavLink>
        <NavLink to="/tenants">
          Tenants
        </NavLink>
        <NavLink to="/rent-history">
          Rent History
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
