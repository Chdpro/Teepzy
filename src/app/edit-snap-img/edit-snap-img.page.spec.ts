import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSnapImgPage } from './edit-snap-img.page';

describe('EditSnapImgPage', () => {
  let component: EditSnapImgPage;
  let fixture: ComponentFixture<EditSnapImgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSnapImgPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSnapImgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
