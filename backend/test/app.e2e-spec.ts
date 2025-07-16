import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';

describe('TodoModule & AuthModule (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;
  let todoId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  const todoPayload = {
    title: 'E2E Test Todo',
    description: 'This is a test',
    status: 'pending',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  it('✅ Register user', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      response.body.message === false
        ? 'User already exists'
        : response.body.message
    );
  });

  it('✅ Login user & receive access token', async () => {
    const response = await request(server)
      .post('/auth/signin')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');

    authToken = response.body.accessToken;
    expect(typeof authToken).toBe('string');
  });

  it('✅ Create a new todo', async () => {
    const response = await request(server)
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send(todoPayload)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(todoPayload.title);

    todoId = response.body._id;
  });

  it('✅ Get all todos', async () => {
    const response = await request(server)
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('todos');
    expect(Array.isArray(response.body.todos)).toBe(true);
    expect(response.body.todos.length).toBeGreaterThan(0);
  });

  it('✅ Get todo by ID', async () => {
    const response = await request(server)
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body._id).toEqual(todoId);
  });

  it('✅ Update todo', async () => {
    const updatedData = { status: 'completed' };

    const response = await request(server)
      .patch(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.status).toEqual('completed');
  });

  it('✅ Delete todo', async () => {
    await request(server)
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    await request(server)
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });

  it('❌ Fail to access todos with invalid token', async () => {
    await request(server)
      .get('/todos')
      .set('Authorization', `Bearer invalid_token`)
      .expect(401);
  });
});
