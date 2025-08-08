'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiGrid, FiUser, FiBell, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from './AuthProvider'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
    { name: 'Users', href: '/user', icon: FiUser },
    { name: 'Notifications', href: '/notification', icon: FiBell },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    setClickedItem(null)
  }

  const handleClick = (itemName: string) => {
    setClickedItem(itemName)
    setIsOpen(false)
  }

  // Properly typed animation variants for nav items
  const navItemVariants: Variants = {
    hidden: { opacity: 0, x: -10, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        filter: { duration: 0.4 }
      }
    }
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#333333] text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 h-full flex-col bg-[#333333] ${
          isMobile
            ? `transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`
            : 'hidden md:flex'
        }`}
      >
        <div className="flex items-center justify-center py-8 mt-3">
          <Image
            src="/assets/logo.png"
            alt="Spot My Ride Logo"
            width={150}
            height={50}
            priority
          />
        </div>
        <nav className="flex-1 px-5 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.name}
                whileTap={{
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => handleClick(item.name)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative ${
                    isActive
                      ? 'text-[#00A085]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#00A085]' : 'text-gray-400'}`} />
                  <motion.span
                    variants={navItemVariants}
                    initial="visible"
                    animate={clickedItem === item.name ? "hidden" : "visible"}
                    transition={{ duration: 0.3 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              </motion.div>
            )
          })}
        </nav>
        <div className="p-4 mt-auto">
          <motion.button
            onClick={handleLogout}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-gray-700"
          >
            <FiLogOut className="h-5 w-5 text-gray-400" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </>
  )
}
