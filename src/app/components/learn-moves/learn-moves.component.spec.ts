import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnMovesComponent } from './learn-moves.component';

describe('LearnMovesComponent', () => {
  let component: LearnMovesComponent;
  let fixture: ComponentFixture<LearnMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnMovesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
