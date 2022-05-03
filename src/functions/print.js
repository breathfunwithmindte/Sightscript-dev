const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Parser = require("../parser/Parser");

module.exports = new Func({
  func_name: "print",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self } = this;
    const props = self.compiler.compile_props_variables(current.props, sp_state, self.state);
    console.log("~~~~~")
    console.log(...props);
    console.log("~~~~~")
    return undefined;
  } 
})
