const request = require('supertest');
let server;
const {Genre} = require('../../Models/genres');
const mongoose =require('mongoose');
const {User} = require('../../Models/users');

describe('/api/genres',() =>{
    beforeEach(()=>{    server=require('../../index');    });//loading server before each test(see notes lec-184)
    afterEach(async ()=>{   
        await server.close();
        await Genre.deleteMany();
    });//after each test close the loaded server & data added to the database at beginning of each test should be removed after each test.

    describe('GET /', ()=>{
        it('should return all genres', async () => {

            await Genre.collection.insertMany([
                {genre: 'genre1'},
                {genre: 'genre2'}
            ]); //add multiple genres

            const res = await request(server).get('/api/genres');//this returns response object,it is async operation so,I used await.
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.genre === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.genre === 'genre2')).toBeTruthy();
        });
    });
    
    describe('GET /:id', () => { //lec-186: Testing the routes with route parameters
        it('should return a genre if valid id is used',async () => { 
            const genre = new Genre({genre:'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/'+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genre',genre.genre);
        });

        it('should return 404 if invalid id is passed',async () => { 
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', ()=>{ //lec-189
        it('should return 401 if user is not logged in',async () => { 
            const res = await request(server).post('/api/genres').send({genre:'genre1'});
            expect(res.status).toBe(401);
        });
        it('should return 400 if input data is invalid(if genre is less than 3 characters)',async () => { 
            const token = new User().generateAuthToken();
            const res = await request(server)
                    .post('/api/genres')
                    .set('x-auth-token',token)
                    .send({genre:'ge'}); //set() is used to set request header

            expect(res.status).toBe(400);
        });
        it('should return 400 if input data is invalid(if genre is more than 50 characters)',async () => { 
            const token = new User().generateAuthToken();

            const name = new Array(52).join('a');//generate a string of 'a' with length more than 50

            const res = await request(server)
                    .post('/api/genres')
                    .set('x-auth-token',token)
                    .send({genre:name}); 
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid',async () => { 
            const token = new User().generateAuthToken();

            const res = await request(server)
                    .post('/api/genres')
                    .set('x-auth-token',token)
                    .send({genre:'genre1'}); 

            const genre = await Genre.find({genre:'genre1'});//lec-191
            expect(genre).not.toBeNull();//if this assertion passes,then it means genre document is saved in db
        });

        it('should return genre if it is valid',async () => { 
            const token = new User().generateAuthToken();

            const name = new Array(52).join('a');//generate a string of 'a' with length more than 50

            const res = await request(server)
                    .post('/api/genres')
                    .set('x-auth-token',token)
                    .send({genre:'genre1'});

            expect(res.body).toHaveProperty('_id');//if this assertion passes,then it means genre document is saved in db
            expect(res.body).toHaveProperty('genre','genre1');
        }); 
    });

    describe('PUT /', ()=>{

        it('should return 404 object not found ,for invalid id',async () => { 

            const res = await request(server).put('/api/genres/1').send({genre:'genre_updated'});//valid input is given and invalid id is given
            expect(res.status).toBe(404);
        });

        it('should return 400 for invalid inputs ,as input should be of minimum length=3 i.e., bad rquest ',async () => { 
            const id= new mongoose.Types.ObjectId().toHexString();
            const genre = new Genre({_id:id, genre:'update_this_genre'});
            genre.save();

            const res = await request(server).put('/api/genres/'+genre._id).send({genre:'g'});//input data is invalid as-->'g' length is 1
            expect(res.status).toBe(400);
        });

        it('should return 404 object not found ,for valid input data but user with specified id donot exhists',async () => { 
            const id= new mongoose.Types.ObjectId().toHexString();

            const res = await request(server).put('/api/genres/'+id).send({genre:'genre_updated'});//valid input is given and invalid id is given
            expect(res.status).toBe(404);
        });

        it('should return 200 if our genre gets successfully updated',async () => { 
            const id= new mongoose.Types.ObjectId().toHexString();
            const genre = new Genre({_id:id, genre:'update_this_genre'});
            genre.save();

            const res = await request(server).put('/api/genres/'+genre._id).send({genre:'genre_updated'});
            expect(res.status).toBe(200);
        });   
    });
    //todo
    // describe('DELETE /', ()=>{
        
    // });
});