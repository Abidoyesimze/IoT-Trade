'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Eye, Settings, Calendar, TrendingDown } from 'lucide-react';
import { DeviceIcon } from '@/components/shared/DeviceIcon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useApp } from '@/context/AppContext';
import { SubscriptionStatus } from '@/lib/enums';
import { formatAddress, formatEthAmount, formatDateTime, formatDaysRemaining, formatCount } from '@/lib/formatters';

export default function SubscriptionsPage() {
  const router = useRouter();
  const { userSubscriptions, updateUserSubscription, cancelUserSubscription } = useApp();
  const [selectedTab, setSelectedTab] = useState('active');

  const activeSubscriptions = userSubscriptions.filter(sub => sub.status === SubscriptionStatus.ACTIVE);
  const expiredSubscriptions = userSubscriptions.filter(sub => sub.status === SubscriptionStatus.EXPIRED);

  const displayedSubscriptions = selectedTab === 'active' ? activeSubscriptions : expiredSubscriptions;

  const handleToggleAutoRenewal = (subscriptionId: string, currentValue: boolean) => {
    updateUserSubscription(subscriptionId, { autoRenewal: !currentValue });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (confirm('Are you sure you want to cancel this subscription? You will receive a refund for unused data points.')) {
      cancelUserSubscription(subscriptionId);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-xl mb-2">My Subscriptions</h1>
            <p className="body-lg text-gray-600">Manage your active and expired subscriptions</p>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="active">
                Active ({activeSubscriptions.length})
              </TabsTrigger>
              <TabsTrigger value="expired">
                Expired ({expiredSubscriptions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeSubscriptions.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No active subscriptions"
                  description="Browse the marketplace to find data streams and subscribe to them."
                  actionLabel="Browse Marketplace"
                  onAction={() => router.push('/marketplace')}
                />
              ) : (
                <div className="space-y-4">
                  {activeSubscriptions.map((subscription) => (
                    <Card key={subscription.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                              <DeviceIcon type={subscription.deviceType} size={24} className="text-primary-blue" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="body-lg font-semibold">{subscription.deviceName}</CardTitle>
                                <StatusBadge status={subscription.status} />
                              </div>
                              <p className="body-sm text-gray-600 mb-3">
                                Owner: {formatAddress(subscription.deviceOwner)}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="body-sm text-gray-600 mb-1">Period</p>
                                  <p className="body-base font-semibold">
                                    {formatDateTime(subscription.startDate).split(',')[0]} → {formatDateTime(subscription.endDate).split(',')[0]}
                                  </p>
                                </div>
                                <div>
                                  <p className="body-sm text-gray-600 mb-1">Days Remaining</p>
                                  <p className="body-base font-semibold text-primary-blue">
                                    {formatDaysRemaining(subscription.daysRemaining)}
                                  </p>
                                </div>
                                <div>
                                  <p className="body-sm text-gray-600 mb-1">Remaining Balance</p>
                                  <p className="body-base font-semibold">{formatEthAmount(subscription.remainingBalance)}</p>
                                </div>
                                <div>
                                  <p className="body-sm text-gray-600 mb-1">Data Consumed</p>
                                  <p className="body-base font-semibold">{formatCount(subscription.dataPointsConsumed)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/stream/${subscription.deviceId}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Stream
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Settings className="w-4 h-4 mr-2" />
                                  Manage
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Manage Subscription</DialogTitle>
                                  <DialogDescription>
                                    {subscription.deviceName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="body-base font-semibold mb-1">Auto-renewal</p>
                                      <p className="body-sm text-gray-600">Automatically renew when subscription expires</p>
                                    </div>
                                    <Switch
                                      checked={subscription.autoRenewal}
                                      onCheckedChange={() => handleToggleAutoRenewal(subscription.id, subscription.autoRenewal)}
                                    />
                                  </div>
                                  <div className="pt-4 border-t">
                                    <Button
                                      variant="outline"
                                      className="w-full mb-2"
                                      onClick={() => router.push(`/device/${subscription.deviceId}?tab=subscribe`)}
                                    >
                                      Renew Subscription
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="w-full"
                                      onClick={() => handleCancelSubscription(subscription.id)}
                                    >
                                      Cancel Subscription
                                    </Button>
                                    <p className="body-sm text-gray-600 mt-2 text-center">
                                      You'll receive a refund for unused data points
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="expired">
              {expiredSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="body-lg text-gray-600">No expired subscriptions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expiredSubscriptions.map((subscription) => (
                    <Card key={subscription.id} className="opacity-60">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                              <DeviceIcon type={subscription.deviceType} size={24} className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="body-lg font-semibold">{subscription.deviceName}</CardTitle>
                                <StatusBadge status={subscription.status} />
                              </div>
                              <p className="body-sm text-gray-600 mb-3">
                                Owner: {formatAddress(subscription.deviceOwner)}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="body-sm text-gray-600 mb-1">Expired On</p>
                                  <p className="body-base font-semibold">{formatDateTime(subscription.endDate)}</p>
                                </div>
                                <div>
                                  <p className="body-sm text-gray-600 mb-1">Total Data Consumed</p>
                                  <p className="body-base font-semibold">{formatCount(subscription.dataPointsConsumed)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/device/${subscription.deviceId}?tab=subscribe`)}
                          >
                            Renew
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}