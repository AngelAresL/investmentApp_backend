import { InvestmentReport } from '../entity/investmentReport';  // Importa tu nueva entidad
import { AppDataSource } from '../index';  // El datasource de tu base de datos
import axios from 'axios';  // Para realizar la llamada al endpoint de inversiones
import openaiService from '../services/openaiServices';  // Servicio para interactuar con OpenAI

const generateDailyReport = async (token: string, userId: number) => {
  try {
    // Hacer la llamada al endpoint de inversiones con el token del usuario
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

    // Usar OpenAI para generar el informe de la cartera
    const report = await openaiService.generatePortfolioReport({
      totalPortfolioValue,
      investmentsInfo,
    });

    // Incluir el informe de OpenAI junto con los datos de las inversiones
    const fullInvestmentData = {
      investmentsInfo,
      openAiReport: report,  // Informe generado por OpenAI
    };

    // Guardar los datos en la base de datos
    const investmentReportRepository = AppDataSource.getRepository(InvestmentReport);
    const newReport = investmentReportRepository.create({
      user: { id: userId },  // Asociamos el reporte con el usuario
      investmentsData: fullInvestmentData,  // Guardamos la info recibida del endpoint junto con el informe de OpenAI
      createdAt: new Date(),
    });
    
    await investmentReportRepository.save(newReport);

    console.log('Reporte diario almacenado correctamente.');
    return newReport;  // Devolver el reporte almacenado
  } catch (error) {
    console.error('Error generando y almacenando el informe diario: ', error);
    return null;
  }
};

export default generateDailyReport;