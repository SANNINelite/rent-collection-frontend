import { useState } from "react";
import { addTenant } from "../../api/tenant.api";
import styles from "./AddTenantForm.module.css";

const AddTenantForm = ({ propertyId, onTenantAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // ✅ NEW
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
        email, // ✅ REQUIRED
        phone,
        monthlyRent: Number(monthlyRent),
      });

      setName("");
      setEmail("");
      setPhone("");
      setMonthlyRent("");

      onTenantAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Add Tenant</h3>

      <input
        type="text"
        placeholder="Tenant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Tenant Login Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Monthly Rent"
        value={monthlyRent}
        onChange={(e) => setMonthlyRent(e.target.value)}
        required
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Tenant"}
      </button>
    </form>
  );
};

export default AddTenantForm;
