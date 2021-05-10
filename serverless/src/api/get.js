'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getcustomer = async (event) => {
  try {
    
    const params = {
      TableName: 'CUSTOMER',
    };

    const { customerId } = event.pathParameters

    const data = await dynamoDb
    .get({
      ...params,
      Key: {
        customer_id: customerId,
      },
    })
    .promise();

    if(!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Customer not exist!" }, null, 2),
      }

    }

    const customer = data.Item

    return {
      statusCode: 200,
      body: JSON.stringify(customer, null, 2),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }

};