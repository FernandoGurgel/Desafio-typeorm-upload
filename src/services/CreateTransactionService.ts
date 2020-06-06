import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_name: string;
}

interface CategoryDTO {
  title: string;
}

class CreateTransactionService {
  private async categoryFind({ title }: CategoryDTO): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const categoryExist = await categoryRepository.findOne({
      where: { title },
    });

    if (categoryExist) {
      return categoryExist;
    }

    const category = categoryRepository.create({ title });
    await categoryRepository.save(category);
    return category;
  }

  public async execute({
    title,
    category_name,
    type,
    value,
  }: TransactionDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    if (type !== 'income' && type !== 'outcome')
      throw new AppError('Type the transaction invalid', 500);

    const balance = await transactionRepository.getBalance();
    if (type === 'outcome' && value > balance.total)
      throw new AppError('Transaction invalid', 400);

    const category = await this.categoryFind({ title: category_name });
    const transaction = transactionRepository.create({
      title,
      category_id: category.id,
      type,
      value,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
