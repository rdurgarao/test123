import SessionHelper from "session-helper";
import SessionConfig from "../constants/SessionConfig";

export default new SessionHelper(
  SessionConfig.uuid,
  SessionConfig.cacheLocation,
  SessionConfig.timeoutInMinutes,
  SessionConfig.debugMode
);
