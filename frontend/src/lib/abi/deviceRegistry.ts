export const deviceRegistryAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "deviceAddress", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "deviceType", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "pricePerDataPoint", "type": "uint256" },
      { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "registerDevice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "deviceAddress", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "deviceType", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "pricePerDataPoint", "type": "uint256" },
      { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "updateDevice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "deviceAddress", "type": "address" },
      { "internalType": "bool", "name": "isActive_", "type": "bool" }
    ],
    "name": "setDeviceActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "deviceAddress", "type": "address" }
    ],
    "name": "purchaseAccess",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "buyer", "type": "address" },
      { "internalType": "address", "name": "deviceAddress", "type": "address" }
    ],
    "name": "totalPaid",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "subscriber", "type": "address" },
      { "internalType": "address", "name": "deviceAddress", "type": "address" }
    ],
    "name": "getAccessExpiry",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "deviceAddress", "type": "address" }
    ],
    "name": "getDevice",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "deviceType", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "uint256", "name": "pricePerDataPoint", "type": "uint256" },
          { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" },
          { "internalType": "string", "name": "metadataURI", "type": "string" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "uint256", "name": "registeredAt", "type": "uint256" }
        ],
        "internalType": "struct DeviceRegistry.Device",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "getDevicesByOwner",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllDevices",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "deviceAddress", "type": "address" }
    ],
    "name": "deviceExists",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

