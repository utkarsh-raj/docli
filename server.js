const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const port = 5086;

app.post('/makeRequest',  async (req, res) => {
  console.log('request received in /makeRequest')
  const curl = req.body.curl;

  res.send(curl)

  // const completion = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [{
  //     "role": "system",
  //     "content": `${text}\n\ This is the cURL for an API Endpoint. Can you make an API documentation for this Endpoint. Please include the Headers, HTTP Request Types, Request body, sample request body and Status codes, sample responses for all the cases.`
  //   }],
  // });
  // console.log('result', completion.data.choices[0].message);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
