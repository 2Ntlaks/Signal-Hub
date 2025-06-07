import React, { useState, useRef } from "react";
import { Upload, File, X, Check, AlertCircle, Download } from "lucide-react";
import { supabaseHelpers, supabase } from "../../lib/supabase"; // Import supabase client directly

const FileUpload = ({
  chapterId,
  chapterTitle,
  materialType,
  currentFile,
  onFileUploaded,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const isNewChapter = !chapterId;

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

  const uploadFile = async (file) => {
    console.group(
      `--- DEBUGGING UPLOAD FOR: ${materialType.toUpperCase()} ---`
    );

    if (isNewChapter) {
      console.error(
        "STOP: Cannot upload file because this is a new chapter without an ID."
      );
      setError("Please save the chapter first before uploading files.");
      console.groupEnd();
      return;
    }
    if (!file) {
      console.warn("STOP: No file selected.");
      console.groupEnd();
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Check user session
      console.log("STEP 1: Checking user session...");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated. Aborting upload.");
      }
      console.log(
        `...User is authenticated as: ${user.email} (ID: ${user.id})`
      );

      // Step 2: Construct file path
      console.log("STEP 2: Constructing file path...");
      const fileExtension = file.name.split(".").pop();
      const fileName = `${materialType}-${Date.now()}.${fileExtension}`;
      const filePath = `chapter-${chapterId}/${materialType}/${fileName}`;
      console.log(`...File path is: ${filePath}`);

      // Step 3: Upload to Supabase Storage
      console.log("STEP 3: Attempting to upload file to Supabase Storage...");
      const { data: uploadData, error: uploadError } =
        await supabaseHelpers.uploadFile("chapter-materials", filePath, file);

      if (uploadError) {
        // This is a critical failure point.
        console.error("--- !!! STORAGE UPLOAD FAILED !!! ---");
        throw uploadError; // This will be caught by the catch block
      }
      console.log(
        "...File successfully uploaded to Storage. Response:",
        uploadData
      );

      // Step 4: Update the database
      console.log(
        "STEP 4: Attempting to update 'chapters' table in the database..."
      );
      const filePaths = { [materialType]: filePath };
      const { data: updateData, error: updateError } =
        await supabaseHelpers.updateChapterFiles(chapterId, filePaths);

      if (updateError) {
        // This is the other critical failure point.
        console.error("--- !!! DATABASE UPDATE FAILED !!! ---");
        throw updateError;
      }
      console.log("...Database successfully updated. Response:", updateData);

      // If we reach here, everything was successful
      console.log("--- SUCCESS: Upload process complete! ---");
      setSuccess(`${config.label} uploaded successfully!`);
      if (onFileUploaded) {
        onFileUploaded(materialType, filePath);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Caught an error during the upload process:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      console.log("--- FINALLY: Resetting UI state. ---");
      setUploading(false);
      console.groupEnd();
    }
  };

  // The rest of the component's JSX remains the same.
  // ... (handleDownload, handleDelete, and the return statement)

  const handleDownload = async () => {
    if (!currentFile) return;
    try {
      const url = await supabaseHelpers.getFileUrl(
        "chapter-materials",
        currentFile
      );
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
      const { error: deleteError } = await supabaseHelpers.deleteFile(
        "chapter-materials",
        currentFile
      );
      if (deleteError) throw deleteError;
      const { error: updateError } = await supabaseHelpers.updateChapterFiles(
        chapterId,
        { [materialType]: null }
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
          : `border-gray-300 ${
              !isNewChapter && `hover:border-${config.color}-400`
            }`
      } ${isNewChapter ? "bg-gray-100" : ""}`}
    >
      <div className="text-center">
        <div
          className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
            isNewChapter
              ? "bg-gray-200"
              : currentFile
              ? `bg-${config.color}-100`
              : "bg-gray-100"
          }`}
        >
          {currentFile ? (
            <File className={`h-6 w-6 text-${config.color}-600`} />
          ) : (
            <Upload
              className={`h-6 w-6 ${
                isNewChapter ? "text-gray-400" : "text-gray-400"
              }`}
            />
          )}
        </div>
        <h3
          className={`font-semibold mb-2 ${
            isNewChapter ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {config.label}
        </h3>
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
          !isNewChapter && (
            <p className="text-sm text-gray-600 mb-3">
              Upload {config.label.toLowerCase()}
            </p>
          )
        )}
        {isNewChapter && (
          <p className="text-xs text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-md p-2">
            First, save the chapter to enable file uploads.
          </p>
        )}
        {uploading && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={config.accept}
          onChange={(e) => uploadFile(e.target.files[0])}
          disabled={uploading || isNewChapter}
          className="hidden"
        />
        {!isNewChapter && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || isNewChapter}
            className={`w-full mt-3 bg-${config.color}-50 text-${config.color}-700 px-4 py-2 rounded-lg hover:bg-${config.color}-100 transition-colors duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {uploading
              ? "Uploading..."
              : currentFile
              ? "Replace File"
              : "Choose File"}
          </button>
        )}
        {!isNewChapter && (
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, DOCX • Max 10MB
          </p>
        )}
        {success && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}
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
