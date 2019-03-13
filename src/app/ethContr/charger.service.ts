import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
declare let require: any;
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');

declare let window: any;
declare const Buffer;
const chargerArtifacts = require('../../../build/contracts/Charger.json');


@Injectable()
export class ChargerService {
  private accounts: string[];
  public ready = false;
  private web3: any;
  Charger: any;

  public accountsObservable = new Subject<string[]>();


  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  public async init(addr?) {
    // this.watchAccount();
    this.web3 = await this.web3Service.poshelNahuy();
    // this.web3Service.artifactsToContract(chargerArtifacts,addr).then(async v => {
    //   this.Charger = v;
    //   // console.log(await this.Charger.methods.counter().call());
    // });
    this.Charger = new this.web3.eth.Contract(chargerArtifacts.abi, addr);
    return new this.web3.eth.Contract(chargerArtifacts.abi, addr);


    // Impement different chargers on diff address
  }

  public async register() {
    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    // Toje
    this.web3.eth.defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const gas = chargerArtifacts.methods.register().estimateGas({from: this.web3.eth.defaultAccount})
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas,
      to: chargerArtifacts.networks[netId].address,
      value: 0,
      data: chargerArtifacts.methods.count().encodeABI(),
    };
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(pk, 'hex'))
    var rawdata = '0x' + transaction.serialize().toString('hex');

    this.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
        return 'Success';
    })
    .on('error', console.error);
  }
  public async showFreeChargers() {
    return await this.Charger.methods.counter().call()
  }

  public async geo() {
    return await this.Charger.methods.geo().call()
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
