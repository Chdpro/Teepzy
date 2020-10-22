import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConditionsPage } from './conditions.page';

describe('ConditionsPage', () => {
  let component: ConditionsPage;
  let fixture: ComponentFixture<ConditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
