import api from "./axios";

export const getTenants = async (propertyId) => {
  const res = await api.get(
    `/tenants?propertyId=${propertyId}`
  );
  return res.data;
};

export const addTenant = async (data) => {
  const res = await api.post("/tenants", data);
  return res.data;
};
