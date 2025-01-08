/* Modules */
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';


// Initialize the Express application
const app = express();

// Define the port number for the server to listen on
const port = 80;




// static files directory (CSS, JS, images, etc.)
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.use(express.static(path.join(__dirname, 'static')));




// Define a route for the root URL ('/') and specify the response
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Send 'Hello, World!' as the response
});

// Start the server and have it listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // Log a message to the console indicating the server is running
});
