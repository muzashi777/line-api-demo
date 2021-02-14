const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
// const con = require("./databaseConfig/databaseConfig");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const routes = require("./routes");

app.use("/", routes);

app.listen(port, () => console.log(`listening to ${port}...`));
