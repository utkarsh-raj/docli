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
// Trust the proxy to handle protocols
app.set('trust proxy', true);
const port = 5086;

app.all('/makeRequest/*',  async (req, res) => {
  console.log('request received in /makeRequest')  
  
  const baseUrl = "https://" + req.url.split("/makeRequest/")[1];

  const requestBody = req.body;
  const requestHeaders = req.headers; 
  delete requestHeaders.host;

  const response = await axios(baseUrl,{
    method: req.method,
    headers: {...requestHeaders},
    data: requestBody
  });

  const queryResponse = response.data;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      "role": "system",
      "content": `BaseURL:${JSON.stringify(baseUrl)}\nRequestBody"${JSON.stringify(requestBody)}\nHeaders:${JSON.stringify(requestHeaders)}\nResponse${JSON.stringify(queryResponse)}\nThese are the corresponding data for an API Endpoint. Based on these, make an API Documentation in markdown. Include the way to make the request, parse the important headers and add metadata to the best of your knowledge. Share the sample response and add other types of responses based on your knowledge and understanding of the data.`
    }],
  });

  console.log('result', completion.data.choices[0].message);
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
