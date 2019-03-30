import {Web3Service} from './web3.service';

declare let require: any;
const env = require('../../config/env');
const factoryArtifacts = require('../../build/contracts/Factory.json');

export class FactoryService {
  public ready: Promise<any>;
  Factory: any;

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
    return this.ready
      .then(async () => {
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

        const rawdata = this.web3Service.generateRaw(funcAbi,env.stationOwner.pk);
    
        return this.web3Service.web3.eth.sendSignedTransaction(rawdata)
        .on('receipt', function(receipt: any){
            console.log(['Receipt:', receipt]);
        })
        .on('error', console.error);
    });
  }
}
