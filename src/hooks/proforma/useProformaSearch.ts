
import { useState } from "react";
import { Proforma } from "@/components/proforma/ProformasTable";

export function useProformaSearch(proformas: Proforma[]) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter proformas based on search term
  const filteredProformas = searchTerm.trim() === "" 
    ? proformas 
    : proformas.filter(p => 
        p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredProformas,
    handleSearch
  };
}
