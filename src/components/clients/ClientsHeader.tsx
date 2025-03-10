
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientsHeaderProps {
  onAddClient?: () => void;
}

export const ClientsHeader = ({ onAddClient }: ClientsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre base de clients
        </p>
      </div>
      <Button className="bg-sama-600 hover:bg-sama-700" onClick={onAddClient}>
        <Plus size={16} className="mr-2" />
        Nouveau client
      </Button>
    </div>
  );
};
