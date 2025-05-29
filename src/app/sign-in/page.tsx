"use client";

import { useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const actionCodeSettings = {
  url: typeof window !== "undefined" ? window.location.origin : "",
  handleCodeInApp: true,
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const parseFirebaseError = (errorMessage: string) => {
    if (!errorMessage) return null;

    if (errorMessage.includes("auth/popup-closed-by-user")) {
      return null;
    }
    if (errorMessage.includes("auth/quota-exceeded")) {
      return "You have exceeded daily quota for email sign in. Try again later.";
    }
    if (errorMessage.includes("auth/invalid-email")) {
      return "Please enter a valid email address.";
    }
    if (errorMessage.includes("auth/missing-email")) {
      return "Please enter an email address.";
    }
    if (errorMessage.includes("auth/user-not-found")) {
      return "No user found with this email address.";
    }
    if (errorMessage.includes("auth/network-request-failed")) {
      return "Network error. Please check your internet connection.";
    }
    return errorMessage;
  };

  const handleSendLink = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setLinkSent(true);
      setError(null);
    } catch (err: any) {
      const friendlyMessage = parseFirebaseError(err.message);
      if (friendlyMessage) setError(friendlyMessage);
      else setError(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
      setError(null);
    } catch (err: any) {
      const friendlyMessage = parseFirebaseError(err.message);
      if (friendlyMessage) setError(friendlyMessage);
      else setError(null);
    }
  };

  return (
    <div className="min-h-screen px-5 flex flex-col items-center pt-30">
      <h1 className="text-3xl font-bold mb-15">SanGig</h1>
      <p className="text-gray-500 w-full max-w-md text-center">
        Sign in to discover jobs and gigs, message employers directly, post
        jobs, hire talent, and more.
      </p>

      {!linkSent && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-3 py-2 w-full max-w-md text-lg font-base my-2 focus:outline-none focus:border-[#50C878]"
          />
          {error && (
            <div className="w-full max-w-md">
              <p className="text-base text-red-600 text-left">{error}</p>
            </div>
          )}
          <button
            onClick={handleSendLink}
            className="w-full mt-2 max-w-md bg-[#50C878] text-white py-2 rounded-lg font-semibold text-lg hover:bg-[#3fa963] transition cursor-pointer"
          >
            Continue
          </button>

          <div className="flex items-center w-full max-w-md my-3 text-gray-500 font-medium">
            <div className="flex-grow border-t-2 border-gray-300" />
            <span className="mx-3">or</span>
            <div className="flex-grow border-t-2 border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="relative flex items-center justify-center w-full max-w-md py-2 px-4 mb-4 border-2 border-gray-300 rounded-lg bg-white text-lg font-semibold transition hover:bg-[#e8f8f1] hover:border-[#50C878] cursor-pointer"
          >
            <div className="absolute left-4 w-5 h-5 min-w-[20px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-full h-full"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
            </div>
            <span className="ml-8">Continue with Google</span>
          </button>
          <div className="w-full max-w-md text-sm text-gray-600">
            <p>
              By creating an account or signing in, you understand and agree to
              SanGig's Terms. You also acknowledge our Cookie and Privacy
              policies.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
