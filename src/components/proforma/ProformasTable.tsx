
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Eye, FileEdit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Proforma {
  id: string;
  reference: string;
  clientName: string;
  amount: string;
  date: string;
  description: string;
}

interface ProformasTableProps {
  proformas: Proforma[];
  onEdit?: (proforma: Proforma) => void;
  onView?: (proforma: Proforma) => void;
  onDelete?: (proforma: Proforma) => void;
}

export function ProformasTable({ proformas, onEdit, onView, onDelete }: ProformasTableProps) {
  if (proformas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Aucun document proforma trouvé</h3>
        <p className="text-sm text-muted-foreground mt-1">
          La liste des proformas s'affichera ici
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proformas.map((proforma) => (
            <TableRow key={proforma.id}>
              <TableCell className="font-medium">{proforma.reference}</TableCell>
              <TableCell>{proforma.clientName}</TableCell>
              <TableCell className="max-w-[200px] truncate">{proforma.description}</TableCell>
              <TableCell className="text-right">{Number(proforma.amount).toLocaleString('fr-FR')} XOF</TableCell>
              <TableCell>{proforma.date}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button variant="ghost" size="icon" onClick={() => onView(proforma)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={() => onEdit(proforma)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(proforma)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
