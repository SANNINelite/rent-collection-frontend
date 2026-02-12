import { useState } from "react";
import { generateBills } from "../../api/rent.api";
import styles from "./GenerateRentControls.module.css";

const GenerateRentControls = ({ properties = [] }) => {
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const generateForAll = async () => {
    if (!month) {
      setMsg("Please select a month");
      return;
    }

    if (!properties.length) {
      setMsg("No properties available");
      return;
    }

    setLoading(true);
    setMsg("");

    let success = 0;
    let skipped = 0;

    for (const property of properties) {
      try {
        await generateBills({
          propertyId: property._id,
          month,
        });
        success++;
      } catch {
        skipped++;
      }
    }

    setLoading(false);

    if (success === 0) setMsg("Rent already generated for all properties");
    else if (skipped === 0) setMsg(`Generated for ${success} properties`);
    else setMsg(`Generated for ${success}, skipped ${skipped}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <button onClick={generateForAll} disabled={loading}>
          {loading ? "Generating..." : "Generate Rent For All"}
        </button>
      </div>

      {msg && <p className={styles.msg}>{msg}</p>}
    </div>
  );
};

export default GenerateRentControls;
