import express from "express";

import { routerAdminEditPassword, routerSignUp } from "./reg/sign-up";
import { routerSignIn } from "./reg/sign-in";
import { routerAuthorize, routerAuthorizeAdmin, routerOK } from "./reg/protecting";
import { routerUserSearchByString, routerUserSearchExplicit } from "./user-search/user-search";
import { routerChatGetLastMessage, routerChatGetText, routerChatWriteMessage } from "./chat/chat";
import { routerAdminDeleteUser, routerAdminUpdateUserProp, routerGetAccountData, routerUpdateUserMap, routerUpdateUserProp } from "./account/account";
import { routerGetMap } from "./map/map";
import { routerGetInfoAboutPos, routerGetLatLon } from "./map/location";

export const router = express.Router();

router.route("/authorize").post(routerAuthorize, routerOK);

router.route("/reg/sign-up").post(routerSignUp);
router.route("/reg/sign-in").post(routerSignIn);

router.route("/default/userSearch").post(routerUserSearchByString);
router.route("/default/userSearchExplicit").post(routerUserSearchExplicit);
router.route("/default/chat/writeMessage").post(routerAuthorize, routerChatWriteMessage);
router.route("/default/chat/getLastMessage").post(routerChatGetLastMessage);
router.route("/default/chat/getText").post(routerChatGetText);
router.route("/default/account").post(routerAuthorize, routerGetAccountData);
router.route("/default/account/update").post(routerAuthorize, routerUpdateUserProp);
router.route("/default/map/get").post(routerAuthorize, routerGetMap);
router.route("/default/map/updatePosition").post(routerAuthorize, routerGetInfoAboutPos, routerUpdateUserMap);
router.route("/default/map/getLatLon").post(routerAuthorize, routerGetLatLon);

router.route("/default/admin/update").post(routerAuthorizeAdmin, routerAdminUpdateUserProp);
router.route("/default/admin/delete").post(routerAuthorizeAdmin, routerAdminDeleteUser);
router.route("/default/admin/editPassword").post(routerAuthorizeAdmin, routerAdminEditPassword);
