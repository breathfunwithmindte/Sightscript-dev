const Parsed = require("../types/Parsed");
module.exports = class Compiler {
  #functions = require("./helpers/index");
  #tokens;
  tests = []
  /**
   * @type {list<Parsed>}
   */
  executables = new Array();

  /**
   * @param  {list<Parsed>} objects
   * @param  {Map<string, string>} tokens
   * @param {boolean} store_global
   */
  main_compile (objects, tokens, store_global)
  {
    this.#tokens = tokens;

    /**
     * @type {list<Parsed>}
     */
    const local_executables = new Array();

    objects.map((object, index) => {
      
      if(object.type === "variable")
      {
        if(store_global) return this.executables.push(this.#compile_variable(object, index, tokens));
        return local_executables.push(this.#compile_variable(object, index, tokens));
      }
      if(object.type === "function-exe" || object.type === "method-exe")
      {
        if(store_global) return this.executables.push(object);
        return local_executables.push(object);
      }
      if(object.type === "ifstatement" || object.type === "forloop" || object.type === "function")
      {
        object.setCodeblock(this.main_compile(object.codeblock, tokens, false))
        this.executables.push(object);
      }

    })
    if(store_global === false) return local_executables;
    return this.executables;
    //console.table(this.executables);
  }
  
  /**
   * @param  {object} variable_obj
   * @param  {int} index
   * @param  {Map<string, string>} tokens
   * @return {Parsed}
   */
  #compile_variable (variable_obj, index, tokens)
  {
    const { type, value, message, ready, props } = this.#compile_datatype(variable_obj.value);
    variable_obj.setType(type); 
    variable_obj.setMessage(message);
    variable_obj.setReady(ready);
    variable_obj.setProps(props);
    variable_obj.value = value;
    return variable_obj;
  }


  #compile_datatype (value)
  {
    // todo variable with operators, expressions //
    if(typeof value === "string") {
      console.log("@@", value)
      if(value.startsWith("__STRING__")) {
        const v = this.#tokens.get(value);
        return { type: "variable-string", value: v.substring(1, v.length - 1), ready: true }
      }
      if(value.startsWith("__TSTRING__")) {
        const v = this.#tokens.get(value);
        return { type: "variable-tstring", value: v.substring(1, v.length - 1), ready: true }
      }
      if(value.search("__PAR__") != -1) {
        const v = this.#tokens.get(`__PAR__${value.split("__PAR__")[1].trim()}`)
        if(value.split("::").length > 1) {
          return {
            type: "variable-method-exe", value: value.split("__PAR__")[0].trim(), props: v.substring(1, v.length -1)
          }
        }else{
          return {
            type: "variable-function-exe", value: value.split("__PAR__")[0].trim(), props: v.substring(1, v.length -1)
          }
        }
      }
      if(!isNaN(Number(value))) {
        return { type: "variable-number", value: Number(value), ready: true }
      }
      if(value.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=") !== -1){
        return { type: "variable-operatorORexpression", value: value, ready: false }
      }
      return { type: "variable", value: value, ready: false }
    }
  }
  
  

  // if(value.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=")) {
  //   let newvalue = this.#compiler_operators_expresstions(value);
  //   newvalue = this.#compiler_operators_expresstions(newvalue);
  //   let actual_value;
  //   try{
  //     actual_value = eval(newvalue)
  //   }catch(err){ actual_value = err.toString() }
  //   return { type: "variable-ready", value: actual_value, message: newvalue }
  // }
  

}