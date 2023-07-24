const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
// Packages/Functions Import
const { connectDB } = require("./utils/databaseConnect");
connectDB().then((con) => {
  global.connection = con;
});

app.get("/", (req, res) => {
  res.json({
    message: "Everything is running....",
  });
});

// Routes
app.use("/api", require("./routes/routes"));

app.listen(PORT, (err) => {
  console.log(`Server is listening on port ${PORT}`);
  if (err) {
    throw new Error("Something went wrong...");
  }
});
