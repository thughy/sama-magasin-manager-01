
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Purchase } from "@/types/purchase";
import { format } from "date-fns";
import { X, Filter, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface PaymentDialogProps {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentAmount: number;
  onPaymentAmountChange: (amount: number) => void;
  paymentMethod: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank';
  onPaymentMethodChange: (method: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank') => void;
  paymentDate: string;
  onPaymentDateChange: (date: string) => void;
  onSubmit: () => void;
}

export function PaymentDialog({
  purchase,
  open,
  onOpenChange,
  paymentAmount,
  onPaymentAmountChange,
  paymentMethod,
  onPaymentMethodChange,
  paymentDate,
  onPaymentDateChange,
  onSubmit
}: PaymentDialogProps) {
  const [showFilters, setShowFilters] = useState(true); // Changed to true to make filters visible by default
  const [referenceFilter, setReferenceFilter] = useState("");
  const [totalMinFilter, setTotalMinFilter] = useState("");
  const [totalMaxFilter, setTotalMaxFilter] = useState("");
  const [paidMinFilter, setPaidMinFilter] = useState("");
  const [paidMaxFilter, setPaidMaxFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "payée" | "impayée">("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  if (!purchase) return null;

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const formatDateStr = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Paiement de facture</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFilters}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Masquer filtres" : "Afficher filtres"}
            </Button>
          </div>
          <DialogDescription>
            Enregistrer un paiement pour la facture {purchase.reference}
          </DialogDescription>
        </DialogHeader>

        {showFilters && (
          <div className="border rounded-md p-3 mb-4 bg-muted/20">
            <h3 className="text-sm font-medium mb-2">Filtres</h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="reference-filter" className="text-xs">
                  Référence
                </Label>
                <Input
                  id="reference-filter"
                  placeholder="Filtrer par référence"
                  value={referenceFilter}
                  onChange={(e) => setReferenceFilter(e.target.value)}
                  className="h-8"
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2">
                <Label className="text-xs">Période</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal h-8",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-3 w-3" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Date début"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal h-8",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-3 w-3" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Date fin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="total-min" className="text-xs">
                    Total Min (FCFA)
                  </Label>
                  <Input
                    id="total-min"
                    type="number"
                    placeholder="Min"
                    value={totalMinFilter}
                    onChange={(e) => setTotalMinFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="total-max" className="text-xs">
                    Total Max (FCFA)
                  </Label>
                  <Input
                    id="total-max"
                    type="number"
                    placeholder="Max"
                    value={totalMaxFilter}
                    onChange={(e) => setTotalMaxFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="paid-min" className="text-xs">
                    Versé Min (FCFA)
                  </Label>
                  <Input
                    id="paid-min"
                    type="number"
                    placeholder="Min"
                    value={paidMinFilter}
                    onChange={(e) => setPaidMinFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="paid-max" className="text-xs">
                    Versé Max (FCFA)
                  </Label>
                  <Input
                    id="paid-max"
                    type="number"
                    placeholder="Max"
                    value={paidMaxFilter}
                    onChange={(e) => setPaidMaxFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status-filter" className="text-xs">
                  Statut
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as any)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="payée">Payée</SelectItem>
                    <SelectItem value="impayée">Impayée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReferenceFilter("");
                    setStartDate(undefined);
                    setEndDate(undefined);
                    setTotalMinFilter("");
                    setTotalMaxFilter("");
                    setPaidMinFilter("");
                    setPaidMaxFilter("");
                    setStatusFilter("all");
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reference" className="text-right">
              Référence
            </Label>
            <Input
              id="reference"
              value={purchase.reference}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Montant Total
            </Label>
            <Input
              id="total"
              value={`${purchase.totalAmount.toLocaleString()} F CFA`}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Solde
            </Label>
            <Input
              id="balance"
              value={`${purchase.balance.toLocaleString()} F CFA`}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Montant à payer
            </Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => onPaymentAmountChange(Number(e.target.value))}
              max={purchase.balance}
              min={0}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">
              Méthode
            </Label>
            <Select 
              value={paymentMethod} 
              onValueChange={(value) => onPaymentMethodChange(value as any)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une méthode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="orangeMoney">Orange Money</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
                <SelectItem value="bank">Virement bancaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={paymentDate}
              onChange={(e) => onPaymentDateChange(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={paymentAmount <= 0 || paymentAmount > purchase.balance || !paymentDate}
          >
            Valider le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
