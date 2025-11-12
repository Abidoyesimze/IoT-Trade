import { MapPin, CloudSun, Wind } from 'lucide-react';
import { DeviceType } from '@/lib/enums';

interface DeviceIconProps {
  type: DeviceType;
  size?: number;
  className?: string;
}

export function DeviceIcon({ type, size = 24, className = '' }: DeviceIconProps) {
  const iconProps = { size, className };
  
  switch (type) {
    case DeviceType.GPS_TRACKER:
      return <MapPin {...iconProps} />;
    case DeviceType.WEATHER_STATION:
      return <CloudSun {...iconProps} />;
    case DeviceType.AIR_QUALITY_MONITOR:
      return <Wind {...iconProps} />;
    default:
      return <MapPin {...iconProps} />;
  }
}