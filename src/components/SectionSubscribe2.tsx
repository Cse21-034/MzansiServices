"use client";

import React, { FC } from "react";
import Badge from "@/shared/Badge";
import Input from "@/shared/Input";

export interface SectionContactProps {
  className?: string;
}

const SectionContact: FC<SectionContactProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionContact relative ${className}`}
      data-nc-id="SectionContact"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Contact Info */}
          <div className="flex-1">
            <div className="max-w-2xl">
              <h2 className="font-semibold text-4xl mb-6">Get In Touch 📞</h2>
              <span className="block text-neutral-500 dark:text-neutral-400 text-lg mb-8">
                Have questions about listing your business or need support? 
                We're here to help you grow in South Africa's business community.
              </span>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-4">
                  <Badge name="💼" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Business listing support
                  </span>
                </li>
                <li className="flex items-center space-x-4">
                  <Badge color="green" name="📈" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Advertising opportunities
                  </span>
                </li>
                <li className="flex items-center space-x-4">
                  <Badge color="red" name="🤝" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Partnership inquiries
                  </span>
                </li>
              </ul>

              {/* Contact Info */}
              <div className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
                <h4 className="font-semibold text-lg mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                    <i className="las la-phone text-lg text-burgundy-600"></i>
                    <span>+267 78 275 372</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                    <i className="las la-envelope text-lg text-burgundy-600"></i>
                    <span>Marketing@namibiaservices.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                    <i className="las la-map-marker text-lg text-burgundy-600"></i>
                    <span>Johannesburg, South Africa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form and Visual */}
          <div className="flex-1 w-full">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      First Name
                    </label>
                    <Input
                      required
                      type="text"
                      placeholder="Your first name"
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Last Name
                    </label>
                    <Input
                      required
                      type="text"
                      placeholder="Your last name"
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="your.email@example.com"
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Business Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your business name (optional)"
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-burgundy-600 hover:bg-burgundy-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionContact;
