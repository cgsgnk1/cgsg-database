"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/server.ts
var server_exports = {};
__export(server_exports, {
  CurrentUsersData: () => CurrentUsersData
});
module.exports = __toCommonJS(server_exports);
var http = __toESM(require("http"));
var import_express2 = __toESM(require("express"));
var import_morgan = __toESM(require("morgan"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_socket = require("socket.io");
var ejs = __toESM(require("ejs"));
var mongoose4 = __toESM(require("mongoose"));

// server/router.ts
var import_express = __toESM(require("express"));

// server/models/user.ts
var import_mongoose = __toESM(require("mongoose"));
var ModelUser = class {
  static userSchema = {
    name: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      minlength: 8,
      required: true
    },
    registrationDate: {
      type: Number,
      default: -1,
      required: true
    },
    accessRights: {
      type: String,
      default: "Default",
      required: true
    },
    avatar: {
      type: String,
      default: "./avatarDefault.png",
      required: true
    },
    ns: {
      type: String,
      required: false
    },
    lat: {
      type: Number,
      required: false
    },
    lon: {
      type: Number,
      required: false
    },
    place: {
      type: String,
      required: false
    },
    fullPlace: {
      type: String,
      required: false
    },
    mail: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    yearOfGrade: {
      type: Number,
      required: false
    },
    classOfGrade: {
      type: Number,
      required: false
    },
    addonInfo: {
      type: String,
      required: false
    }
  };
  static model = import_mongoose.default.model("User", this.userSchema, "NK1_users");
};

// server/models/session.ts
var import_mongoose2 = __toESM(require("mongoose"));
var ModelSession = class {
  static sessionSchema = {
    key: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  };
  static model = import_mongoose2.default.model("Session", this.sessionSchema);
  static getRandomSessionId() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 40; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  static async get(sessionId, result) {
    const session = await this.model.findOne({ key: sessionId });
    if (session) {
      result.name = session.name;
    }
  }
};

// server/reg/sign-up.ts
var bcryptjs = __toESM(require("bcryptjs"));
var jsonwebtoken = __toESM(require("jsonwebtoken"));
var jwtSecret = "455b4d85547e11590929fd2a63ccc7d12fbe78721cf78721cf";
var jwtExpirationTime = 24 * 60 * 60;
async function routerSignUp(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "Not enough data for res" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password length is must to be more or equal than 8 symbols" });
  }
  try {
    await bcryptjs.hash(password, 12).then(async (hashedPassword) => {
      await ModelUser.model.create({
        name,
        password: hashedPassword,
        registrationDate: Date.now()
      }).then(async (user) => {
        const token = jsonwebtoken.sign({
          id: user._id,
          name,
          accessRights: user.accessRights
        }, jwtSecret, {
          expiresIn: jwtExpirationTime
        });
        res.cookie("jwtToken", token, { httpOnly: true, maxAge: jwtExpirationTime * 1e3 });
        return res.status(200).json({ message: "User sign up succeeded", user });
      });
    });
  } catch (err) {
    return res.status(401).json({ message: "This username already exists!" });
  }
}
async function routerAdminEditPassword(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "Not enough data for res" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password length is not enough" });
  }
  await bcryptjs.hash(password, 12).then(async (hashedPassword) => {
    const conditions = { name };
    const updates = { password: hashedPassword };
    await ModelUser.model.findOneAndUpdate(conditions, updates);
    return res.status(200).json({ message: "Admin edit password success" });
  });
}

// server/reg/sign-in.ts
var bcryptjs2 = __toESM(require("bcryptjs"));
var jsonwebtoken2 = __toESM(require("jsonwebtoken"));
async function routerSignIn(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "Not enough data for res" });
  }
  try {
    const user = await ModelUser.model.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "Incorrect username or password!" });
    } else {
      await bcryptjs2.compare(
        password,
        user.password
        /* hashed password*/
      ).then((result) => {
        if (result) {
          const token = jsonwebtoken2.sign({
            id: user._id,
            name,
            accessRights: user.accessRights
          }, jwtSecret, {
            expiresIn: jwtExpirationTime
          });
          res.cookie("jwtToken", token, { httpOnly: true, maxAge: jwtExpirationTime * 1e3 });
          return res.status(200).json({ message: "User sign in succeeded", user });
        }
        return res.status(401).json({ message: "Incorrect username or password!", user });
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown server error" });
  }
}

// server/reg/protecting.ts
var jsonwebtoken3 = __toESM(require("jsonwebtoken"));
function routerAuthorize(req, res, next) {
  const token = req.cookies["jwtToken"];
  if (token) {
    jsonwebtoken3.verify(token, jwtSecret, (error, decodedToken) => {
      if (error) {
        return res.status(401).json({ message: "Token is expired or not correct" });
      } else {
        req.locals = {
          name: decodedToken.name
        };
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Who is hacking my website?" });
  }
}
function routerOK(req, res, next) {
  return res.status(200).json({ message: "OK" });
}
function routerAuthorizeAdmin(req, res, next) {
  const token = req.cookies["jwtToken"];
  if (token) {
    jsonwebtoken3.verify(token, jwtSecret, (error, decodedToken) => {
      if (error || decodedToken.accessRights != "Admin") {
        return res.status(401).json({ message: "You have not enough access rights to enter this page, or your token is expired!" });
      } else {
        req.locals = {
          name: decodedToken.name
        };
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Who is hacking my website?" });
  }
}

// server/user-search/user-search.ts
async function routerUserSearchByString(req, res, next) {
  const { searchString } = req.body;
  const users = await ModelUser.model.find({});
  if (!users) {
    return res.status(500).json({ message: "Server error" });
  }
  let array = new Array();
  for (let i = 0; i < users.length; i++) {
    if (!searchString || !!users[i].name && users[i].name.includes(searchString)) {
      array.push({
        name: users[i].name,
        accessRights: users[i].accessRights,
        registrationDate: users[i].registrationDate,
        avatar: users[i].avatar,
        ns: users[i].ns,
        lat: users[i].lat,
        lon: users[i].lon,
        place: users[i].place,
        mail: users[i].mail,
        phone: users[i].phone,
        yearOfGrade: users[i].yearOfGrade,
        classOfGrade: users[i].classOfGrade,
        addonInfo: users[i].addonInfo
      });
    }
  }
  return res.status(200).json({ message: "User search succeeded", array });
}
async function routerUserSearchExplicit(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "No body" });
  }
  const user = await ModelUser.model.findOne({ name });
  if (!user) {
    return res.status(400).json({ message: "Not found" });
  }
  const result = {
    name: user.name,
    accessRights: user.accessRights,
    registrationDate: user.registrationDate,
    avatar: user.avatar,
    ns: user.ns,
    lat: user.lat,
    lon: user.lon,
    place: user.place,
    mail: user.mail,
    phone: user.phone,
    yearOfGrade: user.yearOfGrade,
    classOfGrade: user.classOfGrade,
    addonInfo: user.addonInfo
  };
  return res.status(200).json({ message: "User search explicit succeeded", user: result });
}

// server/models/message.ts
var import_mongoose3 = __toESM(require("mongoose"));
var ModelMessage = class {
  static messageSchema = {
    author: {
      type: String,
      unique: false,
      required: true
    },
    time: {
      type: Number,
      unique: false,
      required: true
    },
    message: {
      type: String,
      unique: false,
      required: true
    }
  };
  static toString(message) {
    let date = new Date(message.time);
    let month = (date.getMonth() + 1).toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (hours.length == 1) {
      hours = "0" + hours;
    }
    if (minutes.length == 1) {
      minutes = "0" + minutes;
    }
    if (seconds.length == 1) {
      seconds = "0" + seconds;
    }
    return `[${date.getDate()}.${month}.${date.getFullYear()} ${hours}:${minutes}:${seconds}] ${message.author}: "${message.message}"`;
  }
  static model = import_mongoose3.default.model("Message", this.messageSchema, "NK1_messages");
};

// server/chat/chat.ts
async function routerChatWriteMessage(req, res, next) {
  if (!req.locals || !req.locals.name) {
    return res.status(400).json({ message: "No local data" });
  }
  const { date, message } = req.body;
  const author = req.locals.name;
  if (!date || !author || !message) {
    return res.status(400).json({ message: "No enough data to response" });
  }
  try {
    const written = await ModelMessage.model.create({ author, time: date, message });
    return res.status(200).json({ message: "Write message success", text: ModelMessage.toString(written) });
  } catch (err) {
    return res.status(500).json({ message: "Write message server error" });
  }
}
async function routerChatGetLastMessage(req, res, next) {
  const messages = await ModelMessage.model.find({});
  if (messages) {
    return res.status(200).json({
      message: "Get last message success",
      lastMessage: ModelMessage.toString(messages[messages.length - 1])
    });
  } else {
    return res.status(500).json({ message: "Get last message failed" });
  }
}
async function routerChatGetText(req, res, next) {
  const messages = await ModelMessage.model.find({});
  let str = "";
  for (const message of messages) {
    str += ModelMessage.toString(message) + "\n";
  }
  return res.status(200).json({
    message: "Get chat text success",
    text: str
  });
}

// server/account/account.ts
async function routerGetAccountData(req, res, next) {
  if (!req.locals || !req.locals.name) {
    return res.status(400).json({ message: "No local data" });
  }
  const name = req.locals.name;
  const user = await ModelUser.model.findOne({ name });
  let result = {};
  if (user) {
    result.name = user.name;
    result.password = user.password;
    result.accessRights = user.accessRights;
    result.avatar = user.avatar;
    result.registrationDate = user.registrationDate;
    result.ns = user.ns;
    result.lat = user.lat;
    result.lon = user.lon;
    result.place = user.place;
    result.mail = user.mail;
    result.phone = user.phone;
    result.yearOfGrade = user.yearOfGrade;
    result.classOfGrade = user.classOfGrade;
    result.addonInfo = user.addonInfo;
    result.ns = user.ns;
    return res.status(200).json({ message: "Get account data success", account: result });
  } else {
    return res.status(500).json({ message: "Get account data server error" });
  }
}
async function routerUpdateUserProp(req, res, next) {
  if (!req.locals || !req.locals.name) {
    return res.status(400).json({ message: "No local data" });
  }
  const conditions = { name: req.locals.name };
  const updates = req.body;
  await ModelUser.model.findOneAndUpdate(conditions, updates);
  return res.status(200).json("Success");
}
async function routerUpdateUserMap(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  if (!req.locals || !req.locals.place || !req.locals.fullPlace) {
    return res.status(400).json({ message: "No local data" });
  }
  const { lat, lon } = req.body;
  if (!lat || !lon) {
    return res.status(400).json({ message: "Not enough data for res" });
  }
  const conditions = { name: req.locals.name };
  const updates = { lat, lon, place: req.locals.place, fullPlace: req.locals.fullPlace };
  await ModelUser.model.findOneAndUpdate(conditions, updates);
  return res.status(200).json("Success");
}
async function routerAdminUpdateUserProp(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { name, update } = req.body;
  if (!name || !update) {
    return res.status(400).json({ message: "No data" });
  }
  const conditions = { name };
  const updates = update;
  try {
    await ModelUser.model.findOneAndUpdate(conditions, updates);
    return res.status(200).json("routerAdminUpdateUserProp success");
  } catch (err) {
    return res.status(400).json("Incorrect format of data");
  }
}
async function routerAdminDeleteUser(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "No data" });
  }
  try {
    await ModelUser.model.deleteOne({ name });
    return res.status(200).json("Delete user success");
  } catch (err) {
    return res.status(500).json(err);
  }
}

// server/map/map.ts
async function routerGetMap(req, res, next) {
  if (!req.locals || !req.locals.name) {
    return res.status(401).json({ message: "No authorized" });
  }
  const users = await ModelUser.model.find({});
  if (!users) {
    return res.status(500).json({ message: "Server error" });
  }
  const name = req.locals.name;
  let array = [];
  for (const user of users) {
    let str = `<a href="/default/accountViewerPage?name=${user.name}">${user.name}</a><br/>`;
    str += user.place;
    if (name == user.name) {
      if (!user.lat || !user.lon || !user.place) {
        array.push({
          lat: user.lat ? user.lat : 59.947,
          lon: user.lon ? user.lon : 30.347,
          color: "blue",
          textOfPopup: `<a>It seems that you have not chosen the place or update the page too quickly.</a>`
        });
      } else {
        array.push({
          lat: user.lat,
          lon: user.lon,
          color: "blue",
          textOfPopup: str
        });
      }
    } else if (user.lat && user.lon && user.place) {
      array.push({
        lat: user.lat,
        lon: user.lon,
        color: "red",
        textOfPopup: str
      });
    }
  }
  return res.status(200).json({ message: "Get map success", array });
}

// server/map/location.ts
var import_node_fetch_commonjs = __toESM(require("node-fetch-commonjs"));
async function routerGetInfoAboutPos(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { lat, lon } = req.body;
  if (!lat || !lon) {
    return res.status(400).json({ message: "Not enough data for res" });
  }
  const request = {
    method: "GET"
  };
  const apiKey = "03234a843b7b4042bcce0453b6527c14";
  try {
    const received = await (0, import_node_fetch_commonjs.default)(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
    );
    const json = await received.json();
    let place = "";
    let fullPlace = "";
    if (json) {
      fullPlace = JSON.stringify(json);
    }
    if (json && json.features) {
      let properties = json.features[0].properties;
      place += properties.country ? properties.country + ", " : "";
      place += properties.region ? properties.region + ", " : "";
      place += properties.city ? properties.city + ", " : "";
      place += properties.street ? properties.street + ", " : "";
      place += properties.housenumber ? properties.housenumber + ", " : "";
      place += properties.name ? properties.name + ", " : "";
    }
    req.locals["place"] = place;
    req.locals["fullPlace"] = fullPlace;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
async function routerGetLatLon(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "No body" });
  }
  const { place } = req.body;
  if (!place) {
    return res.status(400).json({ message: "Not enough data for res" });
  }
  try {
    const result = await (0, import_node_fetch_commonjs.default)(`https://api.geoapify.com/v1/geocode/search?text=${place}&apiKey=21706bc935764ebf8a26d3cbfaec82db`, { method: "GET" });
    const data = await result.json();
    let array = [];
    if (data.features) {
      for (let feature of data.features) {
        if (feature.properties) {
          const object = {
            country: feature.properties.country,
            region: feature.properties.region,
            city: feature.properties.city,
            street: feature.properties.street,
            housenumber: feature.properties.housenumber,
            name: feature.properties.name,
            lat: feature.properties.lat,
            lon: feature.properties.lon
          };
          array.push(object);
        }
      }
    }
    return res.status(200).json({ message: "ok", array });
  } catch (err) {
    return res.status(500).json({ message: "Geoapify error!" });
  }
}

// server/router.ts
var router = import_express.default.Router();
router.route("/authorize").post(routerAuthorize, routerOK);
router.route("/reg/sign-up").post(routerSignUp);
router.route("/reg/sign-in").post(routerSignIn);
router.route("/default/userSearch").post(routerUserSearchByString);
router.route("/default/userSearchExplicit").post(routerUserSearchExplicit);
router.route("/default/chat/writeMessage").post(routerAuthorize, routerChatWriteMessage);
router.route("/default/chat/getLastMessage").post(routerChatGetLastMessage);
router.route("/default/chat/getText").post(routerChatGetText);
router.route("/default/account").post(routerAuthorize, routerGetAccountData);
router.route("/default/account/update").post(routerAuthorize, routerUpdateUserProp);
router.route("/default/map/get").post(routerAuthorize, routerGetMap);
router.route("/default/map/updatePosition").post(routerAuthorize, routerGetInfoAboutPos, routerUpdateUserMap);
router.route("/default/map/getLatLon").post(routerAuthorize, routerGetLatLon);
router.route("/default/admin/update").post(routerAuthorizeAdmin, routerAdminUpdateUserProp);
router.route("/default/admin/delete").post(routerAuthorizeAdmin, routerAdminDeleteUser);
router.route("/default/admin/editPassword").post(routerAuthorizeAdmin, routerAdminEditPassword);

// server/server.ts
var { MongoClient, ServerApiVersion } = require("mongodb");
var CurrentUsersData = class {
  static clients = [];
};
var AR5DB = `mongodb+srv://doadmin:x62jNC54Pi1W3t98@db-mongodb-pml30-2024-12312526.mongo.ondigitalocean.com/admin?tls=true&authSource=admin`;
var connectDB = async () => {
  await mongoose4.connect(AR5DB, { dbName: "PML30-2024-S" });
  console.log("MongoDB Connected");
};
connectDB();
var app = (0, import_express2.default)();
app.use((0, import_morgan.default)("combined"));
app.use(import_express2.default.json());
app.use((0, import_cookie_parser.default)());
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use("/", router);
app.get("/", (req, res) => {
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
  res.cookie("jwtToken", "", { maxAge: 0.1 });
  res.redirect("/");
});
app.use(import_express2.default.static("."));
var server = http.createServer(app);
var io = new import_socket.Server(server);
io.on("connection", (socket) => {
  CurrentUsersData.clients.push(socket);
  console.log(`Client connected with id: ${socket.id}`);
  socket.on("fClientWriteMessage", (message) => {
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
var port = 3e3;
server.listen(process.env.PORT || port, () => {
  let address = server.address();
  if (address)
    console.log(`Server started on port ${port}.`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CurrentUsersData
});
