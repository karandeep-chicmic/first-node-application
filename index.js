import { getUsers, createUser, deleteUser, updateUser } from "./crudOperations.js";
import { STATUS_CODES, createServer } from "node:http";

// port to listen to.
const PORT = 8000;


// create server callback
const requestHandler = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      if (body === "") {
        body = "{}";
      }
      const parsedBody = JSON.parse(body);
      console.log(req.url);
      if (
        req.method === "GET" &&
        (req.url === "/" || req.url.includes("?id="))
      ) {
        getUsers(req, res);
      } else if (req.method === "POST" && req.url === "/") {
        createUser(req, parsedBody, res);
      } else if (
        req.method === "DELETE" &&
        (req.url === "/" || req.url.includes("?id="))
      ) {
        deleteUser(req, res);
      } else if (
        req.method === "PUT" &&
        (req.url === "/" || req.url.includes("?id="))
      ) {
        updateUser(req, parsedBody, res);
      }
    } catch (error) {
      res.end(JSON.stringify({ error: error }));
    }
  });
};

// create a server
const server = createServer(requestHandler);

// listen to the port
server.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
