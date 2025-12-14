const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const imageRoutes = require("./routes/imageRoutes");
const screenshotRoutes = require("./routes/screenshotRoutes");
const fakeProfileRoutes = require("./routes/fakeProfileRoutes");
const alertRoutes = require("./routes/alertRoutes");
const extensionRoutes = require("./routes/extensionRoutes");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SafeNet Guardian API" });
});
app.use(express.static(path.join(__dirname, "dist")));

app.use("/api/auth", authRoutes);
app.use("/api/text", analysisRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/screenshot", screenshotRoutes);
app.use("/api/fake-profiles", fakeProfileRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/extension", extensionRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(errorHandler);

module.exports = app;
