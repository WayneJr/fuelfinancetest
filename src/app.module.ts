import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DBHOST'),
          port: +configService.get('DBPORT'),
          username: configService.get('DBUSER'),
          password: configService.get('DBPASS'),
          database: configService.get('DBNAME'),
          autoLoadEntities: true,
          synchronize: configService.get('DBSYNC'),
        };
      },
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    AuthModule,

    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
