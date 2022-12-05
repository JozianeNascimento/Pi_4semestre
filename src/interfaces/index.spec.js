const request = require("supertest");
const app = require('../server');

describe('Teste servidor', () => {
    it('teste integração de rota', async() => {
        const res = await request(app).get('/');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
    })

    it('teste criação de login', async() => {
        const res = await request(app)
            .post('/auth/employee')
            .send({
                nome: 'Jest',
                email: 'jest@teste.com.br',
                password: '123456',
                confirmapassword: '123456'
            });

        expect(res.statusCode).toEqual(302);
    })

    it('teste criação de usuário', async() => {
        const res = await request(app)
            .post('/auth/new')
            .send({
                nome: 'Jest',
                email: 'jest@admin.com.br',
                dispositivo: '9999',
                endereco: 'teste',
                telefone: 'teste',
                nome_contato: 'contato 1',
                telefone_contato: '999999999',
                chatid1: '987456321',
                nome_contato2: 'contato 2',
                telefone_contato2: '88888888',
                chatid2: '123456789'
            });

        expect(res.statusCode).toEqual(302);
    })



})