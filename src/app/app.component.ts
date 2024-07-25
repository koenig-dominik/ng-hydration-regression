import { ApplicationRef, Component, OnInit, ViewChild, ViewContainerRef, createComponent, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EagerDynamicComponent } from './eager-dynamic/eager-dynamic.component';
import { firstValueFrom, from, map, shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h2>NgComponentOutlet</h2>
    <ng-template [ngComponentOutlet]="eagerComponent"></ng-template>
    <ng-template [ngComponentOutlet]="lazyComponent | async"></ng-template>

    <h2>ViewContainerRef.createComponent</h2>
    <ng-template #eagerComponentHost></ng-template>
    <ng-template #lazyComponentHost></ng-template>

    <h2>CreateComponent.attachView</h2>
    <div #eagerComponentHost2></div>
    <div #lazyComponentHost2></div>

    <h2>CreateComponent.insert</h2>
    <ng-template #eagerComponentHost3></ng-template>
    <ng-template #lazyComponentHost3></ng-template>

    <p>Check the number of hyrdated components in your console</p>
  `,
  styles: [],
})
export class AppComponent implements OnInit {

  protected eagerComponent = EagerDynamicComponent;
  // Does not hydrate with esbuild
  protected lazyComponent = from(import('./lazy-dynamic/lazy-dynamic.component'))
    .pipe(
      map((c) => c.LazyDynamicComponent),
      tap(() => console.log('ComponentOutlet - lazy component loaded')),
      shareReplay(1),
    );

  private applicationRef = inject(ApplicationRef);
  private lazyComponentsTimeout = setTimeout(() => {}, 999999); // workaround for lazy components to be included in SSR output with esbuild

  constructor() {
    this.applicationRef
      .isStable.pipe(tap((isStable) => console.log('- isStable: ' + isStable)))
      .subscribe();
  }

  ngOnInit(): void {
    Promise.all([
      firstValueFrom(this.lazyComponent),
      this.viewContainerRefCreateComponent(),
      this.createComponentAttachView(),
      this.createComponentInsert(),
    ]).then(() => {
      clearTimeout(this.lazyComponentsTimeout);
    });
  }

  @ViewChild('eagerComponentHost', { static: true, read: ViewContainerRef }) private eagerComponentHost!: ViewContainerRef;
  @ViewChild('lazyComponentHost', { static: true, read: ViewContainerRef }) private lazyComponentHost!: ViewContainerRef;

  private async viewContainerRefCreateComponent(): Promise<void> {
    this.eagerComponentHost.createComponent(EagerDynamicComponent);

    // Does not hydrate with esbuild
    return import('./lazy-dynamic/lazy-dynamic.component').then((c) => {
      console.log('ViewContainerRef.CreateComponent - lazy component loaded');
      this.lazyComponentHost.createComponent(c.LazyDynamicComponent);
    });
  }

  @ViewChild('eagerComponentHost2', { static: true, read: ViewContainerRef }) private eagerComponentHost2!: ViewContainerRef;
  @ViewChild('lazyComponentHost2', { static: true, read: ViewContainerRef }) private lazyComponentHost2!: ViewContainerRef;

  private async createComponentAttachView(): Promise<void> {
    const eagerComponent = createComponent(EagerDynamicComponent, {
      hostElement: this.eagerComponentHost2.element.nativeElement,
      environmentInjector: this.applicationRef.injector,
    });
    this.applicationRef.attachView(eagerComponent.hostView);

    // Does not hydrate with esbuild
    return import('./lazy-dynamic/lazy-dynamic.component').then((c) => {
      console.log('CreateComponent - lazy component (attach view) loaded');
      const lazyComponent = createComponent(c.LazyDynamicComponent, {
        hostElement: this.lazyComponentHost2.element.nativeElement,
        environmentInjector: this.applicationRef.injector,
      });
      this.applicationRef.attachView(lazyComponent.hostView);
    });
  }

  @ViewChild('eagerComponentHost3', { static: true, read: ViewContainerRef }) private eagerComponentHost3!: ViewContainerRef;
  @ViewChild('lazyComponentHost3', { static: true, read: ViewContainerRef }) private lazyComponentHost3!: ViewContainerRef;

  private async createComponentInsert(): Promise<void> {
    // Does not hydrate with webpack & esbuild
    const eagerComponent = createComponent(EagerDynamicComponent, {
      environmentInjector: this.applicationRef.injector,
    });
    this.eagerComponentHost3.insert(eagerComponent.hostView);

    // Does not hydrate with webpack & esbuild
    return import('./lazy-dynamic/lazy-dynamic.component').then((c) => {
      console.log('CreateComponent - lazy component (insert) loaded');
      const lazyComponent = createComponent(c.LazyDynamicComponent, {
        environmentInjector: this.applicationRef.injector,
      });
      this.lazyComponentHost3.insert(lazyComponent.hostView); 
    });
  }

}
