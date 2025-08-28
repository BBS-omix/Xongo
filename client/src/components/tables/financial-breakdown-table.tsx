import { usePresentationContext } from '@/contexts/presentation-context';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';

type Row = {
  month: string;
  revenue: number;
  expenses: number;
  pilots?: number;
  customers?: number;
};

export function FinancialBreakdownTable() {
  const { language, complexity, creatorMode } = usePresentationContext();

  // formatting helpers
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
  const disp = (n: number) => (n === 0 ? '–' : fmt(n)); // show "–" instead of "$0"
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  const [tableTitle, setTableTitle] = useState({
    en: '24-Month Financial Projection',
    tr: '24 Ay Finansal Projeksiyon',
  });
  const [tableSubtitle, setTableSubtitle] = useState({
    en: 'Monthly breakdown of revenue, expenses, investor funding and customer metrics',
    tr: 'Gelir, gider, yatırımcı fonu ve müşteri ölçütlerinin aylık dağılımı',
  });

  // Base rows (investor is derived below)
  const [monthlyData, setMonthlyData] = useState<Row[]>([
    { month: 'Sep-25', revenue: 0,      expenses: 315000, pilots: 0, customers: 0 },
    { month: 'Oct-25', revenue: 0,      expenses: 30000,  pilots: 2, customers: 0 },
    { month: 'Nov-25', revenue: 0,      expenses: 40500,  pilots: 4, customers: 0 },
    { month: 'Dec-25', revenue: 0,      expenses: 40500,  pilots: 4, customers: 0 },
    { month: 'Jan-26', revenue: 0,      expenses: 40500,  pilots: 4, customers: 0 },
    { month: 'Feb-26', revenue: 0,      expenses: 40500,  pilots: 4, customers: 0 },
    { month: 'Mar-26', revenue: 0,      expenses: 40500,  pilots: 4, customers: 0 },
    { month: 'Apr-26', revenue: 0,      expenses: 40500,  pilots: 4, customers: 0 },
    { month: 'May-26', revenue: 22000,  expenses: 55000,  pilots: 1, customers: 3 },
    { month: 'Jun-26', revenue: 22000,  expenses: 50000,  pilots: 1, customers: 3 },
    { month: 'Jul-26', revenue: 22000,  expenses: 50000,  pilots: 1, customers: 3 },
    { month: 'Aug-26', revenue: 22000,  expenses: 50000,  pilots: 0, customers: 3 },

    { month: 'Sep-26', revenue: 45600,  expenses: 50000,  pilots: 0, customers: 4 },
    { month: 'Oct-26', revenue: 64500,  expenses: 76000,  pilots: 0, customers: 9 },
    { month: 'Nov-26', revenue: 126700, expenses: 76000,  pilots: 0, customers: 17 },
    { month: 'Dec-26', revenue: 199500, expenses: 76000,  pilots: 0, customers: 28 },
    { month: 'Jan-27', revenue: 220700, expenses: 76000,  pilots: 0, customers: 34 },
    { month: 'Feb-27', revenue: 220700, expenses: 76000,  pilots: 1, customers: 34 },
    { month: 'Mar-27', revenue: 264000, expenses: 76000,  pilots: 1, customers: 37 },
    { month: 'Apr-27', revenue: 272300, expenses: 76000,  pilots: 3, customers: 39 },
    { month: 'Jun-27', revenue: 274600, expenses: 76000,  pilots: 4, customers: 40 },
    { month: 'Jul-27', revenue: 282900, expenses: 76000,  pilots: 4, customers: 42 },
    { month: 'Aug-27', revenue: 328500, expenses: 76000,  pilots: 4, customers: 46 },
  ]);

  // ---- Investor allocation (no negatives, total = $750,000) -----------------
  // Rule: Investor pays monthly expenses until the cap is exhausted.
  // In this dataset, after paying through Jul-26 we reach $743k,
  // so Aug-26 investor pays only the remaining $7k, then Sep-26 is $0.
  const INVESTOR_CAP = 750_000;
  const CAP_WINDOW_END = 'Aug-26'; // Year-1 subtotal end (inclusive)

  const derivedRows = useMemo(() => {
    let remaining = INVESTOR_CAP;
    const endIndex = monthlyData.findIndex(r => r.month === CAP_WINDOW_END);

    let cum = 0;
    return monthlyData.map((r, i) => {
      const withinWindow = endIndex >= 0 ? i <= endIndex : true;
      const investor = withinWindow && remaining > 0 ? Math.min(r.expenses, remaining) : 0;
      remaining -= investor;
      cum += r.revenue - r.expenses + investor;

      return { ...r, investor, cumulative: cum } as Row & {
        investor: number;
        cumulative: number;
      };
    });
  }, [monthlyData]);

  // ---- Totals ---------------------------------------------------------------
  const capIndex = useMemo(() => derivedRows.findIndex(r => r.month === CAP_WINDOW_END), [derivedRows]);

  // Year-1 slice → Sep-25 .. Sep-26
  const year1Slice = useMemo(
    () => (capIndex >= 0 ? derivedRows.slice(0, capIndex + 1) : derivedRows.slice(0, 13)),
    [derivedRows, capIndex]
  );

  // Show Year-1 "Expenses" as the funded portion (== 750k), per requirement.
  const year1Totals = useMemo(() => {
    const revenue = sum(year1Slice.map(m => m.revenue));
    const fundedExpenses = sum(year1Slice.map(m => m.investor)); // == $750,000
    const investor = fundedExpenses;                             // mirror
    const cumulative = year1Slice.length ? year1Slice[year1Slice.length - 1].cumulative : 0;
    const pilotsMax = Math.max(...year1Slice.map(m => m.pilots ?? 0));
    const customersEnd = year1Slice.length ? (year1Slice[year1Slice.length - 1].customers ?? 0) : 0;
    return { revenue, expenses: fundedExpenses, investor, cumulative, pilotsMax, customersEnd };
  }, [year1Slice]);

  const overallTotals = useMemo(() => ({
    revenue:     sum(derivedRows.map(m => m.revenue)),
    expenses:    sum(derivedRows.map(m => m.expenses)),     // raw expenses overall
    investor:    sum(derivedRows.map(m => m.investor)),     // = 750k
    cumulative:  derivedRows.length ? derivedRows[derivedRows.length - 1].cumulative : 0,
    pilotsMax:   Math.max(...derivedRows.map(m => m.pilots ?? 0)),
    customersEnd: derivedRows.length ? (derivedRows[derivedRows.length - 1].customers ?? 0) : 0,
  }), [derivedRows]);

  // Headers
  const headers =
    complexity === 'basic'
      ? [
          { key: 'month',      label: { en: 'Month',          tr: 'Ay' } },
          { key: 'revenue',    label: { en: 'Revenue ($K)',   tr: 'Gelir ($K)' } },
          { key: 'expenses',   label: { en: 'Expenses ($K)',  tr: 'Giderler ($K)' } },
          { key: 'investor',   label: { en: 'Investor ($K)',  tr: 'Yatırımcı ($K)' } },
          { key: 'cumulative', label: { en: 'Total ($K)',     tr: 'Toplam ($K)' } },
        ]
      : [
          { key: 'month',      label: { en: 'Month',             tr: 'Ay' } },
          { key: 'revenue',    label: { en: 'Revenue ($K)',      tr: 'Gelir ($K)' } },
          { key: 'expenses',   label: { en: 'Expenses ($K)',     tr: 'Giderler ($K)' } },
          { key: 'investor',   label: { en: 'Investor ($K)',     tr: 'Yatırımcı ($K)' } },
          { key: 'cumulative', label: { en: 'Cumulative ($K)',   tr: 'Kümülatif ($K)' } },
          { key: 'pilots',     label: { en: 'Active Pilots',     tr: 'Aktif Pilotlar' } },
          { key: 'customers',  label: { en: 'Paid Customers',    tr: 'Ücretli Müşteriler' } },
        ];

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      {/* Editors */}
      {creatorMode && (
        <>
          <ContentEditor
            title="Table Header"
            data={[{ id: 'table_header', title: tableTitle, subtitle: tableSubtitle }]}
            onSave={(d) => {
              setTableTitle(d[0].title);
              setTableSubtitle(d[0].subtitle);
            }}
            className="absolute top-2 right-2 z-20"
            type="text"
            fields={[
              { key: 'title', label: 'Table Title', type: 'text', multilingual: true },
              { key: 'subtitle', label: 'Table Subtitle', type: 'textarea', multilingual: true },
            ]}
          />
          {/* Investor is derived; editor excludes it to keep the rule intact */}
          <ContentEditor
            title="Monthly Data"
            data={monthlyData}
            onSave={setMonthlyData}
            className="absolute top-2 left-2 z-20"
            type="table"
            fields={[
              { key: 'month', label: 'Month', type: 'text' },
              { key: 'revenue', label: 'Revenue', type: 'number' },
              { key: 'expenses', label: 'Expenses', type: 'number' },
              { key: 'pilots', label: 'Pilots', type: 'number' },
              { key: 'customers', label: 'Customers', type: 'number' },
            ]}
          />
        </>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">{tableTitle[language]}</h3>
        <p className="text-blue-100 text-sm">{tableSubtitle[language]}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 ${
                    index === 0 ? 'bg-gray-50' : ''
                  } text-center`}
                >
                  {header.label[language]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {derivedRows.map((row: any, rowIndex: number) => {
              const cumClass =
                row.cumulative === 0
                  ? 'text-gray-600 font-semibold'
                  : row.cumulative < 0
                  ? 'text-red-600 font-semibold'
                  : 'text-green-600 font-semibold';

              const revenueClass =
                row.revenue > 0 ? 'text-green-600 font-semibold' : 'text-gray-400';

              const investorClass =
                row.investor > 0 ? 'text-blue-600 font-semibold' : 'text-gray-400';

              return (
                <tr
                  key={row.month}
                  className={`border-b border-gray-200 hover:bg-blue-50 ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200 text-center">
                    {row.month}
                  </td>

                  <td className={`px-4 py-3 border-r border-gray-200 text-center ${revenueClass}`}>
                    {disp(row.revenue)}
                  </td>

                  <td className="px-4 py-3 text-center text-red-600 font-semibold border-r border-gray-200">
                    {disp(row.expenses)}
                  </td>

                  <td className={`px-4 py-3 text-center border-r border-gray-200 ${investorClass}`}>
                    {disp(row.investor)}
                  </td>

                  <td className={`px-4 py-3 text-center ${cumClass} ${complexity === 'basic' ? '' : 'border-r border-gray-200'}`}>
                    {disp(row.cumulative)}
                  </td>

                  {complexity === 'advanced' && (
                    <>
                      <td className="px-4 py-3 text-center text-blue-600 font-medium border-r border-gray-200">
                        {row.pilots ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center text-purple-600 font-semibold">
                        {row.customers ?? 0}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>

          {/* Totals */}
          <tfoot className="bg-blue-100 border-t-2 border-blue-200">
            {/* Year 1 subtotal (Sep-25 → Sep-26). Expenses shown as funded portion (= 750k). */}
            <tr>
              <td className="px-4 py-3 font-bold text-gray-900 bg-blue-50 border-r border-blue-200 text-center">
                {language === 'en' ? 'Year 1 (Sep-25 → Sep-26)' : '1. Yıl (Eyl-25 → Eyl-26)'}
              </td>
              <td className="px-4 py-3 font-bold text-green-700 border-r border-blue-200 text-center">
                {disp(year1Totals.revenue)}
              </td>
              <td className="px-4 py-3 font-bold text-red-700 border-r border-blue-200 text-center">
                {disp(year1Totals.expenses)} {/* shown = funded = $750,000 */}
              </td>
              <td className="px-4 py-3 font-bold text-blue-700 border-r border-blue-200 text-center">
                {disp(year1Totals.investor)}   {/* = $750,000 */}
              </td>
              <td
                className={`px-4 py-3 font-bold text-center ${
                  year1Totals.cumulative === 0
                    ? 'text-gray-700'
                    : year1Totals.cumulative < 0
                    ? 'text-red-700'
                    : 'text-green-700'
                } ${complexity === 'basic' ? '' : 'border-r border-blue-200'}`}
              >
                {disp(year1Totals.cumulative)}
              </td>
              {complexity === 'advanced' && (
                <>
                  <td className="px-4 py-3 text-center font-bold text-blue-700 border-r border-blue-200">
                    {year1Totals.pilotsMax}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-purple-700">
                    {year1Totals.customersEnd}
                  </td>
                </>
              )}
            </tr>

            {/* Overall totals */}
            <tr>
              <td className="px-4 py-3 font-bold text-gray-900 bg-blue-50 border-r border-blue-200 text-center">
                {language === 'en' ? 'Overall Total' : 'Genel Toplam'}
              </td>
              <td className="px-4 py-3 font-bold text-green-700 border-r border-blue-200 text-center">
                {disp(overallTotals.revenue)}
              </td>
              <td className="px-4 py-3 font-bold text-red-700 border-r border-blue-200 text-center">
                {disp(overallTotals.expenses)}  {/* raw total */}
              </td>
              <td className="px-4 py-3 font-bold text-blue-700 border-r border-blue-200 text-center">
                {disp(overallTotals.investor)}  {/* = 750,000 */}
              </td>
              <td
                className={`px-4 py-3 font-bold text-center ${
                  overallTotals.cumulative === 0
                    ? 'text-gray-700'
                    : overallTotals.cumulative < 0
                    ? 'text-red-700'
                    : 'text-green-700'
                } ${complexity === 'basic' ? '' : 'border-r border-blue-200'}`}
              >
                {disp(overallTotals.cumulative)}
              </td>
              {complexity === 'advanced' && (
                <>
                  <td className="px-4 py-3 text-center font-bold text-blue-700 border-r border-blue-200">
                    {overallTotals.pilotsMax}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-purple-700">
                    {overallTotals.customersEnd}
                  </td>
                </>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {language === 'en'
              ? `Investor funding allocated month-by-month (no negatives). Total by Sep-26: ${disp(750000)}.`
              : `Yatırımcı fonu aylık olarak tahsis edildi (negatif yok). Eyl-26 itibarıyla toplam: ${disp(750000)}.`}
          </span>
          <span className="font-semibold text-blue-600">
            {language === 'en' ? 'First revenue: Month 9 (May 2026)' : 'İlk gelir: 9. ay (Mayıs 2026)'}
          </span>
        </div>
      </div>
    </Card>
  );
}
