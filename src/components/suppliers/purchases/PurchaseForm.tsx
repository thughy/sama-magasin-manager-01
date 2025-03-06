
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { SupplierSearchBox } from "../SupplierSearchBox";
import { ProductSearchBox } from "../ProductSearchBox";
import { Supplier } from "@/data/suppliersData";
import { DepotSelector } from "./DepotSelector";
import { PurchaseFormItems } from "./PurchaseFormItems";
import { usePurchaseForm } from "@/hooks/usePurchaseForm";

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
}

export const PurchaseForm = ({ 
  isOpen, 
  onClose, 
  initialPurchase,
  onSave
}: PurchaseFormProps) => {
  const {
    formData,
    selectedSupplier,
    selectedDepot,
    purchaseItems,
    isValid,
    setFormData,
    setSelectedSupplier,
    setSelectedDepot,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    calculateTotals,
    handleSubmit
  } = usePurchaseForm({ initialPurchase, onSave, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialPurchase ? "Modifier l'achat" : "Nouvel achat"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                placeholder="F-2024-001"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseDate">Date de la facture</Label>
              <div className="relative">
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SupplierSearchBox 
              selectedSupplier={selectedSupplier} 
              onSelectSupplier={setSelectedSupplier} 
            />
            
            <DepotSelector 
              selectedDepot={selectedDepot}
              onSelectDepot={setSelectedDepot}
            />
          </div>

          <PurchaseFormItems 
            items={purchaseItems}
            onAddItem={addPurchaseItem}
            onRemoveItem={removePurchaseItem}
            onUpdateItem={updatePurchaseItem}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut de paiement</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'payée' | 'impayée'})}
              >
                <option value="impayée">Impayée</option>
                <option value="payée">Payée</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="totalPaid">Montant versé (FCFA)</Label>
              <Input
                id="totalPaid"
                type="number"
                value={formData.totalPaid}
                onChange={(e) => setFormData({...formData, totalPaid: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="space-y-1">
              <div className="text-sm">Total: <span className="font-bold">{formData.totalAmount.toLocaleString()} FCFA</span></div>
              <div className="text-sm">Payé: <span className="font-bold">{formData.totalPaid.toLocaleString()} FCFA</span></div>
              <div className="text-sm">Solde: <span className="font-bold">{formData.balance.toLocaleString()} FCFA</span></div>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={!isValid} className="bg-sama-600 hover:bg-sama-700">
                {initialPurchase ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
