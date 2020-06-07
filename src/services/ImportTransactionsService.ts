import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import upload from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface ImportFile {
  fileName: string;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_name: string;
}

class ImportTransactionsService {
  private async loadCSV(filePath: string): Promise<any[]> {
    const csvFilePath = path.join(upload.tmpFolder, filePath);
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: Array<any> = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }

  async execute({ fileName }: ImportFile): Promise<Transaction[]> {
    const parseCSV = await this.loadCSV(fileName);
    const listTransactionsCSV: Array<TransactionDTO> = [];

    parseCSV.forEach(data => {
      const [title, type, value, category] = data;
      const transaction: TransactionDTO = {
        title,
        type,
        value,
        category_name: category,
      };
      listTransactionsCSV.push(transaction);
    });

    const createTransactionService = new CreateTransactionService();
    const transactions: Array<Transaction> = [];
    for (let i = 0; i < listTransactionsCSV.length; i++) {
      const { title, type, category_name, value } = listTransactionsCSV[i];
      const data = await createTransactionService.execute({
        title,
        value,
        category_name,
        type,
      });
      transactions.push(data);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
