const url = require("url");
const path = require("path");
const fs = require("fs");

// Query string

//  to get users on basis of query params and if no query param then show all users
function getUsers(req, res) {
  console.log("Inside GET");

  const filePath = path.join(__dirname, "userData.json");
  const parsedUrl = url.parse(req.url, true);
  const { id } = parsedUrl.query;

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);
    console.log(jsonData);

    let responseData;
    // If id in query params
    if (id) {
      const user = jsonData.dataArray.find((user) => user.id === parseInt(id));
      if (user) {
        responseData = JSON.stringify(user);
      } else {
        responseData = "No user found with related id!!";
      }
    } else {
      responseData = JSON.stringify({ userData: jsonData.dataArray });
    }

    res.end(responseData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    res.end("Internal Server Error");
  }
}

// To create a new User
function createUser(req, parsedBody, res) {
  console.log("Inside POST");
  const filePath = path.join(__dirname, "userData.json");

  const objToSaveToDb = {
    id: Date.now(),
    name: parsedBody.name,
    age: parsedBody.age,
    email: parsedBody.email,
    city: parsedBody.city,
  };

  if (
    !objToSaveToDb.name ||
    !objToSaveToDb.age ||
    !objToSaveToDb.email ||
    !objToSaveToDb.city
  ) {
    res.end("userFields cant be empty");
    return;
  }

  const usersArr = fs.readFileSync(filePath, "utf-8");
  const usersJson = JSON.parse(usersArr);

  const user = usersJson.dataArray.find(
    (data) => data.email === objToSaveToDb.email
  );

  if (user) {
    res.end("Email Already exists in Db!!");
    return;
  }

  //  push to the array
  usersJson.dataArray.push(objToSaveToDb);

  fs.writeFileSync(filePath, JSON.stringify(usersJson));

  res.end(JSON.stringify(objToSaveToDb));
}

// To delete the user
function deleteUser(req, res) {
  console.log("Inside DELETE");
  const filePath = path.join(__dirname, "userData.json");
  const parsedUrl = url.parse(req.url, true);
  const { id } = parsedUrl.query;

  const usersDb = fs.readFileSync(filePath, "utf-8");
  const usersJson = JSON.parse(usersDb);

  const user = usersJson.dataArray.find((data) => data.id === Number(id));

  console.log(id);
  if (!user) {
    res.end("User Not Found!!");
    return;
  }
  usersJson.dataArray = [
    ...usersJson.dataArray.filter((data) => data.id !== Number(id)),
  ];

  fs.writeFileSync(filePath, JSON.stringify(usersJson));
  res.end("User Successfully Deleted!!");
}

//  To update the user
function updateUser(req, parsedBody, res) {
  console.log("Inside PUT");

  const parsedUrl = url.parse(req.url, true);
  const { id } = parsedUrl.query;

  const filePath = path.join(__dirname, "userData.json");

  const objToSaveToDb = {
    id: Number(id),
    name: parsedBody.name,
    age: parsedBody.age,
    email: parsedBody.email,
    city: parsedBody.city,
  };

  if (
    !objToSaveToDb.name ||
    !objToSaveToDb.age ||
    !objToSaveToDb.email ||
    !objToSaveToDb.city
  ) {
    res.end("userFields cant be empty");
    return;
  }
  const usersDb = fs.readFileSync(filePath, "utf-8");
  const usersJson = JSON.parse(usersDb);
  const user = usersJson.dataArray.find((data) => {
    return data.id === objToSaveToDb.id;
  });

  if (!user) {
    res.end("User Not Found in Db!!");
    return;
  }

  usersJson.dataArray = [
    ...usersJson.dataArray.filter((data) => data.id !== objToSaveToDb.id),
  ];

  usersJson.dataArray.push(objToSaveToDb);

  fs.writeFileSync(filePath, JSON.stringify(usersJson));

  res.end(JSON.stringify(objToSaveToDb));
}

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
