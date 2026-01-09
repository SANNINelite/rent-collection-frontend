import { useEffect, useState } from "react";
import { getProperties } from "../../api/property.api";
import { generateBills } from "../../api/rent.api";
import styles from "./GenerateBills.module.css";

const GenerateBills = () => {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [month, setMonth] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getProperties();
      setProperties(data);
      if (data.length) setPropertyId(data[0]._id);
    };
    fetchProperties();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await generateBills({ propertyId, month });
      setMessage(`Bills generated for ${res.count} tenants`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to generate bills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.box}>
      <h3>Generate Monthly Bills</h3>

      <form onSubmit={handleGenerate}>
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          required
        >
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Bills"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default GenerateBills;
