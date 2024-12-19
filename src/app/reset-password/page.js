"use client";

import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // ShadCN Card component
import { Alert, AlertDescription } from "@/components/ui/alert"; // ShadCN Alert component
import { CheckCircle2 } from "lucide-react"; // Icon library (ShadCN uses Lucide icons)

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email, {
        url:
          process.env.NEXT_PUBLIC_ENV === "production"
            ? "https://jack-robertson.co.uk"
            : "http://localhost:3000",
        handleCodeInApp: true,
      });
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Send Password Reset Email
            </Button>
          </form>
          {message && (
            <Alert
              variant="success"
              className="mt-4 flex items-center gap-3 border-l-4 border-green-500 bg-green-50"
            >
              <CheckCircle2 className="w-6 h-6 pr-2 text-green-500 animate-pulse" />
              <AlertDescription className="text-green-800 font-semibold">
                {message}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="error" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;