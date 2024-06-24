import { IAccountProps } from "../account/account";
import { ModelUser } from "../models/user";
import { IDynamic } from "../server";

async function userSearchByString(str: string, result: IDynamic) {
  const users = await ModelUser.model.find({});
  if (users) {
    result.array = new Array<IAccountProps>;
  
    for (let i = 0; i < users.length; i++) {
      if (!str || (!!users[i].name && users[i].name.includes(str))) {
        result.array.push({
          name: users[i].name,
          accessRights: users[i].accessRights,
          registrationDate: users[i].registrationDate,
          avatar: users[i].avatar,
          lat: users[i].lat,
          lon: users[i].lon,
          ns: users[i].ns,
          place: users[i].place,
          mail: users[i].mail,
          phone: users[i].phone,
          yearOfGrade: users[i].yearOfGrade,
          classOfGrade: users[i].classOfGrade,
          addonInfo: users[i].addonInfo,
        });
      }
    }
  }
}

export async function routerUserSearchByString(req: any, res: any, next: any) {
  const {searchString} = req.body;

  const users = await ModelUser.model.find({});
  if (!users) {
    return res.status(500).json({message: "Server error"});
  }
  let array = new Array<IAccountProps>;
    for (let i = 0; i < users.length; i++) {
    if (!searchString || (!!users[i].name && users[i].name.includes(searchString))) {
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
        addonInfo: users[i].addonInfo,
      });
    }
  }
  return res.status(200).json({message: "User search succeeded", array: array});
}

export async function routerUserSearchExplicit(req: any, res: any, next: any) {
  const {name} = req.body;

  if (!name) {
    return res.status(400).json({message: "No body"});
  }

  const user = await ModelUser.model.findOne({name: name});
  if (!user) {
    return res.status(400).json({message: "Not found"});
  }
  
  const result: IAccountProps = {
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
    addonInfo: user.addonInfo,
  };
  return res.status(200).json({message: "User search explicit succeeded", user: result});
}
