
import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Supplier } from "@/data/suppliersData";

interface SupplierSelectorProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSupplierSelect: (supplier: Supplier) => void;
}

export function SupplierSelector({ 
  suppliers, 
  selectedSupplier, 
  onSupplierSelect 
}: SupplierSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSupplier ? selectedSupplier.name : "Sélectionner un fournisseur"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un fournisseur..." />
          <CommandEmpty>Aucun fournisseur trouvé.</CommandEmpty>
          <CommandGroup>
            {suppliers.map((supplier) => (
              <CommandItem
                key={supplier.id}
                value={supplier.name}
                onSelect={() => {
                  onSupplierSelect(supplier);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSupplier?.id === supplier.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {supplier.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
