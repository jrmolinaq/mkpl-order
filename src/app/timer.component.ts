import { Component, Input, OnInit } from '@angular/core';
import { subHours, subMinutes, format } from 'date-fns';
import {} from './app.worker';

declare const Liferay: any;

@Component({
  selector: 'timer',
  templateUrl:
    Liferay.ThemeDisplay.getPathContext() + 
    '/o/mkpl-order/app/timer.component.html'
})
export class TimerComponent implements OnInit {
  @Input() date: string;
  @Input() disabled: boolean;
  @Input() stopTimer: boolean;
  data: { difference: string, state: string };

  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./app.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.data = JSON.parse(data);
        if (this.stopTimer) {
          worker.terminate();
        }
      };
      worker.postMessage(format(new Date(this.date), 'yyyy-MM-dd HH:mm:ss'));
    }
  }
}
