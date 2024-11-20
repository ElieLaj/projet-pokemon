import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterComponent } from './monster.component';

describe('MonsterComponent', () => {
  let component: MonsterComponent;
  let fixture: ComponentFixture<MonsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
