'use strict';

const customers = [
  {id: 1, nome: "Maria", idade: 20},
  {id: 2, nome: "Joao", idade: 30},
  {id: 3, nome: "Jose", idade: 45},
  {id: 4, nome: "aline", idade: 33}
];

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: "CUSTOMER",
};

module.exports.listcustomer = (event, context, callback) => {
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the customer.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};