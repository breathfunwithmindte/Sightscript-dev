module.exports = class Parsed {
  constructor(props) {
    props = typeof props === "string" ? Parsed.ErrorProps(props) : props;
    this.propss = props;
    /**
     * @type {number}
     * @description // status if something went wrong status equals to -1;
     */
    this.status;
    this.setStatus(props.status);

    /**
     * @type {string}
     * @description // name of function or variable or ... etc
     */
    this.name;
    this.setName(props.name);

    /**
     * @type {string}
     * @description // maybe error message or some description or additional information;
     */
    this.message;
    this.setMessage(props.message);

    /**
     * @type {string}
     * @description // for | if | functions ... required property or null
     */
    this.props;
    this.setProps(props.props);

    /**
     * @type {boolean}
     * @description // true if need additional proccesses
     */
    this.ready;
    this.setReady(props.ready);

    /**
     * @type {any}
     * @description // value for variables
     */
    this.value = props.value || null;

    /**
     * @type {list} // of self class instance
     * @description // for | if | functions ... required property or empty
     */
    this.codeblock = new Array();
    this.setCodeblock(props.codeblock);

    if (typeof props.type !== "string") throw new Error("Type is required.");

    /**
     * @type {string}
     * @description // value type of variables
     */
    this.type;
    this.setType(props.type);

    /**
     * @type {any}
     * @description // maybe something more
     */
    this.general = props.general || null;

    /**
     * @type {object} // with 2 properties writable and readable;
     * @description // config of variables;
     */
    this.config = props.config || {};
  }

  static ErrorProps(props) {
    const [type, errormessage] = props.split("::");
    return { type: type, message: errormessage, status: -1 };
  }

  /**
   * @param  {number} status
   */
  setStatus(status) {
    if (isNaN(Number(status))) {
      this.status = 0;
      return;
    }
    this.status = Number(status);
  }

  /**
   * @param  {string} type
   */
  setType(type, config) {
    if (typeof type !== "string") {
      this.type = "unchecked-variable";
    } else {
      this.type = type;
      this.config = config || this.#setConfig(type)
    }
  }

  /**
   * @param  {string} type
   * @return  {object} // this.config
   */
  #setConfig (type)
  {
    if(type.startsWith("variable"))
    {
      return {
         writable: true, readable: true 
      }
    }
    return {
      writable: true, readable: true
    }
  }

  /**
   * @param  {list} codeblock
   */
  setCodeblock(codeblock) {
    if (codeblock instanceof Array) {
      this.codeblock = codeblock;
    }
  }

  /**
   * @param  {number} name
   */
  setName(name) {
    if (typeof name !== "string") {
      this.name = null;
    } else {
      this.name = name;
    }
  }

  /**
   * @param  {number} props
   */
  setProps(props) {
    if (typeof props !== "string") {
      this.props = null;
    } else {
      this.props = props;
    }
  }

  /**
   * @param  {number} message
   */
  setMessage(message) {
    if (typeof message !== "string") {
      this.message = null;
    } else {
      this.message = message;
    }
  }

  /**
   * @param  {number} ready
   */
  setReady(ready) {
    if (typeof ready !== "boolean") {
      this.ready = false;
    } else {
      this.ready = ready === true ? true : false;
    }
  }

  /**
   * returns {boolean}
   */
  isWritable ()
  {
    return this.config.writable || false;
  }

};
