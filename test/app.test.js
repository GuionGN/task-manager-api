const request = require('supertest');
const app = require('../src/app');
const { execute } = require('../src/config/db');

describe('Health check', () => {
    test('GET /health 200', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
    });
});

describe('Register check', () => {
    test('POST /auth/register 201', async () => {
        const res = await request(app).post('/auth/register').send({
            name: 'Test user',
            email: `test${Date.now()}@test.com`,
            password: '154'
        });
        expect(res.status).toBe(201);
    });
});

describe('login test', () => {
    test('POST /auth/login 401', async () => {
        const res = await request(app).post('/auth/login').send({
        email: 'ejemplo@test.com',
        password: '1123'
        });
        expect(res.status).toBe(401);
    });
});
 
describe('Create task', () => {
    test('POST /tasks  401', async () => {
        const res = await request(app).post('/tasks').send({
            title: 'Hola mundo',
            description: 'una breve descipción',
            status: 'pending'
        });
        expect(res.status).toBe(401);
    });
});