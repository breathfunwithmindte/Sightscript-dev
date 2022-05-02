const Func = require("../types/Func");
const Parsed = require("../types/Parsed");

module.exports = new Func({
  func_name: "print",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self } = this;
    self.state.smth = {
      username: "Mike", new: new Func({
        func_name: "print",
        prop_type: "values",
        func_exe: async function () {

        }
      })
    }
    //console.log(current, sp_state);
  } 
})
