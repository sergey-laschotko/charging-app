import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;
  isMobile: boolean = false;
  isMenuOpened: boolean = true;
  menuMode: string = 'side';
  hasBackdrop: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private mediaMatcher: MediaMatcher
  ) {
    this.isMobile = breakpointObserver.isMatched('(max-width: 550px)');
    const mediaQueryList = mediaMatcher.matchMedia('(max-width: 550px)');
    mediaQueryList.addEventListener("change", (e: any) => {
      if (e.matches) {
        this.isMobile = true;
        this.menuMode = "over";
        this.isMenuOpened = false;
        this.hasBackdrop = true;
      } else {
        this.isMobile = false;
        this.menuMode = "side";
        this.isMenuOpened = true;
        this.hasBackdrop = false;
      }
    });
  }

  ngOnInit() {
    if (this.isMobile) {
      this.isMenuOpened = false;
      this.menuMode = 'over';
      this.hasBackdrop = true;
    }
  }

  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
    this.sidenav.toggle();
  }

  closeByLink() {
    if (this.isMobile) {
      this.sidenav.close();
      this.isMenuOpened = false;
    }
  }
}
