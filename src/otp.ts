import { readClipboard } from "./clipboard";
import { fetchLatestOTPEmail } from "./email";

const getOTP = async (method: "clipboard" | "email"): Promise<string> => {
  if (method === "clipboard") {
    console.log("🔐 Attempting to read OTP from clipboard...");
    return await readClipboard();
  } else {
    console.log("🔐 Fetching OTP from email...");
    const latestOTPEmail = await fetchLatestOTPEmail();
    const otp = latestOTPEmail?.snippet?.match(/\b\d{6}\b/)?.[0];
    if (!otp) throw new Error("Failed to extract OTP from email");
    return otp;
  }
};

export { getOTP };
