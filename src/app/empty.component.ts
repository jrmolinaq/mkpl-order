import { Component, Input } from '@angular/core';

declare const Liferay: any;

@Component({
  selector: 'empty',
  templateUrl:
    Liferay.ThemeDisplay.getPathContext() + 
    '/o/mkpl-order/app/empty.component.html'
})
export class EmptyComponent {
  @Input() data: any;
}
