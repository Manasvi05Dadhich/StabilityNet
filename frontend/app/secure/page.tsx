"use client";

import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import { Shield, Lock, Key, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SecurePage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState("sk_live_1234567890abcdef");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const securityFeatures = [
    {
      name: "API Key Management",
      description: "Generate and manage API keys for programmatic access",
      icon: Key,
      status: "active",
    },
    {
      name: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: Shield,
      status: twoFactorEnabled ? "active" : "inactive",
    },
    {
      name: "Session Management",
      description: "View and manage active sessions",
      icon: Lock,
      status: "active",
    },
  ];

  const recentActivity = [
    {
      action: "API Key Generated",
      time: "2 hours ago",
      status: "success",
    },
    {
      action: "Password Changed",
      time: "1 day ago",
      status: "success",
    },
    {
      action: "Login from new device",
      time: "3 days ago",
      status: "warning",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Security</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your account security settings and API access
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Security Score */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Security Score</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Your account security rating
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">95%</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Excellent</p>
            </div>
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Security Features */}
        <div className="lg:col-span-2 space-y-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {feature.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {feature.description}
                      </p>
                      {feature.name === "API Key Management" && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2">
                            <input
                              type={showApiKey ? "text" : "password"}
                              value={apiKey}
                              readOnly
                              className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                            />
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="rounded-lg border border-zinc-300 bg-white p-2 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                            >
                              {showApiKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                              Generate New Key
                            </button>
                            <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                              Revoke
                            </button>
                          </div>
                        </div>
                      )}
                      {feature.name === "Two-Factor Authentication" && (
                        <div className="mt-4">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={twoFactorEnabled}
                              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">
                              Enable Two-Factor Authentication
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      feature.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {feature.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notifications & Activity */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Email Alerts</span>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">SMS Alerts</span>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  {activity.status === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






















