//lec-194
const {User} =require('../../../Models/users');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware(middleware/auth.js file)', () => {
    it('should populate req.user using the payload of jwt(means check whether req.user=payload is happening or not)', () => { 
        const user = {
            _id:new mongoose.Types.ObjectId().toHexString(),
            isAdmin:true
        };
        const token = new User(user).generateAuthToken();
        req={
            header:jest.fn().mockReturnValue(token) //jest.fn() creates a mock function//see auth function we need to pass token in request's header 
        };
        res={};
        next=jest.fn();//these 3 objects req,res,next are mocked here and then passed as arguments for auth function

        auth(req,res,next); //auth function is called and get executed

        expect(req.user).toMatchObject(user);
    });
});