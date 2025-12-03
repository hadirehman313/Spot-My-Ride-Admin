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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import moment from "moment"; // Import moment

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

const PUSH_API_URL = "https://spotmyridesendnofications.vercel.app/api/send-notification";

export default function Notifications() {
  const [type, setType] = useState<NotificationType>("Email");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
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
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredHistory = useMemo(() => {
    const q = search.toLowerCase();
    return notifications.filter(
      (n) =>
        n.type.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }, [notifications, search]);

  // Updated formatDateTime function using moment
  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return { date: "", time: "" };
    
    try {
      const date = timestamp.toDate();
      
      // Using moment to format date as 3/17/2025
      return {
        date: moment(date).format("M/D/YYYY"), // 3/17/2025 format
        time: moment(date).format("hh:mm A"), // 12:30 PM format
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: "", time: "" };
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Title and Message are required!");
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch all users with deviceToken
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersWithToken: { userId: string; deviceToken?: string }[] = [];

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.deviceToken) {
          usersWithToken.push({
            userId: doc.id,
            deviceToken: data.deviceToken,
          });
        }
      });

      // 2. Save notification in Firestore for all users
      const savePromises = usersSnapshot.docs.map((doc) =>
        addDoc(collection(db, "notifications"), {
          userId: doc.id,
          type: type,
          title: title.trim(),
          description: message.trim(),
          isRead: false,
          createdAt: serverTimestamp(),
        })
      );

      await Promise.all(savePromises);

      // 3. If Push type → Call API
      if (type === "Push" && usersWithToken.length > 0) {
        const payload = {
          title: title.trim(),
          text: message.trim(),
          users: usersWithToken.map((u) => ({ deviceToken: u.deviceToken })),
        };

        try {
          await axios.post(PUSH_API_URL, payload, {
            headers: { "Content-Type": "application/json" },
          });
          toast.success("Push notifications sent to devices!");
        } catch (apiError: any) {
          console.error("Push API Error:", apiError.response?.data || apiError.message);
          toast.warn("Notifications saved but some push failed");
        }
      } else if (type === "Push" && usersWithToken.length === 0) {
        toast.info("No device tokens found – Push skipped, but saved in history");
      }

      // Success
      toast.success("Notification processed successfully!");
      setTitle("");
      setMessage("");
      setType("Email");
      fetchNotifications();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse py-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex justify-between space-x-4">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
            <p className="text-sm text-gray-500 opacity-75 mt-2">
              Send Email or Push notifications to all users
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full rounded-xs border border-gray-200 bg-white py-3 pl-3 pr-9 text-sm outline-none focus:border-gray-400 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Send Form */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Send Notifications
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as NotificationType)}
                    className="w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-5 text-sm outline-none focus:border-gray-400"
                  >
                    <option value="Email">Email Notification</option>
                    <option value="Push">Push Notification (Real Device)</option>
                  </select>
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                  className="w-full rounded-md border border-gray-200 bg-white px-4 py-5 text-sm shadow-sm outline-none focus:border-gray-400"
                  required
                />

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm resize-none outline-none focus:border-gray-400 shadow-sm"
                  required
                />

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-72 rounded-xs bg-[#00A085] py-3 text-white font-medium hover:bg-[#008f75] disabled:opacity-70 transition"
                  >
                    {loading ? "Sending..." : "Send Notification"}
                  </button>
                </div>
              </form>
            </section>

            {/* History Table */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Sent History
              </h2>

              {loading && notifications.length === 0 ? (
                <SkeletonLoader />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead>
                      <tr className="text-xs uppercase text-gray-500">
                        <th className="py-3">Type</th>
                        <th className="py-3">Message</th>
                        <th className="py-3">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-10 text-center text-gray-400">
                            {search ? "No results" : "No notifications sent yet"}
                          </td>
                        </tr>
                      ) : (
                        filteredHistory.map((notif) => {
                          const { date, time } = formatDateTime(notif.createdAt);
                          return (
                            <tr key={notif.id} className="border-t">
                              <td className="py-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    notif.type === "Push"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {notif.type}
                                </span>
                              </td>
                              <td className="py-3 max-w-xs">
                                <div className="font-medium">{notif.title}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {notif.description}
                                </div>
                              </td>
                              <td className="py-3 text-xs whitespace-nowrap">
                                <div>{date}</div>
                                <div className="text-gray-400">{time}</div>
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