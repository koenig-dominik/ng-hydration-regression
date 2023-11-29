import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-lazy-dynamic',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>lazy-dynamic works!</p>`,
    styleUrl: './lazy-dynamic.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyDynamicComponent { }
