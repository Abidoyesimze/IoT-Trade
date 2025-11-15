// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title DeviceRegistry
 * @notice Minimal on-chain registry for IoT-Trade devices.
 */
contract DeviceRegistry {
    struct Device {
        address owner;
        string name;
        string deviceType;
        string location;
        uint256 pricePerDataPoint;
        string metadataURI;
        bool isActive;
        uint256 registeredAt;
    }

    mapping(address deviceAddress => Device) private devices;
    mapping(address deviceAddress => bool) private isRegistered;
    mapping(address owner => address[]) private ownerToDevices;
    address[] private deviceIndex;

    mapping(address buyer => mapping(address device => uint256 totalPaid)) private payments;

    event DeviceAccessPurchased(
        address indexed buyer,
        address indexed deviceAddress,
        uint256 amount
    );
    function purchaseAccess(address deviceAddress) external payable {
        require(isRegistered[deviceAddress], "DeviceRegistry: device not registered");
        Device memory deviceInfo = devices[deviceAddress];
        require(deviceInfo.isActive, "DeviceRegistry: device not active");
        require(msg.value >= deviceInfo.pricePerDataPoint, "DeviceRegistry: insufficient payment");

        payments[msg.sender][deviceAddress] += msg.value;

        (bool success, ) = deviceInfo.owner.call{value: msg.value}("");
        require(success, "DeviceRegistry: payment failed");

        emit DeviceAccessPurchased(msg.sender, deviceAddress, msg.value);
    }

    function totalPaid(address buyer, address deviceAddress) external view returns (uint256) {
        return payments[buyer][deviceAddress];
    }
    event DeviceRegistered(
        address indexed owner,
        address indexed deviceAddress,
        string name,
        string deviceType,
        uint256 pricePerDataPoint,
        string metadataURI
    );

    event DeviceUpdated(
        address indexed owner,
        address indexed deviceAddress,
        string name,
        string deviceType,
        uint256 pricePerDataPoint,
        string metadataURI
    );

    event DeviceStatusChanged(address indexed owner, address indexed deviceAddress, bool isActive);

    modifier onlyDeviceOwner(address deviceAddress) {
        require(isRegistered[deviceAddress], "DeviceRegistry: device not registered");
        require(devices[deviceAddress].owner == msg.sender, "DeviceRegistry: not device owner");
        _;
    }

    /**
     * @notice Register a new device. Each device is represented by an address (can be derived from serial / hardware ID).
     */
    function registerDevice(
        address deviceAddress,
        string calldata name,
        string calldata deviceType,
        string calldata location,
        uint256 pricePerDataPoint,
        string calldata metadataURI
    ) external {
        require(deviceAddress != address(0), "DeviceRegistry: invalid address");
        require(!isRegistered[deviceAddress], "DeviceRegistry: already registered");
        require(pricePerDataPoint > 0, "DeviceRegistry: price must be > 0");

        devices[deviceAddress] = Device({
            owner: msg.sender,
            name: name,
            deviceType: deviceType,
            location: location,
            pricePerDataPoint: pricePerDataPoint,
            metadataURI: metadataURI,
            isActive: true,
            registeredAt: block.timestamp
        });

        isRegistered[deviceAddress] = true;
        ownerToDevices[msg.sender].push(deviceAddress);
        deviceIndex.push(deviceAddress);

        emit DeviceRegistered(msg.sender, deviceAddress, name, deviceType, pricePerDataPoint, metadataURI);
    }

    /**
     * @notice Update device metadata.
     */
    function updateDevice(
        address deviceAddress,
        string calldata name,
        string calldata deviceType,
        string calldata location,
        uint256 pricePerDataPoint,
        string calldata metadataURI
    ) external onlyDeviceOwner(deviceAddress) {
        require(pricePerDataPoint > 0, "DeviceRegistry: price must be > 0");

        Device storage deviceInfo = devices[deviceAddress];
        deviceInfo.name = name;
        deviceInfo.deviceType = deviceType;
        deviceInfo.location = location;
        deviceInfo.pricePerDataPoint = pricePerDataPoint;
        deviceInfo.metadataURI = metadataURI;

        emit DeviceUpdated(msg.sender, deviceAddress, name, deviceType, pricePerDataPoint, metadataURI);
    }

    /**
     * @notice Toggle a device's active status.
     */
    function setDeviceActive(address deviceAddress, bool isActive_) external onlyDeviceOwner(deviceAddress) {
        devices[deviceAddress].isActive = isActive_;
        emit DeviceStatusChanged(msg.sender, deviceAddress, isActive_);
    }

    /**
     * @notice Returns device metadata.
     */
    function getDevice(address deviceAddress) external view returns (Device memory) {
        require(isRegistered[deviceAddress], "DeviceRegistry: device not registered");
        return devices[deviceAddress];
    }

    function getDevicesByOwner(address owner) external view returns (address[] memory) {
        return ownerToDevices[owner];
    }

    function getAllDevices() external view returns (address[] memory) {
        return deviceIndex;
    }

    function deviceExists(address deviceAddress) external view returns (bool) {
        return isRegistered[deviceAddress];
    }
}

