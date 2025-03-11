
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
      
      // Convert quantity to number explicitly and ensure it's a valid number
      const currentQuantity = Number(existingItem.quantity || 0);
      // Add 1 to the current quantity
      const newQuantity = currentQuantity + 1;
      
      // Get the unit price as a number
      const unitPrice = Number(existingItem.unitPrice || 0);
      // Get the discount as a number
      const discount = Number(existingItem.discount || 0);
      
      // Calculate the total price with discount
      const discountMultiplier = (100 - discount) / 100;
      const newTotalPrice = newQuantity * unitPrice * discountMultiplier;
      
      console.log("Updating existing item:", {
        id: existingItem.id,
        currentQuantity,
        newQuantity,
        unitPrice,
        discount,
        discountMultiplier,
        newTotalPrice
      });
      
      // First update the quantity
      onUpdateItem(existingItem.id, "quantity", newQuantity);
      // Then update the total price
      onUpdateItem(existingItem.id, "totalPrice", newTotalPrice);
    } else {
      // Item doesn't exist, add as new
      const unitPrice = item.type === 'product' ? 
        Number(item.sellPrice || 0) : 
        Number(item.amount || 0);
      
      const newItem: InvoiceItem = {
        id: `item-${Date.now()}`,
        productId: item.id,
        productName: item.name,
        quantity: 1,
        unitPrice: unitPrice,
        discount: 0,
        totalPrice: unitPrice,
        type: item.type
      };
      
      onAddItem(newItem);
      console.log("Added new item:", newItem);
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
