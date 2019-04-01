import {Web3Service} from './web3.service';
import { on } from 'cluster';

declare let require: any;
const env = require('../../config/env');
const erc20TokenArtifacts = require('../../build/contracts/ERC20Token.json');

export class ERC20TokenService {
  ready: Promise<any>;
  ERC20Token: any;

  constructor(private web3Service: Web3Service) {
    this.ready = new Promise((resolve, reject) => {
      this.web3Service.artifactsToContract(erc20TokenArtifacts).then(v => {
        this.ERC20Token = v;
        resolve(true);
      });
    });
  }

  public async buyTokens(v:number, address: string) {
    const nonce = await this.web3Service.web3.eth.getTransactionCount(address);
    const gas = await this.ERC20Token.methods.buyTokens(v).estimateGas({from: address, value: v});
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas,
      to: this.ERC20Token.address,
      value: v,
      data: this.ERC20Token.methods.buyTokens(v).encodeABI(),
    };
    let pk;
    for (const key in env) {
      if(env[key].address === address) 
        pk = env[key].pk
    }
    // const pk = env.filter(v => {
    //   return v.address === address
    // })[0].pk;
    const rawdata = await this.web3Service.generateRaw(funcAbi,pk);
    return this.web3Service.web3.eth.sendSignedTransaction(rawdata);
  }

  public async approveTokens(spender:string, v:number) {
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.defaultAccount)
    // const gas = this.ERC20Token.methods.approve(spender,v).estimateGas({from: this.web3Service.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas: 500000,
      to: this.ERC20Token.address,
      data: this.ERC20Token.methods.approve(spender,v).encodeABI(),
    };
    const rawdata = this.web3Service.generateRaw(funcAbi,env.user.pk);

    return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
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

  getStationOwner() {
    return this.web3Service.stationOwner;
  }

  getServiceOwner() {
    return this.web3Service.admin;
  }

  public async totalSupply() {
    return this.ready
      .then(async () => {
        return await this.ERC20Token.methods.totalSupply().call();
      });
  }
  public async mint(amount: number) {
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.admin)
    // const gas = this.ERC20Token.methods.approve(spender,v).estimateGas({from: this.web3Service.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas: 500000,
      to: this.ERC20Token.address,
      data: this.ERC20Token.methods.mint(this.web3Service.admin,amount).encodeABI(),
    };
    const rawdata = this.web3Service.generateRaw(funcAbi,env.admin.pk);
    this.web3Service.web3.eth.sendSignedTransaction(rawdata)
      .on("transactionHash", (transactionHash: any) => {
        console.log(transactionHash);
      })
      .on("receipt", (receipt: any) => {
        console.log(receipt);
      })
      .on('error', (error: any) => {
        console.log(error);
      })
      .then((receipt: any) => {
        console.log(receipt);
      })
  }
  public async burn(amount: number) {
    const nonce = await this.web3Service.web3.eth.getTransactionCount(this.web3Service.admin)
    // const gas = this.ERC20Token.methods.approve(spender,v).estimateGas({from: this.web3Service.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3Service.web3.utils.toHex(this.web3Service.web3.utils.toWei('47', 'gwei')),
      gas: 500000,
      to: this.ERC20Token.address,
      data: this.ERC20Token.methods.burn(amount).encodeABI(),
    };
    const rawdata = this.web3Service.generateRaw(funcAbi,env.admin.pk);

    return this.web3Service.web3.eth.sendSignedTransaction(rawdata);
  }
}
