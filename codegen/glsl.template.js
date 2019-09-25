
// GLSL template for our struct and our constructors
var preamble = (basis, classname) =>
`// Generator written by meuns.

struct ${classname} {  
  float mvec[${basis.length}];
};

//***********************
// ${classname}.Zero : res = 0
// Fill the multivector with 0.
//***********************
${classname} Zero() {
  ${classname} res;
  ${[...Array(basis.length)].map((x,i)=>"  res.mvec[" + i + "] = 0.0;").join("\n")}
  return res;
}

//***********************
// ${classname}.Set : res[i] = v
// Set blade value.
//***********************
${classname} Set(in CGA a, int i, float v) {
  ${classname} res = a;
  res.mvec[i] = v;
  return res;
}

//***********************
// ${classname}.Get : v = a[i]
// Get blade value.
//***********************
float Get(in CGA a, int i) {
  return a.mvec[0];
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
`// Setup CGA basis
const CGA e1 = CGA(float[](+0.0, +1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));
const CGA e2 = CGA(float[](+0.0, +0.0, +1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));
const CGA e3 = CGA(float[](+0.0, +0.0, +0.0, +1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));
const CGA e4 = CGA(float[](+0.0, +0.0, +0.0, +0.0, +1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));
const CGA e5 = CGA(float[](+0.0, +0.0, +0.0, +0.0, +0.0, +1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));
const CGA eo = CGA(float[](+0.0, +0.0, +0.0, +0.0, +1.0, +1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));
const CGA ei = CGA(float[](+0.0, +0.0, +0.0, +0.0, -0.5, +0.5, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0));

// Various shortcuts
float Distance(in CGA a, in CGA b) {
  return sqrt(-Get(Dot(a, b), 0) * 2.0);
}

CGA MakePoint(vec3 p) {
  return Add(smul(p.x, e1), Add(smul(p.y, e2), Add(smul(p.z, e3), Add(smul(0.5 * dot(p, p), ei), eo))));
}

CGA MakeDualSphere(vec3 c, float r) {
  return Add(smul(c.x, e1), Add(smul(c.y, e2), Add(smul(c.z, e3), smul(0.5 * r * r, ei))));
}`;

Object.assign(exports, {preamble, postamble, unary, binary, desc: "glsl"});
