import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
declare let require: any;
const EthereumTx = require('ethereumjs-tx');

declare const Buffer;
const erc20TokenArtifacts = require('../../../build/contracts/ERC20Token.json');

@Injectable()
export class ERC20TokenService {
  ready: Promise<any>;
  ERC20Token: any;

  public accountsObservable = new Subject<string[]>();

  constructor(private web3Service: Web3Service) {
    this.ready = new Promise((resolve, reject) => {
      this.web3Service.artifactsToContract(erc20TokenArtifacts).then(v => {
        this.ERC20Token = v;
        resolve(true);
      });
    });
  }

  public async buyTokens(v:number) {
    const netId = await this.web3Service.web3.eth.net.getId();
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    console.log(this.web3Service.defaultAccount);
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.defaultAccount)
    const gas = await this.ERC20Token.methods.buyTokens(v).estimateGas({from: this.web3Service.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas,
      to: erc20TokenArtifacts.networks[netId].address,
      value: v,
      data: this.ERC20Token.methods.buyTokens(v).encodeABI(),
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

  public async approveTokens(spender:string, v:number) {
    const netId = await this.web3Service.web3.eth.net.getId();
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.defaultAccount)
    // const gas = this.ERC20Token.methods.approve(spender,v).estimateGas({from: this.web3Service.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas: 500000,
      to: erc20TokenArtifacts.networks[netId].address,
      data: this.ERC20Token.methods.approve(spender,v).encodeABI(),
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

  async getBalance(address: string) {
    return this.ready
      .then(async () => {
        return await this.ERC20Token.methods.balanceOf(address).call();
      });
  }

  getUser() {
    return this.web3Service.defaultAccount;
  }
}
