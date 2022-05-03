const print = require("./print");
const struct = require("./struct");

/**
 * @type {Map <string, object>}
 */
const functions = new Map();

functions.set("print", print);
functions.set("struct", struct);


module.exports = functions;