import { Directive, ViewContainerRef, inject } from '@angular/core';
//import { DynamicComponent } from './dynamic/dynamic.component';

@Directive({
  selector: '[appDynamic]',
  standalone: true,
})
export class DynamicDirective {
  
  private viewContainerRef = inject(ViewContainerRef);

  public ngOnInit(): void {
    this.render();
  }

  private async render() {
    this.viewContainerRef.clear();
    const component = await import('./dynamic/dynamic.component').then(({ DynamicComponent }) => DynamicComponent);
    //const component = DynamicComponent;
    this.viewContainerRef.createComponent(component);
  }

}
