
// GLSL template for our struct and our constructors
var preamble = (basis,classname) =>
`// Generator written by meuns.

struct ${classname} {  
    float mvec[${basis.length}];
};

//***********************
//
//
//***********************
${classname} Zero() {
  ${classname} res;
  // TODO
  return res;
}`

// GLSL template for our binary operators
var binary = (classname, symbol, name, name_a, name_b, name_ret, code, classname_a=classname, classname_b=classname, desc) =>
`//***********************
// ${classname}.${name} : ${name_ret} = ${symbol?name_a+" "+symbol+" "+name_b:name_a+"."+name+"("+name_b+")"} 
// ${desc}
//***********************
${classname} ${name}(in ${classname_a} ${name_a}, in ${classname_b} ${name_b}) {
  ${classname} ${name_ret};
  ${code.replace(/\[/g,'.mvec[')}
  return ${name_ret};
}`

// GLSL template for our unary operators
var unary = (classname, symbol, name, name_a, name_ret, code, classname_a=classname, desc)=>
`//***********************
// ${classname}.${name} : ${name_ret} = ${symbol?symbol+name_a:name_a+"."+name+"()"}
// ${desc}
//***********************
${classname} ${name}(in ${classname_a} ${name_a}) {
  ${classname} ${name_ret};
  ${code.replace(/\[/g,'.mvec[')}
  return ${name_ret};
}`

// GLSL template for our postamble
var postamble = (basis, classname, example) =>
``;

Object.assign(exports,{preamble, postamble, unary,binary,desc:"glsl"});
