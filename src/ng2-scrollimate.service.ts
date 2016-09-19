import { Injectable } from '@angular/core';
import { State } from'./ng2-scrollimate.interface';

@Injectable()
export class ScrollimateService {
    private _defaultStates: State[];
    constructor() {
        this._defaultStates=[];
    }
    getDefaultStates(): State[] {
        return this._defaultStates;
    }
    setDefaultStates(defaultStates: State[]) {
        this._defaultStates = defaultStates || this._defaultStates;
    }
}
