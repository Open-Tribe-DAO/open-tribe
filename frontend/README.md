# Open Tribe FE Developer Guide

Follow these detailed instructions to set up and run the project locally for development and testing purposes.

## Prerequisites

Before proceeding, ensure that the smart contracts required by the frontend are already deployed. For guidance on deploying these contracts, refer to the [README.md](https://github.com/Open-Tribe-DAO/open-tribe/blob/main/backend/README.md) in the backend folder.

If you updated the contracts, you should also update the ABI for each contract after compile them. To do so, follow these steps:

1. Find the contracts ABI in `backend/artifacts/contracts`. There should be two folders, one per each contract, inside those folders you should find a json file that represents the contract ABI.
2. Open each contract ABI and copy everything under "abi" keyword. Should be an array of documents.
3. Go to `frontend/src/abi` and open the corresponding ABI file.
4. Paste the data you copied in step 3 under the default const export.
5. Repeat steps 2 to 4 for each updated contract.

## Setup Instructions

### Step 1: Install Project Dependencies

First, navigate to your project directory and install the necessary dependencies:

```bash
npm install
```

This command installs all packages listed in the `package.json` file.

### Step 2: Create an `.env.local` File

To configure your local environment, create an `.env.local` file by copying the example provided:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file to set the following required environment variables:

- `DATABASE_URL`: MySQL database connection string.
- `NEXTAUTH_SECRET`: Secret key for NextAuth to secure authentication sessions.
- `NEXTAUTH_URL`: Base URL of your Next.js application for handling auth redirects.
- `NEXT_PUBLIC_COVALENT_API_KEY`: API key for accessing blockchain data via Covalent API.
- `NEXT_PUBLIC_PROJECT_ID`: Identifier linking your deployment to specific configurations.
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`: Client ID for identifying your application to Thirdweb services.
- `NEXT_PUBLIC_THIRDWEB_SECRET_KEY`: Authentication secret for Thirdweb services.
- `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL`: URL endpoint for your Cloudflare Worker.
- `NEXT_PUBLIC_CLOUDFLARE_AUTH_KEY_SECRET`: Authentication secret for Cloudflare services.
- `NEXT_PUBLIC_CLOUDFLARE_R2_URL`: URL for accessing Cloudflare R2 distributed storage.

### Step 3: Update Contract Addresses

Modify the contract addresses to reflect your deployment by editing the following constants in `src/utils/utils.ts`:

- `TOKEN_MINTER_CONTRACT_ADDRESS`: Address of the OpenTribeToken contract.
- `TASK_MANAGER_CONTRACT_ADDRESS`: Address of the TaskManager contract.

### Step 4: Run the Application

Launch the application in development mode:

```bash
npm run dev
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

## Using the Application

### Login

1. Click "Connect Wallet" in the top right corner. Ensure your Metamask wallet is connected to the appropriate network (e.g., Scroll Sepolia).

### Approve Tokens

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Click "Approve Task Manager on Token Minter" to allow the TaskManager contract to access OTTO tokens from your wallet. Follow the prompts to approve the desired token amount.

### Mint tokens to a community leader

To send some OTTO tokens to a community leader, follow these steps

1. Navigate to [http://localhost:3000/get-tokens](http://localhost:3000/get-tokens).
2. Choose the amount of USD dollars you want to send. The app will send this equivalent in OTTO tokens (for POC purposes, 1 OTTO token is equivalent to 1 ETH).
3. Paste the address of the account where to send the OTTO tokens.
4. Click on Get tokens.

**Note**: the app uses Chainlink price feeds to calculate the price of ETH in real time.

### Create a Task

1. Select a community to view its tasks.
2. Click "Create Task" in the menu to open the task creation form. Fill out the form with the following details:
   - `Name`: Name of the task.
   - `Description`: Description of the task requirements.
   - `Task Assignee`: Wallet address of the individual assigned to the task.
   - `Tokens Amount`: Token amount to be awarded upon task completion.
3. Click the "Create" button to submit the task.

### Manage Tasks

1. Select a community and choose a task to view its details.
2. To manage the task, use the "Confirm Task" button to complete it or the "Cancel Task" button to cancel it.
