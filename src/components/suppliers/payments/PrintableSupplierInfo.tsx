
import React from "react";
import { Supplier } from "@/data/suppliersData";
import { Building, User, MapPin, Phone, Mail, Wallet } from "lucide-react";

interface PrintableSupplierInfoProps {
  supplier: Supplier;
}

export const PrintableSupplierInfo: React.FC<PrintableSupplierInfoProps> = ({ supplier }) => {
  if (!supplier) return null;
  
  return (
    <div className="my-6 border p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <User className="h-5 w-5 mr-2" />
        <h2 className="text-xl font-semibold">Informations du fournisseur</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="flex items-start">
          <Building className="h-4 w-4 mr-2 mt-1" />
          <div>
            <p className="text-sm font-medium">Nom:</p>
            <p className="font-semibold">{supplier.name}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <User className="h-4 w-4 mr-2 mt-1" />
          <div>
            <p className="text-sm font-medium">Contact:</p>
            <p className="font-semibold">{supplier.contact}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-1" />
          <div>
            <p className="text-sm font-medium">Adresse:</p>
            <p className="font-semibold">{supplier.address}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="h-4 w-4 mr-2 mt-1" />
          <div>
            <p className="text-sm font-medium">Téléphone:</p>
            <p className="font-semibold">{supplier.phone}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="h-4 w-4 mr-2 mt-1" />
          <div>
            <p className="text-sm font-medium">Email:</p>
            <p className="font-semibold">{supplier.email}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Wallet className="h-4 w-4 mr-2 mt-1" />
          <div>
            <p className="text-sm font-medium">Solde:</p>
            <p className={`font-semibold ${supplier.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {supplier.balance.toLocaleString()} F CFA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
