// =============================================================================
// NamaInvest ERP — settings/fx.cpp
// -----------------------------------------------------------------------------
// Implementation of CurrencyRate / CurrencyRateBook. Pure C++17, no deps.
// =============================================================================
#include "settings/fx.h"

#include <algorithm>
#include <cctype>
#include <ctime>

namespace nama {
namespace settings {
namespace fx {

namespace {

// Uppercase a copy of the input string (ASCII-only, in-place on a copy).
std::string upper(std::string s)
{
    for (auto& ch : s) ch = static_cast<char>(std::toupper(static_cast<unsigned char>(ch)));
    return s;
}

} // anonymous namespace

// -----------------------------------------------------------------------------
// CurrencyRateBook — upsert
// -----------------------------------------------------------------------------
void CurrencyRateBook::upsert(const CurrencyRate& rate)
{
    const std::string needle = upper(rate.code);
    for (auto& r : rates_) {
        if (upper(r.code) == needle) {
            r = rate;
            r.code = needle; // normalize on store
            return;
        }
    }
    CurrencyRate copy = rate;
    copy.code = needle;
    rates_.push_back(copy);
}

// -----------------------------------------------------------------------------
// CurrencyRateBook — remove
// -----------------------------------------------------------------------------
bool CurrencyRateBook::remove(const std::string& code)
{
    const std::string needle = upper(code);
    for (auto it = rates_.begin(); it != rates_.end(); ++it) {
        if (upper(it->code) == needle) {
            rates_.erase(it);
            return true;
        }
    }
    return false;
}

// -----------------------------------------------------------------------------
// CurrencyRateBook — find
// -----------------------------------------------------------------------------
const CurrencyRate* CurrencyRateBook::find(const std::string& code) const
{
    const std::string needle = upper(code);
    for (const auto& r : rates_) {
        if (upper(r.code) == needle) return &r;
    }
    return nullptr;
}

// -----------------------------------------------------------------------------
// CurrencyRateBook — rateOrOne
// -----------------------------------------------------------------------------
double CurrencyRateBook::rateOrOne(const std::string& code) const
{
    const CurrencyRate* r = find(code);
    return (r != nullptr) ? r->rateToBase : 1.0;
}

// -----------------------------------------------------------------------------
// CurrencyRateBook — seedDefaults
// -----------------------------------------------------------------------------
void CurrencyRateBook::seedDefaults()
{
    clear();

    const std::int64_t now = static_cast<std::int64_t>(std::time(nullptr));

    auto make = [&](const char* code, const char* name, double rate) {
        CurrencyRate r;
        r.code          = code;
        r.name          = name;
        r.rateToBase    = rate;
        r.effectiveFrom = now;
        r.updatedAt     = now;
        r.source        = "seed";
        return r;
    };

    // Rates expressed against base SAR (Saudi Riyal pinned at 1.0).
    // These are the standard reference values as of the NamaInvest v1 cut.
    rates_.push_back(make("SAR", "Saudi Riyal",       1.0000));
    rates_.push_back(make("AED", "UAE Dirham",         1.0211));
    rates_.push_back(make("USD", "US Dollar",          3.7500));
    rates_.push_back(make("EUR", "Euro",               4.0700));
    rates_.push_back(make("GBP", "British Pound",      4.7400));
    rates_.push_back(make("BHD", "Bahraini Dinar",    10.0000)); // 1 BHD ~ 9.95 SAR
    rates_.push_back(make("KWD", "Kuwaiti Dinar",     12.2500));
    rates_.push_back(make("OMR", "Omani Rial",         9.7500));
    rates_.push_back(make("QAR", "Qatari Riyal",       1.0300));
    rates_.push_back(make("EGP", "Egyptian Pound",     0.0770));
    rates_.push_back(make("JOD", "Jordanian Dinar",    5.2900));
    rates_.push_back(make("INR", "Indian Rupee",       0.0450));
}

} // namespace fx
} // namespace settings
} // namespace nama
