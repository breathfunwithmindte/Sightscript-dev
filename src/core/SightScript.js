const Tokenizer = require("../tokenizer/Tokenizer");
const Parser = require("../parser/Parser");
const Compiler = require("../compiler/Compiler");
const Parsed = require("../types/Parsed");
const Executor = require("./Executor");
const functions = require("../functions");

module.exports = class SightScript extends Executor {
  constructor(props)
  {
    super(props.script);
    /**
     * @type {Map<string, object>}
     */
    this.functions = functions;
    /**
     * @type {object}
     * @doc primary state of script proccess. It is the global scope;
     */
    //return;
    this.state = new Object();
    // console.log(this.tokens);
    // console.log(this.script);

    /**
     * @type {list<Parsed>}
     * @doc theses objects compiler can read.
     */
    this.objects = Parser.parse(this.script, this.tokens);
    //console.table(this.objects)

    this.compiler = new Compiler();

    this.executables = this.compiler.main_compile(this.objects, this.tokens, true)

    console.table(this.executables);

    /**
     * @type {list<string>}
     * runtime errors like variable not found, method not envoiked, function not exist;
     */
    this.runtime_errors = new Array();

    // console.log(this);
    //delete this.tokens;
    // runtime, system, dynamic
  }

  async execute ()
  {
    return await this.primary_execute(this.executables, true);
  }


  function_builder (props) {
    return function (props) {
      return this.execute();
    }
  }


}