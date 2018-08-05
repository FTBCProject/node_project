/*jshint esversion: 6 */

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3 (ganache.provider());
web3.setProvider(ganache.provider());

require('events').EventEmitter.defaultMaxListeners = 0;

const { interface, bytecode } = require('../compile'); 

/*beforeEach(() => {
    //Get Ganache test accounts
    web3.eth.getAccounts()
    .then(fetchedAccounts => {
        console.log(fetchedAccounts);
    });
    //Use any one accounts to deploy the contract
});*/

let accounts;
let lottery;

beforeEach( async () => {
    //Get Ganache test accounts
    accounts = await web3.eth.getAccounts();
    //Use any one accounts to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy( {data: bytecode} )
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        console.log(accounts);
        console.log('======================');
        //console.log(lottery);
        console.log('======================>>>>');
        assert.ok(lottery.options.address);
    });

    it('Allows One Account to Enter the Lottery', async () => {
        await lottery.methods.entergame().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether') 
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('Allows Multiple Account to Enter the Lottery', async () => {
        await lottery.methods.entergame().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether') 
        });

        await lottery.methods.entergame().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether') 
        });

        await lottery.methods.entergame().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether') 
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(3, players.length);
    });

    it('Check the Entry Fee Miminum 0.02 Ether', async() => {
        try{
            await lottery.methods.entergame().send({
                from: accounts[2],
                value: 100 
            });
            assert(false);//Incase if above "await" doesn't through error, this assert will execute
        } catch (err)
        {
            assert(err);
            console.log('Fails due to less Ether : ');
        }
        
    });

    it('Check Only Manager can call pickwinner function', async() => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[2]
            });
            assert(false);//Incase if above "await" doesn't through error, this assert will execute
        } catch (err)
        {
            assert(err);
            console.log('Fails due to Non Manager Accounts Calls the function ');
        }
        
    });

    it('Full check', async() => {
        await lottery.methods.entergame().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether') 
        });

        const InitialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from: accounts[0]});
        
        const FinalBalance = await web3.eth.getBalance(accounts[0]);

        const Difference =  FinalBalance - InitialBalance;

        console.log('Difference is : ', Difference);

        assert( Difference > web3.utils.toWei('1.8', 'ether') );
    });
});