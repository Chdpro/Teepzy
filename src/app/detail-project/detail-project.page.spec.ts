import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailProjectPage } from './detail-project.page';

describe('DetailProjectPage', () => {
  let component: DetailProjectPage;
  let fixture: ComponentFixture<DetailProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
