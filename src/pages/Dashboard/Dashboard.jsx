import { useEffect, useState } from "react";
import { getRole } from "../../utils/auth";
import { getProperties } from "../../api/property.api";
import { getTenants } from "../../api/tenant.api";
import { getPendingRent, markRentPaid } from "../../api/rent.api";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const role = getRole();

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [tenants, setTenants] = useState([]);
  const [pendingRent, setPendingRent] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     OWNER DASHBOARD
  ========================= */
  useEffect(() => {
    if (role !== "owner") return;

    const init = async () => {
      try {
        const props = await getProperties();
        setProperties(props);

        if (props.length > 0) {
          setSelectedProperty(props[0]._id);
        }
      } catch (err) {
        console.log(err)
        console.error("Failed to load dashboard data");
      }
    };

    init();
  }, [role]);

  useEffect(() => {
    if (role !== "owner" || !selectedProperty) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [tenantData, pendingData] = await Promise.all([
          getTenants(selectedProperty),
          getPendingRent()
        ]);

        setTenants(tenantData);

        // Filter pending rent only for this property
        const tenantIds = tenantData.map(t => t._id);
        const filteredPending = pendingData.filter(r =>
          tenantIds.includes(r.tenantId)
        );

        setPendingRent(filteredPending);
      } catch (err) {
        console.log(err)
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, selectedProperty]);

  const handleMarkPaid = async (rent) => {
  try {
    console.log("MARKING PAID:", rent);

    await markRentPaid({
      rentId: rent._id,
      paymentMode: "cash",
    });

    setPendingRent(prev =>
      prev.filter(r => r._id !== rent._id)
    );

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Failed to mark rent as paid");
  }
};
  if (role !== "owner") {
    return <p>Welcome to your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  const totalExpected = tenants.reduce(
    (sum, t) => sum + t.monthlyRent,
    0
  );

  const totalPending = pendingRent.reduce(
    (sum, r) => sum + r.amount,
    0
  );

  const totalCollected = totalExpected - totalPending;

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Overview of rent and payments
          </p>
        </div>

        {/* Property Selector */}
        <select
          className={styles.propertySelect}
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Tenants</p>
          <h2 className={styles.statValue}>{tenants.length}</h2>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Expected Rent</p>
          <h2 className={styles.statValue}>₹{totalExpected}</h2>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Collected</p>
          <h2 className={styles.statValue}>₹{totalCollected}</h2>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending</p>
          <h2 className={styles.statValue}>₹{totalPending}</h2>
        </div>
      </div>

      {/* ================= PENDING PAYMENTS ================= */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Pending Payments</h2>

        {pendingRent.length === 0 && (
          <div className={styles.emptyState}>
            <p>No pending rent 🎉</p>
          </div>
        )}

        {pendingRent.length > 0 && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Tenant</span>
              <span>Month</span>
              <span>Amount</span>
              <span>Action</span>
            </div>

            {pendingRent.map((r) => (
              <div key={r._id} className={styles.tableRow}>
                <span>{r.tenantName || "Tenant"}</span>
                <span>{r.month}</span>
                <span>₹{r.amount}</span>

                <button
                  className={styles.payButton}
                  onClick={() =>
                    handleMarkPaid(r)
                  }
                >
                  Mark Paid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
