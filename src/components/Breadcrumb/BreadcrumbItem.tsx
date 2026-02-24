import React from 'react';
import { Text, Pressable } from '@ui';
import { BreadcrumbItem as BreadcrumbItemType } from './types';
import { breadcrumbStyles } from './Styles';

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  isActive: boolean; // Is this the last/current item?
  onPress?: () => void;
  useTranslation?: boolean; // Whether to use translation
  t?: (key: string) => string; // Translation function
}

/**
 * Individual Breadcrumb Item Component
 * Renders a single breadcrumb item with click handling
 */
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  item,
  isActive,
  onPress,
  useTranslation = false,
  t,
}) => {
  // Get display label - prefer translation key if available
  const getLabel = () => {
    if (useTranslation && t) {
      // If labelKey exists, use it; otherwise try to translate the label
      if (item.labelKey) {
        return t(item.labelKey);
      }
      // Try to translate label if it looks like a translation key
      if (item.label.includes('.')) {
        return t(item.label);
      }
    }
    return item.label;
  };

  const label = getLabel();

  if (isActive) {
    // Current/last item - not clickable, highlighted
    return (
      <Text {...breadcrumbStyles.itemActive}>
        {label}
      </Text>
    );
  }

  // Clickable item
  return (
    <Pressable onPress={onPress}>
      <Text {...breadcrumbStyles.item}>
        {label}
      </Text>
    </Pressable>
  );
};

export default BreadcrumbItem;
