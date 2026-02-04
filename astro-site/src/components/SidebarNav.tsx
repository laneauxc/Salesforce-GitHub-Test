import React from 'react';
import Icon from './Icon';

interface NavItem {
  icon: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  href?: string;
}

interface NavSection {
  header: string;
  items: NavItem[];
}

interface SidebarNavProps {
  sections: NavSection[];
}

export default function SidebarNav({ sections }: SidebarNavProps) {
  return (
    <div className="w-64 h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex-1 overflow-y-auto py-4">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-6 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.header}
              </h3>
            </div>
            <nav className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.href) {
                      window.location.href = item.href;
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-6 py-2 text-sm
                    transition-colors duration-150
                    ${
                      item.selected
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}
