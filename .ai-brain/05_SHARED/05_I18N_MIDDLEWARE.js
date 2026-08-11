/**
 * NamaMedical — i18n Middleware & Registry
 *
 * Loads translations from JSON files, supports AR/EN/FR/UR
 * with RTL handling for AR/UR.
 *
 * @module i18n
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SUPPORTED_LOCALES = ['ar', 'en', 'fr', 'ur'];
const RTL_LOCALES = ['ar', 'ur'];
const DEFAULT_LOCALE = 'ar';

class I18n {
  constructor({ translationsDir = 'locales', defaultLocale = DEFAULT_LOCALE } = {}) {
    this.translationsDir = translationsDir;
    this.defaultLocale = defaultLocale;
    this.translations = {};
    this.fallback = {};
    this.load();
  }

  load() {
    for (const locale of SUPPORTED_LOCALES) {
      const file = path.join(this.translationsDir, `${locale}.json`);
      if (fs.existsSync(file)) {
        try {
          this.translations[locale] = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (err) {
          console.error(`[i18n] Failed to load ${file}:`, err.message);
          this.translations[locale] = {};
        }
      } else {
        this.translations[locale] = {};
      }
    }
  }

  t(locale, key, vars = {}) {
    const dict = this.translations[locale] || this.translations[this.defaultLocale] || {};
    let value = dict[key];
    if (value === undefined) {
      // Try fallback
      value = this.translations[this.defaultLocale]?.[key];
    }
    if (value === undefined) {
      // Missing key — log and return key
      if (process.env.I18N_MISSING_LOG) {
        console.warn(`[i18n] Missing key '${key}' for locale '${locale}'`);
      }
      return key;
    }
    // Interpolate {{var}}
    if (typeof value === 'string' && vars) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `[${k}]`);
    }
    return value;
  }

  isRTL(locale) {
    return RTL_LOCALES.includes(locale);
  }

  /**
   * Express middleware
   */
  middleware() {
    return (req, res, next) => {
      // 1. Locale resolution order:
      //    a. Query param ?lang=
      //    b. Cookie lang
      //    c. Accept-Language header
      //    d. User preference (if logged in)
      //    e. Default
      const queryLang = req.query.lang;
      const cookieLang = req.cookies?.lang;
      const headerLang = req.headers['accept-language']?.split(',')[0]?.split('-')[0];
      const userLang = req.user?.locale;

      const locale = [queryLang, cookieLang, headerLang, userLang, this.defaultLocale]
        .find((l) => l && SUPPORTED_LOCALES.includes(l)) || this.defaultLocale;

      req.locale = locale;
      res.locals.locale = locale;
      res.locals.isRTL = this.isRTL(locale);
      res.locals.t = (key, vars) => this.t(locale, key, vars);

      // Set cookie
      res.cookie('lang', locale, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });

      next();
    };
  }

  /**
   * Export a flat key-value list for a locale (for client-side use)
   */
  exportLocale(locale) {
    return this.translations[locale] || {};
  }
}

module.exports = {
  I18n,
  SUPPORTED_LOCALES,
  RTL_LOCALES,
  DEFAULT_LOCALE,
};
