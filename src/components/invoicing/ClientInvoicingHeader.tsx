
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface ClientInvoicingHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onNewInvoice: () => void;
}

export const ClientInvoicingHeader = ({
  isLoading,
  onRefresh,
  onNewInvoice,
}: ClientInvoicingHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Facturation Client</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les factures clients et suivez les paiements
        </p>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Actualiser
        </Button>
        <Button size="sm" onClick={onNewInvoice}>
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle facture
        </Button>
      </div>
    </div>
  );
};
