var express = require("express");
const bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
var app = express();
const mountRoutes = require("./routes/index");

app.use(bodyParser.json({ limit: "10mb" }));

mountRoutes(app);

app.listen(port, function () {
 console.log(`Example app listening on port ${port}!`);
});