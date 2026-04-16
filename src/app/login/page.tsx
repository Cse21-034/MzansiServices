"use client";

import React, { FC, useState } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { BuildingStorefrontIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export interface PageLoginProps {}

const PageLogin: FC<PageLoginProps> = ({}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"user" | "business">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any)?.role;
      if (role === 'BUSINESS') {
        router.push('/business');
      } else if (role === 'USER') {
        router.push('/usersdashboard');
      }
      // Admin users will not be auto-redirected
    }
  }, [session, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please provide email and password.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Login successful
      console.log("✅ Login successful");
      
      // Wait a moment for session to be established, then redirect based on role
      setTimeout(async () => {
        // Refresh session to get updated user data
        const response = await fetch('/api/auth/session');
        const updatedSession = await response.json();
        
        if (updatedSession?.user) {
          const role = updatedSession.user.role;
          if (role === 'BUSINESS') {
            router.push('/business');
          } else if (role === 'USER') {
            router.push('/usersdashboard');
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      }, 500);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageLogin`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* User Type Toggle */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setUserType("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                userType === "user"
                  ? "bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Individual</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("business")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
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
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="example@example.com" 
                className="mt-1" 
                required
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link href="/forgot-password" className="text-sm underline font-medium">
                  Forgot password?
                </Link>
              </span>
              <Input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                className="mt-1" 
                required
              />
            </label>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <ButtonPrimary 
              type="submit" 
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </ButtonPrimary>
          </form>

          {/* Sign Up Link */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link 
              href="/signup" 
              className="font-semibold underline text-primary-600 dark:text-primary-400"
            >
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
