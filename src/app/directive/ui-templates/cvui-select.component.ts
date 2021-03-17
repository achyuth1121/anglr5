import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ExistingProvider, ViewChild, forwardRef, ViewEncapsulation, ContentChildren, QueryList, SecurityContext } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CVUISelectDropdownComponent } from './cvui-select-dropdown.component';
import { CVUISelectOptionComponent } from './cvui-select-option.component';
import { DomSanitizer } from '@angular/platform-browser';

export const SELECT_VALUE_ACCESSOR: ExistingProvider = { provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CVUISelectComponent),
    multi: true
};

@Component({
    selector: 'cvui-select',
    templateUrl: './cvui-select.component.html',
    styleUrls: ['./cvui-select.component.scss'],
    providers: [SELECT_VALUE_ACCESSOR]
})
export class CVUISelectComponent implements ControlValueAccessor, OnInit, OnChanges {

    // Class names.
    private S2: string = 'cvui-select';
    private S2_CONTAINER: string = this.S2 + '-container';
    private S2_SELECTION: string = this.S2 + '-selection';

    @Input() options: { value: any, label: string, selected?: boolean }[];
    @Input() theme: string;
    @Input() placeholder: string;
    @Input() allowClear: boolean;
    @Input('disabled') isReadOnly: boolean;
    @Input() selectedValues: any[];
    @Input() type: 'simple' | 'filter' | 'multiple' = 'simple';
    @Input() width: number;
    @Input() hidden: boolean;

    @Output() opened: EventEmitter<null> = new EventEmitter<null>();
    @Output() closed: EventEmitter<null> = new EventEmitter<null>();
    @Output() selected: EventEmitter<any> = new EventEmitter<any>();
    @Output() deselected: EventEmitter<any> = new EventEmitter<any>();
    @Output() updated: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedValuesChange = new EventEmitter<any[]>(true);

    @ViewChild('container') container: any;
    @ViewChild('selectionSpan') selectionSpan: any;
    @ViewChild('dropdown') dropdown: CVUISelectDropdownComponent;
    @ViewChild('searchInput') searchInput: any;

    // Alternative way to set options through HTML
    @ContentChildren(CVUISelectOptionComponent, { descendants: true }) contentOptions: QueryList<CVUISelectOptionComponent>;

    // State variables.
    private isDisabled: boolean = false;
    private isBelow: boolean = true;
    public isOpen: boolean = false;
    private hasFocus: boolean = false;
    public multiple: boolean = false;

    //public width: number;
    private top: number;
    private left: number;

    // Select options.
    public optionValues: Array<string> = [];
    public optionsDict: { [key: string]: { value: any, label: string, selected?: boolean } } = {};

    public selection: Array<any> = [];
    value: Array<string> = [];

    onChange = (_: any) => {};
    onTouched = () => {};

    constructor(
        private sanitizer: DomSanitizer
    ) { }

    /***************************************************************************
     * Event handlers.
     **************************************************************************/

    ngOnInit() {
        this.init();
        this.updateSelection();
    }

    ngAfterContentInit() {
        this.init();
        this.updateSelection();
    }

    ngOnChanges(changes: any) {
        this.init();
        this.updateSelection();
    }

    onSelectionClick(event: any) {
        this.toggleDropdown();

        if (this.multiple) {
            this.searchInput.nativeElement.focus();
        }
        event.stopPropagation();
    }

    onClearAllClick(event: any) {
        this.clearSelected();
        event.stopPropagation();
    }

    onClearItemClick(event: any) {
        this.deselect(event.target.dataset.value);
        event.stopPropagation();
    }

    onToggleSelect(optionValue: any) {
        this.toggleSelect(optionValue);
    }

    onClose(focus: any) {
        this.close(focus);
    }

    onWindowClick() {
        this.close(false);
    }

    onWindowResize() {
        //this.updateWidth();
    }

    onKeydown(event: any) {
        this.handleKeyDown(event);
    }

    onInput(event: any) {
        // Open dropdown, if it is currently closed.
        if (!this.isOpen) {
            this.open();
            // HACK
            setTimeout(() => {
                this.handleInput(event);
            }, 100);
        }
        else {
            this.handleInput(event);
        }
    }

    onSearchKeydown(event: any) {
        this.handleSearchKeyDown(event);
        this.updated.emit(null);
    }

    /***************************************************************************
     * Initialization.
     **************************************************************************/

    init() {
        this.initOptions();
        this.initDefaults();
    }

    initOptions() {
        let values: any[] = [];
        let opts = {};

        // Prefer to use options property over HTML options
        if (this.options) {
            for (let option of this.options) {
                opts[option.value] = {
                    value: option.value,
                    label: option.label,
                    selected: (typeof option.selected === 'undefined' ? false : option.selected)
                };
                values.push(option.value);
            }
        } else {
            // Get the options from HTML
            this.contentOptions && this.contentOptions.forEach(x => {
                values.push(x.value);
                opts[x.value] = {
                    value: x.value,
                    label: (<HTMLElement> x.elementRef.nativeElement).innerText,
                    //html: this.sanitizer.sanitize(SecurityContext.HTML, (<HTMLElement> x.elementRef.nativeElement).innerHTML),
                    html: (<HTMLElement> x.elementRef.nativeElement).innerHTML,
                    selected: this.selectedValues.findIndex(y => y == x.value) >= 0
                };
            });
        }

        this.optionValues = values;
        this.optionsDict = opts;
    }

    initDefaults() {
        this.multiple = this.type == 'multiple';

        if (typeof this.theme === 'undefined') {
            this.theme = 'default';
        }
        if (typeof this.allowClear === 'undefined') {
            this.allowClear = false;
        }
    }

    /***************************************************************************
     * Dropdown toggle.
     **************************************************************************/

    toggleDropdown() {
        if (!this.isDisabled) {
            this.isOpen ? this.close(false) : this.open();
            //this.close ? this.isOpen : this.close(true);
        }
    }

    open() {
        if (this.isReadOnly)
            return;


        if (!this.isOpen) {
            //this.updateWidth();
            this.updatePosition();
            this.isOpen = true;
            this.opened.emit(null);
        } 
    }

    close(focus: boolean) {
        if (this.isOpen) {
            this.isOpen = false;
            if (focus) {
                this.focus();
            }
            this.closed.emit(null);
        }
    }

    /***************************************************************************
     * Select.
     **************************************************************************/

    toggleSelect(value: string) {

        if (!this.multiple && this.selection.length > 0) {
            if (this.selection[0].selected) {
                this.selection[0].selected = false;
            }
        }

        this.optionsDict[value] ? (this.optionsDict[value].selected ?
            this.deselect(value) : this.select(value)) : () => { };

        if (this.multiple) {
            this.searchInput.nativeElement.value = '';
            this.searchInput.nativeElement.focus();
        }
        else {
            this.focus();
        }
    }

    select(value: string) {
        this.optionsDict[value].selected = true;
        this.updateSelection();
        this.selected.emit(this.optionsDict[value]);
        this.selectedValuesChange.emit(this.selection ? this.selection.map(x => x.value) : []);
    }

    deselect(value: string) {
        if (this.isReadOnly)
            return;

        this.optionsDict[value].selected = false;
        this.updateSelection();
        this.deselected.emit(this.optionsDict[value]);
        this.selectedValuesChange.emit(this.selection ? this.selection.map(x => x.value) : []);
    }

    updateSelection() {
        let s: Array<any> = [];
        let v: Array<string> = [];
        for (let optionValue of this.optionValues) {
            if (this.optionsDict[optionValue].selected) {
                let opt = this.optionsDict[optionValue];
                s.push(opt);
                v.push(opt.value);
            }
        }

        this.selection = s;
        this.value = v;

        // TODO first check if value has changed?
        this.onChange(this.getOutputValue());
    }

    popSelect() {
        if (this.selection.length > 0) {
            this.selection[this.selection.length - 1].selected = false;
            this.updateSelection();
            this.onChange(this.getOutputValue());
            this.selectedValuesChange.emit(this.selection ? this.selection.map(x => x.value) : []);
        }
    }

    clearSelected() {
        for (let item in this.optionsDict) {
            this.optionsDict[item].selected = false;
        }
        this.selection = [];
        this.value = [];

        // TODO first check if value has changed?
        this.onChange(this.getOutputValue());
        this.selectedValuesChange.emit(this.selection ? this.selection.map(x => x.value) : []);
    }

    getOutputValue(): any {
        if (this.multiple) {
            return this.value.slice(0);
        }
        else {
            return this.value.length === 0 ? '' : this.value[0];
        }
    }

    /***************************************************************************
     * ControlValueAccessor interface methods.
     **************************************************************************/

    writeValue(value: any) {

        if (typeof value === 'undefined' || value === null) {
            value = [];
        }

        this.value = value;

        for (let item in this.optionsDict) {
            if (value.indexOf(item) > -1) {
                this.optionsDict[item].selected = true;
            }
            else {
                this.optionsDict[item].selected = false;
            }
        }
        this.updateSelection();
    }

    registerOnChange(fn: (_: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    /***************************************************************************
     * Keys.
     **************************************************************************/

    private KEYS: any = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        UP: 38,
        DOWN: 40
    };

    handleKeyDown(event: any) {

        let key = event.which;

        if (key === this.KEYS.ENTER || key === this.KEYS.SPACE ||
            (key === this.KEYS.DOWN && event.altKey)) {

            this.open();
            event.preventDefault();
        }
    }

    handleInput(event: any) {
        try { this.dropdown.filter(event.target.value, true); } catch (err) { console.log("Haven't loaded child yet"); }
    }

    handleSearchKeyDown(event: any) {

        let key = event.which;

        if (key === this.KEYS.ENTER) {
            if (typeof this.dropdown !== 'undefined') {
                let hl = this.dropdown.highlighted;

                if (hl !== null) {
                    this.onToggleSelect(hl.value);
                }
            }
        }
        else if (key === this.KEYS.BACKSPACE) {
            if (this.searchInput.nativeElement.value === '') {
                this.popSelect();
            }
        }
        else if (key === this.KEYS.UP) {
            if (typeof this.dropdown === 'undefined') {
                this.open();
            }
            else {
                this.dropdown.highlightPrevious();
            }
        }
        else if (key === this.KEYS.DOWN) {
            if (typeof this.dropdown === 'undefined') {
                this.open();
            }
            else {
                this.dropdown.highlightNext();
            }
        }
        else if (key === this.KEYS.ESC) {
            this.close(true);
        }
    }

    /***************************************************************************
     * Layout/Style/Classes/Focus.
     **************************************************************************/

    focus() {
        this.hasFocus = true;
        if (this.multiple) {
            this.searchInput.nativeElement.focus();
        }
        else {
            this.selectionSpan.nativeElement.focus();
        }
    }

    blur() {
        this.hasFocus = false;
        this.selectionSpan.nativeElement.blur();
    }

    // updateWidth() {      
    //   this.width = (this.container.nativeElement.offsetWidth -8);
    // }

    updatePosition() {
        let e = this.container.nativeElement;
        this.left = e.offsetLeft;
        this.top = e.offsetTop + e.offsetHeight;
    }

    getContainerClass(): any {
        let result = {};

        result[this.S2] = true;

        let c = this.S2_CONTAINER;
        result[c] = true;
        result[c + '--open'] = this.isOpen;
        result[c + '--focus'] = this.hasFocus;
        result[c + '--' + this.theme] = true;
        result[c + '--' + (this.isBelow ? 'below' : 'above')] = true;

        return result;
    }

    getSelectionClass(): any {
        let result = {};

        let s = this.S2_SELECTION;
        result[s] = true;
        result[s + '--' + (this.multiple ? 'multiple' : 'single')] = true;

        return result;
    }

    showPlaceholder(): boolean {
        if (!this.optionsDict) return true;

        for (let option of Object.keys(this.optionsDict).map(itm => this.optionsDict[itm])) {
        //for (let option of Object.values(this.optionsDict)) {
            if (typeof option.selected !== 'undefined') {
                if (option.selected) {
                    return false;
                }
            }
        }

        return typeof this.placeholder !== 'undefined' &&
            this.selection.length === 0;
    }

    getPlaceholder(): string {
        return this.showPlaceholder() ? this.placeholder : '';
    }

    getInputStyle(): any {

        let width: number;

        if (typeof this.searchInput === 'undefined') {
            width = 50;
        }
        else if (this.showPlaceholder() &&
            this.searchInput.nativeElement.value.length === 0 ) {

            width = 10 + 10 * this.placeholder.length;
        }
        else {
            width = 10 + 10 * this.searchInput.nativeElement.value.length;
        }

        return {
            'width': width + 'px'
        };
    }
}