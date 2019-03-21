import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
import { ERC20TokenService } from './erc20Token.service';
import env from '../../../config/env';
declare let require: any;

const chargerArtifacts = require('../../../build/contracts/Charger.json');


@Injectable()
export class ChargerService {
  Charger: any;

  public accountsObservable = new Subject<string[]>();

  constructor(private web3Service: Web3Service,
              private erc20TokenService: ERC20TokenService) {
  }

  public async init(addr?) {
    this.Charger = new this.web3Service.web3.eth.Contract(chargerArtifacts.abi, addr);
    return new this.web3Service.web3.eth.Contract(chargerArtifacts.abi, addr);
  }

  public async startCharging(addr) {
    await this.init(addr);
    console.log(addr)
    console.log('Approving tokens to', this.Charger.address);
    const rec = await this.erc20TokenService.approveTokens(this.Charger.address, 150);
    console.log('Rec',rec)

    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.defaultAccount)
    // const gas = await this.Charger.methods.startCharging().estimateGas()

    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas: 500000,
      to: this.Charger.address,
      data: this.Charger.methods.startCharging().encodeABI(),
    };
    console.log(this.Charger.address)
    const rawdata = this.web3Service.generateRaw(funcAbi,env.user.pk);

    return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }

  public async addRate(from: number,to: number,newRate: number) {
    // await this.init(addr);

    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.web3.eth.defaultAccount)
    const gas = await this.Charger.methods.addRate(from,to,newRate).estimateGas({from: this.web3Service.web3.eth.defaultAccount})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas,
      to: this.Charger.address,
      data: this.Charger.methods.addRate(from,to,newRate).encodeABI(),
    };
    const rawdata = this.web3Service.generateRaw(funcAbi,env.stationOwner.pk);

    return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }

  public async reserve(from: number,to: number) {
    // Here we have init again, gotta correct
    // await this.init(addr);

    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.web3.eth.defaultAccount)
    const gas = await this.Charger.methods.reserve(from,to).estimateGas({from: this.web3Service.web3.eth.defaultAccount})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas,
      to: this.Charger.address,
      data: this.Charger.methods.reserve(from,to).encodeABI(),
    };
    const rawdata = this.web3Service.generateRaw(funcAbi,env.stationOwner.pk);
    return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }
  async getReservations(addr,address: string) {
    await this.init(addr);

    // Returns indexes user owns for the next method
    return await this.Charger.methods.getReservations(address).call();
  }

  async reservationsTime(addr,index: number) {
    await this.init(addr);

    return await this.Charger.methods.reservationsTime(index).call();
  }
}
