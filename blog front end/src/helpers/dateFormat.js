const formatDate = (isoString) => {
  const date = new Date(isoString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',    // e.g., "Jan"
    day: 'numeric',    // e.g., "15"
    year: 'numeric',   // e.g., "2023"
    hour: '2-digit',   // e.g., "03"
    minute: '2-digit', // e.g., "45"
    hour12: true       // AM/PM format
  }).format(date);
  
  // Example output: "Jan 15, 2023, 03:45 PM"
};
export default formatDate;