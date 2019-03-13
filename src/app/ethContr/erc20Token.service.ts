import {Injectable} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Subject} from 'rxjs';
declare let require: any;
const EthereumTx = require('ethereumjs-tx');

declare const Buffer;
const erc20TokenArtifacts = require('../../../build/contracts/ERC20Token.json');


@Injectable()
export class ERC20TokenService {
  private accounts: string[];
  public ready = false;
  private web3: any;
  ERC20Token: any;

  public accountsObservable = new Subject<string[]>();

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service) {
    this.init()
  }

  init(): void {
    console.log(this);
    this.web3 = this.web3Service.poshelNahuy();
    this.web3Service.artifactsToContract(erc20TokenArtifacts).then(async v => {
      this.ERC20Token = v;
    });
  }

  public async buyTokens(v:number) {
    const netId = await this.web3.eth.net.getId();
    // Vikin
    const pk = 'f0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31';
    // Toje
    this.web3.eth.defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
    const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
    const gas = erc20TokenArtifacts.methods.buyTokens(v).estimateGas({from: this.web3.eth.defaultAccount, value: v})
    const funcAbi = {
      nonce,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('47', 'gwei')),
      gas,
      to: erc20TokenArtifacts.networks[netId].address,
      value: v,
      data: erc20TokenArtifacts.methods.buyTokens(v).encodeABI(),
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
    return await this.ERC20Token.methods.counter().call()
  }

  public async balance(address: string) {
    return await this.ERC20Token.methods.balanceOf(address).call()
  }
  // public async bootstrapWeb3() {
  //   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  //   if (typeof window.web3 !== 'undefined') {
  //     // Use Mist/MetaMask's provider
  //     this.web3 = new Web3(window.web3.currentProvider);
  //     await window.ethereum['enable']();

  //   } else {
  //     console.log('No web3? You should consider trying MetaMask!');

  //     // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
  //     Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
  //     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //     this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  //   }

  //   // setInterval(() => this.refreshAccounts(), 100);
  // }
}
