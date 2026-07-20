import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandMarkComponent } from './brand-mark.component';

describe('BrandMarkComponent', () => {
  let fixture: ComponentFixture<BrandMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BrandMarkComponent] }).compileComponents();
    fixture = TestBed.createComponent(BrandMarkComponent);
  });

  it('renders the TermSheet wordmark', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('TermSheet');
  });

  it('reflects inverse and compact inputs as modifier classes', () => {
    fixture.componentRef.setInput('inverse', true);
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();

    const brand = fixture.nativeElement.querySelector('.brand') as HTMLElement;
    expect(brand.classList).toContain('brand--inverse');
    expect(brand.classList).toContain('brand--compact');
  });
});
