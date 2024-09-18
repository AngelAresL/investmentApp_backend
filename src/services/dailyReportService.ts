import { InvestmentReport } from '../entity/investmentReport';  
import { AppDataSource } from '../index';  
import axios from 'axios';  
import openaiService from '../services/openaiServices';  

const generateDailyReport = async (token: string, userId: number) => {
  try {
    
    const response = await axios.get('http://localhost:3001/api/investments/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const investmentsInfo = response.data;
    let totalPortfolioValue = 0;
    
    investmentsInfo.forEach((investment: any) => {
      totalPortfolioValue += investment.currentPrice * investment.amount;
    });

   
    const report = await openaiService.generatePortfolioReport({
      totalPortfolioValue,
      investmentsInfo,
    });

    
    const fullInvestmentData = {
      investmentsInfo,
      openAiReport: report,  
    };

   
    const investmentReportRepository = AppDataSource.getRepository(InvestmentReport);
    const newReport = investmentReportRepository.create({
      user: { id: userId },  
      investmentsData: fullInvestmentData,  
      createdAt: new Date(),
    });
    
    await investmentReportRepository.save(newReport);

    console.log('Reporte diario almacenado correctamente.');
    return newReport;  
  } catch (error) {
    console.error('Error generando y almacenando el informe diario: ', error);
    return null;
  }
};

export default generateDailyReport;