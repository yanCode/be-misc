import express from "express";
import { authRole, authUser } from "./basicAuth.js";
import {  ROLE } from "./data.js";
import projectRouter from "./routes/projects.js";
const app = express();

app.use(setUser);

app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/projects", projectRouter);
app.get("/dashboard", (req, res) => {
  res.send("Dashboard");
});
app.get("/amin", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send("Admin Page");
});

function setUser(req, res, next) {
  const userId = req.body.userId;
  if (userId) {
    req.user = users.find((user) => user.id === userId);
  }
  next();
}
app.listen(3000, () => {
  console.log("listening on port 3000");
});
