import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-eager-dynamic',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>eager-dynamic works!</p>`,
    styleUrl: './eager-dynamic.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EagerDynamicComponent { }
