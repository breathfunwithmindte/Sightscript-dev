const SightScript = require("./SightScript");




if(true) {
  global["MODE"] = "dev";
  global["log"] = require("../utils/log").log;
}


exports["SightScript"] = SightScript;