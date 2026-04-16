"use client";

import React, { FC, useState, useEffect } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BuildingStorefrontIcon, UserIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Modal from "@/shared/Modal"; // Import the new Modal component

export interface PageSignUpProps {}

const PageSignUp: FC<PageSignUpProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<"individual" | "business">("individual");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for modal visibility
  const [successMessage, setSuccessMessage] = useState(""); // State for modal message

  // Set user type from URL parameter on component mount
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'business') {
      setUserType('business');
    }
  }, [searchParams]);

  // Password validation checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const allChecksPassed = Object.values(passwordChecks).every(Boolean) && passwordsMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Common validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Business-specific validation
    if (userType === "business" && !formData.businessName) {
      setError("Please provide business name.");
      setLoading(false);
      return;
    }

    if (!allChecksPassed) {
      setError("Please ensure all password requirements are met.");
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms and Conditions and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = userType === "business" ? "/api/auth/business-signup" : "/api/auth/signup";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          ...(userType === "business" && { businessName: formData.businessName }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || `Unable to create ${userType} account`);
        setLoading(false);
        return;
      }

      // Success messages based on user type
      if (userType === "business") {
        setSuccessMessage("You can now login and add details. Your business will only be available on the directory after being approved by The Team. You must expect an email shortly to provide needed documentation.");
        setShowSuccessModal(true);
      } else {
        alert("Account created successfully! You can now login to your account.");
        router.push("/login");
      }

    } catch (err) {
      console.error(err);
      setError(`Unable to create ${userType} account.`);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/login");
  };

  const PasswordCheckItem = ({ check, label }: { check: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {check ? (
        <CheckCircleIcon className="w-4 h-4 text-green-500" />
      ) : (
        <XCircleIcon className="w-4 h-4 text-red-500" />
      )}
      <span className={check ? "text-green-600" : "text-red-600"}>{label}</span>
    </div>
  );

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
    });
    setError("");
  };

  const handleUserTypeChange = (type: "individual" | "business") => {
    setUserType(type);
    resetForm();
  };

  return (
    <div className={`nc-PageSignUp`}>
      <div className="container mb-24 lg:mb-32">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            {userType === "business" ? (
              <BuildingStorefrontIcon className="w-16 h-16 text-primary-600" />
            ) : (
              <UserIcon className="w-16 h-16 text-primary-600" />
            )}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {userType === "business" ? "Register Your Business" : "Join Namibia Services"}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            {userType === "business" ? "Create your business account" : "Create your personal account"}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* User Type Toggle */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleUserTypeChange("individual")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-md transition-all ${
                userType === "individual"
                  ? "bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Individual</span>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange("business")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-md transition-all ${
                userType === "business"
                  ? "bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <BuildingStorefrontIcon className="w-5 h-5" />
              <span className="font-medium">Business</span>
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Name (Only for Business) */}
              {userType === "business" && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Business Name *
                  </label>
                  <Input
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    className="w-full"
                    required
                  />
                </div>
              )}

              {/* Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  {userType === "business" ? "Business Owner / Representative Name *" : "Full Name *"}
                </label>
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={userType === "business" ? "Enter your full name" : "Enter your full name"}
                  className="w-full"
                  required
                />
              </div>

              {/* Email */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Contact Number {userType === "business" ? "*" : ""}
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+267 XXX XXXX"
                  className="w-full"
                  required={userType === "business"}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Password *
                </label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Confirm Password *
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                Password Requirements:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <PasswordCheckItem check={passwordChecks.length} label="At least 8 characters" />
                <PasswordCheckItem check={passwordChecks.uppercase} label="1 uppercase letter" />
                <PasswordCheckItem check={passwordChecks.lowercase} label="1 lowercase letter" />
                <PasswordCheckItem check={passwordChecks.number} label="1 number" />
                <PasswordCheckItem check={passwordChecks.special} label="1 special character" />
                <PasswordCheckItem check={passwordsMatch} label="Passwords match" />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <ButtonPrimary 
              type="submit" 
              className="w-full mt-6 justify-center"
              disabled={!allChecksPassed || !agreeToTerms || loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                `Create ${userType === "business" ? "Business" : ""} Account`
              )}
            </ButtonPrimary>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-neutral-700 dark:text-neutral-300">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Info Box - Only for Business */}
          {userType === "business" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <BuildingStorefrontIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Account Activation Required
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    After registration, your business account will be reviewed by our admin team. 
                    You will receive an email notification once your account is activated and ready to use. 
                    This process typically takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Success Modal for Business Registration */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Business Account Created!"
        buttonText="Go to Login"
        onButtonClick={handleModalClose}
      >
        <p className="text-neutral-700 dark:text-neutral-300">
          {successMessage}
        </p>
      </Modal>
    </div>
  );
};

export default PageSignUp;
