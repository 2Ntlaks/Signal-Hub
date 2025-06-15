import React, { useState } from "react";
import {
  User,
  Lock,
  Mail,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { supabaseHelpers } from "../../lib/supabase";
import toast from "react-hot-toast";

const StudentAuth = ({ onAuthSuccess }) => {
  // We now have three modes: 'login', 'signup', and 'resetPassword'
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    studentNumber: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const { error: resetError } = await supabaseHelpers.resetPasswordForEmail(
      formData.email
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(
        "If an account with that email exists, a password reset link has been sent."
      );
      toast.success("Password reset link sent!");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (authMode === "login") {
      const { data, error } = await supabaseHelpers.signIn(
        formData.email,
        formData.password
      );
      if (error) setError(error.message);
      if (data.user) onAuthSuccess(data.user, data.profile);
    } else {
      // Signup
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      const { data, error } = await supabaseHelpers.signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          student_number: formData.studentNumber,
        }
      );

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Account created! Please check your email to verify your account before logging in."
        );
        toast.success("Account created successfully!");
        // Switch to login view after successful signup
        setAuthMode("login");
      }
    }
    setLoading(false);
  };

  // Switch between Login and Signup views
  const switchMode = (mode) => {
    setAuthMode(mode);
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const renderContent = () => {
    if (authMode === "resetPassword") {
      return (
        <form onSubmit={handlePasswordResetRequest} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-xl"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {authMode === "signup" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Number
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl"
                  placeholder="123456789"
                  required
                />
              </div>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
              placeholder="student@cput.ac.za"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border rounded-xl"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              <EyeOff className="h-5 w-5" />
            </button>
          </div>
        </div>
        {authMode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="Confirm your password"
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading
            ? authMode === "login"
              ? "Signing in..."
              : "Creating account..."
            : authMode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {authMode === "login" && "Welcome Back!"}
            {authMode === "signup" && "Join CPUT Signal Hub"}
            {authMode === "resetPassword" && "Reset Your Password"}
          </h1>
          <p className="text-gray-600">
            {authMode === "login" && "Sign in to continue your journey"}
            {authMode === "signup" && "Create your account to get started"}
            {authMode === "resetPassword" &&
              "We'll send you a link to reset your password"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-xl flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        {renderContent()}

        <div className="mt-6 text-center text-sm text-gray-600">
          {authMode === "login" && (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </button>
              <br />
              <button
                onClick={() => switchMode("resetPassword")}
                className="font-medium text-blue-600 hover:underline mt-2"
              >
                Forgot Password?
              </button>
            </>
          )}
          {authMode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("login")}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
          {authMode === "resetPassword" && (
            <>
              Remember your password?{" "}
              <button
                onClick={() => switchMode("login")}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
