import { useState } from "react";
import { addTenant } from "../../api/tenant.api";
import styles from "./AddTenantForm.module.css";

const AddTenantForm = ({ propertyId, onTenantAdded }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addTenant({
        propertyId,
        name,
        phone,
        monthlyRent,
      });

      setName("");
      setPhone("");
      setMonthlyRent("");

      onTenantAdded(); // refresh tenant list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Add Tenant</h3>
      <div className={styles.formInputGrid}>
        <input
          type="text"
          placeholder="Tenant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Monthly rent"
          value={monthlyRent}
          onChange={(e) => setMonthlyRent(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Tenant"}
        </button>
      </div>
    </form>
  );
};

export default AddTenantForm;
