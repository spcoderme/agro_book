"use client";
import { useEffect, useState } from "react";

export default function ProductForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  const [category_id, setCategory] = useState("");
  const [unit_id, setUnit] = useState("");
  const [unit_value, setUnitValue] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(setCategories);
    fetch("/api/units").then(res => res.json()).then(setUnits);
  }, []);

  const submit = async () => {
    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        category_id,
        unit_id,
        unit_value,
        stock,
      }),
    });

    alert("Product Added");
    onSuccess();
  };

  return (
    <div className="form-container">
  <h3 className="form-title">Add Product</h3>

  <div className="form-grid">
    
    <div className="form-group full-width">
      <input type="text" value={name} onChange={e => setName(e.target.value)} required />
      <label>Product Name</label>
    </div>

    <div className="form-group">
      <select value={category_id} onChange={e => setCategory(e.target.value)} required>
        <option value="" disabled hidden></option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.name_marathi})
          </option>
        ))}
      </select>
      <label>Category</label>
    </div>

    <div className="form-group">
      <select value={unit_id} onChange={e => setUnit(e.target.value)} required>
        <option value="" disabled hidden></option>
        {units.map(u => (
          <option key={u.id} value={u.id}>{u.name}({u.short_name})</option>
        ))}
      </select>
      <label>Unit</label>
    </div>

    <div className="form-group">
      <input type="number" value={unit_value} onChange={e => setUnitValue(e.target.value)} required />
      <label>Pack Size</label>
    </div>

    <div className="form-group">
      <input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
      <label>Stock Qty</label>
    </div>

    <div className="full-width">
      <button className="submit-btn" onClick={submit}>Add Product</button>
    </div>

  </div>
</div>
  );
}
