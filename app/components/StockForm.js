"use client";
import { useState, useEffect } from "react";

export default function StockForm({ refresh }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    type: "IN",
    quantity: "",
    note: ""
  });

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/stock", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({ product_id: "", type: "IN", quantity: "", note: "" });
    refresh();
  };

  return (
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-lg rounded-2xl p-5 mb-6"
  >
    <h2 className="text-lg font-semibold text-gray-700 mb-4">
      ➕ Add Stock
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

      {/* Product */}
      <select
        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
        required
      >
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} (Stock: {p.stock})
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        className="border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="IN">Stock IN</option>
        <option value="OUT">Stock OUT</option>
      </select>

      {/* Quantity */}
      <input
        type="number"
        placeholder="Quantity"
        className="border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        required
      />

      {/* Note */}
      <input
        type="text"
        placeholder="Note"
        className="border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />

      {/* Button */}
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition"
      >
        Save
      </button>

    </div>
  </form>
);
}