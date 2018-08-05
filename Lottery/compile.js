/*jshint esversion: 6 */

const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname,'contracts','Lottery.sol');
/*__dirname == provide current working directory */
const source = fs.readFileSync(contractPath,'utf8');

//console.log(solc.compile(source,1));

module.exports = solc.compile(source,1).contracts[':Lottery'];
