import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunctuationsComponent } from './punctuations.component';

describe('PunctuationsComponent', () => {
  let component: PunctuationsComponent;
  let fixture: ComponentFixture<PunctuationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunctuationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PunctuationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
