const TIERS = [
  { label: "Starter", range: "R100 - R499", split: "70%" },
  { label: "Growth", range: "R500 - R999", split: "75%" },
  { label: "Active", range: "R1,000 - R4,999", split: "80%" },
  { label: "Premium", range: "R5,000+", split: "85%" },
];

export function ForexTierTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gold-500/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-green-950 text-white">
              <th className="px-4 py-3 text-left font-semibold">Account tier</th>
              <th className="px-4 py-3 text-left font-semibold">Deposit range</th>
              <th className="px-4 py-3 text-left font-semibold">Your share of profits</th>
              <th className="px-4 py-3 text-left font-semibold">Example monthly range*</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier, i) => (
              <tr key={tier.label} className={i % 2 === 1 ? "bg-surface" : ""}>
                <td className="border-t border-surface-border px-4 py-3 font-medium">{tier.label}</td>
                <td className="border-t border-surface-border px-4 py-3 text-muted">{tier.range}</td>
                <td className="border-t border-surface-border px-4 py-3 font-medium">{tier.split}</td>
                <td className="border-t border-surface-border px-4 py-3 text-gold-600">-5% to +10%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-surface-border bg-surface px-4 py-2.5 text-xs text-muted">
        *Illustrative example only, not verified historical performance. You earn a share of
        realized trading profits each month - in a losing month you earn less, or nothing.
        Forex trading carries a high level of risk; you could lose some or all of your capital.
        Returns are never guaranteed.
      </p>
    </div>
  );
}
