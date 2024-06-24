import { ModelUser } from "../models/user";
import { ModelSession } from "../models/session";
import { CurrentUsersData, IDynamic } from "../server";
import * as bcryptjs from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";

export const jwtSecret = "455b4d85547e11590929fd2a63ccc7d12fbe78721cf78721cf";
export const jwtExpirationTime = 24 * 60 * 60; // sec

async function signUp(username: string, password: string, result: IDynamic) {
  if (password.length >= 8) {
    try {
      await ModelUser.model.create({
        name: username,
        password: password,
        registrationDate: Date.now(),
      }).then(async (user: any) => {
        result.signedUp = true;
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
      });
    } catch (err) {
      console.log(err);
      result.signedUp = false;
      result.error = String(err);
    }
  } else {
    result.signedUp = false;
    result.error = "Password length is must to be more or equal than 8 symbols";
  }
}

export async function routerSignUp(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }

  const {name, password} = req.body;

  if (!name || !password) {
    return res.status(400).json({message: "Not enough data for res"});
  }

  if (password.length < 8) {
    return res.status(400).json({message: "Password length is must to be more or equal than 8 symbols"});
  }

  try {
    await bcryptjs.hash(password, 12).then(async (hashedPassword) => {

      await ModelUser.model.create({
        name: name,
        password: hashedPassword,
        registrationDate: Date.now(),
      }).then(async (user: any) => {

        /* Session token create */
        const token = jsonwebtoken.sign({
          id: user._id,
          name,
          accessRights: user.accessRights,
        }, jwtSecret, {
          expiresIn: jwtExpirationTime,
        });
        res.cookie("jwtToken", token, {httpOnly: true, maxAge: jwtExpirationTime * 1000});

        return res.status(200).json({message: "User sign up succeeded", user});
      });
    });
  } catch (err) {
    return res.status(401).json({message: "This username already exists!"});
  }
}

export async function routerAdminEditPassword(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }

  const {name, password} = req.body;

  if (!name || !password) {
    return res.status(400).json({message: "Not enough data for res"});
  }

  if (password.length < 8) {
    return res.status(400).json({message: "Password length is not enough"});
  }

  await bcryptjs.hash(password, 12).then(async (hashedPassword) => {
    const conditions = {name: name};
    const updates = {password: hashedPassword}
  
    await ModelUser.model.findOneAndUpdate(conditions, updates);
    return res.status(200).json({message: "Admin edit password success"});
  });
}
