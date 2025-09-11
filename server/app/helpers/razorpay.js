const env = require("dotenv");
const Razorpay = require("razorpay");
env.config({
  path: ".env",
});

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    headers: {
      "X-Razorpay-Account": process.env.MERCHANT_ACCOUNT_ID,
    },
  });
} else {
  console.warn("Razorpay environment variables not set. Payment features will be disabled.");
}

module.exports = razorpay;
