import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation, QueryList, ElementRef, ChangeDetectionStrategy, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { DiacriticsService } from './cvui-select-diacritics.service';
//import { CVUISelectOptionComponent } from './cvui-select-option.component';

@Component({
    selector: 'cvui-select-dropdown',
    templateUrl: './cvui-select-dropdown.component.html',
    styleUrls: ['./cvui-select.component.scss'],
    providers: [DiacriticsService],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CVUISelectDropdownComponent implements AfterViewInit, OnChanges, OnInit {

    // Messages.
    private MSG_LOADING = 'Searching...';
    //private MSG_NOT_FOUND = $t.getString('Common.No_Result_Found') || 'No results found';

    // Class names.
    private S2: string = 'cvui-select';
    private S2_RESULTS: string = this.S2 + '-results';
    private S2_MSG: string = this.S2_RESULTS + '__message';
    private S2_OPTIONS: string = this.S2_RESULTS + '__options';
    private S2_OPTION: string = this.S2_RESULTS + '__option';
    private S2_OPTION_HL: string = this.S2_OPTION + '--highlighted';

    @Input() multiple: boolean;
    @Input() optionValues: Array<string>;
    @Input() optionsDict: { [key: string]: { label: string, html?: string } };
    @Input() selection: Array<any>;
    @Input() type: 'simple' | 'filter' | 'multiple';
    @Input() width: number;
    @Input() top: number;
    @Input() left: number;

    @Output() close = new EventEmitter<boolean>();
    @Output() toggleSelect = new EventEmitter<string>(true);

    @ViewChild('input') input: any;
    @ViewChild('optionsList') optionsList: any;

    public optionValuesFiltered: Array<string> = [];
    private _highlighted: any = null;
    private searchTerm = "";

    constructor(
        private diacriticsService: DiacriticsService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    /***************************************************************************
     * Event handlers.
     **************************************************************************/

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: any) {
        this.init();
    }

    ngAfterViewInit() {
        if (!this.multiple && this.input) {
            this.input.nativeElement.focus();
        }
    }

    onInputClick(event: any) {
        event.stopPropagation();
    }

    onOptionsMouseMove(event: any) {
        let v = event.target.dataset.value;
        if (typeof v !== 'undefined') {
            this.highlight(v);
        }
    }

    onOptionsWheel(event: any) {
        this.handleOptionsWheel(event);
    }

    onOptionsClick(optionValue: any) {
        this.toggleSelect.emit(optionValue);
    }

    onKeydown(event: any) {
        this.handleKeyDown(event);
    }

    onInput(event: any) {
        this.filter(event.target.value);
    }

    /***************************************************************************
     * Initialization.
     **************************************************************************/

    private init() {
        // Set filtered list of options to all options.
        this.optionValuesFiltered = this.optionValues;

        // Highlight first option in list (or first option in selection).
        this.initHighlight();
    }

    /***************************************************************************
     * Highlight.
     **************************************************************************/

    get highlighted(): any {
        return this._highlighted;
    }

    private initHighlight() {
        this._highlighted = this.selection.length > 0 ?
            this.selection[0] : this.optionsDict[this.optionValues[0]];
    }

    private highlight(optionValue: string) {
        if (this.highlighted === null ||
            optionValue !== this.highlighted.value) {
            this._highlighted = this.optionsDict[optionValue];
        }
    }

    private ensureHighlightedVisible() {

        let list = this.optionsList.nativeElement;
        let listHeight = list.offsetHeight;

        let itemIndex = this.highlightIndex();
        let item = list.children[itemIndex];
        let itemHeight = item.offsetHeight;

        let itemTop = itemIndex * itemHeight;
        let itemBottom = itemTop + itemHeight;

        let viewTop = list.scrollTop;
        let viewBottom = viewTop + listHeight;

        if (itemBottom > viewBottom) {
            list.scrollTop = itemBottom - listHeight;
        }
        else if (itemTop < viewTop) {
            list.scrollTop = itemTop;
        }
    }

    private highlightIndex(): number {
        if (this.highlighted === null) {
            return null;
        }
        return this.filteredOptionsIndex(this.highlighted.value);
    }

    /***************************************************************************
     * Filter.
     **************************************************************************/

    filter(term: string, forceDetection = false) {
        this.searchTerm = term.trim();

        // Nothing to filter, set all options.
        if (term.trim() === '') {
            this.optionValuesFiltered = this.optionValues;
        }

        // Clone list of option values.
        let filtered = this.optionValues.slice(0);

        // Backwards iterate over list of options (to remove options).
        for (let i = this.optionValues.length - 1; i >= 0; i--) {

            let label = this.optionsDict[this.optionValues[i]].label;

            let a = this.diacriticsService.stripDiacritics(label).toUpperCase();
            let b = this.diacriticsService.stripDiacritics(term).toUpperCase();

            if (a.indexOf(b) === -1) {
                filtered.splice(i, 1);
            }
        }

        // Set filtered option values.
        this.optionValuesFiltered = filtered;

        // Highlight first item in list.
        if (this.optionValuesFiltered.length > 0) {
            this._highlighted = this.optionsDict[this.optionValuesFiltered[0]];
        }
        else {
            this._highlighted = null;
        }

        forceDetection && this.changeDetectorRef.detectChanges();
    }

    /***************************************************************************
     * Keys/scroll.
     **************************************************************************/

    private KEYS: any = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };

    private handleKeyDown(event: any) {

        let key = event.which;

        if (key === this.KEYS.ESC || key === this.KEYS.TAB ||
            (key === this.KEYS.UP && event.altKey)) {

            this.close.emit(true);
            event.preventDefault();
        }
        else if (key === this.KEYS.ENTER) {
            if (this.highlighted !== null) {
                this.toggleSelect.emit(this.highlighted.value);

                this.close.emit(true);
            }
            event.preventDefault();
        }
        else if (key === this.KEYS.UP) {
            this.highlightPrevious();
            event.preventDefault();
        }
        else if (key === this.KEYS.DOWN) {
            this.highlightNext();
            event.preventDefault();
        }
    }

    private handleOptionsWheel(event: any) {
        let element = this.optionsList.nativeElement;

        let top = element.scrollTop;
        let bottom = (element.scrollHeight - top) - element.offsetHeight;

        let isAtTop = event.deltaY < 0 && top + event.deltaY <= 0;
        let isAtBottom = event.deltaY > 0 && bottom - event.deltaY <= 0;

        if (isAtTop) {
            element.scrollTop = 0;

            event.preventDefault();
            event.stopPropagation();
        }
        else if (isAtBottom) {
            element.scrollTop = element.scrollHeight - element.offsetHeight;

            event.preventDefault();
            event.stopPropagation();
        }
    }

    highlightPrevious() {
        let i = this.highlightIndex();

        if (i !== null && i > 0) {
            this.highlight(this.optionValuesFiltered[i - 1]);
            this.ensureHighlightedVisible();
        }
    }

    highlightNext() {
        let i = this.highlightIndex();

        if (i !== null && i < this.optionValuesFiltered.length - 1) {
            this.highlight(this.optionValuesFiltered[i + 1]);
            this.ensureHighlightedVisible();
        }
    }

    /***************************************************************************
     * Classes.
     **************************************************************************/

    private getOptionClass(optionValue: string): any {
        let result = {};
        let hlValue = this.highlighted === null || (!this.highlighted) ? '' : this.highlighted.value;

        result[this.S2_OPTION] = true;
        result[this.S2_OPTION_HL] = optionValue === hlValue;
        result[this.S2_MSG] = optionValue === null;

        return result;
    }

    getSearchPlaceholder(): string {
        if (this.multiple) return "";
        return (this.selection && this.selection[0] && this.selection[0].label == this.selection[0].html && this.selection[0].label) || '';
    }

    /***************************************************************************
     * Util functions.
     **************************************************************************/

    private filteredOptionsIndex(optionValue: string) {
        for (let i = 0; i < this.optionValuesFiltered.length; i++) {
            if (this.optionValuesFiltered[i] === optionValue) {
                return i;
            }
        }
        return null;
    }
}
