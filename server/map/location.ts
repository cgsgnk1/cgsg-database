import { IDynamic } from "../server";

import fetch from "node-fetch-commonjs";

export async function getInfoAboutPos(lat: number, lon: number, object: IDynamic) {
  const request = {
    method: "GET",
  };

  const apiKey = "03234a843b7b4042bcce0453b6527c14";

  try {
    const received = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`);
    const json = await received.json();
    object.json = json;

    let place: string = "";
    let fullPlace: string = "";

    if (object.json) {
      fullPlace = JSON.stringify(object.json);
    }

    if (object.json && object.json.features) {
      let properties = object.json.features[0].properties;

      place += (properties.country ? properties.country + ", " : "");
      place += (properties.region ? properties.region + ", " : "");
      place += (properties.city ? properties.city + ", " : "");
      place += (properties.street ? properties.street + ", " : "");
      place += (properties.housenumber ? properties.housenumber + ", " : "");
      place += (properties.name ? properties.name + ", " : "");
    }

    object.place = place;
    object.fullPlace = fullPlace;
  } catch(err) {
    console.log(err);
  }
}

export async function routerGetInfoAboutPos(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }

  const {lat, lon} = req.body;

  if (!lat || !lon) {
    return res.status(400).json({message: "Not enough data for res"});
  }

  const request = {
    method: "GET",
  };

  const apiKey = "03234a843b7b4042bcce0453b6527c14";

  try {
    const received = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`);
    const json = await received.json() as IDynamic;

    let place: string = "";
    let fullPlace: string = "";

    if (json) {
      fullPlace = JSON.stringify(json);
    }

    if (json && json.features) {
      let properties = json.features[0].properties;

      place += (properties.country ? properties.country + ", " : "");
      place += (properties.region ? properties.region + ", " : "");
      place += (properties.city ? properties.city + ", " : "");
      place += (properties.street ? properties.street + ", " : "");
      place += (properties.housenumber ? properties.housenumber + ", " : "");
      place += (properties.name ? properties.name + ", " : "");
    }

    req.locals["place"] = place;
    req.locals["fullPlace"] = fullPlace;

    next();
  } catch(err) {
    return res.status(500).json({message: "Server error"});
  }
}

export async function routerGetLatLon(req: any, res: any, next: any) {
  if (!req.body) {
    return res.status(400).json({message: "No body"});
  }

  const {place} = req.body;

  if (!place) {
    return res.status(400).json({message: "Not enough data for res"});
  }

  try {
    const result = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${place}&apiKey=21706bc935764ebf8a26d3cbfaec82db`, {method: "GET"});
    const data = await result.json() as IDynamic;
  
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
    return res.status(200).json({message: "ok", array: array});
  } catch (err) {
    return res.status(500).json({message: "Geoapify error!"});
  }
}
