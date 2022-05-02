const { Console } = require("console");
const makeid = require("../utils/id");

module.exports = class Tokenizer {
  constructor(props) {
    this.initial_script = props.trim();
    this.tokens = new Map();
    this.log = true;
    this.tokenize();
    
    //console.log(this)
  }


  tokenize () 
  {
    let script = this.initial_script;
    script = this.#removeComments(script);
    //script = this.#regexReplace(script, "(?<=\")((.|\n)*?)(?=\\*\")");
    script = this.#regexReplace(script, `"((.|\n)*?)"`, { idName: "__STRING__" });
    script = this.#regexReplace(script, `'((.|\n)*?)'`, { idName: "__STRING__" });
    script = this.#regexReplace(script, "`((.|\n)*?)`", { idName: "__TSTRING__" });
    script = this.#regexReplace(script, "<:((.|\n)*?):>", { idName: "__GROUP__" });
    script = this.#regexReplace(script, "\\{((.|\n)*?)\\}", { idName: "__CODE__" });
    script = this.#regexReplace(script, "function(.*)__CODE__(.*)", { idName: "__FUNCTION__" });
    script = this.#regexReplace(script, "cb\\((.*)\\) ?\\=> ?__CODE__(.*?)(?=(\\)|,))", { idName: "__CALLBACK__" });
    script = this.#regexReplace(script, "\\(((.|\n)*?)\\)", { idName: "__PAR__" });
    script = this.#regexReplace(script, "if((.|\n)*?)end", { idName: "__IF__" });
    script = this.#regexReplace(script, "for((.|\n)*?)end", { idName: "__FOR__" });

    this.tokens.forEach((v, k) => {
      if(k.startsWith("__CODE__")) {
        let text = v;
        text = this.#regexReplace(text, "\\(((.|\n)*?)\\)", { idName: "__PAR__" });
        text = this.#regexReplace(text, "if((.|\n)*?)end", { idName: "__IF__" });
        text = this.#regexReplace(text, "for((.|\n)*?)end", { idName: "__FOR__" });
        this.tokens.set(k, text);
      }
      if(k.startsWith("__FUNCTION__")) {
        let text = v;
        text = this.#regexReplace(text, "\\(((.|\n)*?)\\)", { idName: "__PAR__" });
        this.tokens.set(k, text);
      }
    })
    this.script = script;
    // console.log(this.script)
    // console.log(this.tokens)
    // this.script = script;

  }
  
  /**
   * @param  {string} script;
   * @return {string} script;
   */
  #removeComments (script) 
  {
    let split_comment_lines = script.split(/\r?\n/).map(i => i.trim()).filter(i => !i.startsWith("//") && !i.startsWith("#")).join("\n");
    split_comment_lines = this.#regexReplace(split_comment_lines, "(?<=\\/\\*\\*)((.|\n)*?)(?=\\*\\/)", { addA: "/**", addB: "*/", idName: "__COMMENTS__" });
    return split_comment_lines;
  }

  /**
   * @param  {string} script
   * @param  {string} regex
   * @param  {object} options
   * @description replaceWith, addA, addB, idName, store
   */
  #regexReplace (script, regex, options)
  {
    let initial_local_script = script;
    let i = 0;
    while(i < 1000) {
      let r = initial_local_script.match(regex);
      let regex_found = r ? r[0] : null;
      if(regex_found === null) { break; }
      let id = (options.idName || "") + makeid(23);
      if(options.store !== false) {
        this.tokens.set(id, regex_found);
      }
      if(options.log) {
        console.log(id, regex_found)
      }
      initial_local_script = initial_local_script.replace( regex_found, (options.replaceWith || id) )
      i++;
    }
    return initial_local_script;
  }

  #logtokenzie (name, script) 
  {
    if(this.log) {
      console.log(`\x1b[35mAFTER ${name} TOKENIZE ==>\n \x1b[0m`, script)
      console.log("\x1b[33mEnd " + name + "\n \x1b[0m")
    }
  }
  


}