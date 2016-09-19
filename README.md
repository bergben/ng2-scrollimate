# ng2-scrollimate
Pure angular2 directive to trigger animations on scrolling

## Demo
TODO

## Getting started

### Install
```bash
$ npm install ng2-scrollimate --save
```

### Angular 2 version
This library is built to work with **Angular 2 rc.4 and newer releases**.

## Basic example

### Import the module
```TypeScript
// app.module.ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Ng2ScrollimateModule} from 'ng2-scrollimate'; // <-- import the module
import {MyComponent} from './my.component';

@NgModule({
    imports: [BrowserModule, Ng2ScrollimateModule], // <-- include it in your app module
    declarations: [MyComponent],
    bootstrap: [MyComponent]
})
export class MyAppModule {}
```

### Define the animations and scrollimate options
```TypeScript
// my.component.ts
@Component({
    selector: "sg-my-component",
    template,
    animations: [
        trigger("elementState", [
            state("inactive", style({
                opacity: 0,
                visibility: "hidden",
            })),
            state("active", style({
                opacity: 1,
                visibility: "visible",
            })),
            transition("* => active", animate("200ms ease-in")),
            transition("* => inactive", animate("200ms ease-out")),
        ])
    ]
})
export class MyComponent {
  scrollimateOptions: any = {
      myScrollimation: {
          currentState: "inactive", //currentState is required
          states: [
              {
                  method: "percentTotal", //this will be true when a total of 85% of the page has been scrolled
                  value: 85,
                  state: "active",
              },
              {
                  method: "default",
                  state: "inactive"
              }
          ]
      },
  }
```

### Template
```html
// my.component.html
<div [@elementState]="scrollimateOptions.myScrollimation.currentState" [scrollimate]="scrollimateOptions.myScrollimation">
  This will appear when a total of 85% of the page has been scrolled.
</div>
```

## Options
States will be matched in priority order from top to bottom, falling back to the global default states if necessary. Therefore 
setting default states is highly recommended.

### Setting default states

```TypeScript
// my.component.ts
import { ScrollimateService } from "ng2-scrollimate"; //import the service
...
export class MyComponent {
  scrollimateOptions: any = {
          defaultStates: [
              { //PRIORITY 3
                  method: "pxElement", //this will be true if more than 200px of the element are currently visible (scrolled)
                  value: 200,
                  state: "active",
              },
              { //PRIORITY 4
                  method: "default", //this will always be true
                  state: "inactive",
              }
          ],
          myScrollimation: {
              currentState: "inactive", //currentState is required
              states: [
                  { //PRIORITY 1
                      method: "percentTotal", //this will be true when a total of 85% of the page has been scrolled
                      value: 85,
                      state: "active",
                  },
                  { //PRIORITY 2
                      method: "default",
                      state: "inactive"
                  }
              ]
          },
  }
  constructor(private scrollimateService: ScrollimateService){
          scrollimateService.setDefaultStates(this.scrollimateOptions.defaultStates); //set the default states
  }
}
```
### Available methods to trigger a state
#### pxLeft
pxLeft describes how many pixels are left before the top of the element reaches the top viewport. 
```TypeScript
    method: "pxLeft", //this will be true when there is 200px or less left from the top viewport to the elements top
    value: 200,
```
#### percentLeft
percentLeft describes how much of the viewport is left in percentage before the top of the element reaches that point. 
```TypeScript
    method: "percentLeft", //this will be true when the element is 50% or less from the top of the viewport
    value: 50,
```
#### pxElement
pxElement describes how much of the element has been scrolled from the bottom of the viewport up already. 
```TypeScript
    method: "pxElement", //this will be true when 200px or more of the element are currently in the viewport
    value: 200,
```
#### percentElement
#### pxTotal
#### percentTotal
#### default

### Set state at last chance

### Adding css classes

## Output

### scrollimate

### scrollimateAll
