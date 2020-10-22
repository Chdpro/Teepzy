import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportBugPage } from './report-bug.page';

describe('ReportBugPage', () => {
  let component: ReportBugPage;
  let fixture: ComponentFixture<ReportBugPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportBugPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportBugPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
