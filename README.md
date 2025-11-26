# IoT-Trade

A decentralized marketplace for IoT device data built on the Somnia blockchain. IoT-Trade allows device owners to monetize their sensor data by selling subscriptions to interested buyers, while providing subscribers with access to real-time data streams from GPS trackers, weather stations, and air quality monitors.

## What is IoT-Trade?

Think of IoT-Trade as the "Airbnb for IoT data." If you own an IoT device—whether it's a GPS tracker monitoring vehicle fleets, a weather station in your backyard, or an air quality sensor in your office—you can register it on the platform and start selling access to its data stream. Buyers can browse available devices, purchase subscriptions, and access real-time data feeds directly through the platform.

Everything is stored and verified on the Somnia blockchain, ensuring data authenticity, transparent payments, and decentralized ownership without requiring a traditional backend server.

## Who is This For?

### Device Owners

Perfect for individuals, businesses, or organizations that:

- Own IoT sensors or devices collecting environmental, location, or telemetry data
- Want to monetize unused sensor data streams
- Operate weather monitoring stations, air quality sensors, or GPS tracking systems
- Seek a decentralized, trustless way to sell data subscriptions
- Want full control over pricing and device availability

**Example Use Cases:**
- A shipping company with GPS trackers on vehicles can sell location data to logistics analytics companies
- Homeowners with weather stations can offer hyperlocal weather data to gardening apps or agricultural services
- Office buildings with air quality monitors can provide environmental data to health and wellness platforms
- Researchers with sensor networks can monetize their data collection efforts

### Data Subscribers

Ideal for developers, researchers, and businesses that need:

- Real-time IoT data for applications, dashboards, or analytics
- Verified, authentic sensor data from trusted sources
- Access to diverse data sources without setting up their own sensors
- Blockchain-verified data provenance for compliance or auditing
- Transparent, pay-per-access pricing models

**Example Use Cases:**
- Weather app developers needing hyperlocal weather data from residential stations
- Supply chain analytics companies requiring GPS tracking data from vehicle fleets
- Environmental researchers studying air quality patterns across different locations
- Smart city projects needing distributed sensor data from community contributors
- Agricultural technology platforms requiring field-level weather and environmental data

## Key Features

### For Device Owners

- **Device Registration**: Register GPS trackers, weather stations, or air quality monitors with metadata stored on-chain. Each device gets a unique blockchain address and is automatically discoverable in the marketplace.

- **Data Publishing**: Publish sensor data directly to Somnia blockchain using the Data Streams SDK. No backend infrastructure needed—just connect your device and start streaming.

- **Marketplace Listing**: Your devices automatically appear in the marketplace for potential subscribers. Set your own pricing, device availability, and subscription duration.

- **Revenue Generation**: Set your own price per data point and earn cryptocurrency directly from subscribers. Payments are processed automatically via smart contracts, with funds sent directly to your wallet.

- **Device Management**: Pause or resume devices, update settings, and monitor performance through an intuitive dashboard. Control when your devices are available for subscription.

- **Real-time Analytics**: View device metrics including uptime, update frequency, subscription counts, and earnings. Track how your data is being consumed.

### For Subscribers

- **Device Discovery**: Browse active IoT devices filtered by type, location, and quality metrics. See device uptime, update frequency, and recent data samples before subscribing.

- **Live Data Streams**: Access real-time data feeds with interactive charts, maps, and tables. Data updates automatically as devices publish new readings.

- **Subscription Management**: Purchase access to devices with transparent, blockchain-verified subscriptions. Multiple purchases extend your access period automatically.

- **Flexible Viewing**: Switch between chart view for time-series data, map view for GPS trackers, and table view for detailed records. View historical data points and export data for analysis.

- **Historical Data**: Access recent data points to evaluate device quality before subscribing. Preview functionality lets you sample data before committing to a purchase.

### Platform Features

- **Blockchain Verification**: All device registrations and data are cryptographically verified on-chain. Data provenance is guaranteed, with each data point linked to its publisher address.

- **Decentralized Marketplace**: No central server—everything runs on Somnia blockchain. Devices, subscriptions, and payments are all managed through smart contracts.

- **Wallet Integration**: Connect with Web3 wallets like MetaMask to interact with the platform. All transactions are executed directly from your wallet.

- **Real-time Updates**: Data streams update automatically as devices publish new readings. Subscribers see new data as soon as it's published to the blockchain.

- **Access Control**: Subscription status is verified on-chain, ensuring only paying subscribers can access data. Access expiry is checked automatically for each data request.

## Architecture Overview

IoT-Trade consists of three main components working together:

### 1. Frontend (Next.js Application)

A modern web application built with Next.js 16 and React 19 that provides the user interface for both device owners and subscribers. The frontend handles wallet connections, device registration, marketplace browsing, subscription purchases, and real-time data visualization.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Wagmi & Viem for Ethereum interactions
- Recharts for data visualization
- Somnia Data Streams SDK

### 2. Smart Contracts (DeviceRegistry)

A Solidity smart contract deployed on Somnia Testnet that serves as the on-chain registry for all devices. The contract handles device registration with metadata, subscription purchases and access management, payment processing (native tokens sent directly to device owners), device status toggling, and access expiry tracking for subscriptions.

**Location:** `smartcontract/contracts/DeviceRegistry.sol`

### 3. Somnia Data Streams

The underlying blockchain infrastructure for storing and retrieving IoT data. Somnia provides on-chain data storage for sensor readings, schema-based data encoding/decoding, data provenance (each data point linked to publisher address), and efficient querying by publisher, schema, and data ID.

**Supported Device Types:**
- **GPS Trackers**: Latitude, longitude, altitude, speed, heading
- **Weather Stations**: Temperature, humidity, pressure, wind speed/direction, rainfall
- **Air Quality Monitors**: PM2.5, PM10, CO2, NO2, O3, AQI

## How It Works

### Device Registration Flow

1. **Owner Connects Wallet**: Device owner connects their Web3 wallet to the platform
2. **Enter Device Details**: Fill out device information (name, type, location, pricing)
3. **Generate Device Address**: System generates a unique Ethereum address for the device
4. **Register on Blockchain**: Device metadata is stored in the DeviceRegistry smart contract and also published to Somnia Data Streams
5. **Device Appears in Marketplace**: Once registered, the device is discoverable by subscribers

### Data Publishing Flow

1. **Device Owner Publishes Data**: Using the dashboard, owner publishes sensor readings
2. **Data Encoded with Schema**: Data is encoded according to device type schema (GPS, Weather, Air Quality)
3. **Published to Somnia Blockchain**: Data stored on-chain with publisher address and timestamp
4. **Subscribers Receive Updates**: Active subscribers can read the latest data in real-time

### Subscription Flow

1. **Browse Marketplace**: Subscriber discovers devices they want to subscribe to
2. **Preview Device**: View device details, location, pricing, and recent data samples
3. **Purchase Access**: Click "Subscribe" and approve the blockchain transaction
4. **Payment Processed**: Native tokens sent directly to device owner via smart contract
5. **Access Granted**: Subscription expiry stored on-chain, granting access to device stream
6. **View Live Data**: Subscriber can now access the full data stream with charts, maps, and tables

### Access Control

When a subscriber tries to view device data:

1. Frontend queries the DeviceRegistry contract for subscription expiry
2. If expiry is in the future, access is granted
3. Data is fetched from Somnia Data Streams using the device's publisher address
4. If subscription expired or doesn't exist, access is denied

## Project Structure

```
IoT-Trade/
├── frontend/                    # Next.js web application
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   │   ├── dashboard/      # Device owner dashboard
│   │   │   ├── marketplace/    # Browse available devices
│   │   │   ├── device/[id]/    # Device preview & subscribe
│   │   │   ├── stream/[id]/    # Live data stream viewer
│   │   │   ├── register/       # Register new device
│   │   │   └── subscription/   # Manage subscriptions
│   │   ├── components/         # React components
│   │   ├── services/           # Business logic services
│   │   │   ├── deviceService.ts      # Device operations
│   │   │   ├── registryService.ts    # Smart contract interactions
│   │   │   ├── subscriptionService.ts # Subscription management
│   │   │   └── deviceRegistry.ts     # Device discovery
│   │   ├── lib/                # Utilities and helpers
│   │   │   ├── somnia.ts       # Somnia SDK wrapper
│   │   │   ├── schemas.ts      # Data schemas
│   │   │   └── types.ts        # TypeScript types
│   │   └── context/            # React context providers
│
├── smartcontract/              # Hardhat smart contract project
│   ├── contracts/
│   │   └── DeviceRegistry.sol  # Main registry contract
│   ├── test/                   # Contract tests
│   └── scripts/                # Deployment scripts
│
└── README.md                   # This file
```

## Key Concepts

### Device Types

IoT-Trade supports three device types, each with a specific data schema:

1. **GPS Tracker**: Tracks location data including latitude, longitude, altitude, speed, and heading. Perfect for vehicle tracking, asset monitoring, or location-based services.

2. **Weather Station**: Monitors weather conditions including temperature, humidity, barometric pressure, wind speed, wind direction, and rainfall. Ideal for hyperlocal weather data, agricultural monitoring, or environmental research.

3. **Air Quality Monitor**: Measures air quality metrics including PM2.5, PM10, CO2, NO2, O3, and overall AQI. Useful for environmental monitoring, health applications, or air quality research.

### Data Schemas

Each device type uses a predefined schema for encoding/decoding data. Schemas ensure data consistency and enable efficient storage on the blockchain. All schemas are defined in the frontend codebase and enforced when publishing data.

### Subscription Model

- **Price per Data Point**: Device owners set a price (in native tokens) that subscribers pay for access
- **Subscription Duration**: Each purchase grants access for a fixed duration (set during device registration)
- **Auto-Extension**: Multiple purchases extend the subscription period from the current expiry date
- **Direct Payment**: Payments are sent directly from subscriber to device owner via the smart contract—no intermediaries

### Device Status

Devices can be in two states:

- **Active**: Device is accepting subscriptions and publishing data. Appears in marketplace and available for subscription.
- **Inactive/Paused**: Device is temporarily disabled, not accepting new subscriptions but existing subscribers retain access until their subscription expires.

## Use Cases

### Smart City Initiatives

City governments or urban planners can aggregate data from distributed IoT sensors owned by residents and businesses. Homeowners with weather stations or air quality monitors can contribute data to city-wide environmental monitoring systems, receiving payment for their contributions.

### Supply Chain Analytics

Logistics companies can monetize GPS tracking data from their vehicle fleets. Analytics companies can subscribe to multiple fleet data streams to build comprehensive supply chain visibility dashboards without deploying their own tracking infrastructure.

### Environmental Research

Researchers studying climate patterns or air quality can access data from distributed sensor networks. Individual sensor owners can contribute to scientific research while monetizing their data collection efforts.

### Agricultural Technology

Farmers with field-level sensors can sell environmental and weather data to agricultural technology platforms. These platforms can aggregate data from multiple farms to provide regional insights for crop management, irrigation optimization, or pest prediction.

### Real Estate & Property Management

Building managers with IoT sensors monitoring air quality, temperature, or occupancy can provide data to property valuation services, health and wellness platforms, or smart building automation systems.

### Weather Forecasting

Hyperlocal weather data from residential weather stations can supplement official weather services. Weather apps can offer neighborhood-level forecasts by aggregating data from distributed weather stations.

## Roadmap

### Completed Features ✅

- Device registration on blockchain (both smart contract and data streams)
- Data publishing to Somnia streams for all device types
- Device discovery and marketplace browsing
- Owner dashboard with device management capabilities
- Subscription purchases with on-chain payments
- Real-time data streaming and visualization
- Device pause/play functionality
- Subscription loading from blockchain

### Upcoming Features 🚧

- Access control enforcement (block unauthorized data access at the API level)
- Revenue tracking dashboard for device owners
- Subscription renewal reminders and auto-renewal options
- Advanced filtering and search in marketplace
- Device analytics and performance metrics dashboard
- Multi-chain support for broader blockchain ecosystem
- Mobile application for device owners and subscribers

See [INTEGRATION_ROADMAP.md](./INTEGRATION_ROADMAP.md) for detailed progress and implementation status.

## Technology Stack

**Frontend:**
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS for styling
- Wagmi & Viem for blockchain interactions
- Recharts for data visualization
- Radix UI components
- Somnia Data Streams SDK

**Smart Contracts:**
- Solidity 0.8.28
- Hardhat development environment
- Viem for contract interactions
- Deployed on Somnia Testnet (Chain ID: 50312)

**Blockchain Infrastructure:**
- Somnia Network
- Somnia Data Streams for on-chain data storage
- Ethereum-compatible wallet support

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Somnia Network** for providing the blockchain infrastructure and Data Streams SDK
- **Next.js** team for the excellent React framework
- **Hardhat** for the smart contract development tools
- All contributors and early testers of the platform

---

**Built with ❤️ on the Somnia blockchain**
