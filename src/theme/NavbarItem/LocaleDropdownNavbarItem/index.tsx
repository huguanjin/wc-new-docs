/**
 * Dev guard: `docusaurus start` only bundles one locale. Client-side locale switches
 * load missing chunks and crash with webpack overlay "[object Object]".
 */
import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import {mergeSearchStrings, useHistorySelector} from '@docusaurus/theme-common';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {Props} from '@theme/NavbarItem/LocaleDropdownNavbarItem';

import styles from './styles.module.css';

const LOCALE_DEV_COMMAND: Record<string, string> = {
  'zh-CN': 'npm run start:zh',
  'zh-TW': 'npm run start:zh-tw',
  fr: 'npm run start:fr',
  ja: 'npm run start:ja',
  ru: 'npm run start:ru',
  vi: 'npm run start:vi',
};

function devLocaleHint(targetLocale: string, currentLocale: string): void {
  const cmd =
    LOCALE_DEV_COMMAND[targetLocale] ??
    `npm run docusaurus -- start --locale ${targetLocale}`;
  const message = [
    translate({
      id: 'dev.localeHint.cannotSwitch',
      message:
        'Switching locale in dev mode is not supported (it triggers a runtime error).',
      description: 'Dev-only alert when switching locale in the navbar dropdown',
    }),
    translate(
      {
        id: 'dev.localeHint.currentTarget',
        message: 'Currently running: {current} → target: {target}',
        description: 'Dev-only alert showing current vs target locale',
      },
      {current: currentLocale, target: targetLocale},
    ),
    '',
    translate({
      id: 'dev.localeHint.options',
      message: 'Options:',
      description: 'Dev-only alert options heading',
    }),
    translate(
      {
        id: 'dev.localeHint.option1',
        message: '1) Run in a new terminal: {cmd}',
        description: 'Dev-only alert first option',
      },
      {cmd},
    ),
    translate({
      id: 'dev.localeHint.option2',
      message: '2) Preview all locales: npm run preview',
      description: 'Dev-only alert second option',
    }),
  ].join('\n');
  window.alert(message);
}

function useLocaleDropdownUtils() {
  const {
    siteConfig,
    i18n: {localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const search = useHistorySelector(history => history.location.search);
  const hash = useHistorySelector(history => history.location.hash);

  const getLocaleConfig = (locale: string) => {
    const localeConfig = localeConfigs[locale];
    if (!localeConfig) {
      throw new Error(
        `Docusaurus bug, no locale config found for locale=${locale}`,
      );
    }
    return localeConfig;
  };

  const getBaseURLForLocale = (locale: string) => {
    const localeConfig = getLocaleConfig(locale);
    const isSameDomain = localeConfig.url === siteConfig.url;
    const path = alternatePageUtils.createUrl({
      locale,
      fullyQualified: false,
    });
    if (isSameDomain) {
      if (process.env.NODE_ENV === 'development') {
        return path;
      }
      return `pathname://${path}`;
    }
    return alternatePageUtils.createUrl({
      locale,
      fullyQualified: true,
    });
  };

  return {
    getURL: (locale: string, options: {queryString: string | undefined}) => {
      const finalSearch = mergeSearchStrings(
        [search, options.queryString],
        'append',
      );
      return `${getBaseURLForLocale(locale)}${finalSearch}${hash}`;
    },
    getLabel: (locale: string) => getLocaleConfig(locale).label,
    getLang: (locale: string) => getLocaleConfig(locale).htmlLang,
  };
}

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  queryString,
  ...props
}: Props): ReactNode {
  const utils = useLocaleDropdownUtils();
  const {
    i18n: {currentLocale, locales},
  } = useDocusaurusContext();

  const localeItems = locales.map((locale): LinkLikeNavbarItemProps => {
    const activeClassName =
      locale === currentLocale
        ? mobile
          ? 'menu__link--active'
          : 'dropdown__link--active'
        : '';

    const base: LinkLikeNavbarItemProps = {
      label: utils.getLabel(locale),
      lang: utils.getLang(locale),
      to: utils.getURL(locale, {queryString}),
      target: '_self',
      autoAddBaseUrl: false,
      className: activeClassName,
    };

    if (process.env.NODE_ENV === 'development' && locale !== currentLocale) {
      return {
        ...base,
        to: undefined,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          devLocaleHint(locale, currentLocale);
        },
      };
    }

    return base;
  });

  const items = [...dropdownItemsBefore, ...localeItems, ...dropdownItemsAfter];

  const dropdownLabel = mobile
    ? translate({
        message: 'Languages',
        id: 'theme.navbar.mobileLanguageDropdown.label',
        description: 'The label for the mobile language switcher dropdown',
      })
    : utils.getLabel(currentLocale);

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={
        <>
          <IconLanguage className={styles.iconLanguage} />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}
