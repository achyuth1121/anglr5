import { Directive, ContentChild, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSeMasterContetHeight]'
})
export class SeMasterContetHeightDirective {

   @ContentChild('routeScrollContainer', { static: true }) routeScrollContainer;

  constructor(private el: ElementRef) {

  }

  @HostListener('window:resize') onResize() {
    const self = this;
    self.setElementHeight();
  }

  ngAfterViewInit() {
    const self = this;
    self.setElementHeight();
  }

  setElementHeight() {
    const self = this;
    const currentElement = self.el.nativeElement;
    const headerHeight = currentElement.parentNode.children[0].offsetHeight;
    const updatedHeight = window.innerHeight - headerHeight + 'px';
    currentElement.style.height = updatedHeight;
    self.routeScrollContainer.nativeElement.style.height = updatedHeight;
  }

}
