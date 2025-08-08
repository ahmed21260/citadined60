import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface PaymentFormProps {
    clientSecret: string;
    onPaymentSuccess: (paymentIntentId: string) => void;
    amount: number;
    onProcessingChange: (isProcessing: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, onPaymentSuccess, amount, onProcessingChange }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        onProcessingChange(true);
        setMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is not strictly needed for this SPA flow, but can be a fallback
                return_url: `${window.location.origin}/booking-complete`,
            },
            redirect: 'if_required' // Prevent automatic redirection
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onPaymentSuccess(paymentIntent.id);
        } else {
             setMessage("Payment did not succeed. Please try again.");
        }

        setIsLoading(false);
        onProcessingChange(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-green-600 text-white font-bold py-4 rounded-md mt-6 hover:bg-white hover:text-green-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? (
                         <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                    ) : (
                        `Payer ${amount.toFixed(2)}€`
                    )}
                </span>
            </button>
            
            {message && <div id="payment-message" className="text-red-500 text-xs text-center mt-2">{message}</div>}
        </form>
    );
};

export default PaymentForm;