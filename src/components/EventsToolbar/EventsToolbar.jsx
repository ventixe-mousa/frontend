// src/components/EventsToolbar/EventsToolbar.jsx
import React, { useState } from 'react';
import './EventsToolbar.css';
import FilterIcon from '../../assets/filterlogo.png';
import GridIcon   from '../../assets/gridview.png';
import ListIcon   from '../../assets/listview.png';
import SearchIcon from '../../assets/search-logo.png';

// Definition av våra tre tabs
const tabDefs = [
  { key: 'active', label: 'Active' },
  { key: 'draft',  label: 'Draft' },
  { key: 'past',   label: 'Past' },
];

export default function EventsToolbar({
  activeTab,
  counts = { active: 0, draft: 0, past: 0 },
  onTabChange,
  onSearch,
  onFilter,
  onCategoryChange,
  onDateChange,
  onViewToggle
}) {
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="events-toolbar">
      {/* 1) Tabs med räknare */}
      <div className="events-toolbar__tabs">
        {tabDefs.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'tab--active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {`${tab.label} (${counts[tab.key] ?? 0})`}
          </button>
        ))}
      </div>

      {/* 2) Search */}
      <div className="events-toolbar__search">
        <img src={SearchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search event, location, etc"
          value={searchText}
          onChange={e => {
            const txt = e.target.value;
            setSearchText(txt);
            onSearch?.(txt);
          }}
        />
      </div>

      {/* 3) Filter + dropdowns */}
      <div className="events-toolbar__actions">
        <button className="btn-icon" onClick={onFilter}>
          <img src={FilterIcon} alt="Filter" />
        </button>

        <select onChange={e => onCategoryChange?.(e.target.value)}>
          <option>All Category</option>
          <option>Music</option>
          <option>Sport</option>
          <option>Fashion</option>
          <option>Art & Design</option>
        </select>

        <select onChange={e => onDateChange?.(e.target.value)}>
          <option>This Month</option>
          <option>Last Month</option>
          <option>Next Month</option>
        </select>

        {/* 4) View toggle */}
        <button
          className="btn-icon"
          onClick={() => {
            const next = viewMode === 'grid' ? 'list' : 'grid';
            setViewMode(next);
            onViewToggle?.(next);
          }}
        >
          <img src={viewMode === 'grid' ? ListIcon : GridIcon} alt="Toggle view" />
        </button>
      </div>
    </div>
  );
}
