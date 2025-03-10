
/**
 * Generates a unique reference number for a new proforma
 */
export const generateReference = (): string => {
  return `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
};
