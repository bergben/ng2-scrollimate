import { Directive, ElementRef, Renderer, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ScrollimateService } from './ng2-scrollimate.service';
import { State, Options } from'./ng2-scrollimate.interface';

@Directive({
    selector: '[scrollimate]'
})
export class ScrollimateDirective implements AfterViewInit {

    @Input('scrollimate') options: Options;
    @Output('scrollimate') output = new EventEmitter();
    @Output('scrollimateAll') outputStats = new EventEmitter();
    classNameSetByScrollimate: string = '';

    constructor(private el: ElementRef, private renderer: Renderer, private scrollimateService: ScrollimateService) {
        //add listeneres for scroll and resize
        this.renderer.listenGlobal('window', 'scroll', (evt: Event) => { this._processEvent(); });
        this.renderer.listenGlobal('window', 'resize', (evt: Event) => { this._processEvent(); });
    }
    ngAfterViewInit(): void {
          setTimeout(() => {
            this._processEvent();
          }, 0);
    }


    private _processEvent() {
        if (!this.options || typeof (this.options) === 'string' || typeof (this.options) === 'number') {
            //no options or incorrect options provided -> proceed with default states
            console.warn('Scrollimate:', 'Invalid options provided:', this.options);
        }
        else {
            if (typeof (this.options.states) === 'undefined' || !this.options.states.length) {
                this._applyDefaultStates();
            }
            else {
                let stateApplied: boolean = false;
                for (let i = 0; !stateApplied && i < this.options.states.length; i++) {
                    if (this._processState(this.options.states[i])) {
                        stateApplied = true;
                    };
                }
                if (!stateApplied) {
                    //no state matched -> proceed with default states
                    this._applyDefaultStates();
                }
            }
        }
    }
    private _applyDefaultStates() {
        let stateApplied: boolean = false;
        let defaultStates = this.scrollimateService.getDefaultStates();
        for (let i = 0; !stateApplied && i < defaultStates.length; i++) {
            if (this._processState(defaultStates[i])) {
                stateApplied = true;
            };
        }
        if (!stateApplied) {
            //no state matched at all
            console.warn('Scrollimate:', 'No state matched current scroll position, please provide a default state!');
        }
    }
    private _processState(state: State): boolean {
        //check for valid values
        if (this._isValidState(state)) {
            //state is valid
            state = this._setValuesOrDefault(state);
            switch (state.method.toLowerCase()) {
                case 'pxleft':
                    return this._pxLeft(state);
                case 'percentleft':
                    return this._percentLeft(state);
                case 'pxelement':
                    return this._pxElement(state);
                case 'percentelement':
                    return this._percentElement(state);
                case 'pxtotal':
                    return this._pxTotal(state);
                case 'percenttotal':
                    return this._percentTotal(state);
                case 'default':
                    return this._default(state);
                default:
                    console.warn('Scrollimate:', 'Provided method doesn\'t match any possible methods: ', state.method);
                    return false;
            }
        }
        return false;
    }
    private _setValuesOrDefault(state: State): State {
        state.state = state.state || 'inactive';
        state.sizes = state.sizes || 'all';
        state.setAtLastChance = typeof (state.setAtLastChance) === 'boolean' ? state.setAtLastChance : true;
        state.setAtLastChanceTopPx = state.setAtLastChanceTopPx || 10;
        state.setAtLastChanceBottomPx = state.setAtLastChanceBottomPx || 10;
        return state;
    }
    private _isValidState(state: State): boolean {
        if (typeof (state.method) === 'undefined') {
            console.warn('Scrollimate:', 'No method was provided for a state but is required.');
            return false;
        }
        if (typeof (state.method) !== 'string') {
            console.warn('Scrollimate:', 'Invalid value for method:string provided : ', state.method);
            return false;
        }
        if (state.method !== 'default' && typeof (state.value) === 'undefined') {
            console.warn('Scrollimate:', 'No value was provided for a state but is required if method isn\'t default.');
            return false;
        }
        if (state.method !== 'default' && typeof (state.value) !== 'number') {
            console.warn('Scrollimate:', 'Invalid value for value:number provided : ', state.value);
            return false;
        }
        if (typeof (state.state) !== 'undefined' && typeof (state.state) !== 'string') {
            console.warn('Scrollimate:', 'Invalid value for state:string provided : ', state.state);
            return false;
        }
        if (typeof (state.sizes) !== 'undefined' && typeof (state.sizes) !== 'string') {
            console.warn('Scrollimate:', 'Invalid value for sizes:string provided : ', state.sizes);
            return false;
        }
        if (typeof (state.class) !== 'undefined' && typeof (state.class) !== 'string') {
            console.warn('Scrollimate:', 'Invalid value for class:string provided : ', state.class);
            return false;
        }
        if (typeof (state.setAtLastChance) !== 'undefined' && typeof (state.setAtLastChance) !== 'boolean') {
            console.warn('Scrollimate:', 'Invalid value setAtLastChance:boolean provided : ', state.sizes);
            return false;
        }
        return true;
    }

    private _pxLeft(state: State): boolean {
        //how much left before top of element is out of viewpoint in px
        if (this._isCurrentScreenSize(state.sizes)) {
            let nativeElement = this.el.nativeElement;
            let scrollTop = window.pageYOffset;
            let offsetElement = nativeElement;
            let elementOffsetTop = 0;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            let breakpoint = elementOffsetTop - state.value;
            return this._setElementState(scrollTop, breakpoint, state);
        }
        return false;
    }
    private _percentLeft(state: State): boolean {
        //how much left in percentage of window height before top of element reaches viewpoint
        if (this._isCurrentScreenSize(state.sizes)) {
            let nativeElement = this.el.nativeElement;
            let scrollTop = window.pageYOffset;
            let windowHeight = window.innerHeight;
            let offsetElement = nativeElement;
            let elementOffsetTop = 0;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            let pxLeftUntilTopViewpoint = elementOffsetTop - scrollTop;
            let percentageLeft = pxLeftUntilTopViewpoint / windowHeight * 100;
            return this._setElementState(state.value, percentageLeft, state);
        }
        return false;
    }
    private _pxElement(state: State): boolean {
        //amount of element scrolled from bottom up in px
        if (this._isCurrentScreenSize(state.sizes)) {
            let nativeElement = this.el.nativeElement;
            let scrollTop = window.pageYOffset;
            let windowHeight = window.innerHeight;
            let viewpoint = windowHeight + scrollTop;
            let offsetElement = nativeElement;
            let elementOffsetTop = 0;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            let breakpoint = elementOffsetTop + state.value;
            return this._setElementState(viewpoint, breakpoint, state);
        }
        return false;
    }
    private _percentElement(state: State): boolean {
        //amount of element scrolled from bottom up in percent
        if (this._isCurrentScreenSize(state.sizes)) {
            let nativeElement = this.el.nativeElement;
            let scrollTop = window.pageYOffset;
            let windowHeight = window.innerHeight;
            let offsetElement = nativeElement;
            let elementOffsetTop = 0;
            let viewpoint = windowHeight + scrollTop;
            let elementHeight = nativeElement.offsetHeight;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            let pxOfElementScrolled = viewpoint - elementOffsetTop;
            let percentageOfElementScrolled = pxOfElementScrolled / elementHeight * 100;
            return this._setElementState(percentageOfElementScrolled, state.value, state);
        }
        return false;
    }
    private _pxTotal(state: State): boolean {
        //amount of page scrolled in px
        if (this._isCurrentScreenSize(state.sizes)) {
            let scrollTop = window.pageYOffset;
            return this._setElementState(scrollTop, state.value, state);
        }
        return false;
    }
    private _percentTotal(state: State): boolean {
        //amount of page scrolled in percent
        if (this._isCurrentScreenSize(state.sizes)) {
            let scrollTop = window.pageYOffset;
            let windowHeight = window.innerHeight;
            let bodyHeight = document.documentElement.scrollHeight;
            let percentageScrolled = scrollTop / (bodyHeight - windowHeight) * 100;
            return this._setElementState(percentageScrolled, state.value, state);
        }
        return false;
    }
    private _default(state: State): boolean {
        //default state in case that no other states match
        if (typeof (state.method) !== 'undefined' && state.method === 'default') {
            //default state for specific size provided
            if (this._isCurrentScreenSize(state.sizes)) {
                return this._setElementState(1, 0, state);
            }
        }
        return false;
    }

    private _emitOutput(state: State) {
        this.output.emit({
            state: state,
            options: this.options,
            elementRef: this.el
        });
    }

    private _emitOutputStats(state: State, hasToBeBiggerThan: number, hasToBeSmallerThan: number) {
        let currentValue: number = null;
        if (state.method !== 'default') {
            currentValue = hasToBeBiggerThan;
            if (state.method === 'percentLeft') {
                currentValue = hasToBeSmallerThan;
            }
            if (state.method === 'pxLeft') {
                currentValue = hasToBeSmallerThan + state.value - hasToBeBiggerThan;
            }
            if (state.method === 'pxElement') {
                currentValue = hasToBeBiggerThan - hasToBeSmallerThan + state.value;
            }
        }
        this.outputStats.emit({
            scrollTop: window.pageYOffset,
            state: state,
            currentValue: currentValue,
            options: this.options,
            elementRef: this.el
        });
    }
    private _setClass(stateClass: string) {
        if (typeof (stateClass) !== 'undefined' && this.classNameSetByScrollimate !== stateClass) {
            //class is provided and has to be applied to the element
            if (this.classNameSetByScrollimate !== '') {
                this.el.nativeElement.className = this.el.nativeElement.className.replace(this.classNameSetByScrollimate, stateClass);
            }
            else {
                this.renderer.setElementClass(this.el.nativeElement, stateClass, true);
            }
            this.classNameSetByScrollimate = stateClass;
        }
        else {
            //no class set for current state, remove class if one is set
            if (this.classNameSetByScrollimate !== '') {
                this.el.nativeElement.className = this.el.nativeElement.className.replace(this.classNameSetByScrollimate, '');
            }
            this.classNameSetByScrollimate = '';
        }
    }
    private _setElementState(hasToBeBiggerThan: number, hasToBeSmallerThan: number, state: State): boolean {
        let scrollTop = window.pageYOffset;
        let offsetElement = this.el.nativeElement;
        let elementOffsetTop = 0;
        let windowHeight = window.innerHeight;
        let bodyHeight = document.documentElement.scrollHeight;
        while (offsetElement) {
            elementOffsetTop += offsetElement.offsetTop;
            offsetElement = offsetElement.offsetParent;
        }
        this._emitOutputStats(state, hasToBeBiggerThan, hasToBeSmallerThan);
        if (state.setAtLastChance && scrollTop + windowHeight >= bodyHeight - state.setAtLastChanceBottomPx) {
            //element is default distance before bottom view end -> show element
            if (this.options.currentState !== state.state) {
                this.options.currentState = state.state;
                this._setClass(state.class);
                this._emitOutput(state);
            }
            return true;
        }
        else if (state.setAtLastChance && (scrollTop + state.setAtLastChanceTopPx) > elementOffsetTop) {
            //element is default distance before top view end -> show element
            if (this.options.currentState !== state.state) {
                this.options.currentState = state.state;
                this._setClass(state.class);
                this._emitOutput(state);
            }
            return true;
        }
        else if (hasToBeBiggerThan > hasToBeSmallerThan) {
            if (this.options.currentState !== state.state) {
                this.options.currentState = state.state;
                this._setClass(state.class);
                this._emitOutput(state);
            }
            return true;
        }
        else {
            return false;
        }
    }
    private _isCurrentScreenSize(screenSizes: string): boolean {
        //screenSizes is something like sm-up / lg-down
        if (screenSizes === 'all') {
            return true;
        }
        let currentScreenSize = this._getScreenSize();
        let size = screenSizes.split('-')[0];
        let direction = screenSizes.split('-')[1];
        let possibleScreenSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
        let positionInPossibleScreenSizesArray = -1;
        for (let i = 0; i < possibleScreenSizes.length; i++) {
            if (possibleScreenSizes[i] === size) {
                positionInPossibleScreenSizesArray = i;
                i = possibleScreenSizes.length;
            }
        }
        if (positionInPossibleScreenSizesArray === -1) {
            //invalid screen size provided -> use all screen sizes
            console.warn('Scrollimate:', 'Invalid screen sizes provided:', screenSizes);
            return true;
        }
        if (direction === 'up') {
            possibleScreenSizes = possibleScreenSizes.slice(positionInPossibleScreenSizesArray);
        }
        else if (direction === 'down') {
            possibleScreenSizes = possibleScreenSizes.slice(0, positionInPossibleScreenSizesArray + 1);
        }
        else {
            //invalid direction provided -> use all screen sizes
            console.warn('Scrollimate:', 'Invalid screen sizes provided:', screenSizes);
            return true;
        }
        if (possibleScreenSizes.indexOf(currentScreenSize) !== -1) {
            return true;
        }
        return false;
    }
    private _getScreenSize(): string {
        let screenSize = 'xs';
        let windowWidth = window.innerWidth;
        switch (true) {
            case (windowWidth >= 1200):
                screenSize = 'xl';
                break;
            case (windowWidth >= 992):
                screenSize = 'lg';
                break;
            case (windowWidth >= 768):
                screenSize = 'md';
                break;
            case (windowWidth >= 544):
                screenSize = 'sm';
                break;
        };
        return screenSize;
    }
}
