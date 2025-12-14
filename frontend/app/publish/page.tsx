"use client";

import { useState } from "react";
import { Send, FileText, AlertCircle } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  protocol: string;
  type: "report" | "alert" | "update";
  status: "draft" | "published" | "pending";
  date: string;
}

const mockPublications: Publication[] = [
  {
    id: "1",
    title: "Q1 2024 Stability Report",
    protocol: "All Protocols",
    type: "report",
    status: "published",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Compound V3 Risk Assessment",
    protocol: "Compound",
    type: "alert",
    status: "published",
    date: "2024-01-14",
  },
  {
    id: "3",
    title: "Weekly Stability Update",
    protocol: "All Protocols",
    type: "update",
    status: "draft",
    date: "2024-01-15",
  },
];

export default function PublishPage() {
  const [publications] = useState<Publication[]>(mockPublications);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [protocol, setProtocol] = useState("all");
  const [type, setType] = useState<"report" | "alert" | "update">("update");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle publication submission
    alert("Publication submitted successfully!");
    setTitle("");
    setContent("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-4 w-4" />;
      case "alert":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      published: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    };
    return (
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status as keyof typeof colors]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Publish</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create and publish stability reports, alerts, and updates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Create New Publication */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Create New Publication
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  placeholder="Enter publication title..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Protocol
                  </label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="all">All Protocols</option>
                    <option value="compound">Compound</option>
                    <option value="aave">Aave</option>
                    <option value="makerdao">MakerDAO</option>
                    <option value="uniswap">Uniswap</option>
                    <option value="curve">Curve</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "report" | "alert" | "update")}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="update">Update</option>
                    <option value="report">Report</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  placeholder="Write your publication content here..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                  Publish
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Publications */}
        <div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Publications
            </h2>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-zinc-500 dark:text-zinc-400">
                        {getTypeIcon(pub.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {pub.title}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{pub.protocol}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{pub.date}</p>
                      </div>
                    </div>
                    {getStatusBadge(pub.status)}
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











