import { Component, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private mediaMatcher: MediaMatcher) {
    const mediaQueryList = mediaMatcher.matchMedia('(min-width: 555px)');
    mediaQueryList.addEventListener("change", (e: any) => {
      if (e.matches) {
        this.sidenav.open();
        this.sidenav.mode = "side";
      } else {
        this.sidenav.close();
        this.sidenav.mode = "over";
      }
    });
  }
}
