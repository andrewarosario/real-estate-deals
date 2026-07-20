import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutofocusDirective } from './autofocus.directive';

@Component({
  standalone: true,
  imports: [AutofocusDirective],
  template: '<button type="button" appAutofocus>Focusable</button>',
})
class AutofocusHostComponent {}

describe('AutofocusDirective', () => {
  let animationCallback: FrameRequestCallback | undefined;
  let fixture: ComponentFixture<AutofocusHostComponent>;

  beforeEach(() => {
    jest
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        animationCallback = callback;
        return 1;
      });
    TestBed.configureTestingModule({ imports: [AutofocusHostComponent] });
    fixture = TestBed.createComponent(AutofocusHostComponent);
  });

  it('focuses its host on the next animation frame', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const focus = jest.spyOn(button, 'focus');

    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(1);
    animationCallback?.(0);

    expect(focus).toHaveBeenCalledTimes(1);
  });
});
