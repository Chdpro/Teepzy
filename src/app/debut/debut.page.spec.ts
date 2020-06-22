import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DebutPage } from './debut.page';

describe('DebutPage', () => {
  let component: DebutPage;
  let fixture: ComponentFixture<DebutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DebutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
