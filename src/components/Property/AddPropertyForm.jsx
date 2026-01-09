import { useState } from "react";
import { createProperty } from "../../api/property.api";

const AddPropertyForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProperty({ name, address });

    setName("");
    setAddress("");
    onSuccess(); // refresh list
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Property</h3>

      <input
        placeholder="Property Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <button type="submit">Add</button>
    </form>
  );
};

export default AddPropertyForm;
