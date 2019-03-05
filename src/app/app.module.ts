import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAppModule } from './material.module';
import { UserComponent } from './user/user.component';
import { StationOwnerComponent } from './station-owner/station-owner.component';
import { ServiceOwnerComponent } from './service-owner/service-owner.component';
import { SettingsComponent } from './settings/settings.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialAppModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
