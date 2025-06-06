import React, { useState, useRef } from "react";
import { Upload, File, X, Check, AlertCircle, Download } from "lucide-react";
import { supabaseHelpers } from "../../lib/supabase";

const FileUpload = ({
  chapterId,
  chapterTitle,
  materialType,
  currentFile,
  onFileUploaded,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const materialTypes = {
    notes: { label: "Study Notes", color: "blue", accept: ".pdf,.doc,.docx" },
    solutions: {
      label: "Solutions",
      color: "green",
      accept: ".pdf,.doc,.docx",
    },
    formulas: { label: "Formulas", color: "purple", accept: ".pdf,.doc,.docx" },
  };

  const config = materialTypes[materialType];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.includes("pdf") && !file.type.includes("document")) {
      setError("Please upload PDF or Word documents only");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    setUploadProgress(0);

    try {
      // Create file path: chapter-{id}/{materialType}/{filename}
      const fileExtension = file.name.split(".").pop();
      const fileName = `${materialType}-${Date.now()}.${fileExtension}`;
      const filePath = `chapter-${chapterId}/${materialType}/${fileName}`;

      console.log(`📤 Uploading ${materialType} file:`, fileName);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabaseHelpers.uploadFile(
        "chapter-materials",
        filePath,
        file
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      console.log("✅ File uploaded successfully:", data);

      // Update chapter record with new file path
      const filePaths = { [materialType]: filePath };
      const { error: updateError } = await supabaseHelpers.updateChapterFiles(
        chapterId,
        filePaths
      );

      if (updateError) {
        throw updateError;
      }

      setSuccess(`${config.label} uploaded successfully!`);

      // Call parent callback
      if (onFileUploaded) {
        onFileUploaded(materialType, filePath);
      }

      // Clear form
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!currentFile) return;

    try {
      const url = supabaseHelpers.getFileUrl("chapter-materials", currentFile);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  const handleDelete = async () => {
    if (
      !currentFile ||
      !window.confirm(
        `Are you sure you want to delete this ${config.label.toLowerCase()} file?`
      )
    ) {
      return;
    }

    try {
      setUploading(true);

      // Delete from storage
      const { error: deleteError } = await supabaseHelpers.deleteFile(
        "chapter-materials",
        currentFile
      );
      if (deleteError) throw deleteError;

      // Update chapter record
      const filePaths = { [materialType]: null };
      const { error: updateError } = await supabaseHelpers.updateChapterFiles(
        chapterId,
        filePaths
      );
      if (updateError) throw updateError;

      setSuccess(`${config.label} deleted successfully!`);

      if (onFileUploaded) {
        onFileUploaded(materialType, null);
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 transition-colors duration-300 ${
        uploading
          ? "border-gray-400 bg-gray-50"
          : currentFile
          ? `border-${config.color}-300 bg-${config.color}-50`
          : `border-gray-300 hover:border-${config.color}-400`
      }`}
    >
      <div className="text-center">
        {/* File Icon */}
        <div
          className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
            currentFile ? `bg-${config.color}-100` : "bg-gray-100"
          }`}
        >
          {currentFile ? (
            <File className={`h-6 w-6 text-${config.color}-600`} />
          ) : (
            <Upload className="h-6 w-6 text-gray-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2">{config.label}</h3>

        {/* Current File or Upload Area */}
        {currentFile ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              File uploaded successfully
            </p>

            <div className="flex justify-center space-x-2">
              <button
                onClick={handleDownload}
                className={`flex items-center space-x-1 px-3 py-2 bg-${config.color}-100 text-${config.color}-700 rounded-lg hover:bg-${config.color}-200 transition-colors duration-300 text-sm`}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={uploading}
                className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300 text-sm disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Click to replace with new file:
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-3">
            Upload {config.label.toLowerCase()}
          </p>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`bg-${config.color}-500 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={config.accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`w-full bg-${config.color}-50 text-${config.color}-700 px-4 py-2 rounded-lg hover:bg-${config.color}-100 transition-colors duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {uploading
            ? "Uploading..."
            : currentFile
            ? "Replace File"
            : "Choose File"}
        </button>

        {/* File Type Info */}
        <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX • Max 10MB</p>

        {/* Success Message */}
        {success && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
