import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
declare let require: any;
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
declare const Buffer;


@Injectable()
export class Web3Service {
  defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
  stationOwner = '0x727B07eCcB35770725477Bf3B5350fc1B0E38Ebc';
  admin = '0xa4D16e43473412c360BBB1D1dF3a3eDf1Bd7CF4A';
  web3: any;
  eth: any;

  public accountsObservable = new Subject<string[]>();

  constructor() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    this.web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/RF12tXeeoCJRZz4txW2Y`));
    this.eth = this.web3.eth;
  }

  public async artifactsToContract(artifacts, addr?) {
    const netId = await this.eth.net.getId();
    let contractAbstraction;
    if(addr) {  
      contractAbstraction = new this.web3.eth.Contract(artifacts.abi, addr);
    } else {
      contractAbstraction = new this.web3.eth.Contract(artifacts.abi, artifacts.networks[netId].address); 
    }
    
    return contractAbstraction;
  }

  public generateRaw(funcAbi,pk) {
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(pk, 'hex'))
    return '0x' + transaction.serialize().toString('hex');
  }
}
