import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionServiice: TransactionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.transactionServiice.parseCsvFile(file);
  }

  @HttpCode(HttpStatus.OK)
  @Get('report')
  async getReports() {
    return await this.transactionServiice.getReports();
  }
}
