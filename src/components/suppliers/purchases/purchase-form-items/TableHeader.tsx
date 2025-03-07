
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ItemsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Article</TableHead>
        <TableHead>Quantité</TableHead>
        <TableHead>Dépôt</TableHead>
        <TableHead>Prix d'achat (FCFA)</TableHead>
        <TableHead>Prix de vente (FCFA)</TableHead>
        <TableHead>Total Achat</TableHead>
        <TableHead>Total Vente</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
