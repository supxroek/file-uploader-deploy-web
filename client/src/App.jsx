import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/files")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching files:", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setFiles((prevFiles) => [...prevFiles, data.savedName]); // อัปเดตรายการไฟล์
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during the upload. Please try again.");
      });
  };

  return (
    <div className="App">
      <header>
        <h1>File Uploader</h1>
      </header>
      <main>
        <form id="uploadForm" onSubmit={handleSubmit}>
          <input type="file" name="file" required />
          <input type="submit" value="Upload!" />
        </form>
        <section>
          <h3>Uploaded Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index} className="file-item">
                <a href={`http://localhost:3000/uploads/${file}`} download>
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 File Uploader. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
