"use client";

import { useParams } from "next/navigation";
import { usePerson } from "@/hooks/useApi";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

export default function PersonDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: person, isLoading, error } = usePerson(id);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading person...</div>;
  }

  if (error || !person) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Person not found</h2>
        <p>Sorry, we couldn't find that person.</p>
        <Link href="/people" className="text-blue-600 hover:underline mt-4 block">&larr; Back to People</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <Link href="/people" className="text-blue-600 hover:underline">&larr; Back to People</Link>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{person.name}</h1>
      </div>
      {person.birthday && (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} />
          {new Date(person.birthday).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </div>
      )}
      {person.email && (
        <div className="text-gray-700">
          <span className="font-semibold">Email:</span> {person.email}
        </div>
      )}
      {person.relationship && (
        <div className="text-gray-700">
          <span className="font-semibold">Relationship:</span> {person.relationship}
        </div>
      )}
      {person.notes && (
        <div className="text-gray-700">
          <span className="font-semibold">Notes:</span> {person.notes}
        </div>
      )}
    </div>
  );
} 