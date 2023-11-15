import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnchorButtonComponent } from './anchor-button.component';

describe('AnchorButtonComponent', () => {
  let component: AnchorButtonComponent;
  let fixture: ComponentFixture<AnchorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnchorButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnchorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
