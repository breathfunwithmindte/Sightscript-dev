console.log("sight script");


const { SightScript } = require("./src/core")

const ss = new SightScript({
  script: require("fs").readFileSync("./index.ss").toString()
});

(async () => {
  const result = await ss.execute();
  console.log("primary execute = ", result)
})()



//ss.tokens.forEach((v, k) => console.log(k))


const str = `

  function { asdsad1 } __CODE__asidjasijh213129012489
  function { asdasd2 } __CODE__asidjasidji123123
  function asdasd __CODE__asidjasidji123123

`

//function(.*)__CODE__(.*)
//"(?<=\\{)((.|\n)*?)(?=\\})"
//(?<=function)((.|\n)*?)(?=__CODE__(.*)(\s))
//console.log([...str.matchAll("{((.|\n)*?)}")].map(i => i[0]))






// const sss = `
//   asdasd
//   function somename (asdsa,asd ,asd,as,d,asd) {
//     a = "5 dsadsa"
    
//   }
//   ddd
// `;

// console.log(sss.match("(?<=function ?(.*)\\((.*?)\\) ?{)((.|\n)*?)(?=})"))
// console.log(sss.replace("(?<=function ?(.*)\\((.*?)\\) ?{)((.|\n)*?)(?=})", "@@@@@@@@@@@@@@"))