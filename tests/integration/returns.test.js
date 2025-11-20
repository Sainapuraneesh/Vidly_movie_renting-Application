// p14: Test Driven Development -TDD
//from lec-201
let server;
const mongoose=require('mongoose');
const { Rental } = require('../../Models/rentals');
const { User } = require('../../Models/users');
const request = require('supertest');
const moment = require('moment');//returns function //Lec-209
const { Movie } = require('../../Models/movies');

describe('/api/returns',()=>{
    let rental;
    let customerId;
    let movieId;
    beforeEach(async ()=>{    
        server=require('../../index');
        customerId=new mongoose.Types.ObjectId().toHexString();
        movieId=new mongoose.Types.ObjectId().toHexString();
        rental=new Rental({
            customer:{
                _id:customerId,
                name:'Bob the builder',
                phone:'1234567890'
            },
            movie:{
                _id:movieId,
                title:'1920',
                dailyRentalRate:20
            }
        });
        await rental.save();
    });
    afterEach(async ()=>{   
        await server.close();
        await Rental.deleteMany();
        await Movie.deleteMany();
    });

    it('should return 401 if client is not logged in.',async ()=>{
        const res = await request(server).post('/api/returns').send({
            customerId:customerId, 
            movieId:movieId
        });
        expect(res.status).toBe(401);
    });
    //lec-203
    it('should return 400 if user is aldready logged in. But customerId is not provided.',async ()=>{
        const token =new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({movieId:movieId}); //customerId is not provided

        expect(res.status).toBe(400);
    });

    it('should return 400 if user is aldready logged in. But movieId is not provided.',async ()=>{
        const token =new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({customerId:customerId}); //movieId is not provided

        expect(res.status).toBe(400);
    });
    //lec-205
    it('should return 404 if no rentals found for this customer/movie id.',async ()=>{
        await Rental.deleteMany();
        const token =new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            });

        expect(res.status).toBe(404);
    });
    //lec-206
    it('should return 400 if rental is aldready processed(means return date is aldready set).',async ()=>{
        rental.dateReturned = new Date();
        await rental.save();

        const token =new User().generateAuthToken();
        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            });
        expect(res.status).toBe(400);
    });

    it('should return 200 for valid request.',async ()=>{
        const token =new User().generateAuthToken();
        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            });

        expect(res.status).toBe(200);
    });
    
    it('should set the return date ,for valid request.',async ()=>{
        const token =new User().generateAuthToken();
        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            }); //This code will call router function for specified endpoint and for specified method(post method)
            
        const rentalfromdb = await Rental.findById(rental._id); //getting rental object from db
        const diff =new Date()-rentalfromdb.dateReturned;//If difference in time exhists then only it means dateReturned property is setted 
        expect(diff).toBeLessThan(10 * 1000);//if diff is less than 10 seconds(or give time as ur wish),then it means dateReturned property is setted
    });
    //Lec-209
    it('should set the rentalFee property for valid request(for valid input).',async ()=>{
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const token =new User().generateAuthToken();
        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            }); 
            
        const rentalfromdb = await Rental.findById(rental._id); //getting rental object from db
        const per_day_fee = rentalfromdb.movie.dailyRentalRate;

        expect(rentalfromdb.rentalFee).toBe(per_day_fee * 7);
    });

    it('should increase the movie stock after returning the movie back(i.e, property called numberInStock in movie object)',async ()=>{
        const movie =new Movie({
            _id:movieId,
            title:'12345',
            dailyRentalRate: 20,
            genre: { genre:'12345'},
            numberInStock:10
        });
        await movie.save();

        const token =new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            }); 
        
        moviefromdb = await Movie.findById(movieId);

        expect(moviefromdb.numberInStock).toBe(movie.numberInStock+1);//if diff is less than 10 seconds(or give time as ur wish),then it means dateReturned property is setted
    });

    it('should return the rental if input is valid(for valid request).',async ()=>{

        const token =new User().generateAuthToken();
        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({
                customerId:customerId,
                movieId:movieId
            }); 
            
        //const rentalfromdb = await Rental.findById(rental._id); //getting rental object from db

        expect(res.body).toHaveProperty('dateOut');
        expect(res.body).toHaveProperty('dateReturned');
        expect(res.body).toHaveProperty('rentalFee');
        expect(res.body).toHaveProperty('customer');
        expect(res.body).toHaveProperty('movie'); /* or use below line instead using these 5 lines

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']));
        //Object.keys(res.body)=>This function returns an array of keys present in object(res.body)
        */
    });
});