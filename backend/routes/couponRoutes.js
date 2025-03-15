import express from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

const router = express.Router();
const prisma = new PrismaClient();
router.use(cookieParser());

// ✅ Claim a Coupon (Round-Robin Distribution)
router.post("/claim-coupon", async (req, res) => {
  try {
    const ipAddress = req.ip;
    const sessionId = req.cookies.sessionId || Math.random().toString(36).substring(2);

    // ❌ Check if the user has already claimed a coupon
    const existingClaim = await prisma.claim.findFirst({
      where: { OR: [{ ipAddress }, { sessionId }] },
    });

    if (existingClaim) {
      return res.status(403).json({ message: "You have already claimed a coupon!" });
    }

    // ✅ Get the next available coupon in a round-robin manner
    const coupon = await prisma.coupon.findFirst({ where: { status: "AVAILABLE" }, orderBy: { id: "asc" } });

    if (!coupon) {
      return res.status(404).json({ message: "No coupons available" });
    }

    // ✅ Mark the coupon as claimed & store claim details
    await prisma.coupon.update({ where: { id: coupon.id }, data: { status: "CLAIMED" } });
    await prisma.claim.create({ data: { couponId: coupon.id, ipAddress, sessionId } });

    res.cookie("sessionId", sessionId, { httpOnly: true });
    res.json({ message: `You have received Coupon: ${coupon.code}` });
  } catch (error) {
    res.status(500).json({ message: "Error claiming coupon", error });
  }
});

// ✅ Get Available Coupons
router.get("/available-coupons", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ where: { status: "AVAILABLE" } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
});

export default router;
