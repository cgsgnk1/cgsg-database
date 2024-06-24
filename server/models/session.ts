import mongoose from "mongoose";
import { IDynamic } from "../server";

export class ModelSession {
  static sessionSchema: any = {
    key: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  };

  static model = mongoose.model("Session", this.sessionSchema);

  static getRandomSessionId() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 40; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static async get(sessionId: string, result: IDynamic) {
    const session = await this.model.findOne({key: sessionId});
    if (session) {
      result.name = session.name;
    }
  }
}
