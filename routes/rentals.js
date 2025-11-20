//Lec 118 & 119
const {Rental, validate} = require('../Models/rentals'); 
const {Movie} = require('../Models/movies'); 
const {Customer} = require('../Models/customers');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();  /*either rental.save() or movie.save() is failed then all the operations should be 
            rolledback for this we can use Mongoose transactions but here we are not using Mongoose transaction, why? --> see notes*/
  res.send(rental);

// ⭐⭐Use "Mongoose transactions" instead of Fawn
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     await rental.save({ session }); // pass object having session inside it
    
//     // Decrement movie stock and pass session
//     await Movie.updateOne(
//       { _id: movie._id },
//       { $inc: { numberInStock: -1 } },
//       { session }
//     );

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.send(rental);
//   } catch (ex) {
//     // Rollback on error
//     await session.abortTransaction();
//     session.endSession();
    
//     console.error('Transaction error:', ex);
//     res.status(500).send('Error in internal server');
//   }
//Mongoose transactions ends here⭐⭐

});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 