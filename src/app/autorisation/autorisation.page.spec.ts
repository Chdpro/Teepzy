import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutorisationPage } from './autorisation.page';

describe('AutorisationPage', () => {
  let component: AutorisationPage;
  let fixture: ComponentFixture<AutorisationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorisationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutorisationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
