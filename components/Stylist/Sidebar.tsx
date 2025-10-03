import type { OnboardingSection } from "@/app/stylist_signup/stylistOnboarding/page";

// Define the props for the Sidebar component
interface SidebarProps {
  sections: Omit<OnboardingSection, 'component'>[]; // Sidebar doesn't need the component part
  activeSectionIndex: number;
  onSectionClick: (index: number) => void;
}

export default function Sidebar({
  sections,
  activeSectionIndex,
  onSectionClick,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r p-6 flex flex-col">
      <header>
        <h1 className="text-3xl font-bold mb-10">Attirelly</h1>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">
          Store Profile
        </h2>
      </header>
      <nav className="flex-1">
        <ul>
          {sections.map((section, index) => {
            const isActive = index === activeSectionIndex;
            const Icon = section.icon;

            return (
              <li key={section.name} className="mb-2">
                <button
                  onClick={() => onSectionClick(index)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ease-in-out
                    ${
                      isActive
                        ? 'bg-gray-100 border border-gray-900 text-gray-900 font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{section.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto">
        <button className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100">
          Log Out
        </button>
      </div>
    </aside>
  );
}