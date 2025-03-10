
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
      
      // Convert all values to numbers explicitly
      const currentQuantity = typeof existingItem.quantity === 'number' 
        ? existingItem.quantity 
        : Number(existingItem.quantity);
        
      // Increment by 1
      const newQuantity = currentQuantity + 1;
      
      // Ensure other values are numbers for calculations
      const unitPrice = typeof existingItem.unitPrice === 'number'
        ? existingItem.unitPrice
        : Number(existingItem.unitPrice);
        
      const discount = typeof existingItem.discount === 'number'
        ? existingItem.discount
        : Number(existingItem.discount || 0);
        
      // Calculate the discounted price
      const discountAmount = (unitPrice * discount) / 100;
      const discountedPrice = unitPrice - discountAmount;
      
      // Calculate new total price
      const newTotalPrice = newQuantity * discountedPrice;
      
      // First update the quantity
      onUpdateItem(existingItem.id, "quantity", newQuantity);
      // Then update the total price
      onUpdateItem(existingItem.id, "totalPrice", newTotalPrice);
      
      console.log("Updated item quantity:", {
        id: existingItem.id,
        oldQuantity: currentQuantity,
        newQuantity: newQuantity,
        unitPrice,
        discount,
        newTotalPrice
      });
    } else {
      // Item doesn't exist, add as new
      const unitPrice = item.type === 'product' ? 
        (typeof item.sellPrice === 'number' ? item.sellPrice : Number(item.sellPrice)) : 
        (typeof item.amount === 'number' ? item.amount : Number(item.amount));
      
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
