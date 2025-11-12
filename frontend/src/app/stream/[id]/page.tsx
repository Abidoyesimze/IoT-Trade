'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, MapPin, TrendingUp, Table as TableIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';
import { ViewMode, TimeRange } from '@/lib/enums';
import { formatDateTime, formatRelativeTime } from '@/lib/formatters';
import { mockStore } from '@/lib/mockData';

export default function LiveDashboardPage({ params }: { params: { id: string } }) {
  const { marketplaceDevices, userDevices } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHART);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.ONE_HOUR);
  const [liveData, setLiveData] = useState(mockStore.liveDataPoints);

  const device = [...marketplaceDevices, ...userDevices].find(d => d.id === params.id);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = {
        timestamp: new Date(),
        value: 40 + Math.random() * 10,
        status: 'verified' as const,
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01
      };
      setLiveData(prev => [...prev.slice(-19), newPoint]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!device) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="body-lg text-gray-600">Device not found</p>
          </div>
        </main>
      </>
    );
  }

  const latestPoint = liveData[liveData.length - 1];
  const chartData = liveData.map(point => ({
    time: point.timestamp.toLocaleTimeString(),
    value: point.value
  }));

  const handleExport = (format: 'CSV' | 'JSON') => {
    let content: string;
    let filename: string;

    if (format === 'CSV') {
      content = 'Timestamp,Value,Status\n' + 
        liveData.map(p => `${p.timestamp.toISOString()},${p.value},${p.status}`).join('\n');
      filename = `device-${params.id}-data.csv`;
    } else {
      content = JSON.stringify(liveData, null, 2);
      filename = `device-${params.id}-data.json`;
    }

    const blob = new Blob([content], { type: format === 'CSV' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Current Reading Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-sm text-gray-600 mb-1">Current Reading</p>
                  <p className="heading-xl text-primary-blue">{latestPoint.value.toFixed(2)}</p>
                  <p className="body-sm text-gray-600 mt-1">
                    Last updated: {formatRelativeTime(latestPoint.timestamp)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success-green animate-pulse" />
                  <span className="body-base font-semibold text-success-green">LIVE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data Stream</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('CSV')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('JSON')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value={ViewMode.MAP}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Map View
                  </TabsTrigger>
                  <TabsTrigger value={ViewMode.CHART}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Chart View
                  </TabsTrigger>
                  <TabsTrigger value={ViewMode.TABLE}>
                    <TableIcon className="w-4 h-4 mr-2" />
                    Table View
                  </TabsTrigger>
                </TabsList>

                {/* Map View */}
                <TabsContent value={ViewMode.MAP}>
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="body-base text-gray-600">Map view for GPS devices</p>
                      <p className="body-sm text-gray-500 mt-1">
                        Current position: {latestPoint.latitude?.toFixed(4)}, {latestPoint.longitude?.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Chart View */}
                <TabsContent value={ViewMode.CHART}>
                  <div className="mb-4 flex gap-2">
                    {[TimeRange.ONE_HOUR, TimeRange.SIX_HOURS, TimeRange.TWENTY_FOUR_HOURS, TimeRange.SEVEN_DAYS].map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange(range)}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#6B7280"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#6B7280"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0066FF" 
                          strokeWidth={2}
                          dot={{ fill: '#0066FF', r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                {/* Table View */}
                <TabsContent value={ViewMode.TABLE}>
                  <div className="max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...liveData].reverse().map((point, index) => (
                          <TableRow key={index} className="animate-in fade-in duration-300">
                            <TableCell className="font-mono text-sm">
                              {formatDateTime(point.timestamp)}
                            </TableCell>
                            <TableCell className="font-semibold text-primary-blue">
                              {point.value.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1 text-success-green text-sm">
                                <span className="w-2 h-2 rounded-full bg-success-green" />
                                {point.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}