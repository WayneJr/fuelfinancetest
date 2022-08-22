import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { Transaction } from '../src/modules/transaction/transaction.entity';
import { User } from '../src/modules/users/user.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
  username: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  entities: [Transaction, User],
  synchronize: true,
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await dataSource.initialize();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const sampleUser = {
    name: 'Daniel',
    email: 'daniel@gmail.com',
    password: 'daniel123',
  };

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Hello World!');
  });

  it('/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/signup')
      .send(sampleUser)
      .expect(HttpStatus.CREATED);
  });

  it('/signup (POST) should return a conflict status code', () => {
    return request(app.getHttpServer())
      .post('/signup')
      .send(sampleUser)
      .expect(HttpStatus.CONFLICT);
  });

  it('/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({
        email: sampleUser.email,
        password: sampleUser.password,
      })
      .expect(HttpStatus.OK);
  });

  it('/report (GET)', () => {
    return request(app.getHttpServer()).get('/report').expect(HttpStatus.OK);
  });

  afterAll(async () => {
    console.log({
      type: 'mysql',
      host: process.env.DBHOST,
      port: process.env.DBPORT,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [Transaction, User],
    });
    await dataSource.dropDatabase();
  });
});
