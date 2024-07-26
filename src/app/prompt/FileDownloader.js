import React, { useState } from "react";
import { saveAs } from "file-saver";

const FileDownloader = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadFile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.imc-mix.inter.ikea.com/prod-approved-rt3d/v1/real-time-3d-assets?filter[articleId]=60501259",
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      saveAs(blob, "downloaded_file");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={downloadFile} disabled={loading}>
        {loading ? "Downloading..." : "Download File"}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FileDownloader;
