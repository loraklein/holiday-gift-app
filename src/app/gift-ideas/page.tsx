"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGiftIdeas,
  usePeople,
} from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Search, X } from "lucide-react";

export default function GiftIdeasPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [personFilter, setPersonFilter] = useState<string>("all");

  const { data: giftIdeas = [], isLoading } = useGiftIdeas();
  const { data: people = [] } = usePeople();

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPersonFilter("all");
  };

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all" || personFilter !== "all";

  const filteredGiftIdeas = useMemo(() => {
    let result = giftIdeas;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (giftIdea) =>
          giftIdea.idea.toLowerCase().includes(query) ||
          giftIdea.description?.toLowerCase().includes(query) ||
          people.find((p) => p.id === giftIdea.person_id)?.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((giftIdea) => giftIdea.status === statusFilter);
    }

    if (personFilter !== "all") {
      result = result.filter((giftIdea) => giftIdea.person_id === Number(personFilter));
    }

    return result.slice().sort((a, b) => b.id - a.id);
  }, [giftIdeas, searchQuery, statusFilter, personFilter, people]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gift Ideas
        </h1>
        <Button
          variant="primary"
          onClick={() => router.push("/gift-ideas/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Gift Idea
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search gift ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="idea">Idea</option>
                <option value="purchased">Purchased</option>
                <option value="given">Given</option>
              </select>
              <select
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All People</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  onClick={clearAllFilters}
                  className="flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredGiftIdeas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No gift ideas found
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/gift-ideas/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Gift Idea
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGiftIdeas.map((giftIdea) => {
                const person = people.find((p) => p.id === giftIdea.person_id);

                return (
                  <div
                    key={giftIdea.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                    onClick={() => router.push(`/gift-ideas/${giftIdea.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {giftIdea.idea}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          for {person?.name || "Unknown Person"}
                        </p>
                        {giftIdea.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {giftIdea.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          giftIdea.status === "given"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                            : giftIdea.status === "purchased"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {giftIdea.status.charAt(0).toUpperCase() +
                          giftIdea.status.slice(1)}
                      </span>
                    </div>
                    {giftIdea.price_range && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Price Range: {giftIdea.price_range}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}