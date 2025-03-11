
import { Button } from "@/components/ui/button";

interface InvoiceFormFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  isEditing: boolean;
}

export const InvoiceFormFooter = ({
  onCancel,
  onSubmit,
  isSubmitDisabled,
  isEditing,
}: InvoiceFormFooterProps) => {
  return (
    <div className="p-6 border-t flex justify-between items-center mt-auto">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button 
        type="button" 
        onClick={onSubmit} 
        disabled={isSubmitDisabled}
      >
        {isEditing ? "Mettre à jour" : "Enregistrer"}
      </Button>
    </div>
  );
};
