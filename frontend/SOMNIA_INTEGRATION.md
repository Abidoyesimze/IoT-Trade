# Somnia Data Streams Integration

This document describes the integration of Somnia Data Streams SDK into the IoT-Trade project.

## Overview

The IoT-Trade project now uses Somnia Data Streams SDK to interact with the Somnia blockchain for:
- Device registration (on-chain metadata)
- Data publishing (IoT device data streams)
- Data reading (subscribing to device streams)

## Installation

The `@somnia-chain/streams` package has been installed:

```bash
npm install @somnia-chain/streams --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` because there's a version conflict with viem (SDK requires ~2.37.8, project uses ^2.39.0).

## Architecture

### 1. Data Schemas (`src/lib/schemas.ts`)

Three device-specific schemas are defined:
- **GPS Tracker**: `GPS_TRACKER_SCHEMA` - timestamp, latitude, longitude, altitude, accuracy, speed, heading
- **Weather Station**: `WEATHER_STATION_SCHEMA` - timestamp, temperature, humidity, pressure, windSpeed, windDirection, rainfall
- **Air Quality Monitor**: `AIR_QUALITY_MONITOR_SCHEMA` - timestamp, pm25, pm10, co2, no2, o3, aqi
- **Device Metadata**: `DEVICE_METADATA_SCHEMA` - deviceName, deviceType, location, pricePerDataPoint, ownerAddress

### 2. Somnia SDK Service (`src/lib/somnia.ts`)

Core SDK wrapper providing:
- SDK initialization (public and wallet clients)
- Schema encoding/decoding for each device type
- Data publishing and reading functions
- Schema ID computation

### 3. Device Service (`src/services/deviceService.ts`)

High-level service for device operations:
- `registerDevice()` - Register a device on-chain
- `publishGPSData()` - Publish GPS data to stream
- `publishWeatherData()` - Publish weather data to stream
- `publishAirQualityData()` - Publish air quality data to stream
- `readDeviceData()` - Read latest data from device stream
- `readDeviceMetadata()` - Read device metadata from stream

### 4. React Hooks (`src/hooks/useSomnia.ts`)

React hooks for using Somnia SDK:
- `useSomniaSDK()` - Get SDK instance
- `useSomniaReady()` - Check if wallet is connected and ready

## Usage

### Device Registration

1. User connects wallet
2. User enters device serial number (generates device address)
3. User fills device details (name, type, location, price)
4. Device is registered on-chain via `registerDevice()`
5. Transaction hash is returned and displayed
6. Device is added to local state

```typescript
const result = await registerDevice(
  walletClient,
  deviceName,
  deviceType,
  location,
  pricePerDataPoint,
  ownerAddress,  // Connected wallet address
  deviceAddress  // Device identifier
);
```

### Publishing Data

Device owners can publish data to their streams:

```typescript
// GPS Data
await publishGPSData(walletClient, deviceAddress, {
  timestamp: BigInt(Date.now()),
  latitude: 37.7749,
  longitude: -122.4194,
  altitude: 0,
  accuracy: 10,
  speed: 0,
  heading: 0,
});

// Weather Data
await publishWeatherData(walletClient, deviceAddress, {
  timestamp: BigInt(Date.now()),
  temperature: 72.5,
  humidity: 65.0,
  pressure: 1013.25,
  windSpeed: 5.0,
  windDirection: 180,
  rainfall: 0.0,
});

// Air Quality Data
await publishAirQualityData(walletClient, deviceAddress, {
  timestamp: BigInt(Date.now()),
  pm25: 15,
  pm10: 25,
  co2: 400,
  no2: 20,
  o3: 50,
  aqi: 45,
});
```

### Reading Data

Subscribers can read data from device streams:

```typescript
const dataPoint = await readDeviceData(
  publisherAddress,  // Owner's wallet address
  deviceAddress,     // Device identifier
  deviceType
);

if (dataPoint) {
  console.log('Latest reading:', dataPoint.value);
  console.log('Timestamp:', dataPoint.timestamp);
  if (dataPoint.latitude && dataPoint.longitude) {
    console.log('Location:', dataPoint.latitude, dataPoint.longitude);
  }
}
```

### Stream Dashboard

The stream dashboard (`/stream/[id]`) now:
1. Reads data from Somnia streams every 5 seconds
2. Displays latest data point
3. Shows data in chart, table, and map views
4. Handles loading and error states
5. Falls back to mock data if no real data is available

## Important Notes

### Publisher Address vs Device Address

- **Publisher Address**: The wallet address that publishes data (owner's address)
- **Device Address**: The identifier used to generate the data ID

Currently, the implementation uses the device address for both, but in production, you should:
1. Store the owner's wallet address separately
2. Use owner's address as the publisher
3. Use device address only for data ID generation

### Data Storage

Somnia Data Streams only stores the **latest** data point for each data ID. To track historical data:
1. Implement a local database or cache
2. Use event logs to track all data points
3. Store data points off-chain and reference them on-chain

### Transaction Costs

Each data publish requires a blockchain transaction, which incurs gas costs. Consider:
1. Batching multiple data points
2. Using off-chain storage with on-chain references
3. Implementing a payment system for subscribers

## Network Configuration

The project is configured for **Somnia Testnet**:
- Chain ID: 50312
- RPC URL: https://dream-rpc.somnia.network
- Explorer: https://shannon-explorer.somnia.network

## Next Steps

1. **Store owner address separately** - Update UserDevice type to include ownerAddress
2. **Implement data publishing UI** - Add UI for device owners to publish data
3. **Add historical data tracking** - Implement local storage or event log reading
4. **Marketplace integration** - Discover devices from on-chain metadata
5. **Subscription payments** - Implement payment system for subscriptions
6. **Error handling** - Improve error handling and user feedback
7. **Data validation** - Add validation for data before publishing

## Testing

To test the integration:

1. **Connect Wallet** - Use a wallet connected to Somnia Testnet
2. **Register Device** - Register a new device via `/register`
3. **Publish Data** - Publish test data (currently requires manual function calls)
4. **View Stream** - View device stream at `/stream/[device-id]`

## Resources

- [Somnia Data Streams Documentation](https://docs.somnia.network/somnia-data-streams)
- [Somnia SDK GitHub](https://github.com/somnia-network/streams-sdk)
- [Somnia Testnet Explorer](https://shannon-explorer.somnia.network)

