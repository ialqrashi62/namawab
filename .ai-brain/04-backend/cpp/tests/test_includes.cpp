// Smoke test: both modules compile together in a single TU.
#include "date_filter.h"
#include "period_mgmt_ui.h"

int smoke()
{
    nama::datefilter::DateRange r;
    r.fromDate = nama::datefilter::DateFilter::getCurrentDate();
    r.toDate   = r.fromDate;
    const bool inside = nama::datefilter::DateFilter::isInRange(r.fromDate, r);

    nama::period::FiscalPeriod p;
    p.id = "2024-Q1";
    p.name = "Q1 2024";
    p.startDate = "2024-01-01";
    p.endDate = "2024-03-31";
    p.status = nama::period::PeriodStatus::Open;
    p.year = 2024;

    nama::period::FiscalPeriodBook book;
    book.add(p);
    book.closePeriod(p.id);

    return (inside && !book.empty()) ? 0 : 1;
}
