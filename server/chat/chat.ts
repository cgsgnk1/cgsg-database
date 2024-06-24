import * as mongoose from "mongoose";
import { ModelMessage } from "../models/message";
import { IDynamic } from "../server";
import * as jsonwebtoken from "jsonwebtoken";
import { jwtSecret } from "../reg/sign-up";

async function writeMessage(date: number, author: string, message: string) {
  try {
    await ModelMessage.model.create({author: author, time: date, message: message});
  } catch (err) {
    console.log(err);
  }
}

async function getLastMessage(result: IDynamic) {
  const messages = await ModelMessage.model.find({});

  if (messages) {
    result.str = ModelMessage.toString(messages[messages.length - 1]);
  } else {
    result.str = "???";
  }
}

async function getChatText(result: IDynamic) {
  const messages = await ModelMessage.model.find({});

  result.str = "";

  for (const message of messages) {
    result.str += ModelMessage.toString(message) + "\n";
  }
}

export async function routerChatWriteMessage(req: any, res: any, next: any) {
  if (!req.locals || !req.locals.name) {
    return res.status(400).json({message: "No local data"});
  }

  const {date, message} = req.body;
  const author = req.locals.name;

  if (!date || !author || !message) {
    return res.status(400).json({message: "No enough data to response"});
  }

  try {
    const written = await ModelMessage.model.create({author: author, time: date, message: message});
    return res.status(200).json({message: "Write message success", text: ModelMessage.toString(written)});
  } catch (err) {
    return res.status(500).json({message: "Write message server error"});
  }
}

export async function routerChatGetLastMessage(req: any, res: any, next: any) {
  const messages = await ModelMessage.model.find({});

  if (messages) {
    return res.status(200).json({
      message: "Get last message success",
      lastMessage: ModelMessage.toString(messages[messages.length - 1])
    });

  } else {
    return res.status(500).json({message: "Get last message failed"});
  }
}

export async function routerChatGetText(req: any, res: any, next: any) {
  const messages = await ModelMessage.model.find({});

  let str: string = "";

  for (const message of messages) {
    str += ModelMessage.toString(message) + "\n";
  }
  return res.status(200).json({
    message: "Get chat text success",
    text: str
  });
}
