import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkPage } from './link.page';

describe('LinkPage', () => {
  let component: LinkPage;
  let fixture: ComponentFixture<LinkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
