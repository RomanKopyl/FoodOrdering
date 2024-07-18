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
  const { paymentIntent, publishableKey } = await fetchPaymentSheetParams(amount);

  if (!publishableKey || !paymentIntent) return;

  const { error } = await initPaymentSheet({
    merchantDisplayName: 'RomanK inc.',
    paymentIntentClientSecret: paymentIntent,
    defaultBillingDetails: {
      name: 'Іван Іваненко',
    },
  });
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    Alert.alert(error.message);
    return false;
  }
  return true;
};