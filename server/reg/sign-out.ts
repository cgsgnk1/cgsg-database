import { ModelSession } from "../models/session";

async function deleteSession(sessionId: string) {
  await ModelSession.model.deleteOne({key: sessionId});
}
