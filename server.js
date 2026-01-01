import 'dotenv/config';
import express from "express";

const app = express();
const PORT = process.env.PORT 


import { getMysqlConn, initMysqlDb } from "./utils/mysqldb.js";
import { getMongoConn, initMongoDb } from "./utils/mongodb.js";
import auth from "./routes/auth.js"
import messages from "./routes/messages.js"
import users from "./routes/users.js"


app.use(express.json());

app.use(async (req, res, next) => {
  req.mongoConn = await getMongoConn();
  req.mysqlConn = await getMysqlConn();
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to API",
    version: "1.0.0",
  });
});

app.use("/api/auth", auth)
app.use("/api/messages", messages)
app.use("/api/users", users)


app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}...`);

  await initMysqlDb()
  console.log('Connected to sql')
  await initMongoDb()
  console.log('connected to mongo')
});