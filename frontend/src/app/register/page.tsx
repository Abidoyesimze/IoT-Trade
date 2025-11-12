'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Info, Download } from 'lucide-react';
import { RegistrationStep, DeviceType } from '@/lib/enums';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const router = useRouter();
  const { addUserDevice } = useApp();
  
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.ENTER_SERIAL);
  const [serialNumber, setSerialNumber] = useState('');
  const [deviceAddress, setDeviceAddress] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    price: ''
  });
  const [credentials, setCredentials] = useState({
    deviceId: '',
    apiKey: '',
    apiSecret: ''
  });

  const handleVerifySerial = () => {
    // Simulate serial verification and device wallet generation
    const generatedAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    setDeviceAddress(generatedAddress);
    setStep(RegistrationStep.FILL_DETAILS);
  };

  const handleRegister = () => {
    // Simulate blockchain registration
    const newDevice = {
      id: `device-${Date.now()}`,
      name: formData.name,
      type: formData.type as DeviceType,
      status: 'OFFLINE' as const,
      qualityScore: 0,
      location: formData.location,
      totalDataPoints: 0,
      totalEarnings: 0,
      totalEarningsUsd: 0,
      activeSubscribers: 0,
      deviceAddress,
      pricePerDataPoint: parseFloat(formData.price),
      updateFrequency: 'Every 1 minute',
      uptime: 0,
      lastPublished: new Date()
    };
    
    addUserDevice(newDevice);
    
    // Generate API credentials
    setCredentials({
      deviceId: newDevice.id,
      apiKey: `ak_${Math.random().toString(36).substr(2, 32)}`,
      apiSecret: `as_${Math.random().toString(36).substr(2, 48)}`
    });
    
    setStep(RegistrationStep.SUCCESS);
  };

  const handleDownloadCredentials = () => {
    const config = {
      deviceId: credentials.deviceId,
      deviceAddress,
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      endpoint: 'https://api.iot-marketplace.somnia.network'
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device-${credentials.deviceId}-config.json`;
    a.click();
  };

  if (!isConnected) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Info className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="heading-md mb-2">Connect Wallet First</h3>
                <p className="body-base text-gray-600 mb-6">
                  You need to connect your wallet to register a device
                </p>
                <Button onClick={() => open()} className="gradient-primary">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Enter Serial Number */}
          {step === RegistrationStep.ENTER_SERIAL && (
            <Card>
              <CardHeader>
                <CardTitle className="heading-lg">Register Your IoT Device</CardTitle>
                <CardDescription>
                  Find your device serial number on the device label or box
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-primary-blue" />
                  <AlertDescription className="text-gray-700">
                    The serial number is used to generate a unique blockchain address for your device
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <label className="body-base font-medium">Device Serial Number</label>
                  <Input
                    placeholder="SN-ABC123XYZ"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <Button
                  onClick={handleVerifySerial}
                  disabled={!serialNumber}
                  className="w-full gradient-primary"
                  size="lg"
                >
                  Verify Serial Number
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Fill Device Details */}
          {step === RegistrationStep.FILL_DETAILS && (
            <Card>
              <CardHeader>
                <CardTitle className="heading-lg">Device Details</CardTitle>
                <Alert className="bg-green-50 border-green-200 mt-4">
                  <CheckCircle2 className="h-4 w-4 text-success-green" />
                  <AlertDescription className="text-gray-700">
                    ✓ Device Verified - Address: {deviceAddress.slice(0, 10)}...{deviceAddress.slice(-8)}
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="body-base font-medium">Device Name</label>
                  <Input
                    placeholder="My GPS Tracker"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="body-base font-medium">Device Type</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DeviceType.GPS_TRACKER}>GPS Tracker</SelectItem>
                      <SelectItem value={DeviceType.WEATHER_STATION}>Weather Station</SelectItem>
                      <SelectItem value={DeviceType.AIR_QUALITY_MONITOR}>Air Quality Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="body-base font-medium">Location</label>
                  <Input
                    placeholder="San Jose, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="body-base font-medium">Price per Data Point (ETH)</label>
                  <Input
                    type="number"
                    step="0.00001"
                    placeholder="0.00001"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={!formData.name || !formData.type || !formData.location || !formData.price}
                  className="w-full gradient-primary"
                  size="lg"
                >
                  Complete Registration
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === RegistrationStep.SUCCESS && (
            <Card>
              <CardContent className="py-12 px-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-12 h-12 text-success-green" />
                  </div>
                  <h2 className="heading-lg mb-2">🎉 Registration Complete!</h2>
                  <p className="body-base text-gray-600">
                    Your device has been successfully registered on the blockchain
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="body-sm text-gray-600 mb-1">Device ID</p>
                    <p className="body-base font-mono">{credentials.deviceId}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="body-sm text-gray-600 mb-1">Device Address</p>
                    <p className="body-base font-mono">{deviceAddress}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="body-sm text-gray-600 mb-1">API Key</p>
                    <p className="body-base font-mono text-sm">{credentials.apiKey}</p>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-warning-yellow mb-6">
                  <Info className="h-4 w-4 text-warning-yellow" />
                  <AlertDescription className="text-gray-700">
                    Save these credentials securely. You'll need them to configure your device.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button
                    onClick={handleDownloadCredentials}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Credentials
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 gradient-primary"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}