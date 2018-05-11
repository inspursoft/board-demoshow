import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CsTitleComponent } from './cs-title/cs-title.component';
import { CsClockComponent } from './cs-clock/cs-clock.component';
import { CsNumberComponent } from './cs-number/cs-number.component';
import { HttpClientModule } from '@angular/common/http';
import { DemoShowService, IWorkInfo } from './demoShow.service';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import Spy = jasmine.Spy;

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  declarations: [
    AppComponent,
    CsTitleComponent,
    CsNumberComponent,
    CsClockComponent
  ],
  entryComponents: [CsNumberComponent],
  providers: [DemoShowService]
})
export class FakeModule {
}

describe('AppComponent', () => {
  const workInfoList = Observable.of(Array.from([{
    worker_id: '001',
    worker_version: '2.0',
    workload: 2388
  }]));
  const systemInfo = Observable.of({
    time_stamp: 2000,
    system_version: '1.0',
    sum_workload: 3000
  });

  let appComponentFixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  let demoShowService: DemoShowService;
  let spyWorkInfoList: Spy;
  let spySystemInfo: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FakeModule]
    }).compileComponents().then(() => {
      appComponentFixture = TestBed.createComponent(AppComponent);
      appComponent = appComponentFixture.debugElement.componentInstance;
      demoShowService = appComponentFixture.debugElement.injector.get(DemoShowService);
      spyWorkInfoList = spyOn(demoShowService, 'getWorkInfoList');
      spySystemInfo = spyOn(demoShowService, 'getSystemInfo');
    });
  }));

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('test the demoShowService', (done: DoneFn) => {
    spyWorkInfoList.and.returnValue(workInfoList);
    spySystemInfo.and.returnValue(systemInfo);
    demoShowService.getWorkInfoList().subscribe((value: Array<IWorkInfo>) => {
      expect(value.length).toBe(1);
      expect(value[0].worker_id).toBe('001');
      expect(value[0].worker_version).toBe('2.0');
      done();
    }, (err) => console.log(err));
  });

  it('should calls all reset api and execute initNumbers', fakeAsync(() => {
    spyWorkInfoList.and.returnValue(workInfoList);
    spySystemInfo.and.returnValue(systemInfo);
    appComponent.updateData();
    tick();
    expect(spyWorkInfoList.calls.any()).toBe(true, '/api/v1/workerinfo restApi called');
    expect(spySystemInfo.calls.any()).toBe(true, '/api/v1/systeminfo restApi called');
  }));

  it('should calls all reset api', fakeAsync(() => {
    spyWorkInfoList.and.returnValue(workInfoList);
    spySystemInfo.and.returnValue(systemInfo);
    appComponent.updateData();
    tick();
    appComponent.updateData();
    tick();
    expect(spyWorkInfoList.calls.any()).toBe(true, '/api/v1/workerinfo restApi called');
    expect(spySystemInfo.calls.any()).toBe(true, '/api/v1/systeminfo restApi called');
  }));
});
