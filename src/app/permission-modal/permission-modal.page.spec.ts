import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PermissionModalPage } from './permission-modal.page';

describe('PermissionModalPage', () => {
  let component: PermissionModalPage;
  let fixture: ComponentFixture<PermissionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
