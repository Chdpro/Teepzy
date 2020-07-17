import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkSheetPage } from './link-sheet.page';

describe('LinkSheetPage', () => {
  let component: LinkSheetPage;
  let fixture: ComponentFixture<LinkSheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkSheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
