import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { appConfig } from './app.config';
import { routes } from './app.routes';

describe('appConfig', () => {
  it('provides the application routes to Angular', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });

    expect(TestBed.inject(Router).config).toEqual(routes);
  });
});
