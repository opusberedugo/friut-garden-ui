import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Flex from '../components/layout/Flex'
import Image from '../components/utility/Image'
import Form from '../components/forms/Form'
import Button from '../components/ui/Button'
import Grid from '../components/layout/Grid'
import OTPInput from '../components/forms/OTPInput'
import Toast from '../components/feedback/Toast'

export default function EmailAuth() {
  const { id } = useParams()
  const navigate = useNavigate()
  const apiURL = import.meta.env.VITE_API_URL

  // ── Email verification state ────────────────────────────────
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpError, setEmailOtpError] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerifyError, setEmailVerifyError] = useState('')

  const [toastState, setToastState] = useState({ open: false, variant: 'success', message: '' })

  function showToast(variant, message) {
    setToastState({ open: true, variant, message })
  }

  const emailSentRef = useRef(false)

  // Auto-send the verification email when the page loads
  useEffect(() => {
    async function sendVerificationEmail() {
      try {
        const response = await fetch(`${apiURL}/send-verification-email/${id}`)
        if (response.ok) {
          setEmailSent(true)
        } else {
          setEmailError('Failed to send verification email. Please try again.')
        }
      } catch (err) {
        console.error('Error sending verification email:', err)
        setEmailError('Could not reach the server. Please check your connection.')
      }
    }

    // Guard against React StrictMode double-invocation in development
    if (id && !emailSentRef.current) {
      emailSentRef.current = true
      sendVerificationEmail()
    }
  }, [id])

  async function handleResend() {
    setEmailError('')
    setEmailOtpError('')
    try {
      const response = await fetch(`${apiURL}/send-verification-email/${id}`)
      if (response.ok) {
        showToast('success', 'A new verification code has been sent to your email.')
      } else {
        setEmailError('Failed to resend verification email. Please try again.')
      }
    } catch (err) {
      console.error('Error resending verification email:', err)
      setEmailError('Could not reach the server. Please check your connection.')
    }
  }

  async function handleVerifyEmail(e) {
    e.preventDefault()
    if (!emailOtp) {
      setEmailOtpError('Please enter the verification code.')
      return
    }
    setEmailOtpError('')
    try {
      const response = await fetch(`${apiURL}/verify-email-code/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailOtp }),
      })

      if (response.ok) {
        setEmailVerified(true)
        setEmailVerifyError('')
        showToast('success', 'Email verified successfully! Redirecting…')
        setTimeout(() => navigate('/home'), 2000)
      } else if (response.status === 401) {
        setEmailOtpError('Invalid code. Please check your email and try again.')
      } else {
        setEmailVerifyError('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Error verifying OTP:', err)
      setEmailVerifyError('Could not reach the server. Please check your connection.')
    }
  }

  return (
    <>
      <Toast
        open={toastState.open}
        variant={toastState.variant}
        message={toastState.message}
        position="top-right"
        duration={4000}
        onClose={() => setToastState(prev => ({ ...prev, open: false }))}
      />

      <div className="w-full max-w-lg mx-auto px-8 py-12">
        {/* Header */}
        <Flex className="items-center justify-between mb-16">
          <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.57813 12.4981C3.5777 12.6905 3.65086 12.8831 3.79761 13.0299L9.7936 19.0301C10.0864 19.3231 10.5613 19.3233 10.8543 19.0305C11.1473 18.7377 11.1474 18.2629 10.8546 17.9699L6.13418 13.2461L20.3295 13.2461C20.7437 13.2461 21.0795 12.9103 21.0795 12.4961C21.0795 12.0819 20.7437 11.7461 20.3295 11.7461L6.14168 11.7461L10.8546 7.03016C11.1474 6.73718 11.1473 6.2623 10.8543 5.9695C10.5613 5.6767 10.0864 5.67685 9.79362 5.96984L3.84392 11.9233C3.68134 12.0609 3.57812 12.2664 3.57812 12.4961L3.57813 12.4981Z" fill="#323544" />
            </svg>
          </a>
          <Flex className="items-center space-x-2">
            <Image imgClass="w-40" src="logo.png" />
          </Flex>
        </Flex>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Email Verification</h1>
          <p className="text-gray-600">We want to be sure you are who you say you are.</p>
        </div>

        {/* OTP Form */}
        <Form onSubmit={handleVerifyEmail}>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check your mail</h2>
            <p className="text-gray-600">
              {emailSent
                ? 'We have sent a verification code to your email address.'
                : 'Sending a verification code to your email address…'}
            </p>
            {emailError && <p className="text-red-500 mt-2 text-sm">{emailError}</p>}
          </div>

          {emailVerified && (
            <p className="text-green-600 mb-4">✅ Email verified successfully! Redirecting…</p>
          )}
          {emailVerifyError && (
            <p className="text-red-500 mb-4">{emailVerifyError}</p>
          )}

          <Grid classes="grid-cols-4 grid items-center gap-4 mb-8">
            <OTPInput
              length={8}
              value={emailOtp}
              onChange={setEmailOtp}
              onComplete={(val) => setEmailOtp(val)}
              error={emailOtpError}
              disabled={emailVerified}
            />
          </Grid>

          <div className="flex items-center gap-4 flex-wrap">
            <Button
              className="bg-forest-500 w-fit text-center text-white px-8 py-2 rounded-lg disabled:opacity-50"
              type="submit"
              disabled={emailVerified}
            >
              {emailVerified ? 'Verified ✓' : 'Verify Email'}
            </Button>

            {!emailVerified && (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Resend code
              </button>
            )}
          </div>
        </Form>
      </div>
    </>
  )
}