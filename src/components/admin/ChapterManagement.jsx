import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  FileText,
  Eye,
  Lock,
  Unlock,
  Star,
  ArrowUp,
  ArrowDown,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { supabaseHelpers } from "../../lib/supabase";
import FileUpload from "./FileUpload";

const ChapterManagement = ({
  chapters,
  addChapter,
  updateChapter,
  deleteChapter,
}) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState({
    notes: false,
    solutions: false,
    formulas: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    notes: null,
    solutions: null,
    formulas: null,
  });

  const handleEdit = (chapter) => {
    setSelectedChapter(chapter);
    setEditForm(chapter);
    setIsEditing(true);
    // Reset file states
    setUploadedFiles({
      notes: null,
      solutions: null,
      formulas: null,
    });
  };

  const handleFileUpload = async (fileType, file) => {
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [fileType]: true }));

    try {
      const chapterId = selectedChapter?.id || "temp-" + Date.now();
      const result = await supabaseHelpers.uploadChapterFile(
        chapterId,
        fileType,
        file
      );

      if (result.error) {
        alert(`Upload failed: ${result.error.message}`);
        return;
      }

      // Store uploaded file info
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: {
          path: result.data.path,
          url: result.data.url,
          fileName: result.data.fileName,
          fileSize: result.data.fileSize,
        },
      }));

      // Update form with file path
      setEditForm((prev) => ({
        ...prev,
        materials: {
          ...prev.materials,
          [fileType]: result.data.path,
        },
      }));

      console.log(`✅ ${fileType} uploaded successfully`);
    } catch (error) {
      console.error(`File upload error:`, error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fileType]: false }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (showAddForm) {
        // Creating new chapter
        const result = await addChapter(editForm);
        if (result.success) {
          alert("Chapter created successfully!");
          setShowAddForm(false);
          setEditForm({});
          setUploadedFiles({ notes: null, solutions: null, formulas: null });
        } else {
          alert(`Error creating chapter: ${result.error}`);
        }
      } else {
        // Updating existing chapter
        const result = await updateChapter(selectedChapter.id, editForm);
        if (result.success) {
          alert("Chapter updated successfully!");
          setIsEditing(false);
          setSelectedChapter(null);
          setEditForm({});
          setUploadedFiles({ notes: null, solutions: null, formulas: null });
        } else {
          alert(`Error updating chapter: ${result.error}`);
        }
      }
    } catch (error) {
      alert(`Operation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chapterId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this chapter? This action cannot be undone."
      )
    ) {
      try {
        const result = await deleteChapter(chapterId);
        if (result.success) {
          alert("Chapter deleted successfully!");
        } else {
          alert(`Error deleting chapter: ${result.error}`);
        }
      } catch (error) {
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  const handleAddNew = () => {
    setEditForm({
      title: "",
      description: "",
      order: chapters.length + 1,
      isUnlocked: true,
      materials: { notes: "", solutions: "", formulas: "" },
    });
    setUploadedFiles({ notes: null, solutions: null, formulas: null });
    setShowAddForm(true);
  };

  // File upload component
  const FileUploadCard = ({ type, title, color, description }) => {
    const isUploading = uploadingFiles[type];
    const uploadedFile = uploadedFiles[type];
    const existingFile = editForm.materials?.[type];

    return (
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-300 ${
          isUploading
            ? "border-blue-400 bg-blue-50"
            : uploadedFile || existingFile
            ? "border-green-400 bg-green-50"
            : `border-gray-300 hover:border-${color}-400`
        }`}
      >
        <Upload
          className={`h-8 w-8 mx-auto mb-2 ${
            isUploading
              ? "text-blue-500 animate-bounce"
              : uploadedFile || existingFile
              ? "text-green-500"
              : "text-gray-400"
          }`}
        />

        <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
        <p className="text-xs text-gray-500 mb-3">{description}</p>

        {/* Upload Status */}
        {isUploading && (
          <div className="mb-3">
            <div className="text-xs text-blue-600 font-medium">
              Uploading...
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
              <div className="bg-blue-600 h-1 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {(uploadedFile || existingFile) && !isUploading && (
          <div className="mb-3 p-2 bg-green-100 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-800 font-medium">
                {uploadedFile ? "Uploaded!" : "File exists"}
              </span>
            </div>
            {uploadedFile && (
              <div className="text-xs text-green-700 mt-1">
                {uploadedFile.fileName} (
                {(uploadedFile.fileSize / 1024 / 1024).toFixed(1)}MB)
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        <label
          className={`inline-block px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300 ${
            isUploading
              ? `bg-blue-100 text-blue-600 cursor-not-allowed`
              : `bg-${color}-50 text-${color}-600 hover:bg-${color}-100`
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleFileUpload(type, file);
            }}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading
            ? "Uploading..."
            : uploadedFile || existingFile
            ? "Replace File"
            : "Choose PDF"}
        </label>

        {/* File size limit */}
        <p className="text-xs text-gray-400 mt-2">Max 10MB</p>
      </div>
    );
  };

  // Keep all your existing JSX but replace the file upload section with:
  return (
    <div className="space-y-8">
      {/* All your existing header, stats, and table code stays the same */}

      {/* Edit Modal */}
      {(isEditing || showAddForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {isEditing ? "Edit Chapter" : "Add New Chapter"}
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowAddForm(false);
                    setSelectedChapter(null);
                    setUploadedFiles({
                      notes: null,
                      solutions: null,
                      formulas: null,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Keep all your existing form fields */}

              {/* Updated File Uploads Section */}
              {/* File Uploads */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Chapter Materials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FileUpload
                    chapterId={editForm.id}
                    chapterTitle={editForm.title}
                    materialType="notes"
                    currentFile={editForm.materials?.notes}
                    onFileUploaded={(type, filePath) => {
                      setEditForm((prev) => ({
                        ...prev,
                        materials: {
                          ...prev.materials,
                          [type]: filePath,
                        },
                      }));
                    }}
                  />

                  <FileUpload
                    chapterId={editForm.id}
                    chapterTitle={editForm.title}
                    materialType="solutions"
                    currentFile={editForm.materials?.solutions}
                    onFileUploaded={(type, filePath) => {
                      setEditForm((prev) => ({
                        ...prev,
                        materials: {
                          ...prev.materials,
                          [type]: filePath,
                        },
                      }));
                    }}
                  />

                  <FileUpload
                    chapterId={editForm.id}
                    chapterTitle={editForm.title}
                    materialType="formulas"
                    currentFile={editForm.materials?.formulas}
                    onFileUploaded={(type, filePath) => {
                      setEditForm((prev) => ({
                        ...prev,
                        materials: {
                          ...prev.materials,
                          [type]: filePath,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Keep your existing save/cancel buttons */}
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowAddForm(false);
                  setSelectedChapter(null);
                  setUploadedFiles({
                    notes: null,
                    solutions: null,
                    formulas: null,
                  });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Chapter"
                    : "Create Chapter"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterManagement;
