// =============================================================================
// NamaInvest ERP — period_mgmt_ui.h
// -----------------------------------------------------------------------------
// Win32 GUI dialogs for managing the fiscal-period book and the year-end
// closing flow. Pure C++17, only Win32 + standard headers.
//
// Namespace: nama::periodui  (the UI layer; struct PeriodManagerUI)
//            nama::period   (the data types this UI operates on)
//
// IMPORTANT — DATA TYPES
// -----------------------------------------------------------------------------
// This header is self-contained: it declares the minimal `nama::period`
// value types (`PeriodStatus`, `FiscalPeriod`, `FiscalPeriodBook`) and the
// `Ledger` facade that the dialogs call into. In a real build, these are
// expected to live in their own headers (e.g. `period/fiscal_period.h` and
// `accounting/ledger.h`); the in-header stubs here are kept so the UI
// module compiles standalone. If the real headers exist, define
// NAMA_PERIOD_UI_USE_EXTERNAL_TYPES before including this one and the
// stubs are skipped.
// =============================================================================
#ifndef NAMA_PERIOD_MGMT_UI_H
#define NAMA_PERIOD_MGMT_UI_H

#include <cstdint>
#include <string>
#include <vector>

#include <windows.h>

namespace nama {
namespace period {

// -----------------------------------------------------------------------------
// PeriodStatus — lifecycle state of a fiscal period.
// -----------------------------------------------------------------------------
enum class PeriodStatus
{
    Open   = 0,   // accepting postings
    Closed = 1,   // soft-closed, can be re-opened
    Locked = 2    // hard-closed, cannot be re-opened
};

// -----------------------------------------------------------------------------
// FiscalPeriod — one row in the period book.
// -----------------------------------------------------------------------------
struct FiscalPeriod
{
    std::string   id;          // e.g. "2024-Q1"
    std::string   name;        // e.g. "Q1 2024"
    std::string   startDate;   // "YYYY-MM-DD"
    std::string   endDate;     // "YYYY-MM-DD"
    PeriodStatus  status{PeriodStatus::Open};
    int           year{0};
};

#ifndef NAMA_PERIOD_UI_USE_EXTERNAL_TYPES

// -----------------------------------------------------------------------------
// FiscalPeriodBook — in-memory book of fiscal periods (UI-facing).
// -----------------------------------------------------------------------------
// The UI only needs a small surface area here: enumerate, mutate status,
// add/remove. Heavy lifting (SQL persistence, posting rules) is expected
// to live in the real production header. These stubs are intentionally
// tiny so the dialogs can be exercised in isolation.
// -----------------------------------------------------------------------------
class FiscalPeriodBook
{
public:
    FiscalPeriodBook() = default;

    // -- accessors ------------------------------------------------------------
    std::vector<FiscalPeriod>&       all()       noexcept { return periods_; }
    const std::vector<FiscalPeriod>& all() const noexcept { return periods_; }
    std::size_t                      size() const noexcept { return periods_.size(); }
    bool                             empty() const noexcept { return periods_.empty(); }

    // -- queries --------------------------------------------------------------
    FiscalPeriod*       find(const std::string& id);
    const FiscalPeriod* find(const std::string& id) const;

    // -- mutations ------------------------------------------------------------
    void add(const FiscalPeriod& p);
    bool remove(const std::string& id);

    // Lifecycle transitions. The book enforces the simple state machine
    //      Open   -> Closed   (closePeriod)
    //      Closed -> Open     (reopenPeriod)
    //      Open   -> Locked   (lockPeriod, terminal)
    // Returns true on a valid transition, false otherwise.
    bool closePeriod (const std::string& id);
    bool reopenPeriod(const std::string& id);
    bool lockPeriod  (const std::string& id);

    // Convenience: latest period for `year` (or nullptr).
    const FiscalPeriod* latestForYear(int year) const;

    // Seed a reasonable 8-quarter book starting at `startYear` so the
    // dialog is non-empty out of the box. Safe to call multiple times;
    // existing entries are kept (duplicates skipped).
    void seedDefaults(int startYear);

private:
    std::vector<FiscalPeriod> periods_;
};

#endif // NAMA_PERIOD_UI_USE_EXTERNAL_TYPES

} // namespace period
} // namespace nama

// =============================================================================
// Ledger (global-namespace facade used by year-end close)
// =============================================================================
#ifndef NAMA_PERIOD_UI_USE_EXTERNAL_TYPES

class Ledger
{
public:
    // -------------------------------------------------------------------------
    // ClosingEntry — one half of a year-end closing journal entry.
    // -------------------------------------------------------------------------
    struct ClosingEntry
    {
        std::string account;       // account code (e.g. "4000")
        std::string accountName;   // human-readable
        double      amount{0.0};   // always > 0; the `isDebit` flag decides side
        bool        isDebit{true};
    };

    // -------------------------------------------------------------------------
    // Result of a year-end close attempt.
    // -------------------------------------------------------------------------
    struct CloseResult
    {
        bool                       ok{false};
        std::string                message;       // human-readable
        std::vector<ClosingEntry>  entries;       // entries actually posted
    };

    Ledger() = default;

    // The "income summary" account code we close everything into. The
    // UI uses this for display only; the actual posting path is below.
    std::string incomeSummaryAccount() const { return "3300"; }

    // Compute the closing entries that *would* be posted for `year`. The
    // stub returns a deterministic example so the dialog has something to
    // show. Real implementations would walk the GL for revenue/expense
    // balances.
    std::vector<ClosingEntry> computeYearEndEntries(int year) const;

    // Post the closing entries to the underlying ledger. The stub simply
    // records them and returns ok=true so the UI flow completes.
    CloseResult postYearEndEntries(int year,
                                   const std::vector<ClosingEntry>& entries);

    // Read-only view of entries posted so far (for the summary dialog).
    const std::vector<ClosingEntry>& postedEntries() const noexcept
    {
        return posted_;
    }

private:
    std::vector<ClosingEntry> posted_;
};

#endif // NAMA_PERIOD_UI_USE_EXTERNAL_TYPES

// =============================================================================
// UI layer
// =============================================================================
namespace nama {
namespace periodui {

// -----------------------------------------------------------------------------
// PeriodManagerUI — static methods wrapping the three period-management
// dialogs. See each method's comment below.
// -----------------------------------------------------------------------------
struct PeriodManagerUI
{
    // -------------------------------------------------------------------------
    // showPeriodManagerDialog
    // -------------------------------------------------------------------------
    // Modal dialog showing a ListView of all periods in the book. The user
    // can create new periods, close / lock / reopen existing ones, and
    // launch the year-end close flow. All mutations are applied to `book`
    // in place.
    // -------------------------------------------------------------------------
    static void showPeriodManagerDialog(HWND                              parent,
                                        nama::period::FiscalPeriodBook&   book);

    // -------------------------------------------------------------------------
    // showNewPeriodDialog
    // -------------------------------------------------------------------------
    // Modal "new fiscal period" dialog. On accept, `period` is populated and
    // the function returns true. On cancel, returns false and `period` is
    // left half-filled (the caller should discard).
    // -------------------------------------------------------------------------
    static bool showNewPeriodDialog(HWND                         parent,
                                    nama::period::FiscalPeriod&  period);

    // -------------------------------------------------------------------------
    // showYearEndCloseDialog
    // -------------------------------------------------------------------------
    // Warning dialog that previews the closing entries for `book`'s latest
    // year and, on user confirmation, posts them through `ledger`. The
    // dialog blocks until the user accepts or cancels. The result is
    // communicated back via `ledger.postedEntries()` (the caller can read
    // it after the call returns).
    // -------------------------------------------------------------------------
    static void showYearEndCloseDialog(HWND                              parent,
                                       nama::period::FiscalPeriodBook&   book,
                                       const Ledger&                     ledger);
};

} // namespace periodui
} // namespace nama

#endif // NAMA_PERIOD_MGMT_UI_H
