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
  }, 10000);

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

  it('/signup (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/signup')
      .send(sampleUser);
    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
  });

  it('/signup (POST) should return a conflict status code', async () => {
    const response = await request(app.getHttpServer())
      .post('/signup')
      .send(sampleUser);
    expect(response.statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('/login (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/login').send({
      email: sampleUser.email,
      password: sampleUser.password,
    });
    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
  });

  it('/file (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/file')
      .attach('file', `${process.cwd()}/input.csv`);
    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual([
      {
        date: '2021-01-01T23:00:00.000Z',
        sum: '500',
        source: 'income',
        description: '',
        id: 1,
      },
      {
        date: '2022-01-08T23:00:00.000Z',
        sum: '1200',
        source: 'other',
        description: '',
        id: 2,
      },
      {
        date: '2022-01-11T23:00:00.000Z',
        sum: '700',
        source: 'income',
        description: '',
        id: 3,
      },
      {
        date: '2022-02-15T23:00:00.000Z',
        sum: '600',
        source: 'other',
        description: 'other transactions',
        id: 4,
      },
      {
        date: '2022-02-16T23:00:00.000Z',
        sum: '450',
        source: 'custom-source',
        description: '',
        id: 5,
      },
      {
        date: '2022-02-20T23:00:00.000Z',
        sum: '15',
        source: 'income',
        description: 'typical income',
        id: 6,
      },
      {
        date: '2022-03-03T23:00:00.000Z',
        sum: '900',
        source: 'income',
        description: '',
        id: 7,
      },
      {
        date: '2022-03-04T23:00:00.000Z',
        sum: '1000',
        source: 'income',
        description: 'typical income',
        id: 8,
      },
      {
        date: '2022-03-15T23:00:00.000Z',
        sum: '200',
        source: 'custom-source',
        description: '',
        id: 9,
      },
      {
        date: '2022-03-20T23:00:00.000Z',
        sum: '711',
        source: 'other',
        description: '',
        id: 10,
      },
      {
        date: '2022-04-14T23:00:00.000Z',
        sum: '500',
        source: 'other',
        description: '',
        id: 11,
      },
      {
        date: '2022-04-17T23:00:00.000Z',
        sum: '1200',
        source: 'other',
        description: '',
        id: 12,
      },
      {
        date: '2022-04-20T23:00:00.000Z',
        sum: '1900',
        source: 'income',
        description: '',
        id: 13,
      },
      {
        date: '2022-04-20T23:00:00.000Z',
        sum: '800',
        source: 'custom-source',
        description: '',
        id: 14,
      },
      {
        date: '2022-04-20T23:00:00.000Z',
        sum: '400',
        source: 'other',
        description: '',
        id: 15,
      },
      {
        date: '2022-04-21T23:00:00.000Z',
        sum: '100',
        source: 'income',
        description: 'typical income',
        id: 16,
      },
      {
        date: '2022-04-21T23:00:00.000Z',
        sum: '10',
        source: 'other',
        description: '',
        id: 17,
      },
      {
        date: '2022-05-01T23:00:00.000Z',
        sum: '1500',
        source: 'other',
        description: '',
        id: 18,
      },
      {
        date: '2022-05-02T23:00:00.000Z',
        sum: '800',
        source: 'income',
        description: 'typical income',
        id: 19,
      },
    ]);
  });

  it('/report (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/report');
    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      'custom-source': [
        {
          date: 'April 2022',
          total: '800',
        },
        {
          date: 'February 2022',
          total: '450',
        },
        {
          date: 'March 2022',
          total: '200',
        },
      ],
      income: [
        {
          date: 'April 2022',
          total: '2000',
        },
        {
          date: 'February 2022',
          total: '15',
        },
        {
          date: 'January 2021',
          total: '500',
        },
        {
          date: 'January 2022',
          total: '700',
        },
        {
          date: 'March 2022',
          total: '1900',
        },
        {
          date: 'May 2022',
          total: '800',
        },
      ],
      other: [
        {
          date: 'April 2022',
          total: '2110',
        },
        {
          date: 'February 2022',
          total: '600',
        },
        {
          date: 'January 2022',
          total: '1200',
        },
        {
          date: 'March 2022',
          total: '711',
        },
        {
          date: 'May 2022',
          total: '1500',
        },
      ],
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });
});
