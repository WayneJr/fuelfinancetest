import { BadRequestException, Injectable } from '@nestjs/common';
import { CsvParser } from 'nest-csv-parser';
import { TransactionDto } from './dto/transaction.dto';
import { Duplex } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly csvParser: CsvParser,
  ) {}

  async parseCsvFile(file: Express.Multer.File): Promise<
    ({
      date: Date;
      sum: any;
      source: any;
      description: any;
    } & Transaction)[]
  > {
    try {
      if (!file)
        throw new BadRequestException('Please add a file to be parsed');

      const tmp = new Duplex();
      tmp.push(file.buffer);
      tmp.push(null);

      // loop through
      // for each entity
      // separate the values by commas,
      // since we have the headers already we don't need to worry about the keys
      // just parse the values and get the respective elements we need then
      // we can map them to the expected json format and then save in the database

      const parsedData = await this.csvParser.parse(tmp, TransactionDto);

      const transactions = parsedData.list.map((entity) => {
        const transactionArray =
          entity['date,sum,source,description'].split(',');

        // Convert date to mm-dd-yyyy which javascript understands
        const dateArray = transactionArray[0].split('-');
        const dateParts = {
          day: dateArray[0],
          month: dateArray[1],
          year: dateArray[2],
        };
        const currentDate = new Date(
          `${dateParts.month}-${dateParts.day}-${dateParts.year}`,
        );
        const transaction = {
          date: new Date(currentDate.setDate(currentDate.getDate() + 1)), // Date created above are off-by-one
          sum: transactionArray[1],
          source: transactionArray[2],
          description: transactionArray[3],
        };
        return transaction;
      });

      return this.transactionRepository.save(transactions);
    } catch (err) {
      throw err;
    }
  }

  async getReports() {
    const transactions = await this.transactionRepository.query(
      `SELECT sum(sum) as total, source, MONTHNAME(date) as month, year(date) as year FROM transaction GROUP BY source, month, year`,
    );
    const result = transactions.map(
      (transaction: {
        total: string;
        source: string;
        month: string;
        year: number;
      }) => ({
        source: transaction.source,
        data: {
          date: `${transaction.month} ${transaction.year}`,
          total: transaction.total,
        },
      }),
    );

    return result;
  }
}
