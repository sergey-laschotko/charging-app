declare let require: any;
const env = require("../../config/env");
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
declare const Buffer: any;

export class Web3Service {
  defaultAccount = env.defaultAccountAddress;
  stationOwner = env.stationOwnerAddress;
  admin = env.serviceOwnerAddress;
  web3: any;
  eth: any;

  constructor() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    this.web3 = new Web3(new Web3.providers.HttpProvider(env.netAddress));
    this.eth = this.web3.eth;
  }

  public async artifactsToContract(artifacts: any, addr?: any) {
    const netId = await this.eth.net.getId();
    let contractAbstraction;
    if(addr) {  
      contractAbstraction = new this.web3.eth.Contract(artifacts.abi, addr);
    } else {
      contractAbstraction = new this.web3.eth.Contract(artifacts.abi, artifacts.networks[netId].address); 
    }
    
    return contractAbstraction;
  }

  public generateRaw(funcAbi: any, pk: any) {
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(pk, 'hex'))
    return '0x' + transaction.serialize().toString('hex');
  }
}
