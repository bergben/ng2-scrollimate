import { NgModule } from '@angular/core';
import { ScrollimateService } from './ng2-scrollimate.service';
import { ScrollimateDirective } from './ng2-scrollimate.directive';

@NgModule({
    declarations: [ScrollimateDirective],
    exports: [ScrollimateDirective],
    providers: [
        {provide: ScrollimateService, useClass: ScrollimateService}
    ]
})
export class Ng2ScrollimateModule {
}
