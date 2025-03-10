
import { useState } from "react";
import { InvoiceItem } from "@/services/api/invoicing";
import { Item } from "@/types/product";
import { SearchBar } from "./invoice-items/SearchBar";
import { EmptyState } from "./invoice-items/EmptyState";
import { ItemsTable } from "./invoice-items/ItemsTable";
import { useItemSearch } from "./invoice-items/useItemSearch";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  onAddItem: (item: any) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export function InvoiceItemsTable({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: InvoiceItemsTableProps) {
  const { 
    searchTerm, 
    searchResults, 
    showResults, 
    handleSearch, 
    resetSearch 
  } = useItemSearch();
  
  const handleSelectItem = (item: Item) => {
    // Check if the item already exists in the invoice
    const existingItemIndex = items.findIndex(
      existingItem => existingItem.productId === item.id
    );
    
    if (existingItemIndex !== -1) {
      // Item already exists, update quantity
      const existingItem = items[existingItemIndex];
      const newQuantity = existingItem.quantity + 1;
      
      // Calculate new total price considering discount
      const unitPrice = existingItem.unitPrice;
      const discount = existingItem.discount || 0;
      const discountAmount = (unitPrice * discount) / 100;
      const discountedPrice = unitPrice - discountAmount;
      const newTotalPrice = newQuantity * discountedPrice;
      
      // Update the item quantity
      onUpdateItem(existingItem.id, "quantity", newQuantity);
      // Update the total price after quantity change
      onUpdateItem(existingItem.id, "totalPrice", newTotalPrice);
    } else {
      // Item doesn't exist, add as new
      const unitPrice = item.type === 'product' ? item.sellPrice : item.amount;
      
      const newItem: InvoiceItem = {
        id: `item-${Date.now()}`,
        productId: item.id,
        productName: item.name,
        quantity: 1,
        unitPrice: unitPrice,
        discount: 0, // Initialize discount to 0
        totalPrice: unitPrice, // Initial total is just the unit price since no discount
        type: item.type
      };
      
      onAddItem(newItem);
    }
    
    resetSearch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Articles et services</h3>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          showResults={showResults}
          searchResults={searchResults}
          onSelectItem={handleSelectItem}
        />
      </div>
      
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ItemsTable
          items={items}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
        />
      )}
    </div>
  );
}
