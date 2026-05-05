"use client";
import PurchaseForm from "../../components/PurchaseForm";

export default function PurchasePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Purchase Entry</h1>

      <div className="bg-white shadow rounded-xl p-5">
        <PurchaseForm />
      </div>
    </div>
  );
}