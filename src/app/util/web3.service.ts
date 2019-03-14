import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
declare let require: any;
const Web3 = require('web3');

declare let window: any;


@Injectable()
export class Web3Service {
  defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
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
}
