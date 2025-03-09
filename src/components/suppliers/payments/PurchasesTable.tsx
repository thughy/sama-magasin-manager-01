
import React, { useState } from "react";
import { Purchase } from "@/types/purchase";
import { PurchasesFiltersBar } from "./PurchasesFiltersBar";
import { PurchasesTableDisplay } from "./PurchasesTableDisplay";

interface PurchasesTableProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick?: (purchase: Purchase) => void;
  onHistoryClick: (purchase: Purchase) => void;
}

export const PurchasesTable: React.FC<PurchasesTableProps> = ({ 
  purchases, 
  onPaymentClick, 
  onEditClick, 
  onHistoryClick 
}) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "payée" | "impayée">("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  // Fonction pour vérifier si une date est comprise dans le filtre de date
  const isDateInFilter = (purchaseDate: string): boolean => {
    const date = new Date(purchaseDate);
    
    // Si aucun filtre de date n'est défini
    if (!dateFilter && !dateRangeFilter.from && !dateRangeFilter.to) {
      return true;
    }
    
    // Si un filtre pour une date spécifique est défini
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      return date.getFullYear() === filterDate.getFullYear() &&
             date.getMonth() === filterDate.getMonth() &&
             date.getDate() === filterDate.getDate();
    }
    
    // Si un filtre pour une plage de dates est défini
    if (dateRangeFilter.from || dateRangeFilter.to) {
      // Vérifier la date de début
      if (dateRangeFilter.from && !dateRangeFilter.to) {
        return date >= dateRangeFilter.from;
      }
      
      // Vérifier la date de fin
      if (!dateRangeFilter.from && dateRangeFilter.to) {
        return date <= dateRangeFilter.to;
      }
      
      // Vérifier la plage complète
      if (dateRangeFilter.from && dateRangeFilter.to) {
        return date >= dateRangeFilter.from && date <= dateRangeFilter.to;
      }
    }
    
    return true;
  };
  
  // Filtrer les factures en fonction du statut et de la date sélectionnés
  const filteredPurchases = purchases.filter(purchase => {
    // Filtrer par statut
    const statusMatch = statusFilter === "all" || purchase.status === statusFilter;
    
    // Filtrer par date
    const dateMatch = isDateInFilter(purchase.purchaseDate);
    
    return statusMatch && dateMatch;
  });
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setStatusFilter("all");
    setDateFilter(undefined);
    setDateRangeFilter({ from: undefined, to: undefined });
  };
  
  // Réinitialiser uniquement les filtres de date
  const resetDateFilters = () => {
    setDateFilter(undefined);
    setDateRangeFilter({ from: undefined, to: undefined });
  };
  
  // Vérifier si des filtres sont actifs
  const hasActiveFilters = statusFilter !== "all" || dateFilter || dateRangeFilter.from || dateRangeFilter.to;
  
  return (
    <div>
      <PurchasesFiltersBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={setDateRangeFilter}
        resetFilters={resetFilters}
        resetDateFilters={resetDateFilters}
        hasActiveFilters={hasActiveFilters}
      />
      
      <PurchasesTableDisplay
        purchases={filteredPurchases}
        onPaymentClick={onPaymentClick}
        onEditClick={onEditClick}
        onHistoryClick={onHistoryClick}
        formatDate={formatDate}
      />
    </div>
  );
};
