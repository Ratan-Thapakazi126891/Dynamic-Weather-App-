/*const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("index.html","utf-8");

const server = http.createServer((req,res)=>{
    if (req.url == "/"){
        requests('https://api.openweathermap.org/data/3.0/onecall/overview?lon=-11.8092&lat=51.509865&appid=fe04c418b2a3cb6dbc1a89da2d9c5cf5', { streaming })
.on('data',  (chunk) =>{
  console.log(chunk)
})
.on('end',  (err) => {
  if (err) return console.log('connection closed due to errors', err);
 
  console.log('end');
});
    }
}) */
    const http = require("http");
    const fs = require("fs");
    const requests = require("requests");
    
    // Read the HTML file
    const homeFile = fs.readFileSync("index.html", "utf-8");
    
    // Function to replace placeholders in the HTML file
    const replaceVal = (template, weatherData) => {
      let result = template.replace("{%temp%}", weatherData.main.temp);
      result = result.replace("{%temp_min%}", weatherData.main.temp_min);
      result = result.replace("{%temp_max%}", weatherData.main.temp_max);
      result = result.replace("{%location%}", weatherData.name);
      result = result.replace("{%country%}", weatherData.sys.country);
      return result;
    };
    
    // Create the server
    const server = http.createServer((req, res) => {
      if (req.url === "/") {
        // Fetch data from OpenWeather API
        requests(
          "https://api.openweathermap.org/data/2.5/weather?lat=51.509865&lon=-11.8092&appid=fe04c418b2a3cb6dbc1a89da2d9c5cf5&units=metric"
        )
          .on("data", (chunk) => {
            const weatherData = JSON.parse(chunk); // Parse JSON data
            const realTimeData = replaceVal(homeFile, weatherData); // Replace placeholders
            res.write(realTimeData); // Send response to client
          })
          .on("end", (err) => {
            if (err) {
              console.log("Connection closed due to errors", err);
              res.end("Error fetching weather data!");
            }
            res.end(); // End response
          });
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
      }
    });
    
    // Start the server
    server.listen(8000, "127.0.0.1", () => {
      console.log("Server is running on http://127.0.0.1:8000");
    });
    