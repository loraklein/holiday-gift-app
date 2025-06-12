// Calculate days between two dates
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Calculate days until a future date, or days since if past
export function daysUntil(targetDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Get the next occurrence of Mother's Day (2nd Sunday in May)
export function getNextMothersDay(): Date {
  const currentYear = new Date().getFullYear();
  let year = currentYear;
  
  // Try current year first, then next year if it's passed
  for (let i = 0; i < 2; i++) {
    const may = new Date(year, 4, 1); // May 1st
    const firstSunday = new Date(may);
    firstSunday.setDate(1 + (7 - may.getDay()) % 7); // First Sunday
    
    const mothersDay = new Date(firstSunday);
    mothersDay.setDate(firstSunday.getDate() + 7); // Second Sunday
    
    // If it's in the future (or today), return it
    if (mothersDay >= new Date()) {
      return mothersDay;
    }
    
    year++; // Try next year
  }
  
  // Fallback (shouldn't happen)
  return new Date(currentYear + 1, 4, 8); // Roughly 2nd Sunday
}

// Get the next occurrence of Father's Day (3rd Sunday in June)
export function getNextFathersDay(): Date {
  const currentYear = new Date().getFullYear();
  let year = currentYear;
  
  // Try current year first, then next year if it's passed
  for (let i = 0; i < 2; i++) {
    const june = new Date(year, 5, 1); // June 1st
    const firstSunday = new Date(june);
    firstSunday.setDate(1 + (7 - june.getDay()) % 7); // First Sunday
    
    const fathersDay = new Date(firstSunday);
    fathersDay.setDate(firstSunday.getDate() + 14); // Third Sunday
    
    // If it's in the future (or today), return it
    if (fathersDay >= new Date()) {
      return fathersDay;
    }
    
    year++; // Try next year
  }
  
  // Fallback (shouldn't happen)
  return new Date(currentYear + 1, 5, 15); // Roughly 3rd Sunday
}

// Format date as readable string
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}