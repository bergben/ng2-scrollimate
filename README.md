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
}
```

### Template
```html
<!-- my.component.html -->
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
pxElement describes how much of the element has been scrolled in pixels from the bottom of the viewport up already. 
```TypeScript
    method: "pxElement", //this will be true when 200px or more of the element are currently in the viewport
    value: 200,
```
#### percentElement
percentElement describes how much of the element has been scrolled in percentage from the bottom of the viewport up already. 
```TypeScript
    method: "percentElement", //this will be true when 50% or more of the element are currently in the viewport
    value: 50,
```
#### pxTotal
pxTotal describes how much of the page in px has totally been scrolled. 
```TypeScript
    method: "pxTotal", //this will be true when 500px or more have been scrolled in total
    value: 500,
```
#### percentTotal
percentTotal describes how much of the page in percentage has totally been scrolled. 
```TypeScript
    method: "percentTotal", //this will be true when 50% or more of the page has been scrolled in total
    value: 50,
```
#### default
default states don't have a value because they are always true and used as a fallback if no other state matches the current scrolling position. 
```TypeScript
    method: "default", //always true
```

### Set state at last chance
For methods like pxLeft or percentLeft it might unintentionally happen that an element will never reach the breakpoint for example if the element is positionend at the very bottom of the page. That's what "setAtLastChance" is for. 
**This option is true by default.** You can deactivate it using:
```TypeScript
    setAtLastChance: false
```
The distances from bottom and top viewport in pixels for setAtLastChance can be configured using
```TypeScript
    setAtLastChanceTopPx: 60,
    setAtLastChanceBottomPx: 30
```
The default values are 10px.
For the example below, the state with PRIORITY 1 would be triggered if the element is only 60px left from the top viewport.
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
                  setAtLastChanceTopPx: 60, //set distance from top viewport
                  setAtLastChanceBottomPx: 30 //set distance from bottom viewport
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
                      state: "inactive",
                      setAtLastChance: false //deactivate setAtLastChance
                  }
              ]
          },
  }
  constructor(private scrollimateService: ScrollimateService){
          scrollimateService.setDefaultStates(this.scrollimateOptions.defaultStates); //set the default states
  }
}
```

### Adding css classes
You can also add a certain css class to the element when the state is active.
```TypeScript
// my.component.ts
states: [
      { //PRIORITY 1
          method: "percentTotal", //this will be true when a total of 85% of the page has been scrolled
          value: 85,
          state: "active",
          class: "my-class" //will add the class "my-class" to the element when this state is active
      },
      { //PRIORITY 2
          method: "default",
          state: "inactive",
          setAtLastChance: false //deactivate setAtLastChance
      }
  ]
```
### Specific viewport sizes
States can be limited to certain viewport sizes which follow the schema from bootstrap 4 (see [here](http://v4-alpha.getbootstrap.com/layout/responsive-utilities/)). By default, this is "all".
```TypeScript
// my.component.ts
states: [
    {
        method: "percentTotal",
        value: 85,
        sizes: "lg-up", //only for screens lg and up
        state: "some-state",
    },
    {
        method: "pxElement",
        value: 200,
        sizes: "md-down",  //only for screens md and down
        state: "active",
        class: "green",
    },
    {
        method: "default",
        class: "green",
        state: "inactive"
    }
]
```
## Output events

### scrollimate
This output event fires **only when a state changes**.
```html
<!-- my.component.html -->
<div [@elementState]="scrollimateOptions.myScrollimation.currentState" 
    [scrollimate]="scrollimateOptions.myScrollimation"
    (scrollimate)="myCallback($event)" >
  This will appear when a total of 85% of the page has been scrolled.
</div>
```
```TypeScript
// my.component.ts
myCallback(event:any){
    //event includes state, options and elementRef
}
```
### scrollimateAll
This output event fires **on every scroll event**. 
```html
<!-- my.component.html -->
<div [@elementState]="scrollimateOptions.myScrollimation.currentState" 
    [scrollimate]="scrollimateOptions.myScrollimation"
    (scrollimateAll)="myCallback($event)" >
  This will appear when a total of 85% of the page has been scrolled.
</div>
```
```TypeScript
// my.component.ts
myCallback(event:any){
    //event includes state, options and elementRef
    //event includes scrollTop and currentValue
}
```


## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run prepublish
```

To lint all `*.ts` files:

```bash
$ npm run lint
```
