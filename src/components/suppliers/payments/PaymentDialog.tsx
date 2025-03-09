
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Purchase } from "@/types/purchase";
import { FilterSection } from "./FilterSection";
import { PaymentForm } from "./PaymentForm";
import { PaymentDialogHeader } from "./PaymentDialogHeader";

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
  const [showFilters, setShowFilters] = useState(true); // Show filters by default
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <PaymentDialogHeader 
            purchase={purchase} 
            showFilters={showFilters} 
            toggleFilters={toggleFilters} 
          />
        </DialogHeader>

        {showFilters && (
          <FilterSection
            referenceFilter={referenceFilter}
            setReferenceFilter={setReferenceFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            totalMinFilter={totalMinFilter}
            setTotalMinFilter={setTotalMinFilter}
            totalMaxFilter={totalMaxFilter}
            setTotalMaxFilter={setTotalMaxFilter}
            paidMinFilter={paidMinFilter}
            setPaidMinFilter={setPaidMinFilter}
            paidMaxFilter={paidMaxFilter}
            setPaidMaxFilter={setPaidMaxFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}

        <PaymentForm
          purchase={purchase}
          paymentAmount={paymentAmount}
          onPaymentAmountChange={onPaymentAmountChange}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          paymentDate={paymentDate}
          onPaymentDateChange={onPaymentDateChange}
        />

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
