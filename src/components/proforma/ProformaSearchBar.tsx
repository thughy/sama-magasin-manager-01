
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save } from "lucide-react";

interface ProformaSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onCreateNew: () => void;
}

export const ProformaSearchBar: React.FC<ProformaSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onCreateNew
}) => {
  return (
    <form onSubmit={onSearch} className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Rechercher un proforma..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button type="submit">Rechercher</Button>
      <Button 
        type="button" 
        onClick={onCreateNew} 
        className="flex items-center gap-2"
      >
        <Save size={18} />
        Enregistrer
      </Button>
    </form>
  );
};
