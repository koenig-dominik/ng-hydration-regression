import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-dynamic',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>dynamic works!</p>`,
    styleUrls: ['./dynamic.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicComponent { }
