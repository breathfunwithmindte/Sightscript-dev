const Tokenizer = require("../tokenizer/Tokenizer");
const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Writter = require("./Writter");

module.exports = class Executor extends Tokenizer {
  constructor(props)
  {
    super(props)
    this.state = new Object();
    this.private_state = new Object();
    this.scoped_state = new Object();
  }

  async primary_execute (executables)
  {
    let sp_state = new Object(); // ! scoped proccess state //
    // console.log(executables)
    for (let index = 0; index < executables.length; index++) {
      const current = executables[index];
      if(current.type === "variable-number" || current.type === "variable-string")
      {
        this.#writeVariable(current, sp_state)
      }
      if(current.type === "variable")
      {
        this.#writeVariableWithVariable(current, sp_state)
      }
      if(current.type === "function-exe")
      {
        await this.#executeFunction(current, sp_state);
      }
      if(current.type === "variable-function-exe")
      {
        await this.#executeVariableFunction(current, sp_state);
      }
      if(current.type === "variable-method-exe")
      {
        await this.#executeVariableMethod(current, sp_state);
      }
      if(current.type === "ifstatement")
      {
        // check before run if statement
        console.log(await this.primary_execute(current.codeblock))
      }
      
    }
    //
    
    return { sp_state: sp_state, state: this.state };
  }

  /**
   * 
   * @param {Parsed} current 
   * @param {object} sp_state
   * @returns void 
   * todo check if there is variable with same name that is not writable;
   */
  #writeVariable (current, sp_state)
  {
    Writter(sp_state, this.state, current.name, current.value);
  }

  writeSomething (name, value, sp_state)
  {
    Writter(sp_state, this.state, name, value);
  }

  /**
   * 
   * @param {Parsed} current 
   * @param {object} sp_state
   * @returns void 
   * todo check if there is variable with same name that is not writable;
   */
  #writeVariableWithVariable (current, sp_state)
  {
    Writter(sp_state, this.state, current.name, this.#getValue(sp_state, current.value));
  }

  async #executeFunction (current, sp_state)
  {
    if(!this.functions.has(current.name)) return console.log("function not found with this name !!!");
    const func = this.functions.get(current.name);
    try{
      await func.exe(this, current, sp_state);
    }catch(err){
      console.log(err);
    }
  }

  async #executeVariableFunction (current, sp_state)
  {
    if(!this.functions.has(current.value)) return console.log("function not found with this name !!!");
    const func = this.functions.get(current.value);
    try{
      const r = await func.exe(this, current, sp_state);
      if(r === undefined) return;
      Writter(sp_state, this.state, current.name, r);
    }catch(err){
      console.log(err);
    }
  }

  async #executeVariableMethod (current, sp_state)
  {
    const [object_before, method_name] = current.value.split("::");
    const actual_value = this.#getValue(sp_state, object_before.trim());
    if(!actual_value) return console.log("no value"); // todo do smth with the error //;
    if(actual_value[method_name] instanceof Func) {
      try{
        console.log(await actual_value[method_name].exe(this, current, sp_state))
      }catch(err){
        console.log(err);
      }
    }else{
      // todo do smth with the error //
    }
  }


  /**
   * @param  {object} sp_state
   * @param  {string} name
   * @returns  {any}
   */
  #getValue (sp_state, name)
  {
    if(!name) return null;
    if(name.startsWith("$")){
      let obj = {...this.state};
      name.substring(1, name.length).split(".").map(i => {
        if(obj){ obj = obj[i] }
      });
      return obj || null;
    }else{
      if(!sp_state) return null;
      let obj = {...sp_state};
      name.split(".").map(i => {
        if(obj){ obj = obj[i] }
      });
      return obj || null;
    }
  }

  #compilerAnDrun_operatorsORexpresstions (value)
  {
    let local_value = value;
    value.split(" ").map(i => {
      if(i.startsWith("__STRING__") || i.startsWith("__TSTRING__")) {
        local_value = this.#replacer(local_value, i)
      }
      if(i.startsWith("__GROUP__")) {
          const t = this.tokens.get(i.trim())
          local_value = local_value.replace(i, `(${t.substring(2, t.length - 2)})`)
      }
    })
    return local_value;
  }

  #replacer (string, token) 
  {
    return string.replace(token, this.tokens.get(token.trim()))
  }

}