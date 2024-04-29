# Open Tribe Backend

This guide will help you set up and run the required smart contracts for the Open Tribe platform.

## Developer Guide

### Getting Started

#### Install Dependencies

First, ensure that you have Node.js installed. Then, install the required packages using npm:

```bash
npm install
```

#### Create an Environment File

To run the application locally, you will need to set several environment variables. Start by copying the provided example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file to include the following keys:

- `PRIVATE_KEY`: Your wallet's private key.
- `EXPLORER_API_KEY`: Your API Key for accessing Etherscan services.
- `INITIAL_OWNER_ADDRESS`: The address that will initially own all OTTO tokens.
- `CHAINLINK_PROXY_ADDRESS`: The address of the Chainlink proxy contract used for fetching price feeds data. Refer to the [Chainlink documentation](https://docs.chain.link/data-feeds/price-feeds/addresses?network=scroll&page=1) for more details.

### Build and Deployment

#### Compile the Contracts

Compile the smart contracts using Hardhat:

```bash
npx hardhat compile
```

This command prepares all the necessary contract artifacts for deployment.

#### Deploy the Contracts

Deploy the contracts to the Scrollsepolia network by running:

```bash
npx hardhat run scripts/deploy.js --network scrollsepolia
```

After deployment, the addresses of the newly deployed contracts will be output in the logs. These addresses are necessary for configuring the frontend (FE) components.

Thank you for your involvement in developing Open Tribe!
