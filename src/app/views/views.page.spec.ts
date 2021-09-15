import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewsPage } from './views.page';

describe('ViewsPage', () => {
  let component: ViewsPage;
  let fixture: ComponentFixture<ViewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
