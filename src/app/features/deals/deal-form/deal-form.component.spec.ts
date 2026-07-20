import { WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../../../core/notifications/notification.service';
import { DealStoreService } from '../data-access/deal-store.service';
import { Deal } from '../data-access/deal.model';
import { DealFormComponent } from './deal-form.component';

interface DealFormHarness {
  readonly editingDeal: WritableSignal<Deal | null>;
  readonly form: FormGroup;
  readonly capRate: number | null;
  readonly capRateIsTypical: boolean;
  submit(destination: 'list' | 'another'): void;
}

const existingDeal: Deal = {
  id: 'market-square',
  name: 'Market Square',
  address: '10 Main Street, Austin, TX',
  purchasePrice: 20_000_000,
  noi: 1_400_000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('DealFormComponent', () => {
  let dealId: string | null;
  let fixture: ComponentFixture<DealFormComponent>;
  let focus: jest.Mock;
  let harness: DealFormHarness;
  let navigate: jest.Mock;
  let notifications: { show: jest.Mock };
  let store: {
    findById: jest.Mock;
    add: jest.Mock;
    update: jest.Mock;
  };

  async function createComponent(foundDeal?: Deal): Promise<void> {
    store.findById.mockReturnValue(foundDeal);

    await TestBed.configureTestingModule({
      imports: [DealFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => dealId } } },
        },
        { provide: DealStoreService, useValue: store },
        { provide: NotificationService, useValue: notifications },
        { provide: Router, useValue: { navigate } },
      ],
    })
      .overrideComponent(DealFormComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(DealFormComponent);
    harness = fixture.componentInstance as unknown as DealFormHarness;
  }

  beforeEach(() => {
    dealId = null;
    focus = jest.fn();
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue({ focus } as unknown as HTMLElement);
    navigate = jest.fn(() => Promise.resolve(true));
    notifications = { show: jest.fn() };
    store = {
      findById: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calculates the live cap rate and its typical classification', async () => {
    await createComponent();
    harness.form.patchValue({ purchasePrice: 10_000_000, noi: 750_000 });

    expect(harness.capRate).toBe(7.5);
    expect(harness.capRateIsTypical).toBe(true);

    harness.form.patchValue({ purchasePrice: 0 });
    expect(harness.capRate).toBeNull();
    expect(harness.capRateIsTypical).toBe(false);
  });

  it('marks invalid fields and does not persist an incomplete deal', async () => {
    await createComponent();

    harness.submit('list');

    expect(harness.form.get('name')?.touched).toBe(true);
    expect(store.add).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('adds a valid deal and returns to the list', async () => {
    await createComponent();
    harness.form.setValue({
      name: '  River House  ',
      address: '  5 River Road  ',
      purchasePrice: 12_000_000,
      noi: 720_000,
    });

    harness.submit('list');

    expect(store.add).toHaveBeenCalledWith({
      name: '  River House  ',
      address: '  5 River Road  ',
      purchasePrice: 12_000_000,
      noi: 720_000,
    });
    expect(notifications.show).toHaveBeenCalledWith('  River House   was added to the deal book.');
    expect(navigate).toHaveBeenCalledWith(['/deals']);
  });

  it('resets and focuses the form after saving another deal', async () => {
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    await createComponent();
    harness.form.setValue({
      name: 'River House',
      address: '5 River Road',
      purchasePrice: 12_000_000,
      noi: 720_000,
    });

    harness.submit('another');

    expect(harness.form.getRawValue()).toEqual({
      name: '',
      address: '',
      purchasePrice: null,
      noi: null,
    });
    expect(focus).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('loads and updates an existing deal', async () => {
    dealId = existingDeal.id;
    await createComponent(existingDeal);

    expect(harness.editingDeal()).toEqual(existingDeal);
    expect(harness.form.getRawValue()).toEqual({
      name: existingDeal.name,
      address: existingDeal.address,
      purchasePrice: existingDeal.purchasePrice,
      noi: existingDeal.noi,
    });

    harness.form.patchValue({ name: 'Market Square Updated' });
    harness.submit('list');

    expect(store.update).toHaveBeenCalledWith(existingDeal.id, {
      name: 'Market Square Updated',
      address: existingDeal.address,
      purchasePrice: existingDeal.purchasePrice,
      noi: existingDeal.noi,
    });
    expect(notifications.show).toHaveBeenCalledWith('Market Square Updated was updated.');
    expect(navigate).toHaveBeenCalledWith(['/deals']);
  });

  it('reports and redirects an unknown edit URL', async () => {
    dealId = 'missing';
    await createComponent();

    expect(notifications.show).toHaveBeenCalledWith('That deal could not be found.', 'info');
    expect(navigate).toHaveBeenCalledWith(['/deals']);
  });
});
