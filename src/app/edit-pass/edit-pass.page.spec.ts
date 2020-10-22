import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPassPage } from './edit-pass.page';

describe('EditPassPage', () => {
  let component: EditPassPage;
  let fixture: ComponentFixture<EditPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
