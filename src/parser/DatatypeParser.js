module.exports = class Parsed {
  constructor(props) {
    props = typeof props === "string" ? Parsed.ErrorProps(props) : props;

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
     * @type {string}
     * @description // value for variables
     */
    this.value;
    this.setValue(props.value);

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
     * @type {string}
     * @description // maybe something more
     */
    this.general = props.general || null;
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
  setType(type) {
    if (typeof type !== "string") {
      this.type = "unchecked-variable";
    } else {
      this.type = type;
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
   * @param  {number} value
   */
  setValue(value) {
    if (typeof value !== "string") {
      this.value = null;
    } else {
      this.value = value;
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
};
