import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RobotAlertPage } from './robot-alert.page';

describe('RobotAlertPage', () => {
  let component: RobotAlertPage;
  let fixture: ComponentFixture<RobotAlertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobotAlertPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RobotAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
