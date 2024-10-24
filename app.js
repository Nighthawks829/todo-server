require("dotenv").config();
const createServer = require("./utils/server");

const port = process.env.PORT || 5000;

const app = createServer();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
