<img src="https://github.com/user-attachments/assets/532f3dbf-0ce5-49d4-823c-798d41492b19" width="300"/>

# Kotak Bank Auto Transfer

Automates fund transfers using Kotak Bank's netbanking interface with Puppeteer.

## Features

- Logs in to Kotak netbanking
- Fetches OTP from email using Gmail API
- Initiates fund transfer to a specified beneficiary

## Prerequisites

- [Bun.sh](https://bun.sh/)
- Puppeteer
- Gmail API

## Setup

1. Clone the repository

```bash
git clone https://github.com/neo773/kotak-bank-auto-transfer.git
```

2. Install dependencies

```bash
bun install
```

3. Set up the Gmail API

   Create credentials in Google Cloud Console:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a project.
   - Navigate to "API & Services" > "Dashboard" > "Enable APIs and Services".
   - Search for "Gmail API" and enable it.
   - Create credentials (OAuth client ID) and download the JSON file.

4. Set up environment variables

- Copy `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REDIRECT_URI` from the downloaded JSON file to `.env`

```bash
cp .env.example .env
```

5. Generate Gmail API access token

```bash
bun ./src/login.ts
```

Follow the instructions to complete the login process.

Copy the `refresh token` from url query params (?code=XXX) and paste it in the terminal.

paste the `refresh token` in the `.env` file.

## Usage

```bash
bun ./src/index.ts -r <beneficiary_nickname> -a <amount>
```

<img width="981" alt="image" src="https://github.com/user-attachments/assets/d09dec07-52b3-4d66-94e9-4bc268c58e3f">

## License

MIT

> [!WARNING]
> This project is for educational purposes only. Use responsibly and ensure compliance with Kotak Bank's terms of service. The author claims no liability for any misuse or consequences. This code is posted under fair use for educational and research purposes.
