import Checkbox from "../shared/Checkbox";
import Input from "../shared/Input";
import Select from "../shared/Select";
import { NAMIBIA_LOCATIONS } from "@/data/namibiaLocations";
import { DEMO_CATEGORIES } from "@/data/taxonomies";
import { useState } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const businessSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const services = [
  "Restaurant", "Hotel", "Retail", "Finance", "Transport", "Education", "Health", "IT", "Consulting", "Other"
];

const ratings = [
  { label: "Any", value: "any" },
  { label: "4+ stars", value: "4" },
  { label: "3+ stars", value: "3" },
  { label: "2+ stars", value: "2" },
];

const BusinessSidebarFilters = ({ onFilter, selectedCategory }: { onFilter?: (filters: any) => void, selectedCategory: string }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    search: true,
    category: true,
    location: false,
    size: false,
    services: false,
    rating: false,
    checkboxes: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ 
    id, 
    title, 
    icon, 
    children, 
    defaultOpen = false 
  }: { 
    id: string; 
    title: string; 
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const isExpanded = expandedSections[id] !== undefined ? expandedSections[id] : defaultOpen;

    return (
      <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-4 px-1 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-neutral-600 dark:text-neutral-400">
              {icon}
            </div>
            <h4 className="font-semibold text-neutral-900 dark:text-white text-left">
              {title}
            </h4>
          </div>
          <ChevronDownIcon 
            className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isExpanded && (
          <div className="pb-4 px-1 space-y-3">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 space-y-0">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <MagnifyingGlassIcon className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
          Search & Filter
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Find the perfect business</p>
      </div>

      {/* Search - Always Expanded */}
      <FilterSection 
        id="search" 
        title="Search by Name" 
        icon={<MagnifyingGlassIcon className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          <Input 
            placeholder="Type a business name..." 
            className="pl-10"
          />
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection 
        id="category" 
        title="Category" 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        }
        defaultOpen={true}
      >
        <Select className="w-full">
          <option value="">All categories</option>
          {DEMO_CATEGORIES.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </Select>
      </FilterSection>

      {/* Location */}
      <FilterSection 
        id="location" 
        title="Location" 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <Select className="w-full">
          <option value="">All locations</option>
          {NAMIBIA_LOCATIONS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
      </FilterSection>

      {/* Business Size */}
      <FilterSection 
        id="size" 
        title="Business Size" 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      >
        <Select className="w-full">
          <option value="">Any size</option>
          {businessSizes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </FilterSection>

      {/* Services */}
      <FilterSection 
        id="services" 
        title="Services Offered" 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <Select className="w-full">
          <option value="">Any service</option>
          {services.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </FilterSection>

      {/* Rating */}
      <FilterSection 
        id="rating" 
        title="Minimum Rating" 
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        }
      >
        <Select className="w-full">
          {ratings.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </Select>
      </FilterSection>

      {/* Checkboxes */}
      <FilterSection 
        id="checkboxes" 
        title="Additional Filters" 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      >
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              name="openNow" 
              className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-burgundy-600 focus:ring-burgundy-600 cursor-pointer"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Show only open businesses
            </span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              name="hasWebsite" 
              className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-burgundy-600 focus:ring-burgundy-600 cursor-pointer"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Show only businesses with website
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Reset Button */}
      <button className="w-full mt-6 py-3 px-4 rounded-lg border-2 border-burgundy-600 text-burgundy-600 dark:text-burgundy-400 dark:border-burgundy-400 font-semibold hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-all">
        Reset All Filters
      </button>
    </aside>
  );
};

export default BusinessSidebarFilters;
