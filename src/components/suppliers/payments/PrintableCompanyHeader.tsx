
import React from "react";
import { Building } from "lucide-react";

export const PrintableCompanyHeader: React.FC = () => {
  return (
    <div className="print-only mb-8 no-break">
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center mb-2">
          <Building className="h-8 w-8 mr-2" />
          <h1 className="text-3xl font-bold">ENTREPRISE XYZ</h1>
        </div>
        <p className="text-sm">123 Rue du Commerce, Dakar, Sénégal</p>
        <p className="text-sm">Tel: +221 33 123 45 67 | Email: contact@entreprise-xyz.sn</p>
        <p className="text-sm">NINEA: 123456789 | RC: SN-DKR-2020-B-12345</p>
      </div>
    </div>
  );
};
