import React from 'react';
import Badge from '../ui/Badge';

interface ExpirationBadgeProps {
  expiresAt: string | null;
}

export default function ExpirationBadge({ expiresAt }: ExpirationBadgeProps) {
  if (!expiresAt) return <Badge label="No expiry" variant="gray" />;

  const now = new Date();
  const expDate = new Date(expiresAt);
  const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / 86400000);

  if (daysLeft < 0) return <Badge label="Expired" variant="danger" />;
  if (daysLeft === 0) return <Badge label="Expires today" variant="danger" />;
  if (daysLeft <= 3) return <Badge label={`${daysLeft}d left`} variant="danger" />;
  if (daysLeft <= 7) return <Badge label={`${daysLeft}d left`} variant="secondary" />;
  return <Badge label={`${daysLeft}d left`} variant="success" />;
}
