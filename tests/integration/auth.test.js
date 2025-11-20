//lec193-Testing auth middleware
const request = require('supertest');
let server;
const { User } = require('../../Models/users');
const { Genre } = require('../../Models/genres');
const mongoose = require('mongoose');

describe('Testing auth middleware', ()=>{
    beforeEach(()=>{    server=require('../../index');      });
    afterEach(async ()=>{
        await server.close();
        await Genre.deleteMany();
    });

    
    it('should return 401 if token is not provided', async () => { 
        const token = '';

        const res = await request(server).post('/api/genres').set('x-auth-token',token).send({genre:'genre1'});
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid',async () => { 
        const token = '12345';//passing invalid token

        const res = await request(server).post('/api/genres').set('x-auth-token',token).send({genre:'genre1'});
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid',async () => { 
        const token = new User().generateAuthToken();//generating valid token.

        const res = await request(server).post('/api/genres').set('x-auth-token',token).send({genre:'genre1'});
        expect(res.status).toBe(200);
       
    });
    
});