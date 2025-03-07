
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Printer, PackageCheck } from "lucide-react";
import { Purchase, PaymentMethod } from "@/types/purchase";
import { SupplierSearchBox } from "../SupplierSearchBox";
import { PurchaseFormItems } from "./PurchaseFormItems";
import { usePurchaseForm } from "@/hooks/purchase-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const printRef = useRef<HTMLDivElement>(null);
  
  const {
    formData,
    selectedSupplier,
    purchaseItems,
    paymentMethods,
    isValid,
    setFormData,
    setSelectedSupplier,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod,
    handleSubmit,
    printDepotEntry
  } = usePurchaseForm({ initialPurchase, onSave, onClose });

  // Calculate unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

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

          <div>
            <SupplierSearchBox 
              selectedSupplier={selectedSupplier} 
              onSelectSupplier={setSelectedSupplier} 
            />
          </div>

          <PurchaseFormItems 
            items={purchaseItems}
            onAddItem={addPurchaseItem}
            onRemoveItem={removePurchaseItem}
            onUpdateItem={updatePurchaseItem}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Paiements</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addPaymentMethod}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Ajouter un paiement
              </Button>
            </div>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-gray-500">Aucun paiement ajouté.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((payment) => (
                  <div key={payment.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end p-3 border rounded-md bg-gray-50">
                    <div>
                      <Label htmlFor={`payment-method-${payment.id}`}>Méthode</Label>
                      <Select
                        value={payment.method}
                        onValueChange={(value) => updatePaymentMethod(payment.id, 'method', value)}
                      >
                        <SelectTrigger id={`payment-method-${payment.id}`}>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Espèces</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                          <SelectItem value="orangeMoney">Orange Money</SelectItem>
                          <SelectItem value="cheque">Chèque</SelectItem>
                          <SelectItem value="bank">Banque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`payment-amount-${payment.id}`}>Montant (FCFA)</Label>
                      <Input
                        id={`payment-amount-${payment.id}`}
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updatePaymentMethod(payment.id, 'amount', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePaymentMethod(payment.id)}
                        className="h-9 w-9 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Depot Entry Printing Section */}
          {uniqueDepots.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Bons d'entrée de dépôt</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {uniqueDepots.map((depot) => (
                  <Button
                    key={depot}
                    type="button"
                    variant="outline"
                    onClick={() => printDepotEntry(depot)}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Imprimer bon pour {depot}</span>
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => printDepotEntry('all')}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimer tous les bons</span>
                </Button>
              </div>
            </div>
          )}

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
              <Button 
                type="submit" 
                disabled={!isValid} 
                className="bg-sama-600 hover:bg-sama-700 flex items-center gap-2"
              >
                <PackageCheck className="h-4 w-4" />
                {initialPurchase ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </div>
          </div>
        </form>
        
        {/* Hidden div for printing */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
