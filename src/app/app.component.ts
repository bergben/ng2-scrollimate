import { Component, trigger, animate, state, style, transition } from '@angular/core';
import { ScrollimateService } from "ng2-scrollimate"; //import the service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
          state("blue", style({
              backgroundColor:"blue",
              color: "#fff"
          })),
          state("green", style({
              backgroundColor:"green",
              color: "#fff"
          })),
          state("text-bold", style({
              fontWeight:"bold",
              fontSize:"1.1em"
          })),
          transition("* => active", animate("200ms ease-in")),
          transition("* => green", animate("200ms ease-in")),
          transition("* => blue", animate("200ms ease-in")),
          transition("* => text-bold", animate("200ms ease-in")),
          transition("* => inactive", animate("200ms ease-out")),
      ])
  ]
})
export class AppComponent {
  scrollimateOptions: any = {
    defaultStates: [
              {
                  method: "default",
                  state: "inactive",
              }
      ],
      pxLeft: {
          currentState: "active",
          states: [
              {
                  method: "pxLeft",
                  value: 200,
                  state: "inactive",
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
      percentLeft: {
          currentState: "active",
          states: [
              {
                  method: "percentLeft",
                  value: 20,
                  state: "blue",
                  class: "white-font",
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
      pxTotal: {
          currentState: "active",
          states: [
              {
                  method: "pxTotal",
                  value: 500,
                  state: "green",
                  class: "white-font",
                  setAtLastChance: false
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
      percentTotal: {
          currentState: "active",
          states: [
              {
                  method: "percentTotal",
                  value: 37.55,
                  state: "text-bold",
                  setAtLastChance: false
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
      pxElement: {
          currentState: "inactive",
          states: [
              {
                  method: "pxElement",
                  value: 400,
                  class: "added-class",
                  state: "active",
              },
              {
                  method: "default",
                  state: "inactive"
              }
          ]
      },
      percentElement: {
          currentState: "active",
          states: [
              {
                  method: "percentElement",
                  value: 200,
                  state: "active",
              },
              {
                  method: "percentElement",
                  value: 40,
                  state: "something",
                  class: "rotating"
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
      percentLeftLg: {
          currentState: "active",
          states: [
              {
                  method: "percentLeft",
                  value: 40,
                  sizes: "lg-up",
                  state: "green",
                  class: "white-font",
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
      percentLeftMd: {
          currentState: "active",
          states: [
              {
                  method: "percentLeft",
                  value: 40,
                  sizes: "md-down",
                  state: "green",
                  class: "white-font",
              },
              {
                  method: "default",
                  state: "active"
              }
          ]
      },
  }
  constructor(private scrollimateService: ScrollimateService){
          scrollimateService.setDefaultStates(this.scrollimateOptions.defaultStates); //set the default states
  }
  percentLeft(event:any){
      this.scrollimateOptions.percentLeft.currentValue=event.currentValue || this.scrollimateOptions.percentLeft.currentValue;
  }
  percentTotal(event:any){
      this.scrollimateOptions.percentTotal.currentValue=event.currentValue || this.scrollimateOptions.percentTotal.currentValue;
  }
  pxTotal(event:any){
      this.scrollimateOptions.pxTotal.currentValue=event.currentValue || this.scrollimateOptions.pxTotal.currentValue;
  }
  pxLeft(event:any){
      this.scrollimateOptions.pxLeft.currentValue=event.currentValue || this.scrollimateOptions.pxLeft.currentValue;
  }
  pxElement(event:any){
      this.scrollimateOptions.pxElement.currentValue=event.currentValue || this.scrollimateOptions.pxElement.currentValue;
  }
  percentElement(event:any){
      this.scrollimateOptions.percentElement.currentValue=event.currentValue || this.scrollimateOptions.percentElement.currentValue;
  }
  percentLeftLg(event:any){
      this.scrollimateOptions.percentLeftLg.currentValue=event.currentValue || this.scrollimateOptions.percentLeftLg.currentValue;
  }
  percentLeftMd(event:any){
      this.scrollimateOptions.percentLeftMd.currentValue=event.currentValue || this.scrollimateOptions.percentLeftMd.currentValue;
  }
}
