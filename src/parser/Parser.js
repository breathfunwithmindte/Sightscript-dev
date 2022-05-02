const {} = require("./parser_functions");
const Parsed = require("../types/Parsed");

module.exports = class Parser {
  /**
   * @param {string} script
   * @param {Map<string, string>} tokens
   * @debug log to the console the array of parsed elements;
   */
  static parse(script, tokens) {
    let parsed_lines = [];
    script.split(/\r?\n/).map((i) => {
      if (i === "") return;
      i.trim()
        .split(";")
        .map((j) => {
          if (j.trim() === "") return;
          j = j.trim();
 
          if (j.startsWith("__IF__") || j.startsWith("__FOR__")) {
            // parsing if //
            parsed_lines.push(this.ParseIfFor(j, tokens) || new Parsed("if-for::hello world error"))
          } else if (j.startsWith("__FUNCTION__")) {
            // function //
            parsed_lines.push(this.ParseFunctionDeclaration(j, tokens) || new Parsed("function::hello world error"))
          } else if(j.split("=").length === 1) {
            parsed_lines.push(this.ParseFunctionExe(j, tokens) || new Parsed("function-or-method-exe:: Something went wrong"));
          }else {
              parsed_lines.push(Parser.parse_variables(j));
          }
        });
    });
      //  console.table(parsed_lines);
     //console.log(parsed_lines.map(i => i.codeblock))
    return parsed_lines;
  }

  static ParseFunctionExe (line, tokens)
  {
    try{
      const v = tokens.get(`__PAR__${line.split("__PAR__")[1].trim()}`);
      if(!v) return null;
      const name = line.split("__PAR__")[0].trim();
      const type = name.split("::").length > 1 ? "method-exe" : "function-exe";
      return new Parsed({
        status: 0,
        type: type,
        props: v.substring(1, v.length -1),
        name: name,
      })
    }catch(e){
      console.log("ERROR at parsing line :: " + line, e.toString())
      return null;
      // todo do smth with the error //
    }
  }

  /**
   * @param  {string} code
   */
  static ParseIfFor(line, tokens) {
    try{
      if (!tokens.has(line)) { /* todo push error message; <maybe>return null;*/ }
      const initial_length = line.startsWith("__IF__") ? 2 : 3;
      let code = tokens.get(line);
      code = code.trim();
      const pre_props_token = code.split(":");
      const props_token = pre_props_token[0].substring(initial_length, pre_props_token[0].length);
      let props = tokens.get(props_token.trim());
      props = props.substring(1, props.length - 1);
      const body = pre_props_token[1].substring(0, pre_props_token[1].length - 3);
      // todo [maybe] improve this how to get type (if | for)
      return new Parsed({
        status: 0,
        type: initial_length === 2 ? "ifstatement" : "forloop",
        props: props.trim(),
        codeblock: this.parse(body, tokens),
        name: initial_length === 2 ? "ifstatement" : "forloop"
      })    
    }catch(err){
      // todo [maybe] some errors handle //
      console.log(err);
      console.log("ERROR at parsing if or for looop.", err.toString())
      return null;
    }

  }

   /**
   * @param  {string} code
   * @return  {list} // -1 if error
   * todo space between make it not required (...) {...}
   */
  static ParseFunctionDeclaration(line, tokens) {
    try {
      if (!tokens.has(line)) { /* todo push error message; <maybe>return -1;*/}
      const code = tokens.get(line);
      console.log(code);
      const [name_props, code_id] = code.split("__CODE__");
      let code_block = tokens.get("__CODE__" + code_id.trim());
      code_block = code_block.trim().substring(1, code_block.length - 1);
      const [pre_name, pre_props] = name_props.split("__PAR__");
      let props = tokens.get("__PAR__" + pre_props.trim());
      props = props.trim().substring(1, props.length - 1);
      const name = pre_name.split("function")[1].trim();
      return new Parsed({
        status: 0,
        type: "function",
        props: props.trim(),
        name: name,
        codeblock: this.parse(code_block, tokens),
      })   
    } catch (e) {
      // todo [maybe] some errors handle //
      console.log("ERROR at parsing function definition.", e.toString()); return null;
    }
  }

  /**
   * @param  {string} line
   * @return
   * typeA = { type: "variable", name: <variable name>, value: <value || null>, ready: boolean, status: <-1:error, 0:ok >  }
   */
  static parse_variables(line) {
    // ! can be bug here for value if we have expressions like == or !=
    const variable_name = line.split("=")[0].trim();
    const value = line.split("=").slice(1, line.length).join("=");
    // * register method to struct //
    if(variable_name.split("::").length > 1) {
      return new Parsed({ type: "define-method", name: variable_name, value: value.trim() })
    }
    // * value not set //
    if (!value) {
      return {
        
      };
    }
    // * value is functions with type as variable = <some name>__PAR__<id> //
    if (value.split("__PAR__").length > 1) {
      {
        return new Parsed({ type: "variable", name: variable_name, value: value.trim() })
      }
    }
    // * value is some kind of value //
    return new Parsed({ type: "variable", name: variable_name, value: value.trim(), ready: true })
  }
  
};

