import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
import env from '../../../config/env';
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
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.stationOwner)
    const gas = await this.Factory.methods.createCharger(geo,name,owner).estimateGas()
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas,
      to: this.Factory.address,
      value: 0,
      data: this.Factory.methods.createCharger(geo,name,owner).encodeABI(),
    };
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(env.stationOwner, 'hex'))
    var rawdata = '0x' + transaction.serialize().toString('hex');

    return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }
}
