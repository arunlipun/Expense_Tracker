// import api from "./axios";

// /**
//  * STEP 1: Create Razorpay Order
//  * Backend: PaymentService.createOrder(...)
//  */
// export const createOrder = (planType) => {
//   return api.post("/payment/create-order", {
//     planType: planType
//   });
// };


// /**
//  * STEP 2: Verify Payment after Razorpay success
//  * Backend: PaymentVerificationService + SubscriptionService
//  */
// export const verifyPayment = (data) => {
//   return api.post("/payment/verify", {
//     orderId: data.orderId,
//     paymentId: data.paymentId,
//     signature: data.signature,
//     planType: data.planType,
//     userId: data.userId
//   });
// };



import api from "./axios";

/**
 * STEP 1: Create Razorpay Order
 */
export const createOrder = (planType) => {
  return api.post("/payment/create-order", { // ✅ baseURL already has /api/v1
    planType: planType
  });
};

/**
 * STEP 2: Verify Payment after Razorpay success
 */
// export const verifyPayment = (data) => {
//   return api.post("/payment/verify", {        // ✅ baseURL already has /api/v1
//     orderId: data.orderId,
//     paymentId: data.paymentId,
//     signature: data.signature,
//     planType: data.planType,
//     userId: data.userId,
//     amount: data.amount,                      // ✅ amount added
//   });
// };

export const verifyPayment = (data) => {
  console.log("VERIFY API CALLED");
 console.log("VERIFY API FUNCTION HIT");
  console.log(data);

  console.log("Sending Verify Request:", data);

  return api.post("/payment/verify", {
    
    orderId: data.orderId,
    paymentId: data.paymentId,
    signature: data.signature,
    planType: data.planType,
    userId: data.userId,
    amount: data.amount
  });

};