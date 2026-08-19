// Smoke test for all NamaInvest C++ modules.
// Does NOT show any dialogs (that would require a Win32 message loop in a
// GUI subsystem binary). It exercises: convertVia(), the lookup helpers,
// the default-currency list, the date_filter pure helpers, the
// period_mgmt_ui data layer, and the Ledger stubs.
#include "currency_rates_ui.h"
#include "date_filter.h"
#include "localization.h"
#include "period_mgmt_ui.h"
#include "settings/fx.h"

#include <cassert>
#include <cstdio>

int main()
{
    using namespace nama::locale;
    using namespace nama::settings::fx;
    using namespace nama::fxui;
    using namespace nama::datefilter;
    using namespace nama::period;

    // -- localization -----------------------------------------------------
    assert(countryCode(Country::SAUDI_ARABIA) != nullptr);
    assert(countryFromCode("SA") == Country::SAUDI_ARABIA);
    assert(countryFromCode("zz") == Country::GENERIC);
    assert(defaultVATRate(Country::SAUDI_ARABIA) == 0.15);
    assert(defaultVATRate(Country::UAE) == 0.05);
    assert(decimalPlaces(Country::BAHRAIN) == 3);
    assert(decimalPlaces(Country::SAUDI_ARABIA) == 2);
    assert(isRTL(Country::SAUDI_ARABIA) == true);
    assert(isRTL(Country::GENERIC) == false);

    // -- currency book + convert -----------------------------------------
    CurrencyRateBook book;
    book.seedDefaults();
    assert(book.size() >= 10);
    assert(book.find("USD") != nullptr);

    // 100 USD -> SAR via the book. USD rate is 3.75, SAR rate is 1.0.
    const double sar = convertVia(100.0, "USD", "SAR", book);
    assert(sar > 370.0 && sar < 380.0);

    // 100 SAR -> USD = 100 / 3.75 ~= 26.67
    const double usd = convertVia(100.0, "SAR", "USD", book);
    assert(usd > 26.0 && usd < 28.0);

    // 0 amount short-circuits
    assert(convertVia(0.0, "USD", "SAR", book) == 0.0);

    // Same-currency is identity
    assert(convertVia(42.0, "SAR", "SAR", book) == 42.0);

    // -- default-currency list -------------------------------------------
    const wchar_t* const* codes = defaultCurrencyCodes();
    const int n = defaultCurrencyCodeCount();
    assert(n == 12);
    for (int i = 0; i < n; ++i) {
        assert(codes[i] != nullptr);
    }

    // -- date_filter: pure helpers ---------------------------------------
    {
        // getCurrentDate returns a valid ISO string
        const std::string today = DateFilter::getCurrentDate();
        assert(today.size() == 10);
        assert(today[4] == '-' && today[7] == '-');

        // addDays arithmetic
        const std::string tomorrow = DateFilter::addDays(today, 1);
        assert(tomorrow.size() == 10);
        const std::string yesterday = DateFilter::addDays(today, -1);
        assert(yesterday.size() == 10);

        // Month / year boundaries
        assert(DateFilter::getFirstDayOfMonth(2024, 2)  == "2024-02-01");
        assert(DateFilter::getLastDayOfMonth(2024, 2)   == "2024-02-29"); // leap
        assert(DateFilter::getLastDayOfMonth(2023, 2)   == "2023-02-28"); // non-leap
        assert(DateFilter::getLastDayOfMonth(2024, 4)   == "2024-04-30");
        assert(DateFilter::getLastDayOfMonth(2024, 12)  == "2024-12-31");
        assert(DateFilter::getStartOfYear(2024) == "2024-01-01");
        assert(DateFilter::getEndOfYear(2024)   == "2024-12-31");

        // isInRange
        DateRange r;
        r.fromDate = "2024-01-01";
        r.toDate   = "2024-03-31";
        assert(DateFilter::isInRange("2024-02-15", r) == true);
        assert(DateFilter::isInRange("2023-12-31", r) == false);
        assert(DateFilter::isInRange("2024-04-01", r) == false);
        // Empty bounds = open-ended
        r.fromDate.clear();
        r.toDate.clear();
        assert(DateFilter::isInRange("1900-01-01", r) == true);
    }

    // -- date_filter: presets --------------------------------------------
    {
        const auto presets = DateFilter::quickPresets();
        assert(presets.size() == 8);
        assert(presets[0] == "Today");
        assert(presets[1] == "This Week");
        assert(presets[2] == "This Month");
        assert(presets[3] == "This Quarter");
        assert(presets[4] == "This Year");
        assert(presets[5] == "Last 30 Days");
        assert(presets[6] == "Last 90 Days");
        assert(presets[7] == "YTD");

        for (int i = 0; i < 8; ++i) {
            DateRange r = DateFilter::applyPreset(i);
            assert(!r.fromDate.empty());
            assert(!r.toDate.empty());
            assert(r.fromDate <= r.toDate);
        }
        // Out-of-range preset -> empty range
        DateRange bad = DateFilter::applyPreset(99);
        assert(bad.fromDate.empty());
    }

    // -- period_mgmt_ui: FiscalPeriodBook --------------------------------
    {
        FiscalPeriodBook pbook;
        assert(pbook.empty());

        FiscalPeriod p1;
        p1.id = "2024-Q1"; p1.name = "Q1 2024";
        p1.startDate = "2024-01-01"; p1.endDate = "2024-03-31";
        p1.status = PeriodStatus::Open; p1.year = 2024;
        pbook.add(p1);

        FiscalPeriod p2;
        p2.id = "2024-Q2"; p2.name = "Q2 2024";
        p2.startDate = "2024-04-01"; p2.endDate = "2024-06-30";
        p2.status = PeriodStatus::Open; p2.year = 2024;
        pbook.add(p2);

        assert(pbook.size() == 2);
        assert(pbook.find("2024-Q1") != nullptr);

        // State transitions
        assert(pbook.closePeriod("2024-Q1")  == true);
        assert(pbook.closePeriod("2024-Q1")  == false);  // already closed
        assert(pbook.reopenPeriod("2024-Q1") == true);
        assert(pbook.lockPeriod("2024-Q1")   == true);
        assert(pbook.lockPeriod("2024-Q1")   == true);   // idempotent
        assert(pbook.reopenPeriod("2024-Q1") == false);  // locked -> not reopenable

        // latestForYear
        const FiscalPeriod* latest = pbook.latestForYear(2024);
        assert(latest != nullptr);
        assert(latest->id == "2024-Q2");

        // remove
        assert(pbook.remove("2024-Q1") == true);
        assert(pbook.size() == 1);
    }

    // -- period_mgmt_ui: Ledger ------------------------------------------
    {
        Ledger ledger;
        const std::string acct = ledger.incomeSummaryAccount();
        assert(!acct.empty());

        const auto entries = ledger.computeYearEndEntries(2024);
        assert(!entries.empty());
        // Each entry should have a non-empty account code + name + amount > 0.
        for (const auto& e : entries) {
            assert(!e.account.empty());
            assert(!e.accountName.empty());
            assert(e.amount > 0.0);
        }

        const auto r = ledger.postYearEndEntries(2024, entries);
        assert(r.ok);
        assert(ledger.postedEntries().size() == entries.size());
    }

    std::printf("OK  cur.size=%zu  usd->sar=%.4f  sar->usd=%.4f\n",
                book.size(), sar, usd);
    return 0;
}
