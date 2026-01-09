import { useEffect, useState } from "react";
import { getRole } from "../../utils/auth";
import api from "../../api/axios";
import { getProperties } from "../../api/property.api";
import { getPropertyRentHistory } from "../../api/rent.api";
import styles from "./RentHistory.module.css";

const RentHistory = () => {
  const role = getRole();

  const [history, setHistory] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     TENANT FLOW
  ========================= */
  useEffect(() => {
    if (role !== "tenant") return;

    const fetchTenantHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get("/rent/history");
        setHistory(res.data);
      } catch (err) {
        console.log(err)
        console.error("Failed to load tenant rent history");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantHistory();
  }, [role]);

  /* =========================
     OWNER: FETCH PROPERTIES
  ========================= */
  useEffect(() => {
    if (role !== "owner") return;

    const init = async () => {
      try {
        const props = await getProperties();
        setProperties(props);

        if (props.length > 0) {
          setSelectedProperty(props[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log(err)
        console.error("Failed to load properties");
        setLoading(false);
      }
    };

    init();
  }, [role]);

  /* =========================
     OWNER: FETCH RENT HISTORY
  ========================= */
  useEffect(() => {
    if (role !== "owner" || !selectedProperty) return;

    const fetchPropertyHistory = async () => {
      setLoading(true);
      try {
        const data = await getPropertyRentHistory(selectedProperty);
        setHistory(data);
      } catch (err) {
        console.log(err)
        console.error("Failed to load property rent history");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyHistory();
  }, [role, selectedProperty]);

  if (loading) {
    return <p>Loading rent history...</p>;
  }

  return (
    <div>
      <h1>Rent History</h1>

      {/* OWNER: PROPERTY SELECT */}
      {role === "owner" && properties.length > 0 && (
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {history.length === 0 && <p>No records found</p>}

      {/* =========================
          TENANT VIEW
      ========================= */}
      {role === "tenant" &&
        history.map((r) => (
          <div key={r._id} className={styles.row}>
            <span>{r.month}</span>
            <span>₹{r.amount}</span>
            <span className={`${styles.status} ${styles[r.status]}`}>
              {r.status}
            </span>
          </div>
        ))}

      {/* =========================
          OWNER VIEW (WITH TENANT DETAILS)
      ========================= */}
      {role === "owner" &&
        history.map((r) => (
          <div key={r._id} className={styles.row}>
            <div className={styles.tenantInfo}>
              <p className={styles.tenantName}>
                {r.tenant?.name || "Unknown Tenant"}
              </p>
              {r.tenant?.phone && (
                <p className={styles.tenantPhone}>{r.tenant.phone}</p>
              )}
            </div>

            <div>
              <p>{r.month}</p>
              <p>₹{r.amount}</p>
            </div>

            <span className={`${styles.status} ${styles[r.status]}`}>
              {r.status}
            </span>
          </div>
        ))}
    </div>
  );
};

export default RentHistory;
