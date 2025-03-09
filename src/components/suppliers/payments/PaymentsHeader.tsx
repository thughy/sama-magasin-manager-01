
import React from "react";

interface PaymentsHeaderProps {
  title: string;
  description: string;
}

export const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
