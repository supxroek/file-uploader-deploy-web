import path from "path";
import fs from "fs";
import multiparty from "multiparty";

// กำหนดที่เก็บไฟล์ uploads
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, "/server/uploads");

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Folder 'uploads' created!");
}

// Netlify Function handler
export const handler = async (event) => {
  // ตรวจสอบว่าเป็นการ GET หรือ POST
  if (event.httpMethod === "POST") {
    // การอัปโหลดไฟล์
    return new Promise((resolve, reject) => {
      const form = new multiparty.Form(); // ใช้ multiparty แทน form-data แบบ multer

      form.parse(event.body, (err, fields, files) => {
        if (err) {
          return reject({
            statusCode: 400,
            body: JSON.stringify({ error: "⚠ Error parsing the file." }),
          });
        }

        const file = files.file[0]; // เข้าถึงไฟล์ที่ส่งมา
        const filePath = path.join(uploadDir, file.originalFilename);
        const fileStream = fs.createWriteStream(filePath);

        fs.createReadStream(file.path).pipe(fileStream); // คัดลอกไฟล์จาก path มาเก็บที่ uploadDir

        fileStream.on("close", () => {
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              message: "✅ File uploaded successfully!",
              originalName: file.originalFilename,
              savedName: file.originalFilename,
            }),
          });
        });
      });
    });
  } else if (event.httpMethod === "GET") {
    // การดึงรายการไฟล์
    try {
      const files = fs.readdirSync(uploadDir);
      return {
        statusCode: 200,
        body: JSON.stringify(files),
      };
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "❌ Error reading files." }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
