import { useTransition } from "react";
import { ModelUser } from "../models/user"
import { CurrentUsersData, IDynamic } from "../server";
import { ModelSession } from "../models/session";
import * as jsonwebtoken  from "jsonwebtoken";

import { jwtSecret } from "../reg/sign-up";

export interface IAccountProps {
  name?: string,
  password?: string,
  accessRights?: string,
  avatar?: string,
  ns?: string,
  registrationDate?: string,
  lat?: number,
  lon?: number,
  place?: string,
  mail?: string,
  phone?: string,
  yearOfGrade?: number,
  classOfGrade?: number,
  addonInfo?: string
};

async function getAccountData(sessionId: string, result: IAccountProps) {
  const session = await ModelSession.model.findOne({key: sessionId});

  if (!session) {
    return;
  }

  const user = await ModelUser.model.findOne({name: session.name});

  if (user) {
    const q = "?";
    result.name = user.name;
    result.password = user.password;
    result.accessRights = user.accessRights;
    result.avatar = user.avatar;
    result.registrationDate = user.registrationDate;

    result.lat = user.lat;
    result.lon = user.lon;
    result.place = user.place;
    result.mail = user.mail;
    result.phone = user.phone;
    result.yearOfGrade = user.yearOfGrade;
    result.classOfGrade = user.classOfGrade;
    result.addonInfo = user.addonInfo;
    result.ns = user.ns;
  }
}

async function updateUserProp(sessionId: string, updates: IDynamic, result: IDynamic) {
  const session = await ModelSession.model.findOne({key: sessionId});

  if (!session) {
    return;
  }

  const conditions = {name: session.name};

  await ModelUser.model.findOneAndUpdate(conditions, updates);
}

export async function routerGetAccountData(req: any, res: any, next: any) {
  if (!req.locals || !req.locals.name) {
    return res.status(400).json({message: "No local data"});
  }

  const name = req.locals.name;
  const user = await ModelUser.model.findOne({name: name});

  let result: IAccountProps = {};
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

    return res.status(200).json({message: "Get account data success", account: result});
  } else {
    return res.status(500).json({message: "Get account data server error"});
  }
}

export async function routerUpdateUserProp(req: any, res: any, next: any) {
  if (!req.locals || !req.locals.name) {
    return res.status(400).json({message: "No local data"});
  }

  const conditions = {name: req.locals.name};
  const updates = req.body;

  await ModelUser.model.findOneAndUpdate(conditions, updates);
  return res.status(200).json("Success");
}

export async function routerUpdateUserMap(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }
  if (!req.locals || !req.locals.place || !req.locals.fullPlace) {
    return res.status(400).json({message: "No local data"});
  }

  const {lat, lon} = req.body;

  if (!lat || !lon) {
    return res.status(400).json({message: "Not enough data for res"});
  }

  const conditions = {name: req.locals.name};
  const updates = {lat: lat, lon: lon, place: req.locals.place, fullPlace: req.locals.fullPlace};

  await ModelUser.model.findOneAndUpdate(conditions, updates);
  return res.status(200).json("Success");
}

export async function routerAdminUpdateUserProp(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }
  const {name, update} = req.body;

  if (!name || !update) {
    return res.status(400).json({message: "No data"});
  }

  const conditions = {name: name};
  const updates = update;

  try {
    await ModelUser.model.findOneAndUpdate(conditions, updates);
    return res.status(200).json("routerAdminUpdateUserProp success");
  } catch (err) {
    return res.status(400).json("Incorrect format of data");
  }
}

export async function routerAdminDeleteUser(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }
  const {name} = req.body;
  if (!name) {
    return res.status(400).json({message: "No data"});
  }
  try {
    await ModelUser.model.deleteOne({name: name});
    return res.status(200).json("Delete user success");
  } catch (err) {
    return res.status(500).json(err);
  }
}
