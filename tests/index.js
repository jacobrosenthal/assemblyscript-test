const assert = require("assert");
const myModule = require("..");

console.log(-4 * 417 * 44);
console.log(Math.exp(-4 * 417 * 44));
console.log(Math.exp((-4 * 417 * 44) / 100000));
console.log(100000 / 102150 - 1 + 1);
console.log(Math.exp((-4 * 417 * 44) / 100000) * (100000 / 102150 - 1) + 1);

console.log("in asm");
console.log(myModule.one());
console.log(myModule.two());
console.log(myModule.three());
console.log(myModule.four());
console.log(myModule.five());
// console.log("ok");

assert.equal(myModule.one(), -4 * 417 * 44);
assert.equal(myModule.two(), Math.exp(-4 * 417 * 44));
assert.equal(myModule.three(), Math.exp((-4 * 417 * 44) / 100000));
// assert.equal(myModule.four(), 100000 / 102150 - 1 + 1);
assert.equal(
  myModule.five(),
  Math.exp((-4 * 417 * 44) / 100000) * (100000 / 102150 - 1) + 1
);
