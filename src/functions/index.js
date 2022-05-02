const print = require("./print");

/**
 * @type {Map <string, object>}
 */
const functions = new Map();

functions.set("print", print);

console.log(print)


module.exports = functions;