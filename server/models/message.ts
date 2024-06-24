import mongoose from "mongoose";

export class ModelMessage {
  static messageSchema: any = {
    author: {
      type: String,
      unique: false,
      required: true,
    },
    time: {
      type: Number,
      unique: false,
      required: true,
    },
    message: {
      type: String,
      unique: false,
      required: true,
    }
  };

  static toString(message: any): string {
    let date = new Date(message.time);

    let month = (date.getMonth() + 1).toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (hours.length == 1) {
      hours = "0" + hours;
    }
    if (minutes.length == 1) {
      minutes = "0" + minutes;
    }
    if (seconds.length == 1) {
      seconds = "0" + seconds;
    }
    return `[${date.getDate()}.${month}.${date.getFullYear()} ${hours}:${minutes}:${seconds}] ${message.author}: "${message.message}"`;
  }

  static model = mongoose.model("Message", this.messageSchema, "NK1_messages");
}
