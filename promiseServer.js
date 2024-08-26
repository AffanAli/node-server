const http = require("http");
const https = require("https");
const url = require("url");
const { promisify } = require("util");

require("dotenv").config(); // Load environment variables from .env file
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

function getTitle(address) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(
        address.startsWith("http") ? address : `http://${address}`
      );
      const protocol = parsedUrl.protocol === "https:" ? https : http;

      protocol
        .get(parsedUrl, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            const match = data.match(/<title>([^<]*)<\/title>/);
            if (match && match[1]) {
              resolve({ address, title: match[1] });
            } else {
              resolve({ address, error: "NO RESPONSE" });
            }
          });
        })
        .on("error", () => {
          resolve({ address, error: "NO RESPONSE" });
        });
    } catch (error) {
      resolve({ address, error: "NO RESPONSE" });
    }
  });
}

http
  .createServer(async (req, res) => {
    if (req.url.startsWith("/I/want/title/")) {
      const query = url.parse(req.url, true).query;
      const addresses = Array.isArray(query.address)
        ? query.address
        : [query.address];

      if (addresses.length === 0) {
        res.writeHead(400);
        return res.end("No addresses provided");
      }

      console.log(`Received request for: ${addresses.join(" | ")}`);

      const results = await Promise.all(addresses.map(getTitle));

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        "<html><head></head><body><h1>Following are the titles of given websites:</h1><ul>"
      );
      results.forEach((result) => {
        if (result.error) {
          res.write(`<li>${result.address} - ${result.error}</li>`);
        } else {
          res.write(`<li>${result.address} - "${result.title}"</li>`);
        }
      });
      res.write("</ul></body></html>");
      res.end();
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  })
  .listen(PORT, () => {
    console.log(`Server with promises is listening on port ${PORT}`);
  });
