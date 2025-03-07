
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
    setDialogOpen(isOpen);
    console.log(`Dialog state set to: ${isOpen}`);
  }, [isOpen]);

  // Manual cancel handler
  const handleCancel = () => {
    console.log("Cancel handler executed in useDialogController");
    setDialogOpen(false);
    onClose();
  };

  return {
    dialogOpen,
    handleCancel
  };
};
