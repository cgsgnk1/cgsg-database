import * as jsonwebtoken from "jsonwebtoken";
import { jwtSecret } from "./sign-up";

export function routerAuthorize(req: any, res: any, next: any) {
  const token = req.cookies["jwtToken"];
  if (token) {
    jsonwebtoken.verify(token, jwtSecret, (error: any, decodedToken: any) => {
      if (error) {
        return res.status(401).json({message: "Token is expired or not correct"});
      } else {
        req.locals = {
          name: decodedToken.name
        };
        next();
      }
    });
  } else {
    return res.status(401).json({message: "Who is hacking my website?"})
  }
}

export function routerOK(req: any, res: any, next: any) {
  return res.status(200).json({message: "OK"});
}

export function routerAuthorizeAdmin(req: any, res: any, next: any) {
  const token = req.cookies["jwtToken"];
  if (token) {
    jsonwebtoken.verify(token, jwtSecret, (error: any, decodedToken: any) => {
      if (error || decodedToken.accessRights != "Admin") {
        return res.status(401).json({message: "You have not enough access rights to enter this page, or your token is expired!"});
      } else {
        req.locals = {
          name: decodedToken.name
        };
        next();
      }
    });
  } else {
    return res.status(401).json({message: "Who is hacking my website?"})
  }
}
