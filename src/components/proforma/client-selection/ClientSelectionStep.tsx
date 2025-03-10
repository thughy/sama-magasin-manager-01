
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientSearch, ClientSearchValues } from "./ClientSearch";
import { ClientSearchResults } from "./ClientSearchResults";
import { EmptyClientState } from "./EmptyClientState";
import { Client } from "@/data/clientsData";
import { UseFormReturn } from "react-hook-form";

interface ClientSelectionStepProps {
  searchForm: UseFormReturn<ClientSearchValues>;
  searchResults: Client[];
  onSearchClient: (data: ClientSearchValues) => void;
  onSelectClient: (client: Client) => void;
  onAddNewClient: () => void;
  onCancel: () => void;
}

export function ClientSelectionStep({
  searchForm,
  searchResults,
  onSearchClient,
  onSelectClient,
  onAddNewClient,
  onCancel,
}: ClientSelectionStepProps) {
  return (
    <div className="space-y-6">
      <ClientSearch 
        searchForm={searchForm} 
        onSubmit={onSearchClient} 
        onAddNewClient={onAddNewClient} 
      />

      {searchResults.length > 0 ? (
        <ClientSearchResults
          searchResults={searchResults}
          onSelectClient={onSelectClient}
        />
      ) : (
        <EmptyClientState onCreateClient={onAddNewClient} />
      )}

      <div className="flex justify-between sm:justify-between flex-row mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="button"
          onClick={onAddNewClient}
          className="bg-sama-600 hover:bg-sama-700"
        >
          <Plus size={16} className="mr-2" />
          Nouveau client
        </Button>
      </div>
    </div>
  );
}
