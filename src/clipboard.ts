import clipboardy from "clipboardy";

const readClipboard = async (): Promise<string> => {
  let clipboard = await clipboardy.read();
  let retries = 0;
  while (isNaN(Number(clipboard)) && retries < 3) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clipboard = await clipboardy.read();
    retries++;
  }
  if (retries === 3 && isNaN(Number(clipboard))) {
    throw new Error("Failed to get valid OTP from clipboard after 3 retries");
  }
  return clipboard.trim();
};

export { readClipboard };
