import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BottomSheetOverviewExampleSheetPage } from './bottom-sheet-overview-example-sheet.page';

describe('BottomSheetOverviewExampleSheetPage', () => {
  let component: BottomSheetOverviewExampleSheetPage;
  let fixture: ComponentFixture<BottomSheetOverviewExampleSheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomSheetOverviewExampleSheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BottomSheetOverviewExampleSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
