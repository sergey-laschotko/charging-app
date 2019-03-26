import { Component, OnInit, Output, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.css']
})
export class DatetimepickerComponent implements OnInit {
  @Output() transferDate = new EventEmitter();
  @Input() dateOnly: boolean;
  @Input() timeOnly: boolean;
  @Input() default: boolean;  
  showDate: boolean = true;
  showTime: boolean = true;
  hour: string = "";
  minutes: string = "";
  day: string = "";
  month: string = "";
  year: string = "";
  hourVariants: string[] = [];
  minuteVariants: string[] = [];
  dayVariants: string[] = [];
  monthVariants: string[] = [];
  yearVariants: string[] = [];
  currentEdit: string = "";
  resultTimeDate: Date = new Date();

  constructor(private _el: ElementRef) {
    let { hours, minutes, date, month, year } = this.getCurrentDate();
    this.hour = hours;
    this.minutes = minutes;
    this.day = date;
    this.month = month;
    this.year = year;
    this.hourVariants = this.fillVariants(0, 23);
    this.minuteVariants = this.fillVariants(0, 59);
    this.dayVariants = this.setDayVariants();
    this.monthVariants = this.fillVariants(1, 12);
    this.yearVariants = this.fillVariants(new Date().getFullYear(), new Date().getFullYear() + 1);
  }

  ngOnInit() {
    this.checkOptions();
  }

  @HostListener("document:click", ['$event'])
  OutsideClick($event: any) {
    let clickedInside = this._el.nativeElement.contains($event.target);
    if (!clickedInside && this.currentEdit) {
      this.currentEdit = "";
    }
  }

  checkOptions() {
    if (this.dateOnly) {
      this.showTime = false;
    } else if (this.timeOnly) {
      this.showDate = false;
    }
    if (this.default) {
      this.hour = "00";
      this.minutes = "00";
    }
  }

  setCurrentEdit(field: string) {
    this.currentEdit = field;
  }

  setValue(type: string, value: string) {
    if (this[type]) {
      this[type] = value;
    }
    if (type === 'month') {
      this.dayVariants = this.setDayVariants();
      let lastDayVariant = this.dayVariants[this.dayVariants.length - 1];
      if (Number(this.day) > Number(lastDayVariant)) {
        this.day = lastDayVariant;
      }
    }
    this.currentEdit = "";
    this.resultTimeDate = new Date(
      Number(this.year),
      Number(this.month) - 1,
      Number(this.day),
      Number(this.hour),
      Number(this.minutes)
    );
    this.transferDate.emit(this.resultTimeDate);
  }

  getCurrentDate() {
    let currentDate = new Date();
    let hours = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours() + "";
    let minutes = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes() + "";
    let date = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate() + "";
    let month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1) + "";
    let year = currentDate.getFullYear() + "";
    return {
      hours,
      minutes,
      date,
      month,
      year
    };
  }

  fillVariants(min: number, max: number) {
    let variant: string = "";
    let variants: string[] = [];

    while(min <= max) {
      if (min < 10) {
        variant = "0" + min;
      } else {
        variant = "" + min;
      }
      variants.push(variant);
      min++
    }

    return variants;
  }

  setDayVariants() {
    switch(Number(this.month)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return this.fillVariants(1, 31);
      case 4:
      case 6:
      case 9:
      case 11:
        return this.fillVariants(1, 30);
      case 2:
        if (new Date(Number(this.year), 1, 29).getDate() === 29) {
          return this.fillVariants(1, 29);
        } else {
          return this.fillVariants(1, 28);
        }
    }
  }

  resetTime() {
    this.hour = "00";
    this.minutes = "00";
  }
}
