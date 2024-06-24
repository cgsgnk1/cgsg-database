import * as mongoose from "mongoose";
import { ModelUser } from "../models/user";
import { ModelSession } from "../models/session";
import { CurrentUsersData, IDynamic } from "../server";
import * as bcryptjs from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";

import { jwtSecret, jwtExpirationTime } from "./sign-up";

async function tryToSignIn(sessionId: string, result: IDynamic) {
  const session = await ModelSession.model.findOne({key: sessionId});

  if (!session) {
    result.signedIn = false;
  } else {
    result.signedIn = true;
  }
}

async function getName(sessionId: string, result: IDynamic) {
  const session = await ModelSession.model.findOne({key: sessionId});
  if (!session) {
    return;
  }
  result.name = session.name;
}

async function signIn(username: string, password: string, result: IDynamic) {
  result.name = username;
  try {
    const user = await ModelUser.model.findOne({name: username, password: password});
    if (!user) {
      result.signedIn = false;
      result.error = "Incorrect username or password!";
    } else {
      result.signedIn = true;
      let ready = false;
      let sessionId = "";
      while (!ready) {
        try {
          sessionId = ModelSession.getRandomSessionId();
          await ModelSession.model.create({key: sessionId, name: username});
          ready = true;
        } catch (err) {
          console.log("Key is repeated or something else");
        }
      }
      result.sessionId = sessionId;
    }
  } catch (err) {
    console.log(err);
    result.signedIn = false;
    result.error = "Something went wrong!";
  }
}

export async function routerSignIn(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }

  const {name, password} = req.body;

  if (!name || !password) {
    return res.status(400).json({message: "Not enough data for res"});
  }

  try {
    const user = await ModelUser.model.findOne({name: name});
    if (!user) {
      return res.status(401).json({message: "Incorrect username or password!"});
    } else {
      await bcryptjs.compare(password /* input */, user.password /* hashed password*/).then((result) => {
        if (result) {
          /* Session token create */
          const token = jsonwebtoken.sign({
            id: user._id,
            name,
            accessRights: user.accessRights,
          }, jwtSecret, {
            expiresIn: jwtExpirationTime,
          });
          res.cookie("jwtToken", token, {httpOnly: true, maxAge: jwtExpirationTime * 1000});

          return res.status(200).json({message: "User sign in succeeded", user});
        }
        return res.status(401).json({message: "Incorrect username or password!", user});
      });
    }
  } catch (err) {
    return res.status(500).json({message: "Unknown server error"});
  }
}
