const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { exec } = require('child_process');


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
  
  try {
    const response = await executeCurlCommand(curl);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
  // const completion = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [{
  //     "role": "system",
  //     "content": `${text}\n\ This is the cURL for an API Endpoint. Can you make an API documentation for this Endpoint. Please include the Headers, HTTP Request Types, Request body, sample request body and Status codes, sample responses for all the cases.`
  //   }],
  // });
  // console.log('result', completion.data.choices[0].message);
});

const curlCommand = `curl -X POST "https://api.example.com/data" -H "Content-Type: application/json" -d '{"key": "value"}'`;

function executeCurlCommand(curlCommand) {
  console.log(curlCommand)
  return new Promise((resolve, reject) => {
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing CURL command: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`CURL command encountered an error: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
