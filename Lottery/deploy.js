/*jshint esversion: 6 */
//const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require('./compile'); 

/*const provider = new HDWalletProvider(
    'fossil exercise finger auction more replace federal trumpet nature supreme gas tongue',
    'https://rinkeby.infura.io/qeQLVzTXrwcSvZyXfqPP'
);*/

const web3 = new Web3 (provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Deploying contract in Rinkby through account : ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy( {data: '0x' +bytecode} )
        .send({ gas: '1000000', gasprice: '10000000000', from: accounts[0] });
    
    console.log(interface);
    console.log('Deployed contract in Rinkby @ Address : ', result.options.address);
};
deploy();