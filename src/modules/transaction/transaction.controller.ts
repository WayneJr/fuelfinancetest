import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionService } from './transaction.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('file')
  // @UseGuards(JwtGuard) // You can uncomment this to test endpoint authorization
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.transactionService.parseCsvFile(file);
  }

  @HttpCode(HttpStatus.OK)
  @Get('report')
  // @UseGuards(JwtGuard) // You can uncomment this to test endpoint authorization
  async getReports() {
    return await this.transactionService.getReports();
  }
}
