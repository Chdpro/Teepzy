import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSnapPage } from './edit-snap.page';

describe('EditSnapPage', () => {
  let component: EditSnapPage;
  let fixture: ComponentFixture<EditSnapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSnapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSnapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
