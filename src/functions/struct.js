const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Parser = require("../parser/Parser");
const Writter = require("../core/Writter");

module.exports = new Func({
  func_name: "struct",
  prop_type: "structed",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    //console.log(current);
    if (current.type !== "variable-function-exe")
      throw new Error(
        "Stuck function cannot be executed without set to variable the result."
      );
    const props = self.compiler.getProps(func.prop_type, current.props, sp_state, self.state);
    self.writeSomething(
      current.name,
      {
        new: new Func({
          func_name: "new",
          prop_type: "values",
          config: { schema: props },
          func_exe: async function (current, l_sp_state) {
            const { self, func } = this;
            const props = self.compiler.getProps(func.prop_type, current.props, l_sp_state, self.state);
            const errors = [];
            log(func.config.schema)
            let obj = new Object();
            for (let i = 0; i < func.config.schema.length; i++) {
              const curr = func.config.schema[i];
              const prop_v = props[i];
              if(curr.required && !prop_v){
                errors.push(curr.property + " is required.");
                continue;
              }
              switch (curr.type) {
                case "string": obj[curr.property] = prop_v  || null; break;
                case "number": obj[curr.property] = Number(prop_v); break;
                case "object": obj[curr.property] = prop_v || null; break;
                default: obj[curr.property] = prop_v || null; break;
              }
            }
            if(errors.length > 0) throw new Error(errors.join(","))
            self.writeSomething(
              current.name,
              obj,
              l_sp_state
            )
          },
        }),
      },
      sp_state
    );
    // await self.state.user.new.exe(self, current, sp_state)
    // console.log(...props);
  },
});

function check_values ()
{

}