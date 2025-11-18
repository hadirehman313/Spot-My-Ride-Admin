'use client'

import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { db } from '../../config/Firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Image from 'next/image'
import { useAuth } from '@/component/AuthProvider'
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Cookies from "js-cookie"

interface FormValues {
  email: string
  password: string
  rememberMe: boolean
}

export default function Login() {
  const router = useRouter()
  const { setIsAuthenticated, setUserData } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  // If already logged in → redirect
  useEffect(() => {
    const uid = Cookies.get('uid')
    if (uid) {
      router.replace('/dashboard')
    }
  }, [router])

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },

    validate: (values) => {
      const errors: Partial<FormValues> = {}

      if (!values.email) errors.email = 'Email is required'
      else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Invalid email format'

      if (!values.password) errors.password = 'Password is required'
      else if (values.password.length < 8) errors.password = 'Password must be 8+ characters'

      return errors
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true)

        const adminCollection = collection(db, 'admin')
        const q = query(
          adminCollection,
          where('email', '==', values.email),
          where('password', '==', values.password) // Warning: Never store plain text passwords in production!
        )

        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0]
          const userId = userDoc.id

          const expiresIn = values.rememberMe ? 7 : 1
          Cookies.set("uid", userId, { expires: expiresIn, secure: true, sameSite: 'strict' })
          Cookies.set("email", values.email, { expires: expiresIn, secure: true, sameSite: 'strict' })

          setIsAuthenticated(true)
          setUserData({ uid: userId, email: values.email })

          toast.success('Login successful!', { autoClose: 2000 })
          setTimeout(() => router.push('/dashboard'), 800)
        } else {
          toast.error('Invalid email or password', { autoClose: 3000 })
        }
      } catch (error: any) {
        console.error("Login error:", error)
        toast.error('Login failed. Please try again.', { autoClose: 3000 })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl">

        <div className="flex justify-center mb-8">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={220}
            height={100}
            priority
          />
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-5 rounded-lg bg-[#F5F8FC] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-5 rounded-lg bg-[#F5F8FC] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute right-4 top-5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                className="h-4 w-4 text-teal-600 rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-[#00A085] hover:bg-[#00796b] text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              formik.isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {formik.isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in…</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}


// 'use client'

// import React, { useState } from 'react'
// import { useFormik } from 'formik'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { db } from '../../config/Firebase'
// import { collection, query, where, getDocs } from 'firebase/firestore'
// import Image from 'next/image'
// import { useAuth } from '@/component/AuthProvider'
// import Visibility from "@mui/icons-material/Visibility"
// import VisibilityOff from "@mui/icons-material/VisibilityOff"
// import Cookies from "js-cookie";

// interface FormValues {
//   email: string
//   password: string
//   rememberMe: boolean
// }

// export default function Login() {
//   const router = useRouter()
//   const { setIsAuthenticated, setUserData } = useAuth()
//   const [showPassword, setShowPassword] = useState(false)

//   const formik = useFormik<FormValues>({
//     initialValues: {
//       email: '',
//       password: '',
//       rememberMe: false,
//     },

//     validate: (values) => {
//       const errors: Partial<FormValues> = {}

//       if (!values.email) errors.email = 'Email is required'
//       else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Invalid email'

//       if (!values.password) errors.password = 'Password is required'
//       else if (values.password.length < 8)
//         errors.password = 'Password must be 8+ characters'

//       return errors
//     },

//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         setSubmitting(true)

//         const adminCollection = collection(db, 'admin')
//         const q = query(
//           adminCollection,
//           where('email', '==', values.email),
//           where('password', '==', values.password)
//         )

//         const snapshot = await getDocs(q)

//         if (!snapshot.empty) {
//           const userDoc = snapshot.docs[0]
//           const userId = userDoc.id

//           // Store cookies (7 days if RememberMe, otherwise 1 day)
//           Cookies.set("uid", userId, { expires: values.rememberMe ? 7 : 1 })
//           Cookies.set("email", values.email, { expires: values.rememberMe ? 7 : 1 })

//           // Auth Context Update
//           setIsAuthenticated(true)
//           setUserData({ uid: userId, email: values.email })

//           toast.success('Login successful!', { autoClose: 2000 })

//           setTimeout(() => router.push('/dashboard'), 600)
//         } else {
//           toast.error('Invalid email or password', { autoClose: 2000 })
//         }
//       } catch (error) {
//         console.error(error)
//         toast.error('Login error occurred', { autoClose: 2000 })
//       } finally {
//         setSubmitting(false)
//       }
//     },
//   })

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
//       <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-xl">

//         {/* Logo */}
//         <div className="flex justify-center mb-8 p-4">
//           <Image
//             src="/assets/logo.png"
//             alt="Logo"
//             width={220}
//             height={100}
//             priority
//           />
//         </div>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">

//           {/* Email */}
//           <div className="relative">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="w-full px-4 py-5 rounded-lg bg-[#F5F8FC] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               className="w-full px-4 py-5 rounded-lg bg-[#F5F8FC] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />

//             <div
//               className="absolute right-4 top-5 cursor-pointer text-gray-500"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </div>

//             {formik.touched.password && formik.errors.password && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
//             )}
//           </div>

//           {/* Remember Me */}
//           <div className="flex justify-start mb-4">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="remember"
//                 name="rememberMe"
//                 checked={formik.values.rememberMe}
//                 onChange={formik.handleChange}
//                 className="h-4 w-4 text-teal-600 bg-white shadow rounded-sm border"
//               />
//               <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
//                 Remember me
//               </label>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={formik.isSubmitting}
//             className={`w-full bg-[#00A085] hover:bg-[#00796b] text-white font-semibold py-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-3 ${
//               formik.isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105'
//             }`}
//           >
//             {formik.isSubmitting ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span>Logging in…</span>
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>

//         </form>
//       </div>
//     </div>
//   )
// }
