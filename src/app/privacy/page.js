"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // ShadCN Card component

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="max-w-4xl w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">1. Data Collection</h2>
          <p>
            We collect personal information such as email addresses and usage data to provide and
            improve our services. This data is collected when you sign up, use the application, or
            contact us.
          </p>

          <h2 className="text-xl font-semibold">2. Data Usage</h2>
          <p>
            Your data is used to personalise the user experience, communicate with you, and
            maintain the application's functionality.
          </p>

          <h2 className="text-xl font-semibold">3. Data Sharing</h2>
          <p>
            We do not sell or share your personal data with third parties except when required for
            legal obligations or service providers assisting us.
          </p>

          <h2 className="text-xl font-semibold">4. Data Security</h2>
          <p>
            We employ reasonable measures to protect your data from unauthorised access. However,
            no system is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold">5. Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your personal data. Please contact us
            at
            <a href="mailto:jack@ya-ya.co.uk" className="text-primary hover:underline">
              {" "}
              jack@ya-ya.co.uk
            </a>{" "}
            for assistance.
          </p>

          <h2 className="text-xl font-semibold">6. Changes to Privacy Policy</h2>
          <p>
            We may update this policy periodically. Changes will be communicated via updates to
            this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;