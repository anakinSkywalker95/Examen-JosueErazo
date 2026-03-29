const request = require('supertest');
const app = require('./index');

describe('API Tests', () => {
  
  test('GET / retorna mensaje de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /health retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /ruta-inexistente retorna 404', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.statusCode).toBe(404);
  });

});