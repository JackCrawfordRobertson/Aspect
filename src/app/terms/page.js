"use client";

import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"; // ShadCN Card component

const Terms = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Card className="max-w-4xl w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="text-xl font-semibold">1. Introduction</h2>
                    <p>
                        Welcome to Aspect. By accessing or using our application, you agree to comply with these terms.
                        If you do not agree, you must not use our services.
                    </p>

                    <h2 className="text-xl font-semibold">2. User Responsibilities</h2>
                    <p>
                        Users must use the application responsibly and not engage in unlawful or prohibited activities,
                        including violating intellectual property rights.
                    </p>

                    <h2 className="text-xl font-semibold">3. Modifications</h2>
                    <p>
                        We reserve the right to update or change these terms at any time. Continued use of the service
                        signifies acceptance of the modified terms.
                    </p>

                    <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
                    <p>
                        We are not responsible for any damages or losses resulting from the use of our services, except
                        as required by law.
                    </p>

                    <h2 className="text-xl font-semibold">5. Contact Us</h2>
                    <p>
                        If you have questions regarding these terms, please contact us at
                        <a
                            href="mailto:jack@ya-ya.co.uk
"
                            className="text-primary hover:underline"
                        >
                            {" "}
                            jack@ya-ya.co.uk
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Terms;
