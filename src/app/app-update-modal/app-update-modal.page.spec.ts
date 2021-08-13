import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppUpdateModalPage } from './app-update-modal.page';

describe('AppUpdateModalPage', () => {
  let component: AppUpdateModalPage;
  let fixture: ComponentFixture<AppUpdateModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUpdateModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppUpdateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
