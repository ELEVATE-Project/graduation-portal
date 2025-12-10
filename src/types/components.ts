import { ReactNode } from 'react';
export interface FeatureCardData {
  id?: string;
  color: string;
  icon: string; // Updated to accept any Lucide icon name
  title: string;
  description: string;
  navigationUrl?: string;
  isDisabled?: boolean;
  pressableActionText?: string;
}

export interface FeatureCardProps {
  card: FeatureCardData;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchText: string) => void;
  debounceMs?: number;
  defaultValue?: string;
}

export interface TabData {
  key: string;
  label: string;
  isDisabled?: boolean;
  icon?: string; // Optional Lucide icon name
}

export interface TabButtonProps {
  tab: TabData;
  isActive: boolean;
  onPress: (tabKey: string) => void;
  variant?: 'default' | 'ButtonTab'; // Variant to control styling
}

export interface ColumnDef<T> {
  key: string;
  label: string;
  flex?: number;
  width?: number;
  render?: (item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  onActionClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  showActions?: boolean;
  getRowKey: (item: T) => string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'confirmation' | 'profile'; // Variant type: confirmation (default) or profile
  // Confirmation variant props
  onConfirm?: (inputValue?: string) => void;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  confirmButtonVariant?: 'solid' | 'outline' | 'link';
  headerIcon?: ReactNode;
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputHint?: string;
  inputRequired?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  // Common props
  title: string;
  subtitle?: string; // Used in profile variant
  maxWidth?: number;
  // Profile variant props
  profile?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  onAddressEdit?: () => void; // Used in profile variant
  // Address edit mode props
  isEditingAddress?: boolean;
  editedAddress?: {
    street: string;
    province: string;
    site: string;
  };
  onAddressChange?: (field: 'street' | 'province' | 'site', value: string) => void;
  onSaveAddress?: () => void;
  onCancelEdit?: () => void;
  isSavingAddress?: boolean;
  // Optional custom props for enhanced modal layouts (backward compatible)
  customBody?: ReactNode;
  isConfirmDisabled?: boolean;
  footerButtonsDirection?: 'horizontal' | 'vertical';
  headerLayout?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
}

export type ToastPlacement =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left';

export interface AlertOptions {
  variant?: 'solid' | 'outline' | 'accent';
  placement?: ToastPlacement;
  duration?: number;
}
