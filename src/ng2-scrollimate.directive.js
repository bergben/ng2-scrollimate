"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ng2_scrollimate_service_1 = require('./ng2-scrollimate.service');
var ScrollimateDirective = (function () {
    function ScrollimateDirective(el, renderer, scrollimateService) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.scrollimateService = scrollimateService;
        this.output = new core_1.EventEmitter();
        this.outputStats = new core_1.EventEmitter();
        this.classNameSetByScrollimate = '';
        //add listeneres for scroll and resize
        this.renderer.listenGlobal('window', 'scroll', function (evt) { _this._processEvent(); });
        this.renderer.listenGlobal('window', 'resize', function (evt) { _this._processEvent(); });
    }
    ScrollimateDirective.prototype.ngOnInit = function () {
        this._processEvent();
    };
    ScrollimateDirective.prototype._processEvent = function () {
        if (!this.options || typeof (this.options) === 'string' || typeof (this.options) === 'number') {
            //no options or incorrect options provided -> proceed with default states
            console.warn('Scrollimate:', 'Invalid options provided:', this.options);
        }
        else {
            if (typeof (this.options.states) === 'undefined' || !this.options.states.length) {
                this._applyDefaultStates();
            }
            else {
                var stateApplied = false;
                for (var i = 0; !stateApplied && i < this.options.states.length; i++) {
                    if (this._processState(this.options.states[i])) {
                        stateApplied = true;
                    }
                    ;
                }
                if (!stateApplied) {
                    //no state matched -> proceed with default states
                    this._applyDefaultStates();
                }
            }
        }
    };
    ScrollimateDirective.prototype._applyDefaultStates = function () {
        var stateApplied = false;
        var defaultStates = this.scrollimateService.getDefaultStates();
        for (var i = 0; !stateApplied && i < defaultStates.length; i++) {
            if (this._processState(defaultStates[i])) {
                stateApplied = true;
            }
            ;
        }
        if (!stateApplied) {
            //no state matched at all
            console.warn('Scrollimate:', 'No state matched current scroll position, please provide a default state!');
        }
    };
    ScrollimateDirective.prototype._processState = function (state) {
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
    };
    ScrollimateDirective.prototype._setValuesOrDefault = function (state) {
        state.state = state.state || 'inactive';
        state.sizes = state.sizes || 'all';
        state.setAtLastChance = typeof (state.setAtLastChance) === 'boolean' ? state.setAtLastChance : true;
        state.setAtLastChanceTopPx = state.setAtLastChanceTopPx || 10;
        state.setAtLastChanceBottomPx = state.setAtLastChanceBottomPx || 10;
        return state;
    };
    ScrollimateDirective.prototype._isValidState = function (state) {
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
    };
    ScrollimateDirective.prototype._pxLeft = function (state) {
        //how much left before top of element is out of viewpoint in px
        if (this._isCurrentScreenSize(state.sizes)) {
            var nativeElement = this.el.nativeElement;
            var scrollTop = window.pageYOffset;
            var offsetElement = nativeElement;
            var elementOffsetTop = 0;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            var breakpoint = elementOffsetTop - state.value;
            return this._setElementState(scrollTop, breakpoint, state);
        }
        return false;
    };
    ScrollimateDirective.prototype._percentLeft = function (state) {
        //how much left in percentage of window height before top of element reaches viewpoint
        if (this._isCurrentScreenSize(state.sizes)) {
            var nativeElement = this.el.nativeElement;
            var scrollTop = window.pageYOffset;
            var windowHeight = window.innerHeight;
            var offsetElement = nativeElement;
            var elementOffsetTop = 0;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            var pxLeftUntilTopViewpoint = elementOffsetTop - scrollTop;
            var percentageLeft = pxLeftUntilTopViewpoint / windowHeight * 100;
            return this._setElementState(state.value, percentageLeft, state);
        }
        return false;
    };
    ScrollimateDirective.prototype._pxElement = function (state) {
        //amount of element scrolled from bottom up in px
        if (this._isCurrentScreenSize(state.sizes)) {
            var nativeElement = this.el.nativeElement;
            var scrollTop = window.pageYOffset;
            var windowHeight = window.innerHeight;
            var viewpoint = windowHeight + scrollTop;
            var offsetElement = nativeElement;
            var elementOffsetTop = 0;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            var breakpoint = elementOffsetTop + state.value;
            return this._setElementState(viewpoint, breakpoint, state);
        }
        return false;
    };
    ScrollimateDirective.prototype._percentElement = function (state) {
        //amount of element scrolled from bottom up in percent
        if (this._isCurrentScreenSize(state.sizes)) {
            var nativeElement = this.el.nativeElement;
            var scrollTop = window.pageYOffset;
            var windowHeight = window.innerHeight;
            var offsetElement = nativeElement;
            var elementOffsetTop = 0;
            var viewpoint = windowHeight + scrollTop;
            var elementHeight = nativeElement.offsetHeight;
            while (offsetElement) {
                elementOffsetTop += offsetElement.offsetTop;
                offsetElement = offsetElement.offsetParent;
            }
            var pxOfElementScrolled = viewpoint - elementOffsetTop;
            var percentageOfElementScrolled = pxOfElementScrolled / elementHeight * 100;
            return this._setElementState(percentageOfElementScrolled, state.value, state);
        }
        return false;
    };
    ScrollimateDirective.prototype._pxTotal = function (state) {
        //amount of page scrolled in px
        if (this._isCurrentScreenSize(state.sizes)) {
            var scrollTop = window.pageYOffset;
            return this._setElementState(scrollTop, state.value, state);
        }
        return false;
    };
    ScrollimateDirective.prototype._percentTotal = function (state) {
        //amount of page scrolled in percent
        if (this._isCurrentScreenSize(state.sizes)) {
            var scrollTop = window.pageYOffset;
            var windowHeight = window.innerHeight;
            var bodyHeight = document.documentElement.scrollHeight;
            var percentageScrolled = scrollTop / (bodyHeight - windowHeight) * 100;
            return this._setElementState(percentageScrolled, state.value, state);
        }
        return false;
    };
    ScrollimateDirective.prototype._default = function (state) {
        //default state in case that no other states match
        if (typeof (state.method) !== 'undefined' && state.method === 'default') {
            //default state for specific size provided
            if (this._isCurrentScreenSize(state.sizes)) {
                return this._setElementState(1, 0, state);
            }
        }
        return false;
    };
    ScrollimateDirective.prototype._emitOutput = function (state) {
        this.output.emit({
            state: state,
            options: this.options,
            elementRef: this.el
        });
    };
    ScrollimateDirective.prototype._emitOutputStats = function (state, hasToBeBiggerThan, hasToBeSmallerThan) {
        var currentValue = null;
        if (state.method !== 'default') {
            currentValue = state.method === 'pxLeft' || state.method === 'percentLeft' ? hasToBeSmallerThan : hasToBeBiggerThan;
        }
        this.outputStats.emit({
            scrollTop: window.pageYOffset,
            state: state,
            currentValue: currentValue,
            options: this.options,
            elementRef: this.el
        });
    };
    ScrollimateDirective.prototype._setClass = function (stateClass) {
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
    };
    ScrollimateDirective.prototype._setElementState = function (hasToBeBiggerThan, hasToBeSmallerThan, state) {
        var scrollTop = window.pageYOffset;
        var offsetElement = this.el.nativeElement;
        var elementOffsetTop = 0;
        var windowHeight = window.innerHeight;
        var bodyHeight = document.documentElement.scrollHeight;
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
    };
    ScrollimateDirective.prototype._isCurrentScreenSize = function (screenSizes) {
        //screenSizes is something like sm-up / lg-down
        if (screenSizes === 'all') {
            return true;
        }
        var currentScreenSize = this._getScreenSize();
        var size = screenSizes.split('-')[0];
        var direction = screenSizes.split('-')[1];
        var possibleScreenSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
        var positionInPossibleScreenSizesArray = -1;
        for (var i = 0; i < possibleScreenSizes.length; i++) {
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
    };
    ScrollimateDirective.prototype._getScreenSize = function () {
        var screenSize = 'xs';
        var windowWidth = window.innerWidth;
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
        }
        ;
        return screenSize;
    };
    __decorate([
        core_1.Input('scrollimate'), 
        __metadata('design:type', Object)
    ], ScrollimateDirective.prototype, "options", void 0);
    __decorate([
        core_1.Output('scrollimate'), 
        __metadata('design:type', Object)
    ], ScrollimateDirective.prototype, "output", void 0);
    __decorate([
        core_1.Output('scrollimateAll'), 
        __metadata('design:type', Object)
    ], ScrollimateDirective.prototype, "outputStats", void 0);
    ScrollimateDirective = __decorate([
        core_1.Directive({
            selector: '[scrollimate]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, ng2_scrollimate_service_1.ScrollimateService])
    ], ScrollimateDirective);
    return ScrollimateDirective;
}());
exports.ScrollimateDirective = ScrollimateDirective;
//# sourceMappingURL=ng2-scrollimate.directive.js.map