const express = require('express');
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth')
const router = express.Router();

/**
 * ==> create a new custom:
 * TEST: localhos:3333/api/v1/register
 */
router.post('/register', customerController.registerNewCustomer);
/**
 * ==> login custom route
 * TEST: localhos:3333/api/v1/login
 */
router.post('/login', customerController.loginCustomer)
/**
 * ==> profile custom route
 * TEST: localhos:3333/api/v1/profile
 */
router.get('/profile', auth, customerController.customerProfile)
/**
 * ==> list all registers customs 
 * TEST: localhos:3333/api/v1/customers
*/
router.get('/customers', customerController.listCustomers)
/**
  * ==> Delete customers 
  * TEST: localhos:3333/api/v1/customers/delete/:id
 */
router.delete('/customers/delete/:id', customerController.deleteCustomers)
/**
 * ==> Update customers fields
 * TEST: localhos:3333/api/v1/customers/update/:id
 */
router.put('/customer/update/:id', customerController.updateCustomers)

module.exports = router;