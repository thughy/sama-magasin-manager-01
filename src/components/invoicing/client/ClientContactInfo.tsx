
import React from "react";
import { Input } from "@/components/ui/input";
import { Phone, Mail } from "lucide-react";

interface ClientContactInfoProps {
  phone: string;
  email: string;
}

export const ClientContactInfo = ({ phone, email }: ClientContactInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative">
        <div className="relative">
          <Input
            id="clientPhone"
            value={phone}
            readOnly
            placeholder="Téléphone du client"
            className="pl-10"
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="relative">
        <div className="relative">
          <Input
            id="clientEmail"
            value={email}
            readOnly
            placeholder="Email du client"
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
