import api from "./axios";

export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

export const addProperty = async (data) => {
  const res = await api.post("/properties", data);
  return res.data;
};
export const deleteProperty=async (data)=>{
  return;
}