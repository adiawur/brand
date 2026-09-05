import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackIncident } from './track-incident';

describe('TrackIncident', () => {
  let component: TrackIncident;
  let fixture: ComponentFixture<TrackIncident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackIncident],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackIncident);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
