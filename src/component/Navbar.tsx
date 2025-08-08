"use client";
import Image from 'next/image'
export default function Navbar() {
  return (
    <nav className="bg-[#333333] border-b border-gray-200">
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h1></h1>
         <div className="relative flex items-center gap-10">
       
        <div className="relative">
          <button className="flex items-center">
           
            <Image 
                        src="/assets/human.png" 
                        alt="Spot My Ride Logo" 
                        width={40} 
                        height={0} 
                        priority 
                      />
             <div className="flex flex-col">
             <span className="ml-2 text-xs text-white font-medium">Hello, Christina</span>
             <span className="text-xs text-white">Admin</span>
             </div>
          </button>
          
        </div>
      </div>
        </div>
      </div>
    </nav>
  );
}
