/**
 * Breadcrumb Component Types
 * Type definitions for the Breadcrumb component
 */

export interface BreadcrumbItem {
  id: string;                    // Unique identifier
  label: string;                 // Display text or translation key
  labelKey?: string;            // Translation key (if using i18n)
  path?: string;                // URL path (for URL-based navigation)
  data?: any;                    // Custom data for state-based navigation
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];      // Array of breadcrumb items
  onItemClick?: (item: BreadcrumbItem, index: number) => void; // Click handler
  showBackArrow?: boolean;      // Show back arrow (default: true)
  onBackClick?: () => void;      // Back arrow click handler
  separator?: string;            // Separator between items (default: '/')
  maxItems?: number;            // Max items to show (with ellipsis)
  className?: string;            // Additional styling
}
