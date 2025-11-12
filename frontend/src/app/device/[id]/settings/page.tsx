'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DeviceType } from '@/lib/enums';
import { formatDateTime } from '@/lib/formatters';

export default function DeviceSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { userDevices, updateUserDevice, deleteUserDevice } = useApp();
  const device = userDevices.find(d => d.id === params.id);

  const [formData, setFormData] = useState({
    name: device?.name || '',
    location: device?.location || '',
    price: device?.pricePerDataPoint.toString() || ''
  });
  const [isPublishing, setIsPublishing] = useState(device?.status === 'ONLINE');

  if (!device) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="body-lg text-gray-600">Device not found</p>
          </div>
        </main>
      </>
    );
  }

  const handleSave = () => {
    updateUserDevice(device.id, {
      name: formData.name,
      location: formData.location,
      pricePerDataPoint: parseFloat(formData.price)
    });
    alert('Settings saved successfully!');
  };

  const handleTogglePublishing = (checked: boolean) => {
    setIsPublishing(checked);
    updateUserDevice(device.id, {
      status: checked ? 'ONLINE' : 'OFFLINE'
    });
  };

  const handleDeactivate = () => {
    if (confirm('Are you sure you want to deactivate this device? This will stop all active subscriptions and cannot be undone.')) {
      deleteUserDevice(device.id);
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-xl mb-2">Device Settings</h1>
            <p className="body-lg text-gray-600">{device.name}</p>
          </div>

          <div className="space-y-6">
            {/* Device Information */}
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>Update your device details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="body-base font-medium">Device Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My GPS Tracker"
                  />
                </div>

                <div className="space-y-2">
                  <label className="body-base font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Jose, CA"
                  />
                </div>

                <div className="space-y-2">
                  <label className="body-base font-medium">Device Type</label>
                  <Select value={device.type} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DeviceType.GPS_TRACKER}>GPS Tracker</SelectItem>
                      <SelectItem value={DeviceType.WEATHER_STATION}>Weather Station</SelectItem>
                      <SelectItem value={DeviceType.AIR_QUALITY_MONITOR}>Air Quality Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="body-sm text-gray-600">Device type cannot be changed after registration</p>
                </div>

                <Button onClick={handleSave} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your data pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="body-base font-medium">Price per Data Point (ETH)</label>
                  <Input
                    type="number"
                    step="0.00001"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00001"
                  />
                  <p className="body-sm text-gray-600">
                    Current price: {device.pricePerDataPoint} ETH per data point
                  </p>
                </div>

                <Button onClick={handleSave} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Update Price
                </Button>
              </CardContent>
            </Card>

            {/* Publishing */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>Control your device's data publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="body-base font-semibold mb-1">Publishing Status</p>
                    <p className="body-sm text-gray-600">
                      {isPublishing ? 'Device is currently publishing data' : 'Device is paused'}
                    </p>
                  </div>
                  <Switch
                    checked={isPublishing}
                    onCheckedChange={handleTogglePublishing}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="body-sm text-gray-600 mb-1">Publishing Frequency</p>
                    <p className="body-base font-semibold">{device.updateFrequency}</p>
                  </div>
                  <div>
                    <p className="body-sm text-gray-600 mb-1">Last Published</p>
                    <p className="body-base font-semibold">{formatDateTime(device.lastPublished)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-error-red">
              <CardHeader>
                <CardTitle className="text-error-red">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-red-50 border-error-red">
                  <AlertTriangle className="h-4 w-4 text-error-red" />
                  <AlertDescription className="text-gray-700">
                    Deactivating your device will stop all active subscriptions and remove it from the marketplace. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="destructive"
                  onClick={handleDeactivate}
                  className="w-full"
                >
                  Deactivate Device
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}