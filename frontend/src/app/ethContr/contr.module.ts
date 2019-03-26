import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterService } from './register.service';
import { ChargerService } from './charger.service';
import { ERC20TokenService } from './erc20Token.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    RegisterService,
    ChargerService,
    ERC20TokenService
  ],
  declarations: []
})
export class ContrModule {
}
