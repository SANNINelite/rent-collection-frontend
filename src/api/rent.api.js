import api from "./axios";

/* =======================
   MARK RENT AS PAID
======================= */
export const markRentPaid = async (data) => {
  const response = await api.post("/rent/mark-paid", data);
  return response.data;
};

/* =======================
   OWNER: PENDING RENT
======================= */
export const getPendingRent = async () => {
  const response = await api.get("/rent/pending");
  return response.data;
};

/* =======================
   OWNER: GENERATE BILLS
======================= */
export const generateBills = async (data) => {
  const res = await api.post("/rent/generate", data);
  return res.data;
};

/* =======================
   TENANT: RENT HISTORY
======================= */
export const getTenantRentHistory = async () => {
  const res = await api.get("/rent/history");
  return res.data;
};

/* =======================
   OWNER: PROPERTY RENT HISTORY
======================= */
export const getPropertyRentHistory = async (propertyId) => {
  const res = await api.get(
    `/rent/property-history?propertyId=${propertyId}`
  );
  return res.data;
};
