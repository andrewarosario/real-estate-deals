import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfirmDialogComponent] }).compileComponents();
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentRef.setInput('title', 'Delete this deal?');
    fixture.componentRef.setInput('message', 'This cannot be undone.');
    fixture.componentRef.setInput('confirmLabel', 'Delete deal');
    fixture.detectChanges();
  });

  it('renders alert-dialog semantics and supplied copy', () => {
    const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.textContent).toContain('Delete this deal?');
    expect(dialog.textContent).toContain('This cannot be undone.');
    expect(dialog.textContent).toContain('Delete deal');
  });

  it('emits confirmation from the primary action', () => {
    const confirmed = jest.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);

    (fixture.nativeElement.querySelector('[data-testid="confirm-action"]') as HTMLButtonElement).click();

    expect(confirmed).toHaveBeenCalledTimes(1);
  });

  it('emits cancellation from cancel, backdrop click, and Escape', () => {
    const cancelled = jest.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);
    const backdrop = fixture.nativeElement.querySelector('.dialog-backdrop') as HTMLElement;

    (fixture.nativeElement.querySelector('.button--quiet') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.dialog-backdrop__dismiss') as HTMLButtonElement).click();
    backdrop.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(cancelled).toHaveBeenCalledTimes(3);
  });

  it('does not cancel when the dialog surface is clicked', () => {
    const cancelled = jest.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);

    (fixture.nativeElement.querySelector('.dialog') as HTMLElement).click();

    expect(cancelled).not.toHaveBeenCalled();
  });

  it('applies the selected action tone', () => {
    fixture.componentRef.setInput('tone', 'primary');
    fixture.detectChanges();

    const action = fixture.nativeElement.querySelector('[data-testid="confirm-action"]') as HTMLElement;
    expect(action.classList).toContain('button--primary');
    expect(action.classList).not.toContain('button--danger');
  });
});
