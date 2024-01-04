import axios from "axios";
import { command } from 'commander';

command('test <curlCommand>')
  .description('Make a curl request')
  .action((curlCommand) => {
    const parsedCurl = parseCurlCommand(curlCommand);

    axios(parsedCurl.url, parsedCurl.options)
      .then(response => console.log(response.data))
      .catch(error => console.error('Error:', error));
  });

// ... (rest of the code)

function parseCurlCommand(curlCommand) {
  // Enhanced parsing logic to extract headers, body, and files
  const url = curlCommand.match(/https?:\/\/[^\s]+/)[0];
  const options = {};

  // Extract headers
  const headers = curlCommand.match(/-H ([^\s]+)/g);
  if (headers) {
    options.headers = headers.map(header => header.split(':')[1].trim());
  }

  // Extract request body (assuming JSON format)
  const bodyMatch = curlCommand.match(/--data-raw|-d '([^']*)'/);
  if (bodyMatch) {
    options.data = JSON.parse(bodyMatch[1]);
  }

  // Extract files (assuming multipart/form-data)
  const filesMatch = curlCommand.match(/--form ([^=]+)=@([^\s]+)/g);
  if (filesMatch) {
    options.formData = new FormData();
    filesMatch.forEach(file => {
      options.formData.append(file.split('=')[1], file.split('=')[2]);
    });
  }

  return { url, options };
}
