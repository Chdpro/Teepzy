import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareSheetPage } from './share-sheet.page';

describe('ShareSheetPage', () => {
  let component: ShareSheetPage;
  let fixture: ComponentFixture<ShareSheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
