
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
      const newTotalPrice = newQuantity * existingItem.unitPrice;
      
      // Update the item
      onUpdateItem(existingItem.id, "quantity", newQuantity);
      onUpdateItem(existingItem.id, "totalPrice", newTotalPrice);
    } else {
      // Item doesn't exist, add as new
      const newItem = {
        id: `item-${Date.now()}`,
        productId: item.id,
        productName: item.name,
        quantity: 1,
        unitPrice: item.type === 'product' ? item.sellPrice : item.amount,
        totalPrice: item.type === 'product' ? item.sellPrice : item.amount,
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
