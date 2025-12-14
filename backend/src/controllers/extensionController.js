const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

// Download extension as ZIP
exports.downloadExtension = async (req, res) => {
  try {
    // Path from backend/src/controllers to SafeNet/extension
    const extensionPath = path.join(__dirname, "../../../extension");

    // Check if extension directory exists
    if (!fs.existsSync(extensionPath)) {
      return res.status(404).json({
        success: false,
        message: "Extension directory not found",
      });
    }

    res.header("Content-Type", "application/zip");
    res.attachment("safenet-shield-extension.zip");

    const zip = archiver("zip", { zlib: { level: 9 } });
    zip.pipe(res);

    // Add all files from extension directory
    zip.directory(extensionPath, false);

    zip.on("error", (err) => {
      console.error("Error creating extension zip:", err);
      res
        .status(500)
        .json({ success: false, message: "Error creating zip file" });
    });

    await zip.finalize();
  } catch (err) {
    console.error("Error downloading extension:", err);
    res
      .status(500)
      .json({ success: false, message: "Error generating extension download" });
  }
};
