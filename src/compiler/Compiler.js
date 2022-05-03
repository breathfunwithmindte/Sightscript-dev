const Parsed = require("../types/Parsed");
module.exports = class Compiler {
  #functions = require("./helpers/index");
  #reader = require("./helpers/Reader");
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
      // !debug console.log("@@", value)
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

  getProps (type, props, sp_state, g_state)
  {
    if(type === "values") return this.compile_props_variables(props, sp_state, g_state);
    return this.compile_props_variables_struct(props, sp_state, g_state);
  }

  compile_props_variables (props, sp_state, g_state) 
  {
    let props_values = new Array();
    if(props === "") return [];
    props.split(",").map(i => {
      const v_object = this.#compile_datatype(i);
      if(v_object.type === "variable-string" || v_object.type === "variable-number"){
        props_values.push(typeof v_object.value === "string" ? v_object.value.trim() : v_object.value);
      }else if (v_object.type === "variable"){
        props_values.push(this.#reader(v_object.value.trim(), sp_state, {...g_state}));
      }
      console.log(v_object)
    });
    return props_values;
  }

  /**
   * 
   * @param {string} props 
   * @param {object} sp_state 
   * @param {object} g_state 
   * @returns {list<object>}
   * todo maybe find better solution, bad but working code.
   */
  compile_props_variables_struct (props, sp_state, g_state) 
  {
    let props_values = new Array();
    props.split(/\r?\n/).map(i => {
      i = i.trim();
      if(i === "") return;
      const obj = new Object(); const arr = i.split(" ").filter(f => f !== "");
      obj["property"] = arr[0]; obj["type"] = arr[1] || "string";
      arr.slice(2, arr.length).map(i => { 
        const [n, v] = i.split("::"); const av = this.#props_variables_struct_get_value(v)
        obj[n] = av === undefined ? true : av; 
      })
      props_values.push(obj);
    });
    return props_values;
  }

  #props_variables_struct_get_value (v) {
    if(!v) return undefined;
    if(v === "true" || v === "TRUE") return true;
    if(v === "false" || v === "FALSE") return false; 
    if(!isNaN(Number(v))) return Number(v);
    return v; 
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