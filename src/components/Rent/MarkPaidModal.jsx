import { useState } from "react";
import { markRentPaid } from "../../api/rent.api";
import styles from "./MarkPaidModal.module.css";

const MarkPaidModal = ({ rentId, onClose, onSuccess }) => {
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await markRentPaid({
        rentId,
        paymentDate,
        paymentMode
      });

      onSuccess();
      onClose();
    } catch (err) {
        console.log(err)
      setError("Failed to mark rent as paid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Mark Rent as Paid</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            required
          >
            <option value="">Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Confirm"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkPaidModal;
