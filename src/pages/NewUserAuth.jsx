import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Timeline from "../components/layout/Timeline";
import Flex from "../components/layout/Flex";
import Image from "../components/utility/Image";
import Form from '../components/forms/Form'
import Button from "../components/ui/Button";
import Grid from "../components/layout/Grid";
import OTPInput from "../components/forms/OTPInput";

export default function NewUserAuth(){
  const { id } = useParams()
  const apiURL = import.meta.env.VITE_API_URL

  // Which step is active on the timeline (0 = email, 1 = phone, 2 = preferences)
  const [currentStep, setCurrentStep] = useState(0)

  // ── Email verification ──────────────────────────────────────
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpError, setEmailOtpError] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerifyError, setEmailVerifyError] = useState('')

  const emailSentRef = useRef(false)

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

  async function sendVerificationPhone() {
    try {
      const response = await fetch(`${apiURL}/send-verification-phone/${id}`)
      if (!response.ok) {
        setPhoneSendError('Failed to send SMS verification code. Please try again.')
      }
    } catch (err) {
      console.error('Error sending phone verification:', err)
      setPhoneSendError('Could not reach the server. Please check your connection.')
    }
  }

  async function handleVerifyEmail(e) {
    e.preventDefault()
    if (!emailOtp) {
      setEmailOtpError('Please enter the verification code.')
      return
    }
    try {
      const response = await fetch(`${apiURL}/verify-email-code/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailOtp }),
      })
      if (response.ok) {
        setEmailVerified(true)
        setEmailVerifyError('')
        sendVerificationPhone()
        // Slide to the next step after a short pause so user sees the success message
        setTimeout(() => setCurrentStep(1), 800)
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

  // ── Phone verification ──────────────────────────────────────
  const [phoneOtp, setPhoneOtp] = useState('')
  const [phoneOtpError, setPhoneOtpError] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneVerifyError, setPhoneVerifyError] = useState('')
  const [phoneSendError, setPhoneSendError] = useState('')



  async function handleVerifyPhone(e) {
    e.preventDefault()
    if (!phoneOtp) {
      setPhoneOtpError('Please enter the verification code.')
      return
    }
    // TODO: wire up phone verification endpoint when ready
    setPhoneVerified(true)
    setTimeout(() => setCurrentStep(2), 800)
  }

  return (
    <div className="py-10 px-24">

      <Flex className="flex items-center justify-between mb-16">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.57813 12.4981C3.5777 12.6905 3.65086 12.8831 3.79761 13.0299L9.7936 19.0301C10.0864 19.3231 10.5613 19.3233 10.8543 19.0305C11.1473 18.7377 11.1474 18.2629 10.8546 17.9699L6.13418 13.2461L20.3295 13.2461C20.7437 13.2461 21.0795 12.9103 21.0795 12.4961C21.0795 12.0819 20.7437 11.7461 20.3295 11.7461L6.14168 11.7461L10.8546 7.03016C11.1474 6.73718 11.1473 6.2623 10.8543 5.9695C10.5613 5.6767 10.0864 5.67685 9.79362 5.96984L3.84392 11.9233C3.68134 12.0609 3.57812 12.2664 3.57812 12.4961L3.57813 12.4981Z" fill="#323544"/>
          </svg>
        </a>
        <Flex className="flex items-center space-x-2">
          <Image imgClass="w-40" src="logo.png" />
        </Flex>
      </Flex>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Email Verification</h1>
        <p className="text-gray-600">We want to be sure you are who you say you are.</p>
      </div>

      <Timeline
        showTrackBorder={false}
        showNav={false}
        activeIndex={currentStep}
        onStepClick={setCurrentStep}
        maxAllowedIndex={currentStep}
        steps={[
          { label: 'Email Authentication' },
          { label: 'Phone Authentication' },
          { label: 'User Preferences Selection' },
        ]}
      />

      {/* Slide container — both forms sit side by side; translateX drives the slide */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >

          {/* ── Step 0: Email OTP ── */}
          <div className="w-full flex-shrink-0 px-20">
            <Form onSubmit={handleVerifyEmail}>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your mail</h1>
                <p className="text-gray-600">We have sent a verification code to your email address.</p>
                {emailError && <p className="text-red-500 mt-2 text-sm">{emailError}</p>}
              </div>

              {emailVerified && (
                <p className="text-green-600 mb-4">✅ Email verified successfully!</p>
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
              <Button
                className="bg-forest-500 w-fit text-center text-white px-8 py-2 rounded-lg disabled:opacity-50"
                type="submit"
                disabled={emailVerified}
              >
                {emailVerified ? 'Verified ✓' : 'Verify Email'}
              </Button>
            </Form>
          </div>

          {/* ── Step 1: Phone OTP ── */}
          <div className="w-full flex-shrink-0 px-20">
            <Form onSubmit={handleVerifyPhone}>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your messages</h1>
                <p className="text-gray-600">We have sent a verification code to your phone number.</p>
                {phoneSendError && <p className="text-red-500 mt-2 text-sm">{phoneSendError}</p>}
              </div>

              {phoneVerified && (
                <p className="text-green-600 mb-4">✅ Phone verified successfully!</p>
              )}
              {phoneVerifyError && (
                <p className="text-red-500 mb-4">{phoneVerifyError}</p>
              )}

              <Grid classes="grid-cols-4 grid items-center gap-4 mb-8">
                <OTPInput
                  length={8}
                  value={phoneOtp}
                  onChange={setPhoneOtp}
                  onComplete={(val) => setPhoneOtp(val)}
                  error={phoneOtpError}
                  disabled={phoneVerified}
                />
              </Grid>
              <Button
                className="bg-forest-500 w-fit text-center text-white px-8 py-2 rounded-lg disabled:opacity-50"
                type="submit"
                disabled={phoneVerified}
              >
                {phoneVerified ? 'Verified ✓' : 'Verify Phone'}
              </Button>
            </Form>
          </div>

          {/* ── Step 2: User Preferences ── */}
          <div className="w-full flex-shrink-0 px-20">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">User Preferences</h1>
              <p className="text-gray-600">Tell us a bit about yourself to personalise your experience.</p>
            </div>
            {/* Preferences form will go here */}
          </div>

        </div>
      </div>

    </div>
  )
}
