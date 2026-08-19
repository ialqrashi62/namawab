// =============================================================================
// NamaInvest ERP — localization.cpp
// -----------------------------------------------------------------------------
// Implementation. All Arabic text is encoded as \uXXXX escape sequences inside
// L"" literals so the source stays pure ASCII and the compiler produces the
// right wide-string at build time. We use `inline const wchar_t*` for string
// constants (NOT constexpr) to avoid the C++17 string-literal-to-wchar_t*
// deprecation warning on MSVC and Clang.
//
// Reference Unicode escapes used below:
//   \u0627 = ا   \u0644 = ل   \u0645 = م   \u0643 = ك   \u0629 = ة
//   \u0639 = ع   \u0631 = ر   \u0628 = ب   \u064A = ي   \u0633 = س
//   \u0648 = و   \u062F = د   \u062D = ح   \u0623 = أ   \u0621 = ء
//   \u0625 = إ   \u063A = غ   \u0635 = ص   \u0647 = ه   \u0634 = ش
//   \u062A = ت   \u062B = ث   \u062E = خ   \u062C = ج   \u0642 = ق
//   \u0637 = ط   \u0646 = ن   \u0641 = ف   \u0622 = آ   \u064F = ُ (dhamma)
// =============================================================================
#include "localization.h"

#include <cctype>
#include <cstring>

namespace nama {
namespace locale {

namespace {

// -----------------------------------------------------------------------------
// Country record table. Order MUST match the Country enum.
// -----------------------------------------------------------------------------
struct CountryRecord
{
    const char*    code;
    const wchar_t* nameAr;
    const wchar_t* nameEn;
    const wchar_t* currency;
    double         vat;
    int            decimals;
    const wchar_t* dateFmt;
    bool           rtl;
};

inline const CountryRecord& record(Country c)
{
    // NOTE: All Arabic strings below are wide-string literals with \uXXXX
    // escape sequences. This keeps the source file ASCII-clean.
    static const CountryRecord kTable[] = {
        // SAUDI_ARABIA
        {
            "SA",
            L"\u0627\u0644\u0645\u0645\u0644\u0643\u0629 "
            L"\u0627\u0644\u0639\u0631\u0628\u064A\u0629 "
            L"\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
            L"Saudi Arabia",
            L"SAR",
            0.15,
            2,
            L"DD/MM/YYYY",
            true
        },
        // UAE
        {
            "AE",
            L"\u062F\u0648\u0644\u0629 "
            L"\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A "
            L"\u0627\u0644\u0639\u0631\u0628\u064A\u0629 "
            L"\u0627\u0644\u0645\u062A\u062D\u062F\u0629",
            L"United Arab Emirates",
            L"AED",
            0.05,
            2,
            L"DD/MM/YYYY",
            true
        },
        // BAHRAIN
        {
            "BH",
            L"\u0645\u0645\u0644\u0643\u0629 "
            L"\u0627\u0644\u0628\u062D\u0631\u064A\u0646",
            L"Bahrain",
            L"BHD",
            0.10,
            3,
            L"DD/MM/YYYY",
            true
        },
        // QATAR
        {
            "QA",
            L"\u062F\u0648\u0644\u0629 "
            L"\u0642\u0637\u0631",
            L"Qatar",
            L"QAR",
            0.05,
            2,
            L"DD/MM/YYYY",
            true
        },
        // KUWAIT
        {
            "KW",
            L"\u062F\u0648\u0644\u0629 "
            L"\u0627\u0644\u0643\u0648\u064A\u062A",
            L"Kuwait",
            L"KWD",
            0.05,
            3,
            L"DD/MM/YYYY",
            true
        },
        // OMAN
        {
            "OM",
            L"\u0633\u0644\u0637\u0646\u0629 "
            L"\u0639\u064F\u0645\u0627\u0646",
            L"Oman",
            L"OMR",
            0.05,
            3,
            L"DD/MM/YYYY",
            true
        },
        // EGYPT
        {
            "EG",
            L"\u062C\u0645\u0647\u0648\u0631\u064A\u0629 "
            L"\u0645\u0635\u0631 "
            L"\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
            L"Egypt",
            L"EGP",
            0.14,
            2,
            L"DD/MM/YYYY",
            true
        },
        // JORDAN
        {
            "JO",
            L"\u0627\u0644\u0645\u0645\u0644\u0643\u0629 "
            L"\u0627\u0644\u0623\u0631\u062F\u0646\u064A\u0629 "
            L"\u0627\u0644\u0647\u0627\u0634\u0645\u064A\u0629",
            L"Jordan",
            L"JOD",
            0.16,
            2,
            L"DD/MM/YYYY",
            true
        },
        // GENERIC (US-flavored fallback)
        {
            "GEN",
            L"\u0639\u0627\u0645",
            L"Generic",
            L"USD",
            0.10,
            2,
            L"MM/DD/YYYY",
            false
        }
    };

    const auto idx = static_cast<std::size_t>(c);
    if (idx >= countryCount()) {
        return kTable[static_cast<std::size_t>(Country::GENERIC)];
    }
    return kTable[idx];
}

// -----------------------------------------------------------------------------
// Weekday names. Day 0 = Sunday, day 6 = Saturday (US convention).
// -----------------------------------------------------------------------------
inline const wchar_t* weekdayEn(int day)
{
    static const wchar_t* const kTable[7] = {
        L"Sunday",   L"Monday",   L"Tuesday",  L"Wednesday",
        L"Thursday", L"Friday",   L"Saturday"
    };
    if (day < 0 || day > 6) return L"";
    return kTable[day];
}

inline const wchar_t* weekdayAr(int day)
{
    static const wchar_t* const kTable[7] = {
        L"\u0627\u0644\u0623\u062D\u062F",                                  // الأحد
        L"\u0627\u0644\u0627\u062B\u0646\u064A\u0646",                      // الاثنين
        L"\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621",                // الثلاثاء
        L"\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",                // الأربعاء
        L"\u0627\u0644\u062E\u0645\u064A\u0633",                              // الخميس
        L"\u0627\u0644\u062C\u0645\u0639\u0629",                              // الجمعة
        L"\u0627\u0644\u0633\u0628\u062A"                                     // السبت
    };
    if (day < 0 || day > 6) return L"";
    return kTable[day];
}

// -----------------------------------------------------------------------------
// Month names. 1 = January, 12 = December.
// -----------------------------------------------------------------------------
inline const wchar_t* monthEn(int month)
{
    static const wchar_t* const kTable[12] = {
        L"January",   L"February", L"March",    L"April",
        L"May",       L"June",     L"July",     L"August",
        L"September", L"October",  L"November", L"December"
    };
    if (month < 1 || month > 12) return L"";
    return kTable[month - 1];
}

inline const wchar_t* monthAr(int month)
{
    static const wchar_t* const kTable[12] = {
        L"\u064A\u0646\u0627\u064A\u0631",                                  // يناير
        L"\u0641\u0628\u0631\u0627\u064A\u0631",                            // فبراير
        L"\u0645\u0627\u0631\u0633",                                        // مارس
        L"\u0623\u0628\u0631\u064A\u0644",                                  // أبريل
        L"\u0645\u0627\u064A\u0648",                                        // مايو
        L"\u064A\u0648\u0646\u064A\u0648",                                  // يونيو
        L"\u064A\u0648\u0644\u064A\u0648",                                  // يوليو
        L"\u0623\u063A\u0633\u0637\u0633",                                  // أغسطس
        L"\u0633\u0628\u062A\u0645\u0628\u0631",                            // سبتمبر
        L"\u0623\u0643\u062A\u0648\u0628\u0631",                            // أكتوبر
        L"\u0646\u0648\u0641\u0645\u0628\u0631",                            // نوفمبر
        L"\u062F\u064A\u0633\u0645\u0628\u0631"                             // ديسمبر
    };
    if (month < 1 || month > 12) return L"";
    return kTable[month - 1];
}

} // anonymous namespace

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

const char* countryCode(Country c)
{
    return record(c).code;
}

Country countryFromCode(const std::string& code)
{
    if (code.size() != 2 && code.size() != 3) return Country::GENERIC;
    // Build uppercase copy for case-insensitive compare.
    char upper[4] = {0,0,0,0};
    for (std::size_t i = 0; i < code.size() && i < 3; ++i) {
        upper[i] = static_cast<char>(
            std::toupper(static_cast<unsigned char>(code[i])));
    }
    for (std::size_t i = 0; i < countryCount(); ++i) {
        const auto& r = record(static_cast<Country>(i));
        if (std::strcmp(upper, r.code) == 0) {
            return static_cast<Country>(i);
        }
    }
    return Country::GENERIC;
}

const wchar_t* countryNameAr(Country c)
{
    return record(c).nameAr;
}

const wchar_t* countryNameEn(Country c)
{
    return record(c).nameEn;
}

const wchar_t* currencyCode(Country c)
{
    return record(c).currency;
}

double defaultVATRate(Country c)
{
    return record(c).vat;
}

int decimalPlaces(Country c)
{
    return record(c).decimals;
}

const wchar_t* dateFormat(Country c)
{
    return record(c).dateFmt;
}

const wchar_t* weekdayName(int day, Country /*c*/, bool arabic)
{
    return arabic ? weekdayAr(day) : weekdayEn(day);
}

const wchar_t* monthName(int month, Country /*c*/, bool arabic)
{
    return arabic ? monthAr(month) : monthEn(month);
}

bool isRTL(Country c)
{
    return record(c).rtl;
}

} // namespace locale
} // namespace nama
