import React, { useState } from "react";
import Timeline from "../components/layout/Timeline";
import Flex from "../components/layout/Flex";
import Image from "../components/utility/Image";
import Form from '../components/forms/Form'
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import Grid from "../components/layout/Grid";

export default function NewUserAuth(){

  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  return (
    <div className="py-10 px-24">

      <Flex className="flex items-center justify-between mb-16">
        <a href="#" class="text-sm text-gray-600 hover:text-gray-900">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.57813 12.4981C3.5777 12.6905 3.65086 12.8831 3.79761 13.0299L9.7936 19.0301C10.0864 19.3231 10.5613 19.3233 10.8543 19.0305C11.1473 18.7377 11.1474 18.2629 10.8546 17.9699L6.13418 13.2461L20.3295 13.2461C20.7437 13.2461 21.0795 12.9103 21.0795 12.4961C21.0795 12.0819 20.7437 11.7461 20.3295 11.7461L6.14168 11.7461L10.8546 7.03016C11.1474 6.73718 11.1473 6.2623 10.8543 5.9695C10.5613 5.6767 10.0864 5.67685 9.79362 5.96984L3.84392 11.9233C3.68134 12.0609 3.57812 12.2664 3.57812 12.4961L3.57813 12.4981Z" fill="#323544"/>
          </svg>
        </a>
        <Flex className="flex items-center space-x-2">
          <Image imgClass="w-40" src="logo.png" />
        </Flex>
      </Flex>

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-gray-900 mb-2">New User Authentication</h1>
      <p class="text-gray-600">Enter your details to create an account.</p>
    </div>

      <Timeline showTrackBorder={false}
        steps={[
          {
            label: 'Email Authentication',
            // date: 'October 24, 2019',
            // roundLabel: 'Round One',
            // number: '01',
            // title: 'Competition Launch',
            // description: 'Donec ullamcorper nulla non metus auctor fringilla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
            // href: '#',
          },
          {
            label: 'Phone Authentication',
            // date: 'November 15, 2019',
            // roundLabel: 'Round One',
            // number: '02',
            // title: 'Registration Closes',
            // description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            // href: '#',
          },
          {
            label: 'User Preferences Selection',
            // date: 'November 15, 2019',
            // roundLabel: 'Round One',
            // number: '02',
            // title: 'Registration Closes',
            // description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            // href: '#',
          },
          
        ]}
      />


      <Form className="w-full px-20">

        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">New User Authentication</h1>
          <p class="text-gray-600">Enter your details to create an account.</p>
        </div>

        <Grid classes="grid-cols-4 grid items-center gap-4 px-40">
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          <FormField
            className="mb-4"
            name="email"
            type="email"
            placeholder="Enter your email"
            // label="Email"
            // required
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
        </Grid>
          <Button className="bg-forest-500 w-full text-white px-4 py-2 rounded-lg">Send OTP</Button>
      </Form>
    </div>
  )
}