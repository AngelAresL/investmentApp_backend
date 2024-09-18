export interface DividendData {
    date: string; 
    amount: number; 
    payDate: string; 
    declarationDate: string; 
   
  }

  export interface DividendResponse {
    pastDividends: DividendData[];
    upcomingDividends: DividendData[];
  }