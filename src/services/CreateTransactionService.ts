import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type !== 'outcome' && type !== 'income') {
      throw new Error('Wrong type');
    }

    const balance = this.transactionsRepository.getBalance();
    if (type === 'outcome') {
      const newBalance = balance.total - value;

      if (newBalance < 0) throw new Error('Insufficient Funds');

      const transaction = this.transactionsRepository.create({
        title,
        type,
        value,
      });

      return transaction;
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
