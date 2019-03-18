import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
import { ChargerService } from './charger.service';
import { ERC20TokenService } from './erc20Token.service';
declare let require: any;
const EthereumTx = require('ethereumjs-tx');

declare const Buffer;
const registerArtifacts = require('../../../build/contracts/Register.json');


@Injectable()
export class RegisterService {
  public ready: Promise<any>;
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

  constructor(
    private web3Service: Web3Service, 
    private chargerService: ChargerService,
    private erc20TokenService: ERC20TokenService) {
    this.ready = new Promise((resolve, reject) => {
      this.web3Service.artifactsToContract(registerArtifacts).then(async v => {
        this.Register = v;
        resolve(true);
      });
    });
  }

  public async register() {
    const netId = await this.web3.eth.net.getId();
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas: 300000,
      to: registerArtifacts.networks[netId].address,
      value: 0,
      data: this.Register.methods.count().encodeABI(),
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
    return this.ready
      .then(async () => {
        return await this.Register.methods.counter().call()
      });
  }

  public async showChargers() {
    return this.ready
      .then(async () => {
        const address: string[] = await this.Register.methods.showChargers().call()
        let chargers = [];
        let promises = address.map(async v => {
          let inst = await this.chargerService.init(v);
          let address = await inst.methods.geo().call();
          let balance = await this.erc20TokenService.getBalance(v);
          let owner = await inst.methods.owner().call();
    
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
    
          chargers.push({
            id: v,
            address, balance, 
            owner,
            tariff: prices
          });
        });
    
        await Promise.all(promises);
        return chargers;
      });
  }
}