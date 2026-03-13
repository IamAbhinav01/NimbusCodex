const express = require("express");
const labRoutes = require("./routes/labRoutes");

const app = express();

app.use(express.json());
app.use("/labs", labRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});