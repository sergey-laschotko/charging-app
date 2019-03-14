import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
import { ERC20TokenService } from './erc20Token.service';
declare let require: any;
const EthereumTx = require('ethereumjs-tx');

declare const Buffer;
const chargerArtifacts = require('../../../build/contracts/Charger.json');


@Injectable()
export class ChargerService {
  private accounts: string[];
  public ready = false;
  private web3: any;
  Charger: any;

  public accountsObservable = new Subject<string[]>();

  constructor(private web3Service: Web3Service,
              private erc20TokenService: ERC20TokenService) {
  }

  public async init(addr?) {
    this.web3 = await this.web3Service.getInstance();
    // this.web3Service.artifactsToContract(chargerArtifacts,addr).then(async v => {
    //   this.Charger = v;
    //   // console.log(await this.Charger.methods.counter().call());
    // });
    this.Charger = new this.web3.eth.Contract(chargerArtifacts.abi, addr);
    return new this.web3.eth.Contract(chargerArtifacts.abi, addr);


    // Impement different chargers on diff address
  }

  public async startCharging(addr) {
    await this.init(addr);
    // Nu po idee doljno uspet
    console.log('Approving tokens to', this.Charger.address);
    const rec = await this.erc20TokenService.approveTokens(this.Charger.address, 150);
    //
    console.log('Rec',rec)

    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    // const gas = await this.Charger.methods.startCharging().estimateGas({from: this.web3.eth.defaultAccount, value: 0})

    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas: 500000,
      to: this.Charger.address,
      data: this.Charger.methods.startCharging().encodeABI(),
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

  public async addRate(addr,from: string,to: string,newRate: number) {
    await this.init(addr)
    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const gas = await this.Charger.methods.addRate(from,to,newRate).estimateGas({from: this.web3.eth.defaultAccount})
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas,
      to: this.Charger.address,
      data: this.Charger.methods.addRate(from,to,newRate).encodeABI(),
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
}
