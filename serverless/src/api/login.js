'use strict';

const AWS = require('aws-sdk');
const { matchPassword } = require('../utils/password');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.login = async (event) => {
  try {

    const params = {
      TableName: 'CUSTOMERDB',
    };

    let { email, password } = JSON.parse(event.body)

    if (email && password) {
      const data = await dynamoDb.get({
        ...params,
        Key: {
          email: email,
        }
      }).promise();

      if (data.Item) {
        return console.log(data.Item)
      }
    }

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
}