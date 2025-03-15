import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();
// ✅ Get all coupons (both available & claimed)
router.get("/coupons", async (req, res) => {
    try {
      const coupons = await prisma.coupon.findMany();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error fetching coupons", error });
    }
  });
  
  // ✅ Add new coupons (Bulk Upload)
  router.post("/add-coupon", async (req, res) => {
    try {
      const { code } = req.body;
  
      if (!code) {
        return res.status(400).json({ message: "Coupon code is required" });
      }
  
      const newCoupon = await prisma.coupon.create({
        data: { code, status: "AVAILABLE" },
      });
  
      res.json({ message: "Coupon added successfully!", coupon: newCoupon });
    } catch (error) {
      res.status(500).json({ message: "Error adding coupon", error });
    }
  });
  
  // ✅ Bulk Insert Option
  router.post("/add-coupons", async (req, res) => {
    try {
      const { codes } = req.body;
  
      if (!codes || !Array.isArray(codes)) {
        return res.status(400).json({ message: "Invalid coupon codes format" });
      }
  
      await prisma.coupon.createMany({
        data: codes.map(code => ({ code, status: "AVAILABLE" })),
      });
  
      res.json({ message: "Coupons added successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error adding coupons", error });
    }
  });
  
  
  // ✅ View Claim History (User Claims)
  router.get("/claims", async (req, res) => {
    try {
      const claims = await prisma.claim.findMany({
        include: { coupon: true },
      });
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Error fetching claim history", error });
    }
  });
  
  

export default router;