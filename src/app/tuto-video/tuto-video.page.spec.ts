import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutoVideoPage } from './tuto-video.page';

describe('TutoVideoPage', () => {
  let component: TutoVideoPage;
  let fixture: ComponentFixture<TutoVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutoVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
