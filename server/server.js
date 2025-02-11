const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
const port = 3000;
const uploadDir = path.join(__dirname, "uploads");

// เปิด CORS เพื่อให้ React frontend เรียก API ได้
app.use(cors());

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Folder 'uploads' created!");
}

// ตั้งค่า multer สำหรับจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const id = nanoid();
    cb(null, id + ext);
  },
});

const upload = multer({ storage });

// อัปโหลดไฟล์
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "⚠ No file uploaded." });
  }

  res.json({
    message: "✅ File uploaded successfully!",
    originalName: req.file.originalname,
    savedName: req.file.filename,
  });
});

// ดึงรายการไฟล์ทั้งหมด
app.get("/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "❌ Error reading files." });
    }
    res.json(files);
  });
});

// ให้ React frontend เข้าถึงไฟล์ที่อัปโหลดได้
app.use("/uploads", express.static(uploadDir));

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
