import { Badge } from '@/components/ui/badge';
import { DeviceStatus, SubscriptionStatus } from '@/lib/enums';

interface StatusBadgeProps {
  status: DeviceStatus | SubscriptionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isOnline = status === DeviceStatus.ONLINE;
  const isActive = status === SubscriptionStatus.ACTIVE;
  const isSuccess = isOnline || isActive;
  
  return (
    <Badge 
      variant={isSuccess ? "default" : "secondary"}
      className={`status-badge ${isSuccess ? 'bg-success-green/10 text-success-green border-success-green/20' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
    >
      <span className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-success-green' : 'bg-gray-400'}`} />
      {status}
    </Badge>
  );
}