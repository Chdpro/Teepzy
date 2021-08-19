import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LikersPage } from './likers.page';

describe('LikersPage', () => {
  let component: LikersPage;
  let fixture: ComponentFixture<LikersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LikersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
