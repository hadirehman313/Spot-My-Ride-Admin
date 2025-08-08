

'use client';

import React, { useMemo, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import { CiSearch } from "react-icons/ci";
type NotificationType = 'Email' | 'SMS' | 'Push';

type HistoryRow = {
  id: number;
  type: NotificationType;
  message: string;
  date: string;   // e.g. 23/05/2024
  time: string;   // e.g. 09:00 AM
};

const initialHistory: HistoryRow[] = [
  { id: 1, type: 'Email', message: 'Lorem Ipsum Dolor', date: '23/05/2024', time: '09:00 AM' },
  { id: 2, type: 'SMS', message: 'Lorem Ipsum Dolor', date: '23/05/2024', time: '09:00 AM' },
  { id: 3, type: 'Email', message: 'Lorem Ipsum Dolor', date: '23/05/2024', time: '09:00 AM' },
  { id: 4, type: 'Push', message: 'Lorem Ipsum Dolor', date: '23/05/2024', time: '09:00 AM' },
  { id: 5, type: 'Email', message: 'Lorem Ipsum Dolor', date: '23/05/2024', time: '09:00 AM' },
  { id: 6, type: 'SMS', message: 'Lorem Ipsum Dolor', date: '23/05/2024', time: '09:00 AM' },
];

export default function Notifications() {
  const [type, setType] = useState<NotificationType>('Email');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<HistoryRow[]>(initialHistory);
  const [search, setSearch] = useState('');

  const filteredHistory = useMemo(() => {
    const q = search.toLowerCase();
    return history.filter(
      h =>
        h.type.toLowerCase().includes(q) ||
        h.message.toLowerCase().includes(q) ||
        h.date.toLowerCase().includes(q) ||
        h.time.toLowerCase().includes(q)
    );
  }, [history, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const now = new Date();
    const newRow: HistoryRow = {
      id: Date.now(),
      type,
      message,
      date: now.toLocaleDateString('en-GB'), // 23/05/2024 format
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory(prev => [newRow, ...prev]);
    setMessage('');
    setType('Email');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
            <p className="text-sm text-gray-500 opacity-35 mt-2">
              You can send the users notifications.
            </p>
          </div>

          {/* Search */}
          
        </div>

        <div className='flex justify-between'>
          <div></div>
          <div className="w-full sm:w-auto">
         

          <div className="relative">
              <input
                type="text"
                placeholder="Search here"
                className="w-full sm:w-72 rounded-xs border border-gray-200 bg-white py-3 pl-3 pr-9 text-sm outline-none focus:border-gray-400 focus:ring-0 shadow-[0_4px_4px_rgba(0,0,0,0.04)] opacity-100"
               value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
              <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Send Notifications */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Send Notifications</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type */}
                <div>
                  <label className="sr-only" htmlFor="type">
                    Type of notification
                  </label>
                  <div className="relative">
  <select
    id="type"
    value={type}
    onChange={(e) => setType(e.target.value as NotificationType)}
    className="w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-5 text-sm text-gray-700 outline-none focus:border-gray-400 shadow-[0_0_20px_rgba(0,0,0,0.1)] bg-[#FFFFFF]"
  >
    <option value="Email">Email</option>
    <option value="SMS">SMS</option>
    <option value="Push">Push</option>
  </select>
  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
    ▼
  </span>
</div>
                </div>

                {/* Message */}
               <div>
  <label className="sr-only" htmlFor="message">
    Write Message
  </label>
  <textarea
    id="message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    rows={6}
    placeholder="Write Message"
    className="w-full rounded-md border border-gray-200 bg-white bg-repeat px-4 py-3 text-sm text-gray-700 shadow-[0_0_20px_#0000001A] outline-none opacity-100 focus:border-gray-400"
  />
</div>

                {/* Send button */}
                <div className='flex justify-center'>
                  <button
                    type="submit"
                    className="w-full sm:w-72 rounded-xs bg-[#00A085] py-3 text-white font-medium hover:bg-[#00A085] transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </section>

            {/* Right: Notifications History */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Notifications History</h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left border-collapse">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-gray-500">
                      <th className="py-3">Type</th>
                      <th className="py-3">Message</th>
                      <th className="py-3">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-gray-400">
                          No notifications found
                        </td>
                      </tr>
                    )}
                    {filteredHistory.map((row) => (
                      <tr key={row.id} className="border-t border-gray-100">
                        <td className="py-3 align-top">{row.type}</td>
                        <td className="py-3 align-top">{row.message}</td>
                        <td className="py-3 align-top whitespace-nowrap">
                          <div>{row.date}</div>
                          <div className="text-gray-400 text-xs">{row.time}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
