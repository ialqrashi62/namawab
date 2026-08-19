// =============================================================================
// NamaInvest ERP — settings/fx.h
// -----------------------------------------------------------------------------
// Foreign exchange (currency) rate data types. These are referenced by the
// currency_rates_ui dialog and the multi-currency primitives. This header
// provides the minimal pure-C++17 types so the higher-level modules can compile
// without external dependencies.
//
// Namespace: nama::settings::fx
// =============================================================================
#ifndef NAMA_SETTINGS_FX_H
#define NAMA_SETTINGS_FX_H

#include <cstdint>
#include <string>
#include <vector>

namespace nama {
namespace settings {
namespace fx {

// -----------------------------------------------------------------------------
// CurrencyRate
// -----------------------------------------------------------------------------
// One record describing "1 unit of `code` equals `rateToBase` units of base".
// The base currency is whatever the application owner has configured (in
// practice SAR for NamaInvest deployments). `effectiveFrom` and `updatedAt`
// are unix-epoch seconds. `source` is a free-form tag ("manual", "sama",
// "xe.com", "mock-server", ...).
// -----------------------------------------------------------------------------
struct CurrencyRate
{
    std::string code;          // ISO 4217 (SAR, AED, USD, ...)
    std::string name;          // Display name
    double      rateToBase{1.0};
    std::int64_t effectiveFrom{0};  // unix seconds
    std::int64_t updatedAt{0};      // unix seconds
    std::string source;        // provenance tag
};

// -----------------------------------------------------------------------------
// CurrencyRateBook
// -----------------------------------------------------------------------------
// In-memory container of all known currency rates. Lookup is by ISO code
// (case-insensitive). The container is intentionally simple (linear scan) —
// the working set is ~12-30 entries, so an ordered map would be overkill.
// -----------------------------------------------------------------------------
class CurrencyRateBook
{
public:
    CurrencyRateBook() = default;

    // Non-copyable to keep mutation semantics obvious, but movable.
    CurrencyRateBook(const CurrencyRateBook&) = default;
    CurrencyRateBook& operator=(const CurrencyRateBook&) = default;
    CurrencyRateBook(CurrencyRateBook&&) noexcept = default;
    CurrencyRateBook& operator=(CurrencyRateBook&&) noexcept = default;
    ~CurrencyRateBook() = default;

    // -- mutation -------------------------------------------------------------
    void clear() noexcept { rates_.clear(); }

    // Add or replace the rate for `rate.code`.
    void upsert(const CurrencyRate& rate);

    // Remove by code (case-insensitive). Returns true if removed.
    bool remove(const std::string& code);

    // -- queries --------------------------------------------------------------
    // Find by code (case-insensitive). Returns nullptr if absent.
    const CurrencyRate* find(const std::string& code) const;

    // Convenience: get the rate (returns 1.0 for unknown codes, treating
    // unknown as "identity with base", which is the safe default for the
    // conversion helpers).
    double rateOrOne(const std::string& code) const;

    // -- accessors ------------------------------------------------------------
    const std::vector<CurrencyRate>& all() const noexcept { return rates_; }
    std::size_t size() const noexcept { return rates_.size(); }
    bool empty() const noexcept { return rates_.empty(); }

    // Seed with the standard NamaInvest currency list. Safe to call multiple
    // times; existing entries are replaced.
    void seedDefaults();

private:
    std::vector<CurrencyRate> rates_;
};

} // namespace fx
} // namespace settings
} // namespace nama

#endif // NAMA_SETTINGS_FX_H
