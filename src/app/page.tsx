'use client';

import { useState, useEffect } from "react";
import { CheckCircle, Download } from "lucide-react";

export default function Home() {
  const [downloaded, setDownloaded] = useState(false);

  // Function to handle download
  const handleDownload = () => {    
    const link = document.createElement("a");
    link.href = "/MyFile.pdf"; // place PDF in public folder
    link.download = "MyFile.pdf";
    link.click();
    setDownloaded(true);
  };

  useEffect(() => {
    handleDownload();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {downloaded && (
          <>
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium mb-6">
              <CheckCircle className="w-6 h-6" />
              <span>Thank you for downloading!</span>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 m-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
            >
              <Download className="w-5 h-5" />
              Download Again
            </button>
          </>
        )}
      </div>
    </main>
  );
}
