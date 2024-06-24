import mongoose from "mongoose";

export class ModelUser {
  static userSchema: any = {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    registrationDate: {
      type: Number,
      default: -1,
      required: true,
    },
    accessRights: {
      type: String,
      default: "Default",
      required: true,
    },
    avatar: {
      type: String,
      default: "./avatarDefault.png",
      required: true,
    },
    ns: {
      type: String,
      required: false,
    },
    lat: {
      type: Number,
      required: false,
    },
    lon: {
      type: Number,
      required: false,
    },
    place: {
      type: String,
      required: false,
    },
    fullPlace: {
      type: String,
      required: false,
    },
    mail: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    yearOfGrade: {
      type: Number,
      required: false,
    },
    classOfGrade: {
      type: Number,
      required: false,
    },
    addonInfo: {
      type: String,
      required: false,
    }
  };

  static model = mongoose.model("User", this.userSchema, "NK1_users");
}
