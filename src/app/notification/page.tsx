"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { db } from "../../config/Firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CiSearch } from "react-icons/ci";

type NotificationType = "Email" | "Push";

type NotificationRow = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: any;
  isRead: boolean;
  userId?: string;
};

export default function Notifications() {
  const [type, setType] = useState<NotificationType>("Email");
  const [title, setTitle] = useState(""); // New Title Field
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetched: NotificationRow[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          type: data.type || "Push",
          title: data.title || "",
          description: data.description || "",
          createdAt: data.createdAt,
          isRead: data.isRead ?? false,
          userId: data.userId,
        });
      });

      setNotifications(fetched);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Search filter
  const filteredHistory = useMemo(() => {
    const q = search.toLowerCase();
    return notifications.filter(
      (n) =>
        n.type.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }, [notifications, search]);

  // Format Date
  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return { date: "", time: "" };
    const date = timestamp.toDate();
    return {
      date: date.toLocaleDateString("en-GB"),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Send Notification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Title and Message are required!");
      return;
    }

    setLoading(true);

    try {
      // Fetch all users with deviceToken (for future push if needed)
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersWithToken: { userId: string; token: string }[] = [];

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.deviceToken) {
          usersWithToken.push({
            userId: doc.id,
            token: data.deviceToken,
          });
        }
      });

      if (usersWithToken.length === 0) {
        alert(
          "No users found with a device token (still saving notification)."
        );
      }

      // Save notification for each user
      for (const user of usersWithToken) {
        await addDoc(collection(db, "notifications"), {
          userId: user.userId,
          type: type,
          title: title.trim(),
          description: message.trim(),
          isRead: false,
          createdAt: serverTimestamp(),
        });

        // Here you can trigger actual push notification using user.token if needed
      }

      // Reset form
      setTitle("");
      setMessage("");
      setType("Email");
      alert("Notification sent successfully to all users!");
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h1>
            <p className="text-sm text-gray-500 opacity-35 mt-2">
              You can send the users notifications.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-end">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search here"
              className="w-full rounded-xs border border-gray-200 bg-white py-3 pl-3 pr-9 text-sm outline-none focus:border-gray-400 focus:ring-0 shadow-[0_4px_4px_rgba(0,0,0,0.04)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Send Notification */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Send Notifications
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type */}
                <div>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as NotificationType)
                      }
                      className="w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-5 text-sm text-gray-700 outline-none focus:border-gray-400 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                    >
                      <option value="Email">Email</option>
                      <option value="Push">Push</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter  Title"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-5 text-sm text-gray-700 shadow-[0_0_20px_#0000001A] outline-none focus:border-gray-400"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Write Message / Body"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-[0_0_20px_#0000001A] outline-none focus:border-gray-400 resize-none"
                    required
                  />
                </div>

                {/* Send Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-72 rounded-xs bg-[#00A085] py-3 text-white font-medium hover:bg-[#008f75] transition-colors disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send Notification"}
                  </button>
                </div>
              </form>
            </section>

            {/* Notifications History */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Notifications History
              </h2>

              {loading && notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Loading notifications...
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left border-collapse">
                    <thead>
                      <tr className="text-xs uppercase tracking-wide text-gray-500">
                        <th className="py-3">Type</th>
                        <th className="py-3">Message</th>
                        <th className="py-3">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-10 text-center text-gray-400"
                          >
                            {search
                              ? "No matching notifications found"
                              : "No notifications yet"}
                          </td>
                        </tr>
                      ) : (
                        filteredHistory.map((notif) => {
                          const { date, time } = formatDateTime(
                            notif.createdAt
                          );
                          return (
                            <tr
                              key={notif.id}
                              className="border-t border-gray-100"
                            >
                              <td className="py-3 align-top">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    notif.type === "Email"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {notif.type}
                                </span>
                              </td>

                              <td className="py-3 align-top max-w-xs">
                                <div className="font-medium">{notif.title}</div>
                                <div className="text-gray-500 text-xs mt-1">
                                  {notif.description}
                                </div>
                              </td>

                              <td className="py-3 align-top whitespace-nowrap">
                                <div>{date}</div>
                                <div className="text-gray-400 text-xs">
                                  {time}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
