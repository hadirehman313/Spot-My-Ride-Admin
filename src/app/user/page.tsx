"use client";

import DashboardLayout from "../dashboard/layout";
import "react-toastify/dist/ReactToastify.css";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import Modal from "@mui/material/Modal";

import { db } from "../../config/Firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { RxAvatar } from "react-icons/rx";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface User {
  id: string;
  docId: string;
  name: string;
  email: string;
  phoneNumber: string;
  vehicles: number;
  status: string;
  joiningDate: string;
  image?: string;
  lastActive?: string;
  totalVehicles?: string;
  totalSpots?: string;
  subscription?: string;
  vehiclesList?: {
    carId: string;
    name: string;
    plateNumber: string;
    color: string;
    carAddedTime: string;
    images: string[];
  }[];
}

// Define the Variants type for each animation variant
const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    rotateX: 10,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0, 0.55, 0.45, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    rotateX: -10,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const modalContentVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0, 0.55, 0.45, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    filter: "blur(2px)",
    transition: { duration: 0.3 },
  },
};

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: [0, 0.55, 0.45, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
};

const dropdownItemVariants: Variants = {
  hidden: { opacity: 0, x: -10, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: [0, 0.55, 0.45, 1] },
  },
  exit: {
    opacity: 0,
    x: -10,
    filter: "blur(2px)",
    transition: { duration: 0.2 },
  },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: { duration: 0.5, ease: [0, 0.55, 0.45, 1] },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.3 },
  },
};

export default function User() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openDetailsModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
    setOpenDropdown(null);
  };

  const openSuspendModal = (user: User) => {
    setSelectedUser(user);
    setIsSuspendModalOpen(true);
    setOpenDropdown(null);
  };

  const closeModals = () => {
    setIsDetailsModalOpen(false);
    setIsSuspendModalOpen(false);
    setSelectedUser(null);
  };

  const formatDate = (date: any): string => {
    if (!date) return "N/A";

    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString("en-US");
    }

    if (date instanceof Date) {
      return date.toLocaleDateString("en-US");
    }

    if (typeof date === "string") {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("en-US");
      }
    }

    return "N/A";
  };

  async function fetchData() {
    try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);

      const carsCollection = collection(db, "myCars");
      const carsSnapshot = await getDocs(carsCollection);

      const carsByUserId = carsSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        const userId = data.userId || "N/A";
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push({
          carId: doc.id,
          name: data.name || "N/A",
          plateNumber: data.plateNumber || "N/A",
          color: data.color || "N/A",
          carAddedTime: formatDate(data.carAddedTime),
          images: data.images || [],
        });
        return acc;
      }, {} as Record<string, { carId: string; name: string; plateNumber: string; color: string; carAddedTime: string; images: string[] }[]>);

      const userList = userSnapshot.docs.map((doc, index) => {
        const data = doc.data();
        const userId = doc.id;

        return {
          id: index.toString(),
          docId: userId,
          name: data.name || "N/A",
          email: data.email || "N/A",
          phoneNumber: data.phoneNumber || "N/A",
          vehicles: carsByUserId[userId]?.length || 0,
          status: data.status || "N/A",
          joiningDate: formatDate(data.joiningDate),
          image: data.image || "",
          lastActive: data.lastActive ? formatDate(data.lastActive) : "N/A",
          totalVehicles: carsByUserId[userId]?.length.toString() || "0",
          totalSpots: data.totalSpots || "N/A",
          subscription: data.subscription || "N/A",
          vehiclesList: carsByUserId[userId] || [],
        };
      });

      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users or cars:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-lg font-semibold text-gray-700 mb-4">Users</div>
        <p className="text-gray-500 text-sm mb-4">
          You can see all the users here.
        </p>

        <div className="flex justify-between flex-wrap gap-4 mb-4">
          <div className="w-full sm:w-auto ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here"
                className="w-full sm:w-72 rounded-sm border border-gray-200 bg-white py-3 pl-3 pr-9 text-sm outline-none focus:border-gray-400 focus:ring-0 shadow-[0_4px_4px_rgba(0,0,0,0.04)] opacity-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <Thead className="bg-gray-50">
              <Tr>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  ID
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Image
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Name
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Email
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Phone Number
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Vehicles Count
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Status
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Joining Date
                </Th>
                <Th className="px-2 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user: User) => (
                <Tr key={user.id}>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.id}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="User"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    ) : (
                      <RxAvatar className="w-10 h-10 text-gray-500 mx-auto" />
                    )}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.name}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.email}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.phoneNumber}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.vehicles}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {user.joiningDate}
                  </Td>
                  <Td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center relative">
                    <motion.div
                      className="w-8 h-8 bg-[#00A085] rounded flex items-center justify-center cursor-pointer mx-auto"
                      whileHover={{
                        scale: 1.1,
                        rotate: 90,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDropdown(user.id)}
                    >
                      <span className="text-white text-xs">•••</span>
                    </motion.div>
                    <AnimatePresence>
                      {openDropdown === user.id && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-1/2 transform translate-x-1/2 w-32 bg-[#00A085] rounded-lg shadow-lg z-50 overflow-hidden"
                        >
                          <motion.button
                            variants={dropdownItemVariants}
                            whileHover={{ backgroundColor: "#008970", x: 5 }}
                            className="block w-full text-center px-4 py-3 text-sm text-white"
                            onClick={() => openDetailsModal(user)}
                          >
                            User Details
                          </motion.button>
                          <motion.button
                            variants={dropdownItemVariants}
                            whileHover={{ backgroundColor: "#008970", x: 5 }}
                            className="block w-full text-center px-4 py-3 text-sm text-white"
                            onClick={() => openSuspendModal(user)}
                          >
                            {user.status === "active"
                              ? "Suspend User"
                              : "Activate User"}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>

        <Modal
          open={isDetailsModalOpen}
          onClose={closeModals}
          aria-labelledby="user-details-modal-title"
          aria-describedby="user-details-modal-description"
          closeAfterTransition
        >
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <motion.h2
                    variants={modalContentVariants}
                    id="user-details-modal-title"
                    className="text-lg font-semibold text-gray-700"
                  >
                    App User Details
                  </motion.h2>
                  <motion.button
                    variants={modalContentVariants}
                    className="text-gray-500 hover:text-gray-700"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModals}
                  >
                    ✕
                  </motion.button>
                </div>
                <motion.div
                  variants={modalContentVariants}
                  className="flex justify-center mb-4"
                >
                  {selectedUser?.image ? (
                    <motion.img
                      src={selectedUser.image}
                      alt="User"
                      className="w-24 h-24 rounded-full"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0, 0.55, 0.45, 1] }}
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0, 0.55, 0.45, 1] }}
                    >
                      <RxAvatar className="w-24 h-24 text-gray-500" />
                    </motion.div>
                  )}
                </motion.div>
                <motion.div
                  variants={modalContentVariants}
                  id="user-details-modal-description"
                  className="space-y-2 text-sm text-gray-500"
                >
                  <p className="flex justify-between">
                    <span>ID:</span> {selectedUser?.id || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Name:</span> {selectedUser?.name || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Email:</span> {selectedUser?.email || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Phone Number:</span>{" "}
                    {selectedUser?.phoneNumber || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedUser?.status === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedUser?.status || "N/A"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Last Active Date:</span>{" "}
                    {selectedUser?.lastActive || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Total Vehicles:</span>{" "}
                    {selectedUser?.totalVehicles || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Joining Date:</span>{" "}
                    {selectedUser?.joiningDate || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Total Spots Saved:</span>{" "}
                    {selectedUser?.totalSpots || "N/A"}
                  </p>
                  <p className="flex justify-between">
                    <span>Subscription Info:</span>{" "}
                    {selectedUser?.subscription || "N/A"}
                  </p>
                  <motion.div variants={modalContentVariants} className="mt-4">
                    <span className="font-bold">List of Vehicles</span>
                    <table className="w-full mt-2 border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b-2 border-gray-300 p-2 text-left">
                            Vehicle Name
                          </th>
                          <th className="border-b-2 border-gray-300 p-2 text-left">
                            Plate Number
                          </th>
                          <th className="border-b-2 border-gray-300 p-2 text-left">
                            Color
                          </th>
                          <th className="border-b-2 border-gray-300 p-2 text-left">
                            Added Time
                          </th>
                          <th className="border-b-2 border-gray-300 p-2 text-left">
                            Image
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedUser?.vehiclesList || []).map(
                          (vehicle, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                ease: [0, 0.55, 0.45, 1],
                              }}
                            >
                              <td className="border-b border-gray-200 p-2">
                                {vehicle.name || "N/A"}
                              </td>
                              <td className="border-b border-gray-200 p-2">
                                {vehicle.plateNumber || "N/A"}
                              </td>
                              <td className="border-b border-gray-200 p-2">
                                {vehicle.color || "N/A"}
                              </td>
                              <td className="border-b border-gray-200 p-2">
                                {vehicle.carAddedTime || "N/A"}
                              </td>
                              <td className="border-b border-gray-200 p-2">
                                {vehicle.images && vehicle.images.length > 0 ? (
                                  <motion.img
                                    src={vehicle.images[0]}
                                    alt="Car"
                                    className="w-16 h-16 object-cover rounded"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                      duration: 0.4,
                                      ease: [0, 0.55, 0.45, 1],
                                    }}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </motion.tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </motion.div>
                </motion.div>
                <motion.div
                  variants={modalContentVariants}
                  className="mt-6 flex justify-center"
                >
                  <motion.button
                    className="w-96 py-2 bg-[#00A085] text-white rounded hover:bg-[#008970] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModals}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </Modal>

        <Modal
          open={isSuspendModalOpen}
          onClose={closeModals}
          aria-labelledby="suspend-user-modal-title"
          aria-describedby="suspend-user-modal-description"
          closeAfterTransition
        >
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <motion.h2
                  variants={modalContentVariants}
                  id="suspend-user-modal-title"
                  className="text-lg text-center font-semibold text-gray-700 mb-4"
                >
                  {selectedUser?.status === "active"
                    ? "Suspend User"
                    : "Activate User"}
                </motion.h2>
                <motion.p
                  variants={modalContentVariants}
                  id="suspend-user-modal-description"
                  className="text-sm text-center text-black mb-4"
                >
                  Are you sure you want to{" "}
                  {selectedUser?.status === "active" ? "suspend" : "activate"}{" "}
                  this user?
                </motion.p>
                <motion.div
                  variants={modalContentVariants}
                  className="mt-6 flex justify-between space-x-2"
                >
                  <motion.button
                    className="w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModals}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="w-full py-2 bg-[#00A085] text-white rounded hover:bg-[#008970] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log(
                        `${
                          selectedUser?.status === "active"
                            ? "Suspending"
                            : "Activating"
                        } user ${selectedUser?.id}`
                      );
                      closeModals();
                    }}
                  >
                    {selectedUser?.status === "active" ? "Suspend" : "Activate"}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </Modal>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 flex-wrap gap-2">
          <span>
            Showing {indexOfFirstUser + 1} to{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </span>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:bg-gray-200"
              }`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === number
                      ? "bg-[#00A085] text-white"
                      : "text-black hover:bg-gray-200"
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              className={`px-3 py-1 rounded transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:bg-gray-200"
              }`}
              onClick={() =>
                currentPage < totalPages && paginate(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

