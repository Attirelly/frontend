"use client";
import AddCampaignModal from "@/components/sponsor_dashboard/AddCampaignModal";
import CampaignModal, {
  KPIBox,
} from "@/components/sponsor_dashboard/CampaignModal";
import CampaignTable from "@/components/sponsor_dashboard/CampaignTable";
import Filters from "@/components/sponsor_dashboard/Filters";
import TopBar from "@/components/sponsor_dashboard/TopBar";
import { api } from "@/lib/axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- (API Helper and other functions remain the same) ---
const fetchCampaignsApi = async () => {
  try {
    const response = await api.get("/sponsored/campaigns/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    throw new Error("Could not load campaigns from server.");
  }
};


export default function CampaignDashboardPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState({ q: "", status: "", type: "" });
  const [loading, setLoading] = useState(true);

  const [openCampaign, setOpenCampaign] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  
  // --- 1. STATE CHANGE: Add state to hold the campaign being edited ---
  const [editingCampaign, setEditingCampaign] = useState(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCampaignsApi();
      setCampaigns(data);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const filtered = campaigns.filter((c) => {
    if (filters.status && c.status !== filters.status) return false;
    if (filters.type && c.targeting_type !== filters.type) return false;
    if (filters.q && !c.name.toLowerCase().includes(filters.q.toLowerCase()))
      return false;
    return true;
  });
  
  // --- 2. LOGIC CHANGE: Centralize modal closing logic ---
  function handleCloseModal() {
    setOpenCreate(false);
    setEditingCampaign(null); // Clear editing state on close
  }

  async function handleCreate(payload) {
    setLoading(true);
    try {
      const result = await api.post("/sponsored/campaigns/", payload);
      const newCampaign = result.data;
      setCampaigns((prev) => [newCampaign, ...prev]);
      handleCloseModal();
      alert(`Campaign "${newCampaign.name}" created successfully!`);
    } catch (error) {
      console.error("Campaign creation failed:", error);
      const errorMessage = error.response?.data?.detail || "Failed to create campaign.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }
  
  // --- 3. NEW FUNCTION: Logic to handle updating a campaign ---
  async function handleUpdate(campaignId, payload) {
    setLoading(true);
    try {
      const result = await api.patch(`/sponsored/campaigns/${campaignId}`, payload);
      const updatedCampaign = result.data;
      
      // Find and update the campaign in the local state
      setCampaigns(prev => prev.map(c => 
        c.campaign_id === campaignId ? updatedCampaign : c
      ));
      
      handleCloseModal();
      alert(`Campaign "${updatedCampaign.name}" updated successfully!`);
    } catch(error) {
      console.error("Campaign update failed:", error);
      const errorMessage = error.response?.data?.detail || "Failed to update campaign.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }


  function handleView(c) {
    setOpenCampaign(c);
  }

  // --- 4. LOGIC CHANGE: handleEdit now sets the campaign data ---
  function handleEdit(c) {
    setEditingCampaign(c); // Set the campaign to be edited
    setOpenCreate(true);   // Open the modal
  }

  async function handleToggle(c) {
    const newStatus = c.status === "active" ? "paused" : "active";
    const previousCampaigns = campaigns;
    const updatedCampaigns = campaigns.map((x) =>
      x.campaign_id === c.campaign_id
        ? { ...x, status: newStatus }
        : x
    );
    setCampaigns(updatedCampaigns);
    try {
      await api.patch(`/sponsored/campaigns/${c.campaign_id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Toggle failed:", error);
      alert("Failed to change campaign status.");
      setCampaigns(previousCampaigns);
    }
  }
  
  const kpiData = useMemo(() => {
    // ... (kpi logic is unchanged)
    return { total: campaigns.length, /* ...other calcs */ };
  }, [campaigns]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopBar onAdd={() => setOpenCreate(true)} />
      <Filters filters={filters} setFilters={setFilters} />
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* ... (rest of the page JSX is unchanged) ... */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <CampaignTable
                campaigns={filtered}
                onView={handleView}
                onEdit={handleEdit}
                onToggle={handleToggle}
            />
        </div>
      </main>

      <CampaignModal
        open={!!openCampaign}
        campaign={openCampaign}
        onClose={() => setOpenCampaign(null)}
      />
      
      {/* --- 5. PROP CHANGE: Pass edit data and update handler to the modal --- */}
      <AddCampaignModal
        open={openCreate}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        campaignToEdit={editingCampaign}
      />
    </div>
  );
}