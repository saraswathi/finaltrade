# Final Trade - Prototype

Final Trade is a competitive, blockchain-based game where two species tokens ($3TOED 🦋 and $MNRCH 🦥) battle for dominance, with power and success determined by real-time market activity.

This prototype simulates the gameplay experience with a fully functional frontend that allows you to test and visualize the market-driven game mechanics.

## Features

- Real-time battle visualization between the two species tokens
- Market simulation with buy/sell actions affecting game dynamics
- Progress tracking toward $1M market cap victory condition
- Battle log showing game events based on market activity
- Cyberpunk-styled UI with neon elements and animation effects

## Project Structure

```
final-trade-prototype/
├── README.md
├── package.json
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       └── animations/
└── src/
    ├── contexts/
    │   ├── Web3Context.js
    │   └── GameContext.js
    ├── components/
    │   ├── common/
    │   ├── battle/
    │   └── market/
    ├── hooks/
    ├── services/
    ├── pages/
    └── styles/

```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/final-trade-prototype.git
cd final-trade-prototype

```

1. Install dependencies

```bash
npm install
# or
yarn install

```

1. Start the development server

```bash
npm start
# or
yarn start

```

1. Open your browser and navigate to `http://localhost:3000`

## Using the Prototype

### Home Page

The home page displays the two competing species tokens with their presale progress. You can:

- Connect your wallet (simulated)
- Read the greypaper for more information
- Select a species to support by clicking the "Play" button

### Battle Arena

The battle arena shows the real-time state of the competition between the two species tokens. Here you can:

- View the market stats for both tokens
- Track progress toward the $1M market cap victory goal
- See the battle log with recent market events
- Execute buy/sell actions to influence the battle

### Simulation Controls

For testing purposes, the prototype includes simulation controls that allow you to:

- Start/stop automatic market simulation
- Adjust simulation speed
- Trigger specific market scenarios

## Development Notes

### Simulation Mode

The prototype operates in a simulated environment:

- Wallet connections are mocked
- Market data is generated and manipulated locally
- All transactions are simulated without actual blockchain interaction

Personas/Wallets: Players start with 0 battle tokens, must buy to influence fights. Personas are:

New Recruit: 1-2 ETH, 50-75 $FINAL
Buff Chaser: 3-4 ETH, 100-149 $FINAL
Market Mover: 5 ETH, 150-200 $FINAL
Whale: 10 ETH, 200-300+ $FINAL


Market Data: Game will mask PEPE/DOGE historical data as 3TOED/MNRCH movements

To test the game mechanics:

1. Start a simulation with the controls at the top of the Battle page
2. Use the Buy/Sell panel to manually influence the game
3. Watch how market actions translate to game events in the battle log



## Future Implementation

To move from prototype to production:

1. Implement actual smart contracts for tokens
2. Connect to a real blockchain network (recommended: Arbitrum)
3. Replace simulated market data with real on-chain events
4. Implement staking mechanics and additional game features

