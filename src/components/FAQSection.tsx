"use client";

import React, { FC, useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is Mzansi Services™?",
        answer: "Mzansi Services is an online marketplace for specialised traders to BUY and SELL products and services and BID for new business opportunities to increase your revenue."
    },
    {
        question: "Who owns Mzansi Services™?",
        answer: "By Solidcare Services (Pty) Ltd"
    },
    {
        question: "How does it work?",
        answer: "Business owners can set up their own eCommerce storefront to sell their services and products to consumers and other businesses. Consumers can find business in their area, request a quotation and book an appointment for the services. You can also chat with the business owners."
    },
    {
        question: "What is selling services on Mzansi Services™?",
        answer: "With Selling Services on Mzansi Services, you can list the services you offer, define these services, add call-out and labour fees. All of this is to assist the consumer to make an informed decision when choosing your offering."
    },
    {
        question: "How do I get a quotation?",
        answer: "When a customer visits your service page and storefront, they can request a quote and it will be sent directly to you to respond to them. You can also use our in-App chat functionality to chat with your clients."
    },
    {
        question: "When I sign up, am I locked in for a while?",
        answer: "There is no set time commitment to sell your services. You can walk away at any time. Refer to our terms and conditions."
    },
    {
        question: "Does my premium listing rank my business high?",
        answer: "There are many businesses listed on Mzansi Services™ with premium listings, therefore, we do not guarantee your business will rank high."
    },
    {
        question: "Do I get charged for requesting a quote on the platform?",
        answer: "Requesting a quote is free on the Mzansi Services™ platform. However, some service providers do charge a service or call-out fee, so as a consumer, you need to ask the prospective service provider about their policy."
    },
    {
        question: "How do service providers accept payments?",
        answer: "Payment options may be handled differently from business to business. As a consumer you need to ask the service provider about their payment solution."
    },
    {
        question: "How do I know that my quote request has been received?",
        answer: "You'll receive a notification in your Mzansi Services™ Chat confirming that the vendor has seen your request. Then an interested vendor will contact you to discuss the details of your request."
    },
    {
        question: "How do I cancel my quote request?",
        answer: "Once you have submitted the quote request the vendor will be notified. You can let the vendor know of your wish to cancel the request via the Mzansi Services™ Chat."
    },
    {
        question: "How do I know the vendors are trustworthy?",
        answer: "We cannot guarantee or be held liable for any misfortunes. Mzansi Services™ businesses are verified either by their registration number or national ID. Verified businesses have a blue tick next to their logo. Also, please refer to the store reviews for better dealing with the business."
    },
    {
        question: "How much does it cost to register on Mzansi Services™?",
        answer: "There are various advertising solutions available at Mzansi Services™ at a fairly reasonable cost. Click here to learn more."
    },
    {
        question: "Is it possible to pay once-off annually versus monthly?",
        answer: "Yes, arrangements can be made and the payment options are available on the Mzansi Services™ platform. The once-off annual payment would grant you eligibility for a discount."
    }
    {
        question: "Are there more payment options?",
        answer: "You can use your conventional VISA bank card, Mastercard, or local payment methods. We also accept EFT and direct deposits."
    },
    {
        question: "What happens when the vendors are unresponsive?",
        answer: "You will need to follow up with the vendor by calling or contacting Namibia Services™ support for assistance via email: support@namibiaservices.com"
    },
    {
        question: "If I see a business listing that I think is spam, offensive or illegal, what do I do?",
        answer: "You are welcome to report that listing to us by sending an email to: support@namibiaservices.com"
    }
];

export interface FAQSectionProps {
    className?: string;
}

const FAQSection: FC<FAQSectionProps> = ({ className = "" }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`nc-FAQSection ${className}`}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="font-bold text-4xl md:text-5xl mb-4">
                        Mzansi Services™
                        <br />
                        <span className="text-burgundy-600">Frequently Asked Questions</span>
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                        Find answers to common questions about our platform
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:border-burgundy-600 hover:shadow-lg"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200"
                                >
                                    <span className="font-semibold text-lg text-neutral-900 dark:text-white pr-4">
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full bg-burgundy-600 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                    >
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"
                                        }`}
                                >
                                    <div className="px-6 pb-5 pt-2">
                                        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700 mb-4"></div>
                                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-12 text-center p-8 bg-gradient-to-r from-burgundy-50 to-burgundy-100 rounded-2xl border-2 border-burgundy-200">
                    <h3 className="font-semibold text-2xl mb-3">Still have questions?</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Can't find the answer you're looking for? Please reach out to our friendly team.
                    </p>
                    <a
                        href="mailto:support@bwservices.com"
                        className="inline-flex items-center gap-2 bg-burgundy-600 hover:bg-burgundy-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
