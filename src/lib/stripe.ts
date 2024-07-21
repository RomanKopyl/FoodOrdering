import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import { Alert } from "react-native";
import { supabase } from "./supabase";

// Payments
const fetchPaymentSheetParams = async (amount: number) => {
  // Create payment session for our customer
  const { data, error } = await supabase.functions.invoke('payment-sheet', {
    body: { amount },
  });

  if (data) {
    return data;
  }

  Alert.alert(`Error: ${error?.message ?? 'no data'}`);
  return {};
};

export const initialisePaymetSheet = async (amount: number) => {
  const {
    paymentIntent,
    publishableKey,
    customer,
    ephemeralKey,
  } = await fetchPaymentSheetParams(amount);

  if (!publishableKey || !paymentIntent) return false;

  const { error } = await initPaymentSheet({
    merchantDisplayName: 'RomanK inc.',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    defaultBillingDetails: {
      name: 'Іван Іваненко',
    },
  });

  return true;
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    Alert.alert(error.message);
    return false;
  }
  return true;
};