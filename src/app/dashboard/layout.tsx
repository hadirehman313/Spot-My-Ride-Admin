// app/(dashboard)/layout.tsx
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - now handled within the Sidebar component */}
      <Sidebar />
      
      {/* Main content area with navbar and children */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64"> {/* Add margin for desktop sidebar */}
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

