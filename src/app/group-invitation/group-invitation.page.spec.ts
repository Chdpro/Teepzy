import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupInvitationPage } from './group-invitation.page';

describe('GroupInvitationPage', () => {
  let component: GroupInvitationPage;
  let fixture: ComponentFixture<GroupInvitationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInvitationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupInvitationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
