import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);

  // Claim a coupon
  const API_BASE_URL = "https://coupon-m3hj.onrender.com"; // Deployed backend URL

const claimCoupon = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/coupon/claim-coupon`);
    setMessage(res.data.message);
    fetchAvailableCoupons();
  } catch (error) {
    setMessage(error.response?.data?.message || "Error claiming coupon");
  }
};

const fetchAvailableCoupons = async () => {
  const res = await axios.get(`${API_BASE_URL}/coupon/available-coupons`);
  setAvailableCoupons(res.data);
};

const fetchAllCoupons = async () => {
  const res = await axios.get(`${API_BASE_URL}/admin/coupons`);
  setAllCoupons(res.data);
};

  useEffect(() => {
    fetchAvailableCoupons();
    fetchAllCoupons();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Coupon Distribution System</h1>
      <button
        onClick={claimCoupon}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Claim Coupon
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold">Available Coupons</h2>
        <ul className="bg-white shadow-md rounded-lg p-4">
          {availableCoupons.length === 0 ? (
            <p className="text-gray-500">No available coupons</p>
          ) : (
            availableCoupons.map((coupon) => (
              <li key={coupon.id} className="border-b p-2">{coupon.code}</li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold">Admin Panel - All Coupons</h2>
        <ul className="bg-white shadow-md rounded-lg p-4">
          {allCoupons.length === 0 ? (
            <p className="text-gray-500">No coupons found</p>
          ) : (
            allCoupons.map((coupon) => (
              <li key={coupon.id} className="border-b p-2">
                {coupon.code} - {coupon.status}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
