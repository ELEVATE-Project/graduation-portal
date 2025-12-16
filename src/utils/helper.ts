export function applyFilters(data: any[], filters: Record<string, any>): any[] {
  return data.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];

      // Ignore empty filters
      if (
        filterValue === undefined ||
        filterValue === null ||
        filterValue === "" ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        return true;
      }

      // ARRAY filter → OR logic
      if (Array.isArray(filterValue)) {
        // string comparison (case-insensitive)
        if (typeof itemValue === "string") {
          return filterValue
            .map(v => v.toLowerCase())
            .includes(itemValue.toLowerCase());
        }
        return filterValue.includes(itemValue);
      }

      // STRING filter → exact match for status field, partial match for others (case-insensitive)
      if (typeof filterValue === "string") {
        // Use exact match for status field to avoid partial matches (e.g., "Onboarded" matching "Not Onboarded")
        if (key === 'status') {
          return String(itemValue).toLowerCase() === filterValue.toLowerCase();
        }
        // Partial match for other string fields (e.g., search)
        return String(itemValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }

      // DEFAULT → exact match (boolean, number, etc.)
      return itemValue === filterValue;
    });
  });
}

