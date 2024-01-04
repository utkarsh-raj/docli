#!/usr/bin/env node

const axios = require('axios');

// Get the string argument provided after the command
// const curl = process.argv.slice(2).join(" "); // The argument at index 2 



const commander = require('commander');

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-c, --custom <value>', 'Overwriting value.', 'Default')
  .parse(process.argv);

const options = commander.opts();

const curl = options.custom

console.log(curl)

// Check if a string argument is provided
if (curl) {
  console.log('The string argument is:', curl);

  // Make an API call using Axios and async/await
  const fetchData = async () => {
    try {
      const response = await axios.post(`http://localhost:5086/makeRequest`, {
        curl,
      })
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  fetchData();
} else {
  console.log('No string argument provided.');
}
