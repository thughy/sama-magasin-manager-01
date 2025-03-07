
import { useState, useEffect } from "react";

interface UseDialogControllerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useDialogController = ({ isOpen, onClose }: UseDialogControllerProps) => {
  // Internal dialog state
  const [dialogOpen, setDialogOpen] = useState(isOpen);

  // Sync our internal state with parent's isOpen prop
  useEffect(() => {
    if (isOpen !== dialogOpen) {
      console.log(`Syncing dialog state: parent=${isOpen}, internal=${dialogOpen}`);
      setDialogOpen(isOpen);
    }
  }, [isOpen, dialogOpen]);

  // Manual cancel handler
  const handleCancel = () => {
    console.log("Cancel button clicked, closing form");
    setDialogOpen(false);
    // Call the parent onClose immediately rather than with setTimeout
    onClose();
  };

  return {
    dialogOpen,
    handleCancel
  };
};
