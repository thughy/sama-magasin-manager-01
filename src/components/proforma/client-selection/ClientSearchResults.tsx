
import React from "react";
import { Button } from "@/components/ui/button";
import { Client } from "@/data/clientsData";

interface ClientSearchResultsProps {
  searchResults: Client[];
  onSelectClient: (client: Client) => void;
}

export function ClientSearchResults({ searchResults, onSelectClient }: ClientSearchResultsProps) {
  return (
    <div className="border rounded-md">
      <div className="px-4 py-3 bg-muted font-medium text-sm">
        Résultats de recherche
      </div>
      <div className="divide-y max-h-[200px] overflow-y-auto">
        {searchResults.map((client) => (
          <div
            key={client.id}
            className="p-3 flex items-center justify-between hover:bg-muted cursor-pointer"
            onClick={() => onSelectClient(client)}
          >
            <div>
              <div className="font-medium">{client.name}</div>
              <div className="text-sm text-muted-foreground">
                {client.id} • {client.phone}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Sélectionner
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
