import { useEffect, useState } from "react";
import { getProperties, addProperty, deleteProperty } from "../../api/property.api";
import styles from "./Properties.module.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  /* ================= FETCH PROPERTIES ================= */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        console.log(err)
        console.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  /* ================= ADD PROPERTY ================= */
  const handleAddProperty = async () => {
    if (!name || !address) return;

    try {
      const newProperty = await addProperty({ name, address });
      setProperties((prev) => [...prev, newProperty]);

      // reset form + close modal
      setName("");
      setAddress("");
      setShowModal(false);
    } catch (err) {
      console.log(err)
      alert("Failed to add property");
    }
  };

  /* ================= DELETE PROPERTY ================= */
  const handleDeleteProperty = async (id) => {
    const confirm = window.confirm("Delete this property?");
    if (!confirm) return;

    try {
      await deleteProperty(id);
      setProperties((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (err) {
      console.log(err)
      alert("Failed to delete property");
    }
  };

  if (loading) {
    return <p>Loading properties...</p>;
  }

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Properties</h1>
          <p className={styles.subtitle}>
            Manage your rental properties
          </p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={() => setShowModal(true)}
        >
          + Add Property
        </button>
      </div>

      {/* ================= PROPERTIES GRID ================= */}
      <div className={styles.grid}>
        {properties.map((p) => (
          <div key={p._id} className={styles.card}>
            <button
              className={styles.deleteIcon}
              onClick={() => handleDeleteProperty(p._id)}
            >
              🗑
            </button>

            <div className={styles.iconWrapper}>🏢</div>

            <h3 className={styles.propertyName}>{p.name}</h3>
            <p className={styles.address}>{p.address}</p>

            <div className={styles.meta}>
              <span>🏠 {p.units || 0} units</span>
              <span>👤 {p.tenants || 0} tenants</span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD PROPERTY MODAL ================= */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add New Property</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.form}>
              <label>Property Name</label>
              <input placeholder="e.g., Sunset Apartments" />

              <label>Address</label>
              <input placeholder="e.g., 123 Main Street, City" />

              <label>Number of Units</label>
              <input placeholder="e.g., 10" />

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className={styles.primaryButton}
                  onClick={handleAddProperty}
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
