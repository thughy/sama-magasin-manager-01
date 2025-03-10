
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Proforma } from "@/components/proforma/ProformasTable";

export function useProformaPrinting() {
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: (currentProforma: Proforma | null) => 
      currentProforma ? `Proforma_${currentProforma.reference}` : "Proforma",
    pageStyle: `
      @page {
        size: A4;
        margin: 1.5cm;
      }
    `,
    contentRef: printRef,
  });

  const triggerPrint = () => {
    if (printRef.current) {
      handlePrint();
    }
  };

  return {
    printRef,
    triggerPrint
  };
}
