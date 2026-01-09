import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import styles from "./Landing.module.css";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h1>Manage Rent. Simplified.</h1>
      <p>
        RentFlow helps property owners manage tenants, generate rent bills,
        track payments, and maintain transparent rent history — all in one
        place.
      </p>

      <div className={styles.features}>
        <div>
          <h3>For Owners</h3>
          <p>Add properties, manage tenants, generate bills, track payments.</p>
        </div>

        <div>
          <h3>For Tenants</h3>
          <p>View rent history, payment status, and stay informed.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
