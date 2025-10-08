import React from 'react';

// --- UI/UX IMPROVEMENT: Badge component with slightly more padding and refined styles ---
export const Badge = ({ children, className }) => (
  <span 
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

// --- SVG Icons for Action Buttons ---
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const ResumeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;


// --- CampaignRow Component ---
export function CampaignRow({ c, onView, onEdit, onToggle }) {
  // Calculate Click-Through Rate (CTR) safely
  const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00";
  
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      {/* --- UI/UX IMPROVEMENT: Name is now the primary clickable element to view details --- */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        <a onClick={() => onView(c)} className="hover:text-gray-600 cursor-pointer">
          {c.name}
        </a>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium capitalize text-gray-800">{c.targeting_type}</div>
        <div className="text-xs text-gray-500 max-w-[200px] truncate" title={c.targeting_value.join(", ")}>
          {c.targeting_value.join(", ")}
        </div>
      </td>
      <td className="px-4 py-3">
        {c.status === "active" ? (
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        ) : c.status === "paused" ? (
          <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-700">Expired</Badge>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{formatDate(c.start_date)}</td>
      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{formatDate(c.end_date)}</td>
      
      {/* --- UI/UX IMPROVEMENT: Re-introduced key performance metrics, right-aligned for readability --- */}
      <td className="px-4 py-3 text-sm text-gray-800 font-medium text-right">
        ₹{c.total_budget ? c.total_budget.toLocaleString('en-IN') : '0'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right">{c.impressions?.toLocaleString('en-IN') || '0'}</td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right">{c.clicks?.toLocaleString('en-IN') || '0'}</td>
      <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{ctr}%</td>
      
      {/* --- UI/UX IMPROVEMENT: Redesigned action buttons with icons and better visual hierarchy --- */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
            <button
              onClick={() => onView(c)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
              title="View Details"
            >
              <ViewIcon />
            </button>
            <button
              onClick={() => onEdit(c)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
              title="Edit Campaign"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => onToggle(c)}
              className={`p-1.5 rounded-full transition-colors ${c.status === "active" ? "text-yellow-600 hover:bg-yellow-100" : "text-green-600 hover:bg-green-100"}`}
              title={c.status === "active" ? "Pause Campaign" : "Resume Campaign"}
            >
              {c.status === "active" ? <PauseIcon /> : <ResumeIcon />}
            </button>
        </div>
      </td>
    </tr>
  );
}

// --- CampaignTable Component ---
export default function CampaignTable({ campaigns, onView, onEdit, onToggle }) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* --- UI/UX IMPROVEMENT: Headers updated to reflect new columns --- */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Targeting</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Impr.</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Clicks</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">CTR</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((c) => (
                <CampaignRow key={c.campaign_id} c={c} onView={onView} onEdit={onEdit} onToggle={onToggle} />
              ))
            ) : (
              // --- UI/UX IMPROVEMENT: Visually richer empty state ---
              <tr>
                <td colSpan="10" className="px-4 py-16 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Campaigns Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new campaign.
                    </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}