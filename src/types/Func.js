module.exports = class Func {
  constructor(props)
  {
    this.func_name = String;
    this.prop_type = String; 
    this.func_exe = Function;
    this.config = Object;

    if(!props) return;
    this.setFunc_name(props.func_name);
    this.setFunc_prop_type(props.prop_type);
    this.setFunc_exe(props.func_exe);
    this.setConfig(props.config);
  }

  /**
   * @param  {string} name
   */
  setFunc_name (name) 
  {
    if(typeof name !== "string") return;
    this.func_name = name;
  }

  /**
   * @param  {string} proptype
   */
  setFunc_prop_type (proptype)
  {
    if(typeof proptype !== "string") return;
    this.prop_type = proptype;
  }

  /**
   * @param  {function} func
   */
  setFunc_exe (func)
  {
    if(typeof func !== "function") return;
    this.func_exe = func;
  }

  /**
   * @param  {function} config
   */
  setConfig (config)
  {
    if(typeof config !== "object") return this.config = new Object();
    this.config = config;
  }

  async exe (instance, current, sp_state)
  {
    const newfunc = this.func_exe.bind({ self: instance });
    return await newfunc(current, sp_state);
  }
  
}
