'use client'

import React from 'react'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { db } from '../../config/Firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Image from 'next/image'
import { useAuth } from '@/component/AuthProvider'

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const { setIsAuthenticated, setUserData } = useAuth()

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<FormValues> = {}
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'Password is required'
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 9 characters long'
      }
      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true)
        console.log('Login form submitted:', values)

        const adminCollection = collection(db, 'admin')
        const q = query(
          adminCollection,
          where('email', '==', values.email),
          where('password', '==', values.password)
        )
        const querySnapshot = await getDocs(q)
        console.log('Firebase query result:', querySnapshot.empty ? 'No data found' : 'Data found')

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          const userId = querySnapshot.docs[0].id
          console.log('User data:', { userId, userData })

          setIsAuthenticated(true)
          setUserData({ uid: userId, email: values.email })
          console.log('isAuthenticated set to true, userData set:', { uid: userId, email: values.email })

          toast.success('Login successful!', {
            position: 'top-right',
            autoClose: 2000,
          })

          setTimeout(() => {
            console.log('Navigating to dashboard...')
            router.push('/dashboard')
          }, 500)
        } else {
          console.log('Invalid email or password')
          toast.error('Invalid email or password!', {
            position: 'top-right',
            autoClose: 2000,
          })
        }
      } catch (error) {
        console.error('Error during login:', error)
        toast.error('An error occurred during login', {
          position: 'top-right',
          autoClose: 2000,
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-xl">
        <div className="flex justify-center mb-8 p-4">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={220}
            height={100}
            priority
          />
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            ) : null}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-5 mt-3 rounded-lg bg-[#F5F8FC] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-[#00A085] hover:bg-[#00796b] text-white font-semibold py-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
              formik.isSubmitting ? 'animate-pulse' : ''
            }`}
          >
            {formik.isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Please Wait...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}