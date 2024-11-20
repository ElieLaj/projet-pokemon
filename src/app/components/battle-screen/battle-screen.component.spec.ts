import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleScreenComponent } from './battle-screen.component';

describe('BattleScreenComponent', () => {
  let component: BattleScreenComponent;
  let fixture: ComponentFixture<BattleScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
