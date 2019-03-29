import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAppModule } from './material.module';
import { UserComponent } from './user/user.component';
import { StationOwnerComponent } from './station-owner/station-owner.component';
import { ServiceOwnerComponent } from './service-owner/service-owner.component';
import { SettingsComponent } from './settings/settings.component';
import { BalanceComponent } from './balance/balance.component';
import { DatetimepickerComponent } from './datetimepicker/datetimepicker.component';
import { ModalComponent } from './modal/modal.component';
import { TableComponent } from './table/table.component';
import { OwnerBalanceComponent } from './owner-balance/owner-balance.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';

const routes: Routes = [
  { path: "", redirectTo: "/settings", pathMatch: "full" },
  { path: "user", component: UserComponent },
  { path: "station-owner", component: StationOwnerComponent },
  { path: "service-owner", component: ServiceOwnerComponent },
  { path: "settings", component: SettingsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    StationOwnerComponent,
    ServiceOwnerComponent,
    SettingsComponent,
    BalanceComponent,
    DatetimepickerComponent,
    ModalComponent,
    TableComponent,
    OwnerBalanceComponent,
    PageLoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialAppModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
