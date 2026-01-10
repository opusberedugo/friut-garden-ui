import React from 'react'
import { useState } from 'react'

import Grid from '../components/layout/Grid'
import Image from '../components/utility/Image'
import Form from '../components/forms/Form'
import FormField from '../components/forms/FormField'
import Divider from '../components/utility/Divider'
import FormButton from '../components/forms/Button'
import Checkbox from '../components/forms/Checkbox'
import UIButton from '../components/ui/Button'
import Flex from '../components/layout/Flex'
import FormGroup from '../components/forms/FormGroup'


export default function SingUpPage({ }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error for the modified field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  function validateForm() {
    const newErrors = {}

    // First Name Validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = 'First name must be at least 3 characters'
    } else if (/\s/.test(formData.firstName)) {
      newErrors.firstName = 'First name cannot contain spaces'
    } else if (/[^a-zA-Z]/.test(formData.firstName)) {
      newErrors.firstName = 'First name cannot contain special characters or numbers'
    }

    // Last Name Validation
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = 'Last name must be at least 3 characters'
    } else if (/\s/.test(formData.lastName)) {
      newErrors.lastName = 'Last name cannot contain spaces'
    } else if (/[^a-zA-Z]/.test(formData.lastName)) {
      newErrors.lastName = 'Last name cannot contain special characters or numbers'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone) newErrors.phone = 'Phone number is required'

    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.birthDay) newErrors.birthDay = 'Day is required'
    if (!formData.birthMonth) newErrors.birthMonth = 'Month is required'
    if (!formData.birthYear) newErrors.birthYear = 'Year is required'

    // Basic date validity
    if (formData.birthDay && (formData.birthDay < 1 || formData.birthDay > 31)) newErrors.birthDay = 'Invalid day'
    if (formData.birthMonth && (formData.birthMonth < 1 || formData.birthMonth > 12)) newErrors.birthMonth = 'Invalid month'

    // Age validation (18+)
    if (formData.birthDay && formData.birthMonth && formData.birthYear) {
      const birthDate = new Date(formData.birthYear, formData.birthMonth - 1, formData.birthDay);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - (birthDate.getMonth());

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.birthYear = 'You must be at least 18 years old';
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (validateForm()) {
      console.log(JSON.stringify(formData))
      try {
        const response = await fetch("https://friut-garden-server-production.up.railway.app/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          console.log('Signup Successful', data)
          // Store token if needed, e.g., localStorage.setItem('token', data.token)
          alert("User created successfully!");
          // Navigate to login or home
        } else {
          console.log('Signup Failed', data.message)
          setErrors({ ...errors, apiError: data.message })
          alert(data.message || "Signup failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      console.log('Validation Failed')
    }
  }

  return (
    <>
      <Grid classes='grid-cols-2 gap-4  overflow-hidden'>
        {/* First column */}
        <Flex className="w-full p-12 flex-col">
          <Flex className="flex items-center justify-between mb-16">
            <Flex className="flex items-center space-x-2">
              <Image imgClass="w-40" src="logo.png" />
            </Flex>
            <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Already have an account</a>
          </Flex>


          <div class="mb-8">
            <h1 class="text-3xl font-semibold text-gray-900 mb-2">Welcome back</h1>
            <p class="text-gray-600">Enter your Untitled account details.</p>
          </div>

          <UIButton text="Sign Up with Google" onClick="" className="mb-4 w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mx-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </UIButton>

          <UIButton text="Sign Up with Facebook" onClick="" className="mb-4 w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg fill="#1877F2" class="w-5 h-5 mx-4" viewBox="0 0 24 24">
              <path d="M22 12.037C22 6.494 17.523 2 12 2S2 6.494 2 12.037c0 4.707 3.229 8.656 7.584 9.741v-6.674H7.522v-3.067h2.062v-1.322c0-3.416 1.54-5 4.882-5 .634 0 1.727.125 2.174.25v2.78a13 13 0 0 0-1.155-.037c-1.64 0-2.273.623-2.273 2.244v1.085h3.266l-.56 3.067h-2.706V22C18.164 21.4 22 17.168 22 12.037" />
            </svg>
          </UIButton>



          <Divider text="OR" />

          <Form onSubmit={handleSubmit}>

            <FormGroup className="grid-cols-2 gap-4">
              <FormField
                className="mb-4"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                label="First name"
                required
                value={formData.firstName}
                error={errors.firstName}
                onChange={handleChange}
              />
              <FormField
                className="mb-4"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                label="Last name"
                required
                value={formData.lastName}
                error={errors.lastName}
                onChange={handleChange}
              />
            </FormGroup>

            <label className='block text-gray-700 font-medium mb-2'>Date of birth <span className='text-red-500'>*</span></label>
            <FormGroup className="grid-cols-3 gap-4" error={""} >
              <FormField
                className="mb-4"
                name="birthDay"
                type="number"
                placeholder="Day"
                label=""
                value={formData.birthDay}
                error={errors.birthDay}
                onChange={handleChange}
              />
              <FormField
                className="mb-4"
                name="birthMonth"
                type="number"
                placeholder="Month"
                label=""
                value={formData.birthMonth}
                error={errors.birthMonth}
                onChange={handleChange}
              />
              <FormField
                className="mb-4"
                name="birthYear"
                type="number"
                placeholder="Year"
                label=""
                value={formData.birthYear}
                error={errors.birthYear}
                onChange={handleChange}
              />
            </FormGroup>

            <FormField
              className="mb-4"
              name="email"
              type="email"
              placeholder="Enter your email"
              label="Email"
              required
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
            />

            <FormField
              className="mb-4"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              label="Phone number"
              required
              value={formData.phone}
              error={errors.phone}
              onChange={handleChange}
            />

            <FormField
              className="mb-4"
              name="password"
              type="password"
              placeholder="Enter your password"
              label="Password"
              required
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
            />

            <FormField
              className="mb-4"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              label="Confirm Password"
              required
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
            />

            <FormButton text="Sign Up" className="bg-forest-500 hover:bg-forest-600 transition-colors" />
          </Form>

          <div class="mt-auto pt-8 text-center">
            <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Trouble signing Up?</a>
          </div>
        </Flex>

        {/* Image Serving as second column */}
        <div className='fixed top-0 right-0 w-1/2 h-screen'>
          <Image src="hasan-almasi-Z4NJcyOAPvc-unsplash.jpg" alt='Login background' imgClass='block w-full h-full object-cover' />
        </div>
        {/* <Image src="https://images.unsplash.com/photo-1569239591652-6cc3025b07fa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt='Login background' imgClass='block w-full h-full object-cover' /> */}
      </Grid>
    </>
  )
}