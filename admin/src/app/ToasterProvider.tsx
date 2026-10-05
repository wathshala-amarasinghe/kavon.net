"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#0a0a0a',
          color: '#df0715',
          border: '1px solid rgba(223, 7, 21, 0.2)',
          borderRadius: '0',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
      }}
    />
  );
}
