import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const fetchLatestOTPEmail = async () => {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  let latestMessage = null;

  while (!latestMessage) {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "subject:otp is:unread",
      maxResults: 20,
    });

    console.log(
      `💬 Found ${response.data.messages?.length || 0} unread messages`,
    );

    if (response.data.messages && response.data.messages.length > 0) {
      // Fetch full details for all messages
      const messages = await Promise.all(
        response.data.messages.map((msg) =>
          gmail.users.messages.get({ userId: "me", id: msg.id! }),
        ),
      );

      // Sort messages by internalDate in descending order
      const sortedMessages = messages
        .map((m) => m.data)
        .sort((a, b) => Number(b.internalDate) - Number(a.internalDate));

      const newestMessage = sortedMessages[0];
      const receivedTime = parseInt(newestMessage.internalDate!, 10);
      const currentTime = Date.now();
      const timeDifference = (currentTime - receivedTime) / 1000; // in seconds

      if (timeDifference <= 60) {
        // OTP received within last 1 minute
        latestMessage = newestMessage;
        console.log(`💬 Found latest message with id: ${latestMessage.id}`);

        // Mark the message as read
        await gmail.users.messages.modify({
          userId: "me",
          id: latestMessage.id!,
          requestBody: {
            removeLabelIds: ["UNREAD"],
          },
        });
      } else {
        console.log("💬 Latest unread message too old, waiting for new OTP...");
      }
    }

    if (!latestMessage) {
      console.log("💬 No new unread messages found, waiting 3 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  return latestMessage;
};

export { fetchLatestOTPEmail };
