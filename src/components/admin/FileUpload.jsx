import React, { useState, useRef } from "react";
import {
  Upload,
  File,
  X,
  Check,
  AlertCircle,
  Download,
  Loader,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

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
    notes: {
      label: "Study Notes",
      color: "blue",
      accept: ".pdf",
      icon: "📝",
    },
    solutions: {
      label: "Solutions",
      color: "green",
      accept: ".pdf",
      icon: "✅",
    },
    formulas: {
      label: "Formulas",
      color: "purple",
      accept: ".pdf",
      icon: "🔢",
    },
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
    if (!file.type.includes("pdf")) {
      setError("Please upload PDF files only");
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
      // Create a unique file name to avoid conflicts
      const fileExtension = file.name.split(".").pop();
      const timestamp = Date.now();
      const safeName = chapterTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const fileName = `${safeName}-${materialType}-${timestamp}.${fileExtension}`;
      const filePath = `chapters/${chapterId}/${materialType}/${fileName}`;

      console.log(`📤 Uploading ${materialType} file:`, fileName);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("chapter-materials")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      console.log("✅ File uploaded successfully:", data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("chapter-materials")
        .getPublicUrl(filePath);

      // Update chapter record with new file path
      const updateField = `${materialType}_file_path`;
      const { error: updateError } = await supabase
        .from("chapters")
        .update({
          [updateField]: filePath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chapterId);

      if (updateError) {
        throw updateError;
      }

      setUploadProgress(100);
      setSuccess(`${config.label} uploaded successfully!`);

      // Call parent callback with both path and URL
      if (onFileUploaded) {
        onFileUploaded(materialType, filePath, urlData.publicUrl);
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
      // Get the public URL
      const { data } = supabase.storage
        .from("chapter-materials")
        .getPublicUrl(currentFile);

      // Open in new tab
      window.open(data.publicUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download file");
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
      const { error: deleteError } = await supabase.storage
        .from("chapter-materials")
        .remove([currentFile]);

      if (deleteError) throw deleteError;

      // Update chapter record
      const updateField = `${materialType}_file_path`;
      const { error: updateError } = await supabase
        .from("chapters")
        .update({
          [updateField]: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chapterId);

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

  const getFileName = (path) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
        uploading
          ? "border-gray-400 bg-gray-50"
          : currentFile
          ? `border-${config.color}-300 bg-${config.color}-50`
          : `border-gray-300 hover:border-${config.color}-400`
      }`}
    >
      <div className="text-center">
        {/* Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
            currentFile ? `bg-${config.color}-100 scale-110` : "bg-gray-100"
          }`}
        >
          {uploading ? (
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          ) : currentFile ? (
            <span className="text-2xl">{config.icon}</span>
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2">{config.label}</h3>

        {/* Status */}
        {currentFile ? (
          <div className="space-y-3">
            <div className="bg-white rounded-lg px-3 py-2 text-sm text-gray-700">
              {getFileName(currentFile)}
            </div>

            <div className="flex justify-center space-x-2">
              <button
                onClick={handleDownload}
                className={`flex items-center space-x-1 px-3 py-2 bg-${config.color}-100 text-${config.color}-700 rounded-lg hover:bg-${config.color}-200 transition-colors duration-300 text-sm font-medium`}
              >
                <Download className="h-4 w-4" />
                <span>Preview</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={uploading}
                className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300 text-sm font-medium disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>

            <p className="text-xs text-gray-500">or upload a new file:</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-3">
            Drop your PDF here or click to browse
          </p>
        )}

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`bg-${config.color}-500 h-2 transition-all duration-300`}
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
          className={`mt-4 w-full bg-${config.color}-500 text-white px-4 py-2 rounded-lg hover:bg-${config.color}-600 transition-colors duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {uploading
            ? "Uploading..."
            : currentFile
            ? "Replace File"
            : "Choose PDF"}
        </button>

        {/* File Type Info */}
        <p className="text-xs text-gray-500 mt-2">PDF files only • Max 10MB</p>

        {/* Success Message */}
        {success && (
          <div className="mt-3 p-2 bg-green-100 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-2 bg-red-100 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
