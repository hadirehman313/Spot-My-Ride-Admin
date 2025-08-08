"use client";

// eslint-disable-next-line no-unused-vars
import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserFriends, FaCar, FaMapMarkerAlt } from "react-icons/fa";

const Card = () => {
  const cardData = [
    { icon: <FaUsers className="text-4xl text-[#00A085]" />, count: 446, label: "Total Users" },
    { icon: <FaUserFriends className="text-4xl text-[#00A085]" />, count: 156, label: "Active Users (Last 7 Days)" },
    { icon: <FaCar className="text-4xl text-[#00A085]" />, count: 346, label: "Total Vehicles Added" },
    { icon: <FaMapMarkerAlt className="text-4xl text-[#00A085]" />, count: 89, label: "Locations Saved Today" },
  ];

  return (
    <div className="mx-2 bg-[#FAFAFA]">
      <h1 className="text-lg  font-semibold text-gray-700 mb-2">
        Welcome Christina
      </h1>
      <p className="text-xs opacity-35">Hi, your analytics are all set</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6 mt-3">
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-6 bg-white rounded-lg border-t-4 border-t-[#00A085] transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="mb-3">{card.icon}</div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {card.count}
            </h1>
            <p className="text-sm text-[#A5A5A5] opacity-75">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Card;