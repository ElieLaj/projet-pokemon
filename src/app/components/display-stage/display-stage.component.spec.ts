import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStageComponent } from './display-stage.component';

describe('DisplayStageComponent', () => {
  let component: DisplayStageComponent;
  let fixture: ComponentFixture<DisplayStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
