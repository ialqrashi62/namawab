// =============================================================================
// NamaInvest ERP — date_filter.h
// -----------------------------------------------------------------------------
// Date-range filter primitives for reports, listings, and forms. Provides
// a self-contained `DateRange` value type plus a small set of static helpers
// for "Today / This Week / This Month / This Quarter / This Year / Last
// 30 Days / Last 90 Days / YTD" presets and basic date arithmetic. All
// helpers are pure C++17 (only <ctime> + <string> + <vector>) so they can
// be used headless by both the Win32 UI and any future N-API bindings.
//
// Namespace: nama::datefilter
// =============================================================================
#ifndef NAMA_DATE_FILTER_H
#define NAMA_DATE_FILTER_H

#include <cstdint>
#include <string>
#include <vector>

#include <windows.h>   // HWND, wchar_t (already in <string> on MSVC, but kept
                        // here for documentation that this header is Win32-
                        // aware when the static methods touch a dialog).

namespace nama {
namespace datefilter {

// -----------------------------------------------------------------------------
// DateRange
// -----------------------------------------------------------------------------
// Inclusive date range expressed as ISO-8601 strings ("YYYY-MM-DD"). The
// optional `period` field carries a free-form label such as "Today",
// "This Month", "Q1-2024" so the calling UI can echo it back to the user
// without re-deriving it. `from` and `to` may be equal for a single-day
// filter.
// -----------------------------------------------------------------------------
struct DateRange
{
    std::string fromDate;   // "YYYY-MM-DD" (inclusive)
    std::string toDate;     // "YYYY-MM-DD" (inclusive)
    std::string period;     // free-form label, e.g. "This Month"
};

// -----------------------------------------------------------------------------
// DateFilter — static helpers for date ranges + a small modal picker UI.
// -----------------------------------------------------------------------------
struct DateFilter
{
    // -------------------------------------------------------------------------
    // Dialog (UI side, Win32)
    // -------------------------------------------------------------------------

    // promptDateRange — opens a modal date-range picker. On Cancel, returns
    // a range equal to "today" (so callers can use the result without a
    // separate "did the user cancel?" check). Matches the brief.
    static DateRange promptDateRange(HWND                parent,
                                     const std::wstring& title);

    // -------------------------------------------------------------------------
    // Pure helpers (no UI, no global state beyond the local-time clock)
    // -------------------------------------------------------------------------

    // isInRange — true if `date` (YYYY-MM-DD) is in [`range.fromDate`,
    // `range.toDate`] inclusive. An empty bound on either side is treated
    // as "no bound on this side".
    static bool isInRange(const std::string& date, const DateRange& range);

    // quickPresets — the ordered list of preset labels surfaced in the
    // dialog's combo box. The order of the returned strings is the
    // canonical preset order used by `applyPreset` (0..N-1).
    static std::vector<std::string> quickPresets();

    // applyPreset — converts a preset index (as returned by `quickPresets`)
    // into a concrete DateRange based on "today" (local time). Unknown
    // indices return an empty range (from == to == "").
    static DateRange applyPreset(int presetIndex);

    // getCurrentDate — "YYYY-MM-DD" for the current local date.
    static std::string getCurrentDate();

    // addDays — returns date + `days` (negative is allowed) as "YYYY-MM-DD".
    // Wraps across months/years correctly via mktime-normalised arithmetic.
    static std::string addDays(const std::string& date, int days);

    // getFirstDayOfMonth — "YYYY-MM-01" for the given year/month. `month` is
    // 1-based (1 = January, 12 = December). Out-of-range values are clamped.
    static std::string getFirstDayOfMonth(int year, int month);

    // getLastDayOfMonth — "YYYY-MM-DD" with the correct last day for the
    // given year/month (handles 28/29/30/31 and leap years).
    static std::string getLastDayOfMonth(int year, int month);

    // getStartOfYear — "YYYY-01-01".
    static std::string getStartOfYear(int year);

    // getEndOfYear — "YYYY-12-31".
    static std::string getEndOfYear(int year);

    // -------------------------------------------------------------------------
    // Low-level conversions (exposed for callers that already hold a `tm`).
    // -------------------------------------------------------------------------

    // parseIsoDate — parses "YYYY-MM-DD" into year/month/day (1-based month).
    // Returns false on malformed input.
    static bool parseIsoDate(const std::string& iso,
                             int& year, int& month, int& day);

    // formatIsoDate — formats year/mon/day into "YYYY-MM-DD". `mon` is
    // 0-based (0 = January) to mirror `struct tm`.
    static std::string formatIsoDate(int year, int mon, int day);
};

} // namespace datefilter
} // namespace nama

#endif // NAMA_DATE_FILTER_H
