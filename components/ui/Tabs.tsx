"use client";

import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || "");
  const active = activeTab ?? internalActive;

  const handleTabChange = (tabId: string) => {
    setInternalActive(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className={`border-b border-border ${className}`}>
      <nav className="-mb-px flex gap-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground hover:border-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
