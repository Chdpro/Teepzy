import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CircleMembersPage } from './circle-members.page';

describe('CircleMembersPage', () => {
  let component: CircleMembersPage;
  let fixture: ComponentFixture<CircleMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CircleMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
