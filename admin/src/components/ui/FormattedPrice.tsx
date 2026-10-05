"use client";

import React from 'react';

interface FormattedPriceProps {
  amount: number;
  className?: string;
}

export const FormattedPrice = ({ amount, className = "" }: FormattedPriceProps) => {
  const formattedAmount = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={className}>
      {formattedAmount}
    </span>
  );
};
