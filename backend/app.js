import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

const app = express();
const __dirname = path.resolve(); // Get the root directory

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ✅ Serve React frontend from `frontend/build`
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.use("/admin", adminRoutes);
app.use("/coupon", couponRoutes);

// ✅ Catch-all route to serve React index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
