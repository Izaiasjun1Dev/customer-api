const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const CustomerSchema = new Schema({
  first_name: {
    type: String,
    maxlength: 15,
    required: true
  },
  surname: {
    type: String,
    maxlength: 30
  },
  email: {
    type: String,
    maxlength: 50,
    required: true
  },
  password: {type: String,  required: true},
  is_acitve: {
    type: Boolean,
    required: true
  },
  is_acitve: {
    type: Boolean,
    required: true
  },
  createdAt: Number,
  updatedAt: Number,
  tokens: [
    {
      token: {
        type: String, 
        require: true
      }
    }
  ]
}, {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  colletion: 'customers'
});

// ==> create hash password pre save
CustomerSchema.pre('save', async function(next) {
  const customer = this;
  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8);
  }
  next();
});

// ==> generate tokens
CustomerSchema.methods.generateAuthToken = async function() {

  try {
    const customer = this;
    const token = jwt.sign({ 
      _id: customer._id,
      first_name: customer.first_name,
      email: customer.email
    }, 'secret');
    customer.tokens = customer.tokens.concat({token})
    await customer.save();
    return token

  } catch(e){
    return {
      Error: e
    }
  }
};

// ==> find credentials
CustomerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne(
    {email}
  )

  if (!customer) {
    throw new Error({
      error: 'Log is invalid!'
    })
  }

  const isPassword = await bcrypt.compare(password, customer.password);

  if (!isPassword) {
    throw new Error({
      error: 'Your password is invalid!'
    })
  }
  
  return customer;
};

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer