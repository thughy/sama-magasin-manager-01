
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Purchase } from "@/types/purchase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit, Filter, Wallet, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">Filtrer par statut:</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | "payée" | "impayée")}
          >
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="payée">Payées</SelectItem>
              <SelectItem value="impayée">Impayées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filtre pour une date spécifique */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={dateFilter ? "default" : "outline"}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              {dateFilter 
                ? format(dateFilter, 'dd/MM/yyyy') 
                : "Date spécifique"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateFilter}
              onSelect={(date) => {
                setDateFilter(date);
                setDateRangeFilter({ from: undefined, to: undefined });
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
            {dateFilter && (
              <div className="p-2 border-t flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)}>
                  Effacer
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        
        {/* Filtre pour une plage de dates */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={(dateRangeFilter.from || dateRangeFilter.to) ? "default" : "outline"}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              {dateRangeFilter.from && dateRangeFilter.to ? (
                <>
                  {format(dateRangeFilter.from, 'dd/MM/yy')} - {format(dateRangeFilter.to, 'dd/MM/yy')}
                </>
              ) : dateRangeFilter.from ? (
                <>
                  {format(dateRangeFilter.from, 'dd/MM/yy')} - ...
                </>
              ) : dateRangeFilter.to ? (
                <>
                  ... - {format(dateRangeFilter.to, 'dd/MM/yy')}
                </>
              ) : "Plage de dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: dateRangeFilter.from,
                to: dateRangeFilter.to
              }}
              onSelect={(range) => {
                setDateRangeFilter({
                  from: range?.from,
                  to: range?.to
                });
                setDateFilter(undefined);
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
            {(dateRangeFilter.from || dateRangeFilter.to) && (
              <div className="p-2 border-t flex justify-end">
                <Button variant="ghost" size="sm" onClick={resetDateFilters}>
                  Effacer
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        
        {/* Bouton pour réinitialiser tous les filtres */}
        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={resetFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payé</TableHead>
            <TableHead>Solde</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right print:hidden">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPurchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Aucune facture ne correspond aux critères de recherche.
              </TableCell>
            </TableRow>
          ) : (
            filteredPurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.reference}</TableCell>
                <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                <TableCell>{purchase.totalAmount.toLocaleString()} F CFA</TableCell>
                <TableCell>{purchase.totalPaid.toLocaleString()} F CFA</TableCell>
                <TableCell className={purchase.status === 'impayée' ? 'font-medium text-red-500' : 'font-medium text-green-500'}>
                  {purchase.balance.toLocaleString()} F CFA
                </TableCell>
                <TableCell>
                  <Badge variant={purchase.status === 'payée' ? 'success' : 'destructive'} className="print:bg-transparent print:border print:border-current">
                    {purchase.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right print:hidden">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onHistoryClick(purchase)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Historique
                    </Button>
                    
                    {onEditClick && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditClick(purchase)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onPaymentClick(purchase)}
                      disabled={purchase.status === 'payée'}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Payer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
