import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPeopleRoomPage } from './add-people-room.page';

describe('AddPeopleRoomPage', () => {
  let component: AddPeopleRoomPage;
  let fixture: ComponentFixture<AddPeopleRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPeopleRoomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPeopleRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
