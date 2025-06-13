"use client";

import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGiftIdeas,
  useCreateGiftIdea,
  useUpdateGiftIdea,
  usePatchGiftIdea,
  useDeleteGiftIdea,
  usePeople,
  useEvents,
} from "@/hooks/useApi";
import { GiftIdea } from "@/lib/api";
import GiftIdeasPageHeader from "@/components/gift-ideas/GiftIdeasPageHeader";
import GiftIdeasList from "@/components/gift-ideas/GiftIdeasList";
import AddGiftIdeaForm from "@/components/gift-ideas/AddGiftIdeaForm";
import EditGiftIdeaForm from "@/components/gift-ideas/EditGiftIdeaForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function GiftIdeasPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [giftIdeaToEdit, setGiftIdeaToEdit] = useState<GiftIdea | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [personFilter, setPersonFilter] = useState<string>("all");
  const [giftIdeaToDelete, setGiftIdeaToDelete] = useState<GiftIdea | null>(null);

  const { data: giftIdeas = [], isLoading, error } = useGiftIdeas();
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const createGiftIdeaMutation = useCreateGiftIdea();
  const updateGiftIdeaMutation = useUpdateGiftIdea();
  const patchGiftIdeaMutation = usePatchGiftIdea();
  const deleteGiftIdeaMutation = useDeleteGiftIdea();

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPersonFilter('all');
  };
  
  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || personFilter !== 'all';

  const filteredGiftIdeas = useMemo(() => {
    let result = giftIdeas;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(giftIdea =>
        giftIdea.idea.toLowerCase().includes(query) ||
        giftIdea.description?.toLowerCase().includes(query) ||
        people.find(p => p.id === giftIdea.person_id)?.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(giftIdea => giftIdea.status === statusFilter);
    }

    if (personFilter !== "all") {
      result = result.filter(giftIdea => giftIdea.person_id === Number(personFilter));
    }

    return result.slice().sort((a, b) => b.id - a.id);
  }, [giftIdeas, searchQuery, statusFilter, personFilter, people]);

  const handleAddGiftIdea = async (
    giftIdeaData: Omit<GiftIdea, "id" | "created_at" | "updated_at">
  ) => {
    try {
      await createGiftIdeaMutation.mutateAsync(giftIdeaData);
      setShowAddForm(false);
      toast.success("Gift idea added successfully!");
    } catch (error) {
      toast.error("Failed to add gift idea. Please try again.");
      console.error("Error creating gift idea:", error);
    }
  };

  const handleEditGiftIdea = (giftIdea: GiftIdea) => {
    setGiftIdeaToEdit(giftIdea);
  };

  const handleUpdateGiftIdea = async (id: number, giftIdeaData: Partial<GiftIdea>) => {
    try {
      await updateGiftIdeaMutation.mutateAsync({ id, ...giftIdeaData });
      setGiftIdeaToEdit(null);
      toast.success("Gift idea updated successfully!");
    } catch (error) {
      toast.error("Failed to update gift idea. Please try again.");
      console.error("Error updating gift idea:", error);
    }
  };

  const handleQuickStatusUpdate = async (id: number, status: GiftIdea['status']) => {
    try {
      await patchGiftIdeaMutation.mutateAsync({ id, status });
      toast.success(`Status updated to ${status}!`);
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteGiftIdea = (id: number) => {
    const giftIdea = giftIdeas.find((gi) => gi.id === id);
    if (!giftIdea) return;
    setGiftIdeaToDelete(giftIdea);
  };

  const confirmDelete = async () => {
    if (!giftIdeaToDelete) return;
    try {
      await deleteGiftIdeaMutation.mutateAsync(giftIdeaToDelete.id);
      toast.success("Gift idea deleted successfully.");
      setGiftIdeaToDelete(null);
    } catch (error) {
      toast.error("Failed to delete gift idea. Please try again.");
      console.error("Error deleting gift idea:", error);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <GiftIdeasPageHeader
          onAddClick={() => setShowAddForm(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          personFilter={personFilter}
          onPersonFilterChange={setPersonFilter}
          people={people}
          onClearFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load gift ideas</h3>
          <p className="text-gray-600 mb-4">There was an error loading your gift ideas. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GiftIdeasPageHeader
        onAddClick={() => setShowAddForm(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        personFilter={personFilter}
        onPersonFilterChange={setPersonFilter}
        people={people}
        onClearFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <GiftIdeasList
        giftIdeas={filteredGiftIdeas}
        people={people}
        events={events}
        onEdit={handleEditGiftIdea}
        onDelete={handleDeleteGiftIdea}
        onStatusUpdate={handleQuickStatusUpdate}
        isLoading={isLoading}
      />

      {showAddForm && (
        <AddGiftIdeaForm
          people={people}
          events={events}
          onSubmit={handleAddGiftIdea}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={createGiftIdeaMutation.isPending}
        />
      )}

      {giftIdeaToEdit && (
        <EditGiftIdeaForm
          giftIdea={giftIdeaToEdit}
          people={people}
          events={events}
          onSubmit={handleUpdateGiftIdea}
          onCancel={() => setGiftIdeaToEdit(null)}
          isSubmitting={updateGiftIdeaMutation.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={!!giftIdeaToDelete}
        title="Delete Gift Idea"
        message={`Are you sure you want to delete "${giftIdeaToDelete?.idea}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setGiftIdeaToDelete(null)}
        isLoading={deleteGiftIdeaMutation.isPending}
      />
    </div>
  );
}