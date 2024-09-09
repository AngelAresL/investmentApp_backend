export interface DividendData {
    date: string; // Fecha del dividendo
    amount: number; // Monto del dividendo
    payDate: string; // Fecha de pago del dividendo
    declarationDate: string; // Fecha de declaración
   
  }

  export interface DividendResponse {
    pastDividends: DividendData[];
    upcomingDividends: DividendData[];
  }