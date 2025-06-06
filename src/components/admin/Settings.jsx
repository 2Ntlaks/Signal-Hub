import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  DollarSign,
  Bell,
  Shield,
  Mail,
  Globe,
  Save,
  Upload,
  Key,
  Database,
  Palette,
  Users,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "CPUT Signal Processing Hub",
      siteDescription: "Master Signal Processing with CPUT-specific resources",
      contactEmail: "admin@cput.ac.za",
      supportEmail: "support@cput.ac.za",
      maintenanceMode: false,
      registrationEnabled: true,
    },
    pricing: {
      freeTierChapters: 2,
      premiumPrice: 50,
      currency: "ZAR",
      trialDays: 7,
      discountEnabled: false,
      discountPercentage: 20,
    },
    notifications: {
      emailNotifications: true,
      welcomeEmails: true,
      paymentReminders: true,
      contentUpdates: true,
      systemAlerts: true,
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 24,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      ipWhitelist: "",
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      intercomKey: "",
      stripePublishableKey: "",
      supabaseUrl: "",
      supabaseKey: "",
    },
  });

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Key },
  ];

  const updateSettings = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Will implement with Supabase later
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Settings
          </h2>
          <p className="text-gray-600">
            Configure your Signal Processing Hub platform
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Save className="h-5 w-5" />
          <span>Save All Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    General Settings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Basic platform configuration and information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) =>
                        updateSettings("general", "siteName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) =>
                        updateSettings(
                          "general",
                          "contactEmail",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) =>
                      updateSettings(
                        "general",
                        "siteDescription",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) =>
                        updateSettings(
                          "general",
                          "supportEmail",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Maintenance Mode
                      </h4>
                      <p className="text-sm text-gray-600">
                        Temporarily disable access to the platform
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "general",
                          "maintenanceMode",
                          !settings.general.maintenanceMode
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.general.maintenanceMode
                          ? "bg-red-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-white rounded-full transition-transform ${
                          settings.general.maintenanceMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        User Registration
                      </h4>
                      <p className="text-sm text-gray-600">
                        Allow new users to register
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "general",
                          "registrationEnabled",
                          !settings.general.registrationEnabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.general.registrationEnabled
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-white rounded-full transition-transform ${
                          settings.general.registrationEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Settings */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Pricing Configuration
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configure your freemium model and pricing
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Tier Chapters
                    </label>
                    <input
                      type="number"
                      value={settings.pricing.freeTierChapters}
                      onChange={(e) =>
                        updateSettings(
                          "pricing",
                          "freeTierChapters",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of chapters available to free users
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Price (Monthly)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        R
                      </span>
                      <input
                        type="number"
                        value={settings.pricing.premiumPrice}
                        onChange={(e) =>
                          updateSettings(
                            "pricing",
                            "premiumPrice",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trial Period (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.pricing.trialDays}
                      onChange={(e) =>
                        updateSettings(
                          "pricing",
                          "trialDays",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.pricing.currency}
                      onChange={(e) =>
                        updateSettings("pricing", "currency", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ZAR">South African Rand (ZAR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Student Discount
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enable special pricing for students
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "pricing",
                          "discountEnabled",
                          !settings.pricing.discountEnabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.pricing.discountEnabled
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-white rounded-full transition-transform ${
                          settings.pricing.discountEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {settings.pricing.discountEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        value={settings.pricing.discountPercentage}
                        onChange={(e) =>
                          updateSettings(
                            "pricing",
                            "discountPercentage",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="20"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Pricing Preview
                  </h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>
                      • Free users get access to{" "}
                      {settings.pricing.freeTierChapters} chapters
                    </p>
                    <p>
                      • Premium subscription: R{settings.pricing.premiumPrice}
                      /month
                    </p>
                    <p>
                      • {settings.pricing.trialDays}-day free trial for premium
                    </p>
                    {settings.pricing.discountEnabled && (
                      <p>
                        • Student discount:{" "}
                        {settings.pricing.discountPercentage}% off (R
                        {Math.round(
                          settings.pricing.premiumPrice *
                            (1 - settings.pricing.discountPercentage / 100)
                        )}
                        /month)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Notification Settings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configure email notifications and alerts
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === "emailNotifications" &&
                              "Send email notifications to users"}
                            {key === "welcomeEmails" &&
                              "Send welcome emails to new users"}
                            {key === "paymentReminders" &&
                              "Send payment reminder emails"}
                            {key === "contentUpdates" &&
                              "Notify users about new content"}
                            {key === "systemAlerts" &&
                              "Send system maintenance alerts"}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            updateSettings("notifications", key, !value)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? "bg-green-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 bg-white rounded-full transition-transform ${
                              value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">
                        Email Configuration Required
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Make sure to configure your email service in the
                        integrations tab for notifications to work properly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Security Settings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configure security policies and access controls
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (hours)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "maxLoginAttempts",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) =>
                      updateSettings(
                        "security",
                        "passwordExpiry",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set to 0 for no expiry
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-600">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSettings(
                        "security",
                        "twoFactorRequired",
                        !settings.security.twoFactorRequired
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.security.twoFactorRequired
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 bg-white rounded-full transition-transform ${
                        settings.security.twoFactorRequired
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Whitelist (Optional)
                  </label>
                  <textarea
                    value={settings.security.ipWhitelist}
                    onChange={(e) =>
                      updateSettings("security", "ipWhitelist", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="192.168.1.0/24, 10.0.0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated IP addresses or CIDR blocks
                  </p>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Integrations
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configure third-party services and API keys
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>Supabase Configuration</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supabase URL
                        </label>
                        <input
                          type="url"
                          value={settings.integrations.supabaseUrl}
                          onChange={(e) =>
                            updateSettings(
                              "integrations",
                              "supabaseUrl",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://your-project.supabase.co"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supabase Anon Key
                        </label>
                        <input
                          type="password"
                          value={settings.integrations.supabaseKey}
                          onChange={(e) =>
                            updateSettings(
                              "integrations",
                              "supabaseKey",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Payment Processing</span>
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Publishable Key
                      </label>
                      <input
                        type="text"
                        value={settings.integrations.stripePublishableKey}
                        onChange={(e) =>
                          updateSettings(
                            "integrations",
                            "stripePublishableKey",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="pk_test_..."
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Analytics & Marketing</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Analytics ID
                        </label>
                        <input
                          type="text"
                          value={settings.integrations.googleAnalytics}
                          onChange={(e) =>
                            updateSettings(
                              "integrations",
                              "googleAnalytics",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="GA_MEASUREMENT_ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook Pixel ID
                        </label>
                        <input
                          type="text"
                          value={settings.integrations.facebookPixel}
                          onChange={(e) =>
                            updateSettings(
                              "integrations",
                              "facebookPixel",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123456789012345"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Customer Support</span>
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intercom App ID
                      </label>
                      <input
                        type="text"
                        value={settings.integrations.intercomKey}
                        onChange={(e) =>
                          updateSettings(
                            "integrations",
                            "intercomKey",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="abcd1234"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Integration Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">Supabase</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          settings.integrations.supabaseUrl
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {settings.integrations.supabaseUrl
                          ? "Connected"
                          : "Not configured"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">Stripe</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          settings.integrations.stripePublishableKey
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {settings.integrations.stripePublishableKey
                          ? "Connected"
                          : "Not configured"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">Analytics</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          settings.integrations.googleAnalytics
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {settings.integrations.googleAnalytics
                          ? "Connected"
                          : "Not configured"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
