import puppeteer from "puppeteer";
import { clickElementWithText } from "./utils";
import { parse } from "ts-command-line-args";
import { getOTP } from "./otp";

const args = parse<{
  amount: number;
  receiver: string;
  otpMethod: 'clipboard' | 'email';
}>({
  receiver: {
    type: String,
    alias: "r",
    description: "beneficiary nick name",
  },
  amount: {
    type: Number,
    alias: "a",
    description: "amount to transfer in rupees",
  },
  otpMethod: {
    type: String as () => 'clipboard' | 'email',
    alias: "o",
    description: "OTP method: 'clipboard' or 'email'",
    defaultValue: 'clipboard' as 'clipboard' | 'email'
  }
});

const { amount: AMOUNT, receiver: RECEIVER, otpMethod: OTP_METHOD } = args;
const { KOTAK_CRN, KOTAK_PASSWORD } = process.env;

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto("https://netbanking.kotak.com/knb2/", {
  timeout: 120000,
});

console.log(`🚀 Starting transfer of ₹${AMOUNT} to ${RECEIVER}`);

console.log("🔐 Logging in...");

await page.waitForSelector("#userName");
await page.type("#userName", KOTAK_CRN!);

await page.waitForSelector("#credentialInputField");
await page.type("#credentialInputField", KOTAK_PASSWORD!);

await page.waitForSelector('button[type="submit"]:not(:disabled)');

await page.evaluate(() => {
  const button = document.querySelector('button[type="submit"]');
  if (button instanceof HTMLElement) {
    button.click();
  }
});

const otp = await getOTP(OTP_METHOD);
console.log("🔐 OTP obtained");

await page.waitForSelector("#otpMobile");
await page.type("#otpMobile", otp);

console.log("🔐 OTP entered");

await clickElementWithText(page, "button", "Secure login");

await clickElementWithText(page, ".nav-item", "fund transfer");

await clickElementWithText(page, ".fav-name", RECEIVER);

await page.waitForSelector('label[for="payNow"]');

await page.evaluate(() => {
  const label = document.querySelector('label[for="payNow"]') as HTMLElement;
  label.click();
});

await page.waitForFunction(() => {
  const payNowRadio = document.querySelector("#payNow");
  return payNowRadio instanceof HTMLInputElement && payNowRadio.checked;
});

await page.waitForSelector("#amountInput");

await page.type("#amountInput", AMOUNT.toString());

await clickElementWithText(page, "button", "proceed");

await page.waitForNavigation();

await clickElementWithText(page, "button", "confirm");

console.log(`💸 Confirmed transfer of ₹${AMOUNT} to ${RECEIVER}`);

await new Promise((resolve) => setTimeout(resolve, 1000));

await browser.close();

process.exit(0);
