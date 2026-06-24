import React from 'react';
import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: "KAVON | wear power wear kavon",
  description: "wear power wear kavon. High-performance streetwear engineered for the modern nomad. Tactical construction, limited archival releases, and urban shadow aesthetics.",
  openGraph: {
    title: "KAVON | wear power wear kavon",
    description: "High-performance streetwear engineered for the modern nomad.",
    images: [
      {
        url: "/img/Logo-1.jpeg",
        width: 1200,
        height: 630,
        alt: "KAVON TACTICAL"
      }
    ],
  },
};

export default function Home() {
  return <HomeClient />;
}