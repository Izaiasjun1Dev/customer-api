'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");
const { generateCookie, verifyCookie } = require("../utils/cookie");
const { hashPassword } = require('../utils/password');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event) => {
  try {
    const timestamp = new Date().getTime();

    let dados = JSON.parse(event.body);

    const { name, birth_date, email, phone, password } = dados;

    const token = await hashPassword(password)

    const customer = {
      customer_id: uuidv4(),
      name,
      birth_date,
      email,
      phone,
      token,
      status: true,
      created_at: timestamp,
      update_at: timestamp,
    };

    await dynamoDb
      .put({
        TableName: "CUSTOMERDB",
        Item: customer,
      })
      .promise();

    const cookie = generateCookie(customer.customer_id, 1)

    return {
      statusCode: 201,
      headers: {
        "Set-Cookie": cookie,
      },
      body: JSON.stringify({ 
        success: `Customer ${customer.name} created success!` 
      }),
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