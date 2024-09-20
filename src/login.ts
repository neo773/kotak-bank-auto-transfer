import { OAuth2Client } from "google-auth-library";
import readline from "readline";

const oauth2Client = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getAccessToken = async () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
    ],
  });

  console.log("Authorize this app by visiting this url:", authUrl);

  return new Promise<string>((resolve) => {
    rl.question("Enter the authorization code: ", (authCode) => {
      resolve(authCode);
    });
  });
};

const getCredentials = async (authCode: string) => {
  const { tokens } = await oauth2Client.getToken(authCode);
  oauth2Client.setCredentials(tokens);
  console.log("Refresh Token:", tokens.refresh_token);
  rl.close();
};

(async () => {
  const authCode = await getAccessToken();
  await getCredentials(authCode);
})();
