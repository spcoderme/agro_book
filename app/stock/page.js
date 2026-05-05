"use client";
import { useEffect, useState } from "react";
import StockForm from "../components/StockForm";

export default function StockPage() {
  const [history, setHistory] = useState([]);

  const loadData = () => {
    fetch("/api/stock/history")
      .then(res => res.json())
      .then(data => setHistory(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        📦 Stock Management
      </h1>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl p-5 mb-6">
        <StockForm refresh={loadData} />
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

        <table className="w-full text-sm text-left">

          {/* Table Head */}
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Type</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Note</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">
                  {item.product_name}
                </td>

                <td
                  className={`p-3 font-semibold ${
                    item.type === "IN"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.type}
                </td>

                <td className="p-3">
                  {item.quantity}
                </td>

                <td className="p-3 text-gray-600">
                  {item.note}
                </td>

                <td className="p-3 text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}   