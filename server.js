const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mdToPdf } = require("md-to-pdf");
const uuid4 = require("uuid4");
const { Configuration, OpenAIApi } = require("openai");

require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', true);
const port = 5086;

app.all('/createDocs/*',  async (req, res, next) => {
  console.log('request received in /createDocs')  
  
  const baseUrl = "https://" + req.url.split("/createDocs/")[1];
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
      "content": `BaseURL:${JSON.stringify(baseUrl)}\nRequestBody"${JSON.stringify(requestBody)}\nHeaders:${JSON.stringify(requestHeaders)}\nResponse${JSON.stringify(queryResponse)}\nThese are the corresponding data for an API Endpoint. Based on these, make an API Documentation in markdown. Include the way to make the request, parse the important headers and add metadata to the best of your knowledge. Share the sample response and add other types of responses based on your knowledge and understanding of the data. Remove the headers that are commonly not passed by the users. Make the API Documentation as classy looking as possible.`
    }],
  });

  const uniqueDocumentationId = uuid4();
  const fileDestination = `/Users/utkarsh/projects/docli/${uniqueDocumentationId}.pdf` 
  await mdToPdf({content: completion.data.choices[0].message.content}, {dest:fileDestination});
  res.sendFile(fileDestination);
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
