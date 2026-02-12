import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../../api/property.api";
import { getTenants } from "../../api/tenant.api";
import AddTenantForm from "../../components/Tenant/AddTenantForm";
import styles from "./Tenants.module.css";

const Tenants = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // ✅ FIX 1

  // INITIAL LOAD
  useEffect(() => {
    const init = async () => {
      try {
        const props = await getProperties();
        setProperties(props);

        if (props.length > 0) {
          setSelectedProperty(props[0]._id);
        }
      } catch (err) {
        console.log(err)
        console.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // LOAD TENANTS WHEN PROPERTY CHANGES
  useEffect(() => {
    if (!selectedProperty) return;

    const fetchTenants = async () => {
      const tenantsData = await getTenants(selectedProperty);
      setTenants(tenantsData);
    };

    fetchTenants();
  }, [selectedProperty]); // ✅ FIX 2

  // REFRESH AFTER ADD
  const refreshTenants = async () => {
    const tenantsData = await getTenants(selectedProperty);
    setTenants(tenantsData);
    setShowModal(false); // ✅ FIX 3 close modal after add
  };

  if (loading) return <p>Loading...</p>;

  // 🔒 GUARD: no property → no tenants
  if (properties.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No properties found</h2>
        <p>Add a property first to start adding tenants.</p>
        <button onClick={() => navigate("/properties")}>Add Property</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tenants</h1>
          <p className={styles.subtitle}>Manage tenants for your properties</p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={() => setShowModal(true)}
        >
          + Add Tenant
        </button>
      </div>

      {/* PROPERTY SELECT */}
      <div className={styles.filterBar}>
        <label>Select Property</label>
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)} // ✅ FIX 4
        >
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* EMPTY */}
      {tenants.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No tenants found</h3>
          <p>Add tenants to start tracking rent.</p>
        </div>
      )}

      {/* GRID */}
      {tenants.length > 0 && (
        <div className={styles.grid}>
          {tenants.map((t) => (
            <div key={t._id} className={styles.card}>
              <div className={styles.avatar}>👤</div>

              <h3 className={styles.tenantName}>{t.name}</h3>
              <p className={styles.phone}>{t.phone}</p>

              <div className={styles.meta}>
                <span>₹{t.monthlyRent}</span>
                <span>Monthly Rent</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add New Tenant</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <AddTenantForm
                propertyId={selectedProperty}
                onTenantAdded={refreshTenants}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;
