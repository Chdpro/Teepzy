import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SnapPage } from './snap.page';

describe('SnapPage', () => {
  let component: SnapPage;
  let fixture: ComponentFixture<SnapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SnapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
