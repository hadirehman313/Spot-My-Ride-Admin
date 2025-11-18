"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserFriends, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { db } from "../../config/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface CardData {
  icon: React.ReactNode;
  count: number | string;
  label: string;
  loading?: boolean;
}

const Card = () => {
  const [cardData, setCardData] = useState<CardData[]>([
    {
      icon: <FaUsers className="text-4xl text-[#00A085]" />,
      count: "...",
      label: "Total Users",
      loading: true,
    },
    {
      icon: <FaUserFriends className="text-4xl text-[#00A085]" />,
      count: "...",
      label: "Active Users (Last 7 Days)",
      loading: true,
    },
    {
      icon: <FaCar className="text-4xl text-[#00A085]" />,
      count: "...",
      label: "Total Vehicles Added",
      loading: true,
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-[#00A085]" />,
      count: "...",
      label: "Locations Saved Today",
      loading: true,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Total Users
        const usersSnap = await getDocs(collection(db, "users"));
        const totalUsers = usersSnap.size;

        // 2. Total Vehicles Added (myCars collection)
        const myCarsSnap = await getDocs(collection(db, "myCars"));
        const totalMyCars = myCarsSnap.size;

        // 3. Active Users (active = true वाले users)
        const activeUsersQuery = query(
          collection(db, "users"),
          where("active", "==", true)
        );
        const activeSnap = await getDocs(activeUsersQuery);
        const activeUsers = activeSnap.size;

        // 4. pinnedCars collection की length
        const pinnedCarsSnap = await getDocs(collection(db, "pinnedCars"));
        const pinnedCarsCount = pinnedCarsSnap.size;

        // Update state
        setCardData([
          {
            icon: <FaUsers className="text-4xl text-[#00A085]" />,
            count: totalUsers,
            label: "Total Users",
          },
          {
            icon: <FaUserFriends className="text-4xl text-[#00A085]" />,
            count: activeUsers,
            label: "Active Users",
          },
          {
            icon: <FaCar className="text-4xl text-[#00A085]" />,
            count: totalMyCars,
            label: "Total Vehicles Added",
          },
          {
            icon: <FaMapMarkerAlt className="text-4xl text-[#00A085]" />,
            count: pinnedCarsCount,
            label: "Pinned Cars Count",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setCardData((prev) =>
          prev.map((item) => ({ ...item, count: "Error", loading: false }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <motion.div
      className="flex flex-col items-center p-6 bg-white rounded-lg border-t-4 border-t-gray-200 shadow-lg cursor-default"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
        repeatType: "reverse",
      }}
    >
      <div className="mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
      <div className="w-16 h-8 bg-gray-200 rounded-lg mb-2"></div>
      <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
    </motion.div>
  );

  return (
    <div className="mx-2 bg-[#FAFAFA] p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-lg font-semibold text-gray-700 mb-2">
          Welcome Christina
        </h1>
        <p className="text-xs opacity-35">Hi, your analytics are all set</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6 mt-6">
        {isLoading
          ? // Skeleton Loading State
            Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : // Actual Data State
            cardData.map((card, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 bg-white rounded-lg border-t-4 border-t-[#00A085] shadow-lg hover:shadow-xl transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {card.icon}
                </motion.div>
                <motion.h1
                  className="text-3xl font-bold mb-2 text-gray-800"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  {card.count}
                </motion.h1>
                <motion.p
                  className="text-sm text-[#A5A5A5] text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {card.label}
                </motion.p>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

export default Card;
