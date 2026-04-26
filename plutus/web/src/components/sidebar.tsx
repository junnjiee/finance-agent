import { LayoutDashboard, Receipt, Clock, TrendingUp, PieChart, Settings } from "lucide-react";

const NAV_ITEMS = [
  { section: "Overview", items: [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Receipt, label: "Expenses", active: false },
    { icon: Clock, label: "Recurring", active: false },
  ]},
  { section: "Analysis", items: [
    { icon: TrendingUp, label: "Trends", active: false },
    { icon: PieChart, label: "Categories", active: false },
  ]},
  { section: "Settings", items: [
    { icon: Settings, label: "Preferences", active: false },
  ]},
];

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-sidebar border-r border-sidebar-border p-6 flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-[590] text-primary-foreground">
          ₱
        </div>
        <span className="text-lg font-[590] text-foreground tracking-[-0.02em]">Plutus</span>
      </div>

      {NAV_ITEMS.map((section) => (
        <div key={section.section} className="mb-4">
          <div className="text-[0.6875rem] font-[510] uppercase tracking-[0.06em] text-muted-foreground mb-2 mt-4 first:mt-0">
            {section.section}
          </div>
          {section.items.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-[0.8125rem] transition-colors mb-0.5 ${
                item.active
                  ? "bg-accent text-accent-foreground font-[510]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 opacity-60" />
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}
