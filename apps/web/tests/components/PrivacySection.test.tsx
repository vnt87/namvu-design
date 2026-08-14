// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PrivacySection } from '../../src/components/PrivacySection';
import { I18nProvider } from '../../src/i18n';

describe('PrivacySection', () => {
  afterEach(cleanup);

  it('describes statistics as local-only and exposes no telemetry controls', () => {
    render(
      <I18nProvider initial="en">
        <PrivacySection />
      </I18nProvider>,
    );

    expect(screen.getByText('Local only')).toBeTruthy();
    expect(screen.getByText((_, element) => (
      element?.tagName === 'P' && element.textContent?.includes('never leave this device') === true
    ))).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByText(/anonymous metrics/i)).toBeNull();
  });
});
