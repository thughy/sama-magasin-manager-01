
import React from "react";

export function EmptyState() {
  return (
    <div className="border rounded-md p-8 text-center">
      <p className="text-muted-foreground">
        Aucun article/service dans la facture. Recherchez un article ou service pour l'ajouter.
      </p>
    </div>
  );
}
