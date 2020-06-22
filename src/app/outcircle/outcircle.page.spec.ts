import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutcirclePage } from './outcircle.page';

describe('OutcirclePage', () => {
  let component: OutcirclePage;
  let fixture: ComponentFixture<OutcirclePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcirclePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutcirclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
