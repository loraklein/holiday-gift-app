/**
 * Calculates the next occurrence of a yearly recurring event.
 * @param eventDate - The original event date
 * @param recurring - Whether the event is recurring
 * @returns The next occurrence date, or null if the event is not recurring
 */
export function getNextOccurrence(
  eventDate: string | null,
  recurring: boolean
): Date | null {
  if (!eventDate || !recurring) {
    return null;
  }

  const date = new Date(eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If the event date is in the future, return it
  if (date >= today) {
    return date;
  }

  // Calculate the next yearly occurrence
  const nextDate = new Date(date);
  nextDate.setFullYear(today.getFullYear());
  if (nextDate < today) {
    nextDate.setFullYear(today.getFullYear() + 1);
  }

  return nextDate;
} 