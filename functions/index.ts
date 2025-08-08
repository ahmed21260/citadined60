
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe with the secret key from an environment variable.
// This secret is made available by the 'secrets' option in the function definition below.
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2025-07-30.basil",
});

/**
 * Creates a Stripe Payment Intent.
 * This function is callable directly from the client application.
 * It's defined to run with the STRIPE_SECRET secret made available as an environment variable.
 */
export const createPaymentIntent = onCall(
  { secrets: ["STRIPE_SECRET"] },
  async (request) => {
    // 1. Authentication Check
    // Ensure the user is authenticated before processing.
    if (!request.auth) {
      logger.error("Authentication Error: User is not authenticated.");
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const { amount, user } = request.data;
    const uid = request.auth.uid;

    // 2. Data Validation
    if (!amount || amount <= 0 || !user) {
      logger.error("Invalid data received:", { amount, user });
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with a valid 'amount' and 'user' object."
      );
    }
    
    logger.info(`Starting payment intent creation for user ${uid} for amount ${amount}€`);

    try {
      // 3. Get or Create Stripe Customer
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        logger.info(`No Stripe customer ID for user ${uid}. Creating a new one.`);
        const customer = await stripe.customers.create({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          metadata: { firebaseUID: uid },
        });
        customerId = customer.id;
        
        // Update user's profile in Firestore with the new Stripe Customer ID
        const userRef = db.collection("users").doc(uid);
        await userRef.update({ stripeCustomerId: customerId });
        logger.info(`Created and saved new Stripe customer ID ${customerId} for user ${uid}.`);
      } else {
         logger.info(`Using existing Stripe customer ID ${customerId} for user ${uid}.`);
      }

      // 4. Create a Stripe Payment Intent
      // This object represents the transaction.
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Amount in cents
        currency: "eur",
        customer: customerId,
        // This is key for the caution system. It allows you to reuse the payment method later.
        setup_future_usage: "on_session",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info(`Successfully created Payment Intent ${paymentIntent.id} for customer ${customerId}.`);

      // 5. Return the client_secret to the frontend
      // The client_secret is a temporary key that allows the frontend to securely confirm the payment.
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        customerId: customerId,
      };
    } catch (error) {
      logger.error("Stripe Error:", error);
      throw new HttpsError(
        "internal",
        "An error occurred while creating the payment intent."
      );
    }
  }
);
