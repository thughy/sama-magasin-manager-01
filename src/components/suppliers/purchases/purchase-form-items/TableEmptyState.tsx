
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export const TableEmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
        Aucun article. Utilisez le champ de recherche ou le bouton "Ajouter" pour ajouter des articles.
      </TableCell>
    </TableRow>
  );
};
