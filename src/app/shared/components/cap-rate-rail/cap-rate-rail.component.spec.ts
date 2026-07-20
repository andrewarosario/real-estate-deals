import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapRateRailComponent } from './cap-rate-rail.component';

describe('CapRateRailComponent', () => {
  let fixture: ComponentFixture<CapRateRailComponent>;
  let component: CapRateRailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CapRateRailComponent] }).compileComponents();
    fixture = TestBed.createComponent(CapRateRailComponent);
    component = fixture.componentInstance;
  });

  it('classifies and positions rates on the 0% to 16% rail', () => {
    component.rate = 8;
    expect(component.typical).toBe(true);
    expect(component.position).toBe('50%');
    expect(component.typicalStart).toBe('31.25%');
    expect(component.typicalWidth).toBe('43.75%');

    component.rate = -2;
    expect(component.typical).toBe(false);
    expect(component.position).toBe('0%');

    component.rate = 20;
    expect(component.position).toBe('100%');
  });

  it('renders an accessible status and hides the scale in compact mode', () => {
    fixture.componentRef.setInput('rate', 7.5);
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();

    const rate = fixture.nativeElement.querySelector('.rate') as HTMLElement;
    expect(rate.getAttribute('aria-label')).toContain('7.50%');
    expect(rate.getAttribute('aria-label')).toContain('Within the typical');
    expect(rate.classList).toContain('rate--compact');
    expect(fixture.nativeElement.querySelector('.rate__scale')).toBeNull();
  });

  it('marks rates outside the reference band as atypical', () => {
    fixture.componentRef.setInput('rate', 4.5);
    fixture.detectChanges();

    const rate = fixture.nativeElement.querySelector('.rate') as HTMLElement;
    expect(rate.classList).toContain('rate--atypical');
    expect(rate.textContent).toContain('Atypical');
  });
});
