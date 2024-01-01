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
const port = 5086;

app.post('/lime', async (req, res) => {
//   const command = req.body.command;
  const text = req.body.text;
  const responseUrl = req.body.response_url;
  console.log(req.body)

  res.send();

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
        "role": "system",
        "content": `${text}\n\nCan you rephrase the above text into a paragraph for 4-6 lines, in the style of a funny limerick. It should still convey the same message, from the sender to the recipient.`
    }],
});
console.log('result', completion.data.choices[0].message);

  await axios.post(responseUrl, {
    text: `@${req.body.user_name} says...\n\n${completion.data.choices[0].message.content}`,
    response_type: "in_channel",
    as_user: true,
    user: req.body.user_id
  })
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
