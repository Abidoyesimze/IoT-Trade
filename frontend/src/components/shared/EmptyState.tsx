import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary-blue" />
        </div>
        <h3 className="heading-md mb-2">{title}</h3>
        <p className="body-base text-gray-600 mb-6 max-w-md">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="gradient-primary">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}