import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupFinalPage } from './signup-final.page';

describe('SignupFinalPage', () => {
  let component: SignupFinalPage;
  let fixture: ComponentFixture<SignupFinalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupFinalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
