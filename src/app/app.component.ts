import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDirective } from './dynamic.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DynamicDirective],
  template: `<ng-template appDynamic></ng-template>`,
  styles: [],
})
export class AppComponent {}
