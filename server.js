const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const { mdToPdf } = require("md-to-pdf");
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
      "content": `BaseURL:${JSON.stringify(baseUrl)}\nRequestBody"${JSON.stringify(requestBody)}\nHeaders:${JSON.stringify(requestHeaders)}\nResponse${JSON.stringify(queryResponse)}\nThese are the corresponding data for an API Endpoint. Based on these, make an API Documentation in markdown. Include the way to make the request, parse the important headers and add metadata to the best of your knowledge. Share the sample response and add other types of responses based on your knowledge and understanding of the data. Remove the headers that are commonly not passed by the users. Make the API Documentation as classy looking as possible.`
    }],
  });
  // const completion = {
  //   data: {
  //     choices: [
  //       {
  //         message: {
  //           role: 'assistant',
  //           content: '# AML Search API\n' +
  //             '\n' +
  //             "The AML Search API provides a way to search for individuals in the anti-money laundering (AML) database. It allows you to check if a person's name and date of birth match any records in the database.\n" +
  //             '\n' +
  //             '## API Endpoint\n' +
  //             '\n' +
  //             '`POST /v1/amlSearch`\n' +
  //             '\n' +
  //             'The API endpoint for making AML search requests.\n' +
  //             '\n' +
  //             '## Request Body\n' +
  //             '\n' +
  //             'The request body should be a JSON object with the following properties:\n' +
  //             '\n' +
  //             '- `name`: The name of the individual to search for.\n' +
  //             '- `dob`: The date of birth of the individual to search for.\n' +
  //             '- `countryId`: The country ID of the individual to search for.\n' +
  //             '\n' +
  //             'Example:\n' +
  //             '\n' +
  //             '```json\n' +
  //             '{\n' +
  //             '  "name": "Gurwinder Singh",\n' +
  //             '  "dob": "04-06-2000",\n' +
  //             '  "countryId": "IND"\n' +
  //             '}\n' +
  //             '```\n' +
  //             '\n' +
  //             '## Headers\n' +
  //             '\n' +
  //             'The following headers are required for making an API request:\n' +
  //             '\n' +
  //             '- `transactionid`: The transaction ID for tracking the request. Example: `dev-testing_28_December`\n' +
  //             '- `appid`: The application ID for authentication. Example: `ad678a`\n' +
  //             '- `appkey`: The application key for authentication. Example: `a088b033b0785eb81acf`\n' +
  //             '- `content-type`: The content type of the request. Example: `application/json`\n' +
  //             '- `user-agent`: The user agent of the client making the request. Example: `PostmanRuntime/7.35.0`\n' +
  //             '- `accept`: The accepted response format. Example: `*/*`\n' +
  //             '- `cache-control`: The cache control policy for the request. Example: `no-cache`\n' +
  //             '- `postman-token`: The token for the Postman client. Example: `8ca39ae6-e644-4534-ace7-828afffc23c1`\n' +
  //             '- `accept-encoding`: The accepted encoding for the response. Example: `gzip, deflate, br`\n' +
  //             '- `connection`: The connection type for the request. Example: `keep-alive`\n' +
  //             '- `content-length`: The length of the request body. Example: `63`\n' +
  //             '\n' +
  //             '## Response\n' +
  //             '\n' +
  //             'The response will be a JSON object with the following properties:\n' +
  //             '\n' +
  //             '- `statusCode`: The HTTP status code of the response. Example: `200`\n' +
  //             '- `metaData`: Metadata associated with the request.\n' +
  //             '  - `transactionId`: The transaction ID of the request. Example: `dev-testing_28_December`\n' +
  //             '  - `requestId`: The request ID of the request. Example: `1704392288662-35842b65-d22d-4f56-997b-d9f253549782`\n' +
  //             '- `summary`: Summary information about the search result.\n' +
  //             '  - `action`: The recommended action based on the search result. Example: `manualReview`\n' +
  //             '  - `details`: Additional details about the search result.\n' +
  //             '    - `code`: An identifier code for the hit. Example: `433`\n' +
  //             '    - `message`: A message describing the hit. Example: `Found 2 hit(s)`\n' +
  //             '- `result`: The search result.\n' +
  //             '  - `hits`: An array of hits matched in the AML database.\n' +
  //             '    - `name`: The name of the matched individual.\n' +
  //             '    - `id`: The unique ID of the matched individual.\n' +
  //             '    - `updatedAt`: The date and time when the record was last updated.\n' +
  //             '    - `createdAt`: The date and time when the record was created.\n' +
  //             '    - `aka`: Any known aliases of the individual.\n' +
  //             '    - `sources`: Information about the sources of the hit.\n' +
  //             '      - `adverseMedia`: Adverse media information about the individual.\n' +
  //             '      - `pep`: Politically exposed person information about the individual.\n' +
  //             '      - `sanction`: Sanction information about the individual.\n' +
  //             '        - `name`: The name of the sanctioning authority.\n' +
  //             '        - `url`: The URL for more information about the sanction.\n' +
  //             '        - `countryCodes`: The country codes associated with the sanction.\n' +
  //             '      - `warning`: Warning information about the individual.\n' +
  //             '      - `fitnessProbity`: Fitness and probity information about the individual.\n' +
  //             '    - `associates`: Information about any known associates of the individual.\n' +
  //             '    - `countryMatch`: Indicates whether the country of the individual matches the search country.\n' +
  //             '    - `dob`: Date of birth information about the individual.\n' +
  //             '    - `countries`: Countries associated with the individual.\n' +
  //             '    - `nameMatch`: Indicates the name match type.\n' +
  //             '    - `hitId`: The ID of the hit.\n' +
  //             '    - `details`: Additional details about the hit.\n' +
  //             '      - `countryMatch`: Indicates whether the country of the individual matches the search country.\n' +
  //             '      - `exactNameMatch`: Indicates an exact name match.\n' +
  //             '      - `countryExists`: Indicates if the country exists in the search result.\n' +
  //             '    - `relevanceScore`: The relevance score of the hit.\n' +
  //             '\n' +
  //             'Example:\n' +
  //             '\n' +
  //             '```json\n' +
  //             '{\n' +
  //             '  "statusCode": 200,\n' +
  //             '  "metaData": {\n' +
  //             '    "transactionId": "dev-testing_28_December",\n' +
  //             '    "requestId": "1704392288662-35842b65-d22d-4f56-997b-d9f253549782"\n' +
  //             '  },\n' +
  //             '  "summary": {\n' +
  //             '    "action": "manualReview",\n' +
  //             '    "details": [\n' +
  //             '      {\n' +
  //             '        "code": 433,\n' +
  //             '        "message": "Found 2 hit(s)"\n' +
  //             '      }\n' +
  //             '    ]\n' +
  //             '  },\n' +
  //             '  "result": {\n' +
  //             '    "hits": [\n' +
  //             '      {\n' +
  //             '        "name": "Gurwinder Singh",\n' +
  //             '        "id": null,\n' +
  //             '        "updatedAt": "2023-06-22T15:32:25.000Z",\n' +
  //             '        "createdAt": "2023-06-22T15:32:25.000Z",\n' +
  //             '        "aka": [\n' +
  //             '          "Baba"\n' +
  //             '        ],\n' +
  //             '        "sources": {\n' +
  //             '          "adverseMedia": [],\n' +
  //             '          "pep": [],\n' +
  //             '          "sanction": [\n' +
  //             '            {\n' +
  //             '              "name": [\n' +
  //             '                "National Investigation Agency of India"\n' +
  //             '              ],\n' +
  //             '              "url": [\n' +
  //             '                "https://www.nia.gov.in/wanted-details.htm?866"\n' +
  //             '              ],\n' +
  //             '              "countryCodes": [\n' +
  //             '                "IN"\n' +
  //             '              ]\n' +
  //             '            }\n' +
  //             '          ],\n' +
  //             '          "warning": [],\n' +
  //             '          "fitnessProbity": []\n' +
  //             '        },\n' +
  //             '        "associates": [],\n' +
  //             '        "countryMatch": true,\n' +
  //             '        "dob": [],\n' +
  //             '        "countries": [\n' +
  //             '          "India"\n' +
  //             '        ],\n' +
  //             '        "nameMatch": [\n' +
  //             '          "Exact name match"\n' +
  //             '        ],\n' +
  //             '        "hitId": "855b0818-a78c-4fe1-b069-fb4f9bc73353",\n' +
  //             '        "details": {\n' +
  //             '          "countryMatch": true,\n' +
  //             '          "exactNameMatch": true,\n' +
  //             '          "countryExists": true\n' +
  //             '        },\n' +
  //             '        "relevanceScore": 12\n' +
  //             '      },\n' +
  //             '      {\n' +
  //             '        "name": "Gurwinder Singh",\n' +
  //             '        "id": null,\n' +
  //             '        "updatedAt": "2023-06-22T15:32:25.000Z",\n' +
  //             '        "createdAt": "2023-06-22T15:32:25.000Z",\n' +
  //             '        "aka": [\n' +
  //             '          "Baba"\n' +
  //             '        ],\n' +
  //             '        "sources": {\n' +
  //             '          "adverseMedia": [],\n' +
  //             '          "pep": [],\n' +
  //             '          "sanction": [\n' +
  //             '            {\n' +
  //             '              "name": [\n' +
  //             '                "National Investigation Agency of India"\n' +
  //             '              ],\n' +
  //             '              "url": [\n' +
  //             '                "https://www.nia.gov.in/wanted-details.htm?866"\n' +
  //             '              ],\n' +
  //             '              "countryCodes": [\n' +
  //             '                "IN"\n' +
  //             '              ]\n' +
  //             '            }\n' +
  //             '          ],\n' +
  //             '          "warning": [],\n' +
  //             '          "fitnessProbity": []\n' +
  //             '        },\n' +
  //             '        "associates": [],\n' +
  //             '        "countryMatch": true,\n' +
  //             '        "dob": [],\n' +
  //             '        "countries": [\n' +
  //             '          "India"\n' +
  //             '        ],\n' +
  //             '        "nameMatch": [\n' +
  //             '          "Exact name match"\n' +
  //             '        ],\n' +
  //             '        "hitId": "cf858777-3b68-4a39-a46e-4417ed58db99",\n' +
  //             '        "details": {\n' +
  //             '          "countryMatch": true,\n' +
  //             '          "exactNameMatch": true,\n' +
  //             '          "countryExists": true\n' +
  //             '        },\n' +
  //             '        "relevanceScore": 12\n' +
  //             '      }\n' +
  //             '    ]\n' +
  //             '  }\n' +
  //             '}\n' +
  //             '```\n' +
  //             '\n' +
  //             '## Additional Response Types\n' +
  //             '\n' +
  //             '### 400 Bad Request\n' +
  //             '\n' +
  //             'Example:\n' +
  //             '\n' +
  //             '```json\n' +
  //             '{\n' +
  //             '  "statusCode": 400,\n' +
  //             '  "error": "Bad Request",\n' +
  //             '  "message": "Invalid request body"\n' +
  //             '}\n' +
  //             '```\n' +
  //             '\n' +
  //             '### 401 Unauthorized\n' +
  //             '\n' +
  //             'Example:\n' +
  //             '\n' +
  //             '```json\n' +
  //             '{\n' +
  //             '  "statusCode": 401,\n' +
  //             '  "error": "Unauthorized",\n' +
  //             '  "message": "Invalid app ID or app key"\n' +
  //             '}\n' +
  //             '```\n' +
  //             '\n' +
  //             '### 403 Forbidden\n' +
  //             '\n' +
  //             'Example:\n' +
  //             '\n' +
  //             '```json\n' +
  //             '{\n' +
  //             '  "statusCode": 403,\n' +
  //             '  "error": "Forbidden",\n' +
  //             '  "message": "Invalid user permissions"\n' +
  //             '}\n' +
  //             '```\n' +
  //             '\n' +
  //             '### 500 Internal Server Error\n' +
  //             '\n' +
  //             'Example:\n' +
  //             '\n' +
  //             '```json\n' +
  //             '{\n' +
  //             '  "statusCode": 500,\n' +
  //             '  "error": "Internal Server Error",\n' +
  //             '  "message": "An unexpected error occurred"\n' +
  //             '}\n' +
  //             '```'
  //         }
  //       }
  //     ]
  //   }
  // }
  console.log('result', completion.data.choices[0].message);

  
  await mdToPdf({content: completion.data.choices[0].message.content}, {dest: 'test.pdf'});
  // await fs.promises.writeFile('test3.pdf', completion.data.choices[0].message.content)
  res.send('ok')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
