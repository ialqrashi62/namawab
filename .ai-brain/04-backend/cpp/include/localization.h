// =============================================================================
// NamaInvest ERP — localization.h
// -----------------------------------------------------------------------------
// Multi-country localization primitives (GCC / GCC-Gulf / Levant).
// Provides country codes, ISO currency codes, default VAT rates, decimal
// places, date format, weekday / month names (English + Arabic), and an
// RTL flag for layout.
//
// Namespace: nama::locale
// Standard:  C++17 — no external dependencies, only <string>/<cstddef>.
// =============================================================================
#ifndef NAMA_LOCALIZATION_H
#define NAMA_LOCALIZATION_H

#include <cstddef>
#include <string>

namespace nama {
namespace locale {

// -----------------------------------------------------------------------------
// Country — the set of countries NamaInvest ships day-one support for.
// `GENERIC` is a non-regional fallback (LTR, USD, 2 decimals, 10% VAT).
// -----------------------------------------------------------------------------
enum class Country
{
    SAUDI_ARABIA = 0,
    UAE          = 1,
    BAHRAIN      = 2,
    QATAR        = 3,
    KUWAIT       = 4,
    OMAN         = 5,
    EGYPT        = 6,
    JORDAN       = 7,
    GENERIC      = 8
};

// -----------------------------------------------------------------------------
// Static API — all methods are pure (no global state, no allocations).
// -----------------------------------------------------------------------------

// ISO 3166-1 alpha-2 code: "SA", "AE", "BH", "QA", "KW", "OM", "EG", "JO", "GEN".
const char* countryCode(Country c);

// Reverse lookup by code (case-insensitive). Unknown -> GENERIC.
Country countryFromCode(const std::string& code);

// Country name in Arabic (full form, e.g. "المملكة العربية السعودية").
const wchar_t* countryNameAr(Country c);

// Country name in English (e.g. "Saudi Arabia").
const wchar_t* countryNameEn(Country c);

// Default ISO 4217 currency code: SAR, AED, BHD, QAR, KWD, OMR, EGP, JOD, USD.
const wchar_t* currencyCode(Country c);

// Default VAT rate (e.g. 0.15 for Saudi Arabia, 0.05 for UAE).
double defaultVATRate(Country c);

// Number of decimal places to display in monetary amounts.
// 2 for SAR/AED/USD/EUR/GBP/EGP/JOD/INR/QAR/GENERIC, 3 for BHD/KWD/OMR
// (those currencies are denominated in 1000 sub-units).
int decimalPlaces(Country c);

// Preferred short date format pattern ("DD/MM/YYYY", "MM/DD/YYYY", ...).
const wchar_t* dateFormat(Country c);

// Weekday name. `day` is 0..6 with 0 = Sunday (ISO/US convention).
// `arabic` selects the language; both are always non-null.
const wchar_t* weekdayName(int day, Country c, bool arabic);

// Month name. `month` is 1..12.
const wchar_t* monthName(int month, Country c, bool arabic);

// True if the locale writes right-to-left (all GCC + Levant countries are
// Arabic-script locales; only `GENERIC` defaults to LTR).
bool isRTL(Country c);

// Total number of Country values (useful for table bounds).
inline constexpr std::size_t countryCount() noexcept
{
    return static_cast<std::size_t>(Country::GENERIC) + 1;
}

} // namespace locale
} // namespace nama

#endif // NAMA_LOCALIZATION_H
