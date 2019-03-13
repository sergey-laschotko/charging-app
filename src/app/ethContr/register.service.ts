import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
import { ChargerService } from './charger.service';
import { ERC20TokenService } from './erc20Token.service';
declare let require: any;
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');

declare let window: any;
declare const Buffer;
const registerArtifacts = require('../../../build/contracts/Register.json');


@Injectable()
export class RegisterService {
  private accounts: string[];
  public ready = false;
  private web3: any;
  Register: any;

  public accountsObservable = new Subject<string[]>();


  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, 
              private chargerService: ChargerService,
              private erc20TokenService: ERC20TokenService) {
    console.log('Register Constructor: ' + web3Service);
    this.init()
  }

  async init() {
    // this.watchAccount();
    this.web3 = this.web3Service.poshelNahuy();
    await this.web3Service.artifactsToContract(registerArtifacts).then(async v => {
      this.Register = v;
    });
  }

  public async register() {
    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    // Toje
    this.web3.eth.defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas: 300000,
      to: registerArtifacts.networks[netId].address,
      value: 0,
      data: registerArtifacts.methods.count().encodeABI(),
    };
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(pk, 'hex'))
    var rawdata = '0x' + transaction.serialize().toString('hex');

    this.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }
  public async showFreeChargers() {
    return await this.Register.methods.counter().call()
  }

  public async showChargers() {
    await this.init()
    // console.log('Chargers incoming sir')
    const address: string[] = await this.Register.methods.showChargers().call()
    let chargers = [];
    await address.forEach(async v => {
      console.log('charger', v)
      let inst = await this.chargerService.init(v);
      // this.Charger = new this.web3.eth.Contract(chargerArtifacts.abi, addr);
      let address = await inst.methods.geo().call();
      let balance = await this.erc20TokenService.balance(v);

      let pricesN = await inst.methods.pricesLength().call();
      let prices = [];
      for (let i = 0; i < pricesN; i++) {
        let price = await inst.methods.prices(i).call();
        prices.push({
          id: v + prices.length,
          from: price.from,
          to: price.to,
          price: price.amount
        });
      }
      let charger = {
        id: v,
        address, balance, tariff: prices
      }

      // User {
      //  id: addr,
      //  balance: tokenBalance,
      //  station: all of them
      //}

      chargers.push(charger);

    })
    console.log('Charged sir',chargers);
    return chargers;
  }
  // public async bootstrapWeb3() {
  //   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  //   if (typeof window.web3 !== 'undefined') {
  //     // Use Mist/MetaMask's provider
  //     this.web3 = new Web3(window.web3.currentProvider);
  //     await window.ethereum['enable']();

  //   } else {
  //     console.log('No web3? You should consider trying MetaMask!');

  //     // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
  //     Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
  //     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //     this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  //   }

  //   // setInterval(() => this.refreshAccounts(), 100);
  // }
}
