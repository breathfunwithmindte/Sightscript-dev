/**
 * 
 * @param {object} obj // ? write to // 
 * @param {*} name // ? object property, sightscript variable name //
 * @param {*} value // ? value to write //
 * @returns void
 */

module.exports = (sp_state, state, name, value) => {
  if(!sp_state) return console.log("no local state writter");
  if(!state) return console.log("no state writter");;
  if(!name) return console.log("no name writter");;
  let obj = name.startsWith("$") ?  state : sp_state;
  if(name.split(" ").length > 1) return console.log("name bad formated writter");;
  const i = name.startsWith("$") ? name.substring(1, name.length).split(".") : name.split(".");
  if(i.length === 1)
  {
    obj[i[0]] = value;
  }
  if(i.length === 2)
  {
    obj[i[0]][i[1]] = value;
  }
  if(i.length === 3)
  {
    obj[i[0]][i[1]][i[2]] = value;
  }
  if(i.length === 4)
  {
    obj[i[0]][i[1]][i[2]][i[3]] = value;
  }
  if(i.length === 5)
  {
    obj[i[0]][i[1]][i[2]][i[3]][i[4]] = value;
  }
}