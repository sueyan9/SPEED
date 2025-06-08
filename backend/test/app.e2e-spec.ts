import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SubmissionsController } from '../src/submissions/submissions.controller';
import { SubmissionsService } from '../src/submissions/submissions.service';

describe('SubmissionsController (e2e)', () => {
  let app: INestApplication;
  const mockService = {
    create: jest.fn(dto => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [{ id: '1', title: 'Test' }]),
    findByStatus: jest.fn(status => [{ id: '1', title: 'Test', status }]),
    updateStatus: jest.fn((id, status) => ({ id, status })),
    search: jest.fn((q, status) => [{ id: '1', title: q, status }]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionsController],
      providers: [
        { provide: SubmissionsService, useValue: mockService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/submissions (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/api/submissions')
      .send({ title: 'Test Submission' })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Test Submission');
      });
  });

  it('/api/submissions (POST) - fail validation', () => {
    return request(app.getHttpServer())
      .post('/api/submissions')
      .send({}) // no title
      .expect(400);
  });

  it('/api/submissions (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/submissions')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/api/submissions/search?q=Test', () => {
    return request(app.getHttpServer())
      .get('/api/submissions/search?q=Test')
      .expect(200)
      .expect((res) => {
        expect(res.body[0].title).toBe('Test');
      });
  });

  it('/api/submissions/1/status (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/api/submissions/1/status')
      .send({ status: 'pending' })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('pending');
      });
  });
});
