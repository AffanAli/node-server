const http = require("http");
const https = require("https");
const url = require("url");

require("dotenv").config(); // Load environment variables from .env file
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

function getTitle(address, callback) {
  let parsedUrl;
  try {
    parsedUrl = new URL(
      address.startsWith("http") ? address : `http://${address}`
    );
  } catch (error) {
    return callback(null, { address, error: "NO RESPONSE" });
  }
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
          callback(null, { address, title: match[1] });
        } else {
          callback(null, { address, error: "NO RESPONSE" });
        }
      });
    })
    .on("error", () => {
      callback(null, { address, error: "NO RESPONSE" });
    });
}

http
  .createServer((req, res) => {
    if (req.url.startsWith("/I/want/title/")) {
      const query = url.parse(req.url, true).query;
      const addresses = Array.isArray(query.address)
        ? query.address
        : [query.address];

      if (addresses.length === 0) {
        res.writeHead(400);
        return res.end("No addresses provided");
      }

      console.log(`Received request for: ${addresses.join(' | ')}`);

      let results = [];
      let completedRequests = 0;

      addresses.forEach((address) => {
        getTitle(address, (err, result) => {
          results.push(result);
          completedRequests++;
          if (completedRequests === addresses.length) {
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
          }
        });
      });
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  })
  .listen(PORT, () => {
    console.log(`Simple http Server is listening on port ${PORT}`);
  });
