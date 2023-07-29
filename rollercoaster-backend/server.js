const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ridesRouter = require("./routes/coasters");
app.use("/api", ridesRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
