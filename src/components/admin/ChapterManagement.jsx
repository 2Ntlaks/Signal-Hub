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

  const handleEdit = (chapter) => {
    setSelectedChapter(chapter);
    setEditForm(chapter);
    setIsEditing(true);
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
    setShowAddForm(true);
  };

  const moveChapter = async (chapter, direction) => {
    const currentOrder = chapter.order;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    // Find the chapter to swap with
    const swapChapter = chapters.find((ch) => ch.order === newOrder);
    if (!swapChapter) return;

    // Update both chapters
    await updateChapter(chapter.id, { order: newOrder });
    await updateChapter(swapChapter.id, { order: currentOrder });
  };

  // Calculate stats
  const stats = {
    total: chapters.length,
    published: chapters.filter((ch) => ch.isUnlocked).length,
    draft: chapters.filter((ch) => !ch.isUnlocked).length,
    withMaterials: chapters.filter(
      (ch) =>
        ch.materials.notes || ch.materials.solutions || ch.materials.formulas
    ).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Chapter Management
          </h2>
          <p className="text-gray-600">
            Create and manage course content for students
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Chapters
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.published}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Unlock className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.draft}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Lock className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                With Materials
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.withMaterials}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
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
                  Chapter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter, index) => (
                  <tr
                    key={chapter.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {chapter.order}
                        </span>
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => moveChapter(chapter, "up")}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => moveChapter(chapter, "down")}
                            disabled={index === chapters.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {chapter.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {chapter.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {chapter.materials.notes && (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                            📝 Notes
                          </span>
                        )}
                        {chapter.materials.solutions && (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                            ✅ Solutions
                          </span>
                        )}
                        {chapter.materials.formulas && (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
                            🔢 Formulas
                          </span>
                        )}
                        {!chapter.materials.notes &&
                          !chapter.materials.solutions &&
                          !chapter.materials.formulas && (
                            <span className="text-xs text-gray-500">
                              No materials
                            </span>
                          )}
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
                            <Unlock className="h-3 w-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(chapter)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(chapter.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
                    setEditForm({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter chapter title"
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
                        setEditForm({
                          ...editForm,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter chapter description"
                  />
                </div>

                <div className="mt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isUnlocked || false}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          isUnlocked: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Publish this chapter (make it visible to students)
                    </span>
                  </label>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Chapter Materials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FileUpload
                    chapterId={editForm.id || "temp-" + Date.now()}
                    chapterTitle={editForm.title || "New Chapter"}
                    materialType="notes"
                    currentFile={editForm.materials?.notes}
                    onFileUploaded={(type, filePath, publicUrl) => {
                      setEditForm((prev) => ({
                        ...prev,
                        materials: {
                          ...prev.materials,
                          [type]: filePath,
                        },
                      }));
                      console.log(`✅ ${type} uploaded:`, filePath);
                    }}
                  />

                  <FileUpload
                    chapterId={editForm.id || "temp-" + Date.now()}
                    chapterTitle={editForm.title || "New Chapter"}
                    materialType="solutions"
                    currentFile={editForm.materials?.solutions}
                    onFileUploaded={(type, filePath, publicUrl) => {
                      setEditForm((prev) => ({
                        ...prev,
                        materials: {
                          ...prev.materials,
                          [type]: filePath,
                        },
                      }));
                      console.log(`✅ ${type} uploaded:`, filePath);
                    }}
                  />

                  <FileUpload
                    chapterId={editForm.id || "temp-" + Date.now()}
                    chapterTitle={editForm.title || "New Chapter"}
                    materialType="formulas"
                    currentFile={editForm.materials?.formulas}
                    onFileUploaded={(type, filePath, publicUrl) => {
                      setEditForm((prev) => ({
                        ...prev,
                        materials: {
                          ...prev.materials,
                          [type]: filePath,
                        },
                      }));
                      console.log(`✅ ${type} uploaded:`, filePath);
                    }}
                  />
                </div>
              </div>

              {/* Upload Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Upload Guidelines</span>
                </h5>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Only PDF files are accepted</li>
                  <li>• Maximum file size is 10MB per file</li>
                  <li>• Files are automatically organized by chapter</li>
                  <li>
                    • Students will be able to view and download these materials
                  </li>
                  <li>
                    • Make sure content is properly formatted before uploading
                  </li>
                </ul>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowAddForm(false);
                  setSelectedChapter(null);
                  setEditForm({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !editForm.title || !editForm.description}
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
