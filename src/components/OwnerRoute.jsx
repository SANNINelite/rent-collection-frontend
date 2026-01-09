import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

const OwnerRoute = ({ children }) => {
  if (getRole() !== "owner") {
    return <Navigate to="/" />;
  }
  return children;
};

export default OwnerRoute;
