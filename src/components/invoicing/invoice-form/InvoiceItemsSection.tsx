
import { InvoiceItem } from "@/services/api/invoicing";
import { InvoiceItemsTable } from "../InvoiceItemsTable";

interface InvoiceItemsSectionProps {
  items: InvoiceItem[];
  onAddItem: (item: any) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export const InvoiceItemsSection = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}: InvoiceItemsSectionProps) => {
  return (
    <div className="space-y-4 mt-4">
      <InvoiceItemsTable 
        items={items}
        onAddItem={onAddItem}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
};
