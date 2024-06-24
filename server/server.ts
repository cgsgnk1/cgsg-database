import * as http from "http";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import * as ejs from "ejs";

const { MongoClient, ServerApiVersion } = require('mongodb');
import * as mongoose from "mongoose";

export class CurrentUsersData {
  static clients: any[] = [];
}

const localDB = `mongodb://localhost:27017/role_auth`;
const AR5DB = `mongodb+srv://doadmin:x62jNC54Pi1W3t98@db-mongodb-pml30-2024-12312526.mongo.ondigitalocean.com/admin?tls=true&authSource=admin`;

import { router } from "./router";
import { routerAuthorize, routerAuthorizeAdmin } from "./reg/protecting";

const connectDB = async () => {
  await mongoose.connect(AR5DB, {dbName: "PML30-2024-S"}); 
  console.log("MongoDB Connected");
}

connectDB();

export interface IDynamic {
  [key: string] : any,
}

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use("/", router);

app.get("/", (req, res) => {
  // console.log("222");
  res.render("index");
});

app.get("/reg", (req, res) => {
  res.render("reg");
});

app.get("/reg/signInPage", (req, res) => {
  res.render("reg/sign-in");
});

app.get("/reg/signUpPage", (req, res) => {
  res.render("reg/sign-up");
});

app.get("/default", routerAuthorize, (req, res) => {
  res.render("default");
});

app.get("/default/returnToDefaultPage", routerAuthorize, (req, res) => {
  res.redirect("/default");
});

app.get("/default/returnToMapPage", routerAuthorize, (req, res) => {
  res.redirect("/default/mapPage");
});

app.get("/default/accountPage", routerAuthorize, (req, res) => {
  res.render("default/account");
});

app.get("/default/mapPage", routerAuthorize, (req, res) => {
  res.render("default/map");
});

app.get("/default/userSearchPage", routerAuthorize, (req, res) => {
  res.render("default/user-search");
});

app.get("/default/chatPage", routerAuthorize, (req, res) => {
  res.render("default/chat");
});

app.get("/default/accountViewerPage", routerAuthorize, (req, res) => {
  res.render("default/account-viewer");
});

app.get("/default/admin/panelPage", routerAuthorizeAdmin, (req, res) => {
  res.render("default/admin/panel");
});

app.get("/default/admin/accountViewerPage", routerAuthorizeAdmin, (req, res) => {
  res.render("default/admin/account-viewer");
});

app.get("/default/admin/returnToAdminPanelPage", routerAuthorizeAdmin, (req, res) => {
  res.redirect("/default/admin/panelPage");
});

app.get("/sign-out", (req, res) => {
  res.cookie("jwtToken", "", {maxAge: 0.1});
  res.redirect("/");
});

app.use(express.static("."));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket: any) => {
  CurrentUsersData.clients.push(socket);

  console.log(`Client connected with id: ${socket.id}`);

  socket.on("fClientWriteMessage", (message: string) => {
    for (const client of CurrentUsersData.clients) {
      client.emit("fServerWriteMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = CurrentUsersData.clients.indexOf(socket);
    if (index > -1) {
      CurrentUsersData.clients.splice(index, 1);
    }
  });
});

const port = 3000;

server.listen(process.env.PORT || port, () => {
  let address = server.address();
  if (address)
    console.log(`Server started on port ${port}.`);
});
