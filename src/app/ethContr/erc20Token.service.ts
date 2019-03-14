import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
declare let require: any;
const EthereumTx = require('ethereumjs-tx');

declare const Buffer;
const erc20TokenArtifacts = require('../../../build/contracts/ERC20Token.json');


@Injectable()
export class ERC20TokenService {
  public ready = false;
  private web3: any;
  ERC20Token: any;

  public accountsObservable = new Subject<string[]>();

  constructor(private web3Service: Web3Service) {
    this.init();
  }

  // Test One
  // E14386F7BE3AF18B07222E1124494A92498934B548C05DA8DC17DE3EE1427AB9
  // 0xa4D16e43473412c360BBB1D1dF3a3eDf1Bd7CF4A

  async init() {
    this.web3 =  await this.web3Service.getInstance();
    // const netId = await this.web3.eth.net.getId();
    
    console.log('ready?',this.isReady())
    this.web3Service.artifactsToContract(erc20TokenArtifacts).then(async v => {
      this.ERC20Token = v;
    });
    // this.ERC20Token = new this.web3.eth.Contract(erc20TokenArtifacts.abi, erc20TokenArtifacts.networks[netId].address);
    // return new this.web3.eth.Contract(erc20TokenArtifacts.abi, erc20TokenArtifacts.networks[netId].address);
  }

  public isReady():boolean {
    return this.ERC20Token ? true : false;
  }

  public async buyTokens(v:number) {
    await this.init()
    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    // Toje
    // this.web3.eth.defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const gas = await this.ERC20Token.methods.buyTokens(v).estimateGas({from: this.web3.eth.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas,
      to: erc20TokenArtifacts.networks[netId].address,
      value: v,
      data: this.ERC20Token.methods.buyTokens(v).encodeABI(),
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

  public async approveTokens(spender:string, v:number) {
    await this.init()
    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    // Toje
    // this.web3.eth.defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const gas = await this.ERC20Token.methods.approve(spender,v).estimateGas({from: this.web3.eth.defaultAccount})
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas,
      to: erc20TokenArtifacts.networks[netId].address,
      value: 0,
      data: this.ERC20Token.methods.approve(spender,v).encodeABI(),
    };
    const transaction = new EthereumTx(funcAbi);
    transaction.sign(Buffer.from(pk, 'hex'))
    var rawdata = '0x' + transaction.serialize().toString('hex');

    return this.web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
        console.log(['Receipt:', receipt]);
    })
    .on('error', console.error);
  }

  public async getBalance(address: string) {
    await this.init();
    return this.ERC20Token.methods.balanceOf(address).call()
  }

  public async getUser() {
    // await this.init()
    return this.web3.eth.defaultAccount;
  }
}
