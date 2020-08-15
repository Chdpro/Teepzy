import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailFeedPage } from './detail-feed.page';

describe('DetailFeedPage', () => {
  let component: DetailFeedPage;
  let fixture: ComponentFixture<DetailFeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFeedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
