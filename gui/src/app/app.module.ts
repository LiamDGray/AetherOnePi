import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {ReactiveFormsModule} from "@angular/forms";
import { SessionComponent } from './components/session/session.component';
import { StatusComponent } from './components/status/status.component';
import { MapComponent } from './components/map/map.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CaseViewComponent } from './components/case/case-view/case-view.component';
import { AreaScanGridResultComponent } from './components/map/area-scan-grid-result/area-scan-grid-result.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnalysisComponent,
    SidebarComponent,
    SessionComponent,
    StatusComponent,
    MapComponent,
    CaseViewComponent,
    AreaScanGridResultComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
