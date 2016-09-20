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
var ng2_scrollimate_directive_1 = require('./ng2-scrollimate.directive');
var Ng2ScrollimateModule = (function () {
    function Ng2ScrollimateModule() {
    }
    Ng2ScrollimateModule = __decorate([
        core_1.NgModule({
            declarations: [ng2_scrollimate_directive_1.ScrollimateDirective],
            exports: [ng2_scrollimate_directive_1.ScrollimateDirective],
            providers: [
                { provide: ng2_scrollimate_service_1.ScrollimateService, useClass: ng2_scrollimate_service_1.ScrollimateService }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2ScrollimateModule);
    return Ng2ScrollimateModule;
}());
exports.Ng2ScrollimateModule = Ng2ScrollimateModule;
//# sourceMappingURL=ng2-scrollimate.module.js.map