const Customer = require('../models/customer.model');

// ==> Responsable method to create new Customer
exports.registerNewCustomer = async (req, res) => {
  try {

    let isCustomer = await Customer.find({
      email: req.body.email
    });

    if (isCustomer.length >= 1) {
      return res.status(409).json({
        message: 'Sorry! this email is already registered'
      })
    }

    const newCustomer = new Customer(req.body);
    const customer = await newCustomer.save()
    const token = await newCustomer.generateAuthToken()

    res.status(201).json({
      message: 'User created successfully!', customer, token
    })


  } catch (e) {
    res.status(400).json({
      error: e
    });
  }
}

// ==> Responsable method to log user
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findByCredentials(email, password);

    if (!customer) {
      return res.status(404).json({
        Error: "error when logging in! carefully check your email and password credentials ..."
      })
    }

    const token = await customer.generateAuthToken();

    return res.status(201).json({
      Message: `User successfully logged in!`,
      customer,
      token
    })

  } catch (e) {
    res.status(400).json({
      Error: e
    })
  }
}
// ==> 
exports.updateCustomers = async (req, res) => {
  const {id} = req.params.id
  const update = {updated_at: Date.now()}
  const up = req.body
  console.log(req.body)
  
  await Customer.findByIdAndUpdate(id, up)
  .then(cust => {
    if (!cust) {
      return res.status(404).json({
        Message: `Customer not found!`
      })
    }
    return res.status(201).json({
      cust
    });
  }).catch(e => {
    if(e.kind === 'ObjectId') {
      return res.status(404).json({
        Message: `Customer not found with id ${id}`
      });   
    }
    return res.status(500).json({
      Message: `Error updating Customer with id ${id}`
  });
  })
}

// ==> Responsible for recovering all customers
exports.listCustomers = async (req, res) => {
  await Customer.find()
    .then(cust => {
        res.send(cust);
    }).catch(err => {
        res.status(500).json({
            Message: err.message || "Some error occurred while retrieving customers."
        });
    });
}
// ==> Responsible for delete customers
exports.deleteCustomers = async (req, res) => {
  const params = req.params.id

  await Customer.findByIdAndRemove(params)
  .then(cust => {
    if (!cust) {
      return res.status(404).json({
        Message: `Customer not found with id ${params}` 
      })
    }
    res.json({Message: `Customer deleted successfully!`})
  }).catch(e => {
    if (e.kind === "ObjectId" || e.name === 'NotFound') {
      return res.status(404).json({
        Message: `"Customer not found with id ${params}`
      });       
    }
    return res.status(500).json({
      Message:  `Could not delete Customer with id ${params}`
    })
  })
}

// ==> Responsable method to return profile
exports.customerProfile = async (req, res) => {
  await res.json(req.userData);
}