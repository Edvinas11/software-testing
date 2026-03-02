export const parsePrice = (priceText: string | null) =>
   priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : 0;