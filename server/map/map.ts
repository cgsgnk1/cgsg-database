import { ModelUser } from "../models/user";
import { IMyMarkerProps } from "../../client/map/map-ui";

export async function routerGetMap(req: any, res: any, next: any) {
  if (!req.locals || !req.locals.name) {
    return res.status(401).json({message: "No authorized"});
  }

  const users = await ModelUser.model.find({});

  if (!users) {
    return res.status(500).json({message: "Server error"});
  }

  const name = req.locals.name;

  let array: IMyMarkerProps[] = [];

  for (const user of users) {
    let str: string = `<a href="/default/accountViewerPage?name=${user.name}">${user.name}</a><br/>`;
    str += user.place;

    if (name == user.name) {
      if (!user.lat || !user.lon || !user.place) {
        array.push({
          lat: user.lat ? user.lat : 59.947,
          lon: user.lon ? user.lon : 30.347,
          color: "blue",
          textOfPopup: `<a>It seems that you have not chosen the place or update the page too quickly.</a>`,
        });
      } else {
        array.push({
          lat: user.lat,
          lon: user.lon,
          color: "blue",
          textOfPopup: str,
        });
      }
    } else if (user.lat && user.lon && user.place) {
      array.push({
        lat: user.lat,
        lon: user.lon,
        color: "red",
        textOfPopup: str,
      });
    }
  }

  return res.status(200).json({message: "Get map success", array: array});
}