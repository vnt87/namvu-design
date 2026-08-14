import { useT } from '../i18n';

export function PrivacySection(): JSX.Element {
  const t = useT();
  return (
    <section className="settings-section">
      <div className="settings-subsection">
        <div className="section-head">
          <div>
            <strong>{t('settings.statisticsLocalBadge')}</strong>
            <h4>{t('settings.privacy')}</h4>
            <p className="hint">{t('settings.statisticsDescription')}</p>
          </div>
        </div>
        <dl className="settings-privacy-disclosure">
          <div>
            <dt>{t('settings.statistics')}</dt>
            <dd>{t('settings.statisticsEmptyHint')}</dd>
          </div>
          <div>
            <dt>{t('settings.statisticsReset')}</dt>
            <dd>{t('settings.statisticsResetHint')}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
