const request = require('supertest');
const app = require('../src/app');

describe('API TEST', () => {
    it('deve validar se query parameter cidade está faltando', async () => {

      const response = await request(app).get('/playlist').send({});
      expect(response.status).toBe(400);
    });

    it('deve validar se a cidade não foi encontrada', async () => {

      const response = await request(app)
      .get('/playlist')
      .query({'cidade':'Aneruc'})
      expect(response.status).toBe(404);
    });

});