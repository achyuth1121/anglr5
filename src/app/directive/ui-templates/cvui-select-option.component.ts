import { Component, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'cvui-select-option',
    template: `<ng-content></ng-content>`
})
export class CVUISelectOptionComponent {
    
    @Input() value: any;

    constructor(
        public elementRef: ElementRef
    ) { }

}