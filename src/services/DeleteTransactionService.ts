import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: TransactionDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transactionById = await transactionRepository.findOne({
      where: { id },
    });
    if (!transactionById) throw new AppError('This id not found', 404);

    const transaction = await transactionRepository.remove(transactionById);
    // await transactionRepository.remove(transaction);
    return transaction;
  }
}

export default DeleteTransactionService;
