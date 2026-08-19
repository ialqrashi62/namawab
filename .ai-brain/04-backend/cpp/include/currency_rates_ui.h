// =============================================================================
// NamaInvest ERP — currency_rates_ui.h
// -----------------------------------------------------------------------------
// Win32 GUI dialogs for managing the currency rate book and a triangular
// conversion helper. Pure C++17, only Win32 + standard headers.
//
// Namespace: nama::fxui
// =============================================================================
#ifndef NAMA_CURRENCY_RATES_UI_H
#define NAMA_CURRENCY_RATES_UI_H

// Force the wide (Unicode) Win32 API everywhere this header is included.
// This makes the ListView / Window / Edit / Button macros resolve to the
// `W` variants and avoids the ANSI/Unicode mismatch warnings.
#ifndef UNICODE
#  define UNICODE
#endif
#ifndef _UNICODE
#  define _UNICODE
#endif

#include <string>

#include <windows.h>

#include "settings/fx.h"

namespace nama {
namespace fxui {

// -----------------------------------------------------------------------------
// showCurrencyRatesDialog
// -----------------------------------------------------------------------------
// Modal dialog: lists all rates in the book and lets the user add, edit,
// delete, or "refresh from server" (mocked). The dialog mutates the book
// in place. The dialog is parented to `parent` (may be nullptr).
// -----------------------------------------------------------------------------
void showCurrencyRatesDialog(HWND parent,
                             nama::settings::fx::CurrencyRateBook& book);

// -----------------------------------------------------------------------------
// showNewRateDialog
// -----------------------------------------------------------------------------
// Modal "add / edit" dialog. Pass a fresh `CurrencyRate` for "new", or an
// existing one for "edit". Returns true if the user accepted (OK), false on
// Cancel. On accept, the new values are written back into `rate`.
// -----------------------------------------------------------------------------
bool showNewRateDialog(HWND parent,
                       nama::settings::fx::CurrencyRate& rate);

// -----------------------------------------------------------------------------
// convertVia
// -----------------------------------------------------------------------------
// Triangular conversion helper. `book` stores "1 unit of code = rate(code)
// units of base". To convert `amount` from `from` to `to`:
//      amount_in_base = amount * book.rateOrOne(from)
//      amount_in_to   = amount_in_base / book.rateOrOne(to)
// If `from == to` the amount is returned unchanged. If either side is missing
// from the book, `rateOrOne` falls back to 1.0 (identity), which is the
// safe no-op behaviour for unmapped currencies.
// -----------------------------------------------------------------------------
double convertVia(double amount,
                  const std::string& from,
                  const std::string& to,
                  const nama::settings::fx::CurrencyRateBook& book);

// -----------------------------------------------------------------------------
// List of all currency codes the NamaInvest "Quick add" picker ships with.
// The dialog uses this to populate the dropdown / quick-add grid.
// -----------------------------------------------------------------------------
inline const wchar_t* const* defaultCurrencyCodes() noexcept
{
    static const wchar_t* const kCodes[] = {
        L"SAR", L"AED", L"USD", L"EUR", L"GBP",
        L"BHD", L"KWD", L"OMR", L"QAR", L"EGP",
        L"JOD", L"INR"
    };
    return kCodes;
}

inline int defaultCurrencyCodeCount() noexcept
{
    // Explicit count is intentional: a `sizeof` against a function-local
    // static array across translation units is not well-defined.
    return 12;
}

} // namespace fxui
} // namespace nama

#endif // NAMA_CURRENCY_RATES_UI_H
