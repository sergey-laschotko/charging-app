import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
declare let require: any;
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx')

declare let window: any;


@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;

  public accountsObservable = new Subject<string[]>();

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public async bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    // if (typeof window.web3 == 'undefined') {
    //   // Use Mist/MetaMask's provider
    //   this.web3 = new Web3(window.web3.currentProvider);
    //   await window.ethereum['enable']();

    // } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/RF12tXeeoCJRZz4txW2Y`));
      
      this.web3.eth.defaultAccount = '0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12';
    // }

    // setInterval(() => this.refreshAccounts(), 100);
  }

  public giveMeThat() {
    return this.web3;
  }

  public async artifactsToContract(artifacts, addr?) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const netId = await this.web3.eth.net.getId();
    let contractAbstraction;
    if(addr) {
      contractAbstraction = new this.web3.eth.Contract(artifacts.abi, addr);
      // console.log('I got an address', addr)
    } else {
      contractAbstraction = new this.web3.eth.Contract(artifacts.abi, artifacts.networks[netId].address);      
      // console.log('I took an address', artifacts.networks[netId].address)
    }

    // console.log(this.web3.eth.accounts.wallet.add('0xf0b14d22eedc978abd2b3f64287eb4b7e7b19a3ecfe60cf46d925f0366804b31'));

    // console.log('Meth',await contractAbstraction.methods.counter().call())
    // console.log(await this.web3.eth.personal.getAccounts())
    // this.web3.eth.sendTransaction({
    //   // from: "0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12",
    //   to: "0x9de88e0a9Fa6d30dF271eec31C55eE0358E8f7f9",
    //   value: '10000'
    // })

    // contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  // private refreshAccounts() {
  //   this.web3.eth.getAccounts((err, accs) => {
  //     console.log('Refreshing accounts');
  //     if (err != null) {
  //       console.warn('There was an error fetching your accounts.');
  //       return;
  //     }

  //     // Get the initial account balance so it can be displayed.
  //     if (accs.length === 0) {
  //       console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
  //       return;
  //     }

  //     if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
  //       console.log('Observed new accounts');

  //       this.accountsObservable.next(accs);
  //       this.accounts = accs;
  //     }

  //     this.ready = true;
  //   });
  // }
}
