"use client";

import { useParams } from "next/navigation";
import { useEvent } from "@/hooks/useApi";
import { Calendar, Cake, PartyPopper, Heart, Smile, RefreshCw } from "lucide-react";
import Link from "next/link";

function getEventTypeIcon(event) {
  if (event.isBirthday) return <Cake size={20} className="text-pink-500" />;
  switch (event.event_type) {
    case "holiday":
      return <PartyPopper size={20} className="text-green-500" />;
    case "anniversary":
      return <Heart size={20} className="text-red-500" />;
    case "special_occasion":
      return <Smile size={20} className="text-yellow-500" />;
    default:
      return null;
  }
}

export default function EventDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: event, isLoading, error } = useEvent(id);

  const idParam = params.id;
  const isBirthday = typeof idParam === 'string' && idParam.startsWith('birthday-');

  if (isBirthday) {
    // Extract personId from idParam
    const personId = idParam.replace('birthday-', '');
    return (
      <div className="max-w-xl mx-auto p-8 space-y-6">
        <Link href="/events" className="text-blue-600 hover:underline">&larr; Back to Events</Link>
        <div className="flex items-center gap-3 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Birthday
            <Cake size={20} className="text-pink-500" />
          </h1>
        </div>
        <div className="text-gray-700">
          <span>This is a birthday event. </span>
          <Link href={`/people/${personId}`} className="text-blue-600 hover:underline">View person details</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading event...</div>;
  }

  if (error || !event) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Event not found</h2>
        <p>Sorry, we couldn&apos;t find that event.</p>
        <Link href="/events" className="text-blue-600 hover:underline mt-4 block">&larr; Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <Link href="/events" className="text-blue-600 hover:underline">&larr; Back to Events</Link>
      <div className="flex items-center gap-3 mt-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          {event.name}
          {getEventTypeIcon(event)}
          {event.recurring && <RefreshCw size={18} className="text-blue-400 ml-2" />}
        </h1>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar size={18} />
        {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </div>
      <div className="text-gray-700">
        <span className="font-semibold">Type:</span> {event.event_type}
      </div>
      {event.description && (
        <div className="text-gray-700">
          <span className="font-semibold">Description:</span> {event.description}
        </div>
      )}
    </div>
  );
} 