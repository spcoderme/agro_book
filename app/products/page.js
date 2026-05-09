"use client";
import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        📦 Product Management
      </h1>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl p-5 mb-6">
        <ProductForm onSuccess={load} />
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

        <table className="w-full text-sm text-left">

          {/* Table Head */}
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              
              <th className="p-3">Pack Size</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium text-gray-800">
                  {p.name}
                </td>

                <td className="p-3 text-gray-600">
                  {p.category}
                </td>

                

                <td className="p-3">
                  
                  <span>{parseFloat(p.unit_value)}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                    {p.unit_name}
                  </span>
                </td>

                <td className="p-3 font-semibold text-green-600">
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}