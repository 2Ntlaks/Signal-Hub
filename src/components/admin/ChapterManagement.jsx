import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
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

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Chapter Management
          </h2>
          <p className="text-gray-600">
            Add, edit, and manage all course chapters and materials.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Chapter</span>
        </button>
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chapter Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materials
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter) => (
                  <tr
                    key={chapter.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {chapter.order}
                        </span>
                        <div className="flex flex-col">
                          <button>
                            <ArrowUp className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                          <button>
                            <ArrowDown className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {chapter.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {chapter.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          chapter.isUnlocked
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {chapter.isUnlocked ? (
                          <>
                            <Unlock className="h-3 w-3 mr-1" /> Unlocked
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" /> Locked
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {
                        Object.values(chapter.materials || {}).filter(Boolean)
                          .length
                      }{" "}
                      files
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(chapter)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(chapter.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
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
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Order
                  </label>
                  <input
                    type="number"
                    value={editForm.order || ""}
                    onChange={(e) =>
                      handleInputChange("order", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isUnlocked"
                  checked={editForm.isUnlocked || false}
                  onChange={(e) =>
                    handleInputChange("isUnlocked", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isUnlocked"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Unlocked for free users
                </label>
              </div>

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

            {/* Save/Cancel Buttons */}
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
