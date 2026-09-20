'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import AnalyticsHubPage from '../page';

const analyticsSubnav = [
  { label: 'Cluster Overview', href: '/analytics' },
  { label: 'AI & Models', href: '/analytics/ai' },
  { label: 'Workflows', href: '/analytics/workflows' },
  { label: 'Projects', href: '/analytics/projects' },
  { label: 'User Activity', href: '/analytics/users' },
  { label: 'Storage & Vectors', href: '/analytics/storage' },
  { label: 'Search Queries', href: '/analytics/search' },
  { label: 'Export Telemetry', href: '/analytics/export' },
];

export default function AnalyticsOverviewPage() {
  return <AnalyticsHubPage />;
}
