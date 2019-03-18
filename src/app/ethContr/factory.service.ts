import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
declare let require: any;
const EthereumTx = require('ethereumjs-tx');

declare const Buffer;
const factoryArtifacts = require('../../../build/contracts/Factory.json');


@Injectable({
  providedIn: "root"
})
export class FactoryService {
  public ready: Promise<any>;
  private web3: any;
  Factory: any;

  public accountsObservable = new Subject<string[]>();

  constructor(
    private web3Service: Web3Service) {
    this.ready = new Promise((resolve, reject) => {
      this.web3Service.artifactsToContract(factoryArtifacts).then(async v => {
        this.Factory = v;
        resolve(true);
      });
    });
  }

  public async createCharger(geo: string,name: string,owner: string) {
    const netId = await this.web3Service.web3.eth.net.getId();
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.defaultAccount)
    const gas = await this.Factory.methods.createCharger(geo,name,owner).estimateGas()
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas,
      to: factoryArtifacts.networks[netId].address,
      value: 0,
      data: this.Factory.methods.createCharger(geo,name,owner).encodeABI(),
    };
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(pk, 'hex'))
    var rawdata = '0x' + transaction.serialize().toString('hex');

    return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }
}
