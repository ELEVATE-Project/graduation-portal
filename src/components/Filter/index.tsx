import React from "react";
import { VStack, HStack, Text, Image, Input, InputField, Pressable } from "@ui";
import Select from "../ui/Inputs/Select";
import DatePicker from "../ui/Inputs/DatePicker";
import { filterStyles } from "./Styles";
import filterIcon from "../../assets/images/FilterIcon.png";
import { useLanguage } from "@contexts/LanguageContext";

interface FilterButtonProps {
  data: any[];
  onFilterChange?: (filters: Record<string, any>) => void;
  // Configuration for right section (Clear Button)
  showClearButton?: boolean; // Show clear button (default: true)
  rightContent?: React.ReactNode; // Custom right content (overrides default clear button)
  disabled?: boolean; // Disable filter (e.g., district when no province selected)
}

export default function FilterButton({
  data,
  onFilterChange,
  showClearButton = true,
  rightContent
  // disabled prop is passed via data items - Used for district filter when no province selected
}: FilterButtonProps) {
  const { t } = useLanguage();
  const [value, setValue] = React.useState<any>({});
  const [openDatePicker, setOpenDatePicker] = React.useState<string | null>(null);

  // Notify parent when filters change
  React.useEffect(() => {
    onFilterChange?.(value);
  }, [value, onFilterChange]);

  // Get default display values for UI (not included in output)
  const getDefaultDisplayValue = (item: any) => {
    // If placeholder is set, don't auto-select unless first item is an "all" option
    if (item.placeholderKey || item.placeholder) {
      // Check if first item is an "all" option (e.g., "all-Provinces", "all-roles", "all-status")
      if (item.data && item.data.length > 0) {
        const firstItem = item.data[0];
        let firstValue = '';
        if (typeof firstItem === 'string') {
          firstValue = firstItem;
        } else if (firstItem?.value !== undefined) {
          firstValue = String(firstItem.value);
        }
        // Only auto-select if it's an "all" option
        if (firstValue.toLowerCase().startsWith('all-') || firstValue.toLowerCase() === 'all') {
          return firstValue;
        }
      }
      // Otherwise, return empty to show placeholder
      return "";
    }
    
    // Default behavior: auto-select first item if no placeholder
    if (item.type !== 'search' && item.data && item.data.length > 0) {
      const firstItem = item.data[0];
      // Extract the actual value string from the first item
      if (typeof firstItem === 'string') {
        return firstItem;
      } else if (firstItem?.value !== undefined) {
        // Use marker for actual null to match option values
        // Empty strings are handled directly
        if (firstItem.value === null) {
          return '__NULL_VALUE__';
        } else {
          return String(firstItem.value);
        }
      }
    }
    return '';
  };

  const handleClearFilters = () => {
    const clearedValue = {};
    setValue(clearedValue);
    // Notify parent component when filters are cleared
    // onchange?.(clearedValue);
  };

  // Render right section content
  const renderRightContent = () => {
    // If custom right content is provided, use it
    if (rightContent) {
      return rightContent;
    }

    // Otherwise, render default clear button
    if (showClearButton) {
      return (
        <Pressable onPress={handleClearFilters}>
          <Text {...filterStyles.clearLinkText} $web-cursor="pointer">
            {t('common.clear')}
          </Text>
        </Pressable>
      );
    }

    return null;
  };

  // Render a single filter item
  const renderFilterItem = (item: any) => {
    const useSearchContainer = item.type === 'search';
    
    // Handle value change for input fields (text, date, search)
    const handleInputChange = (text: string) => {
      if (!text || text.trim() === "") {
        setValue((prev: any) => {
          const updated = { ...prev };
          delete updated[item.attr];
          return updated;
        });
      } else {
        setValue((prev: any) => ({ ...prev, [item.attr]: text }));
      }
    };

    // Handle value change for select fields
    const handleSelectChange = (v: any) => {
      // ❗ If actual null (marked), empty string, or undefined → remove from state
      // Note: String "null" is kept in state, only actual null/empty removes the key
      if (v == null || v === '__NULL_VALUE__' || v === '') {
        setValue((prev: any) => {
          const updated = { ...prev };
          delete updated[item.attr];
          return updated;
        });
      } else {
        // Otherwise store the selected value (including string "null")
        setValue((prev: any) => ({
          ...prev,
          [item.attr]: v,
        }));
      }
    };

    // Get placeholder text
    const getPlaceholder = () => {
      if (item.placeholderKey) {
        return t(item.placeholderKey);
      }
      if (item.placeholder) {
        return item.placeholder;
      }
      if (item.type === 'search' && item.nameKey) {
        return `${t('common.search')} ${t(item.nameKey).toLowerCase()}...`;
      }
      if (item.type === 'search' && item.name) {
        return `Search ${item.name.toLowerCase()}...`;
      }
      return '';
    };

    // Render the appropriate input field based on type
    const renderInputField = () => {
      // Date type field - uses custom DatePicker component
      if (item.type === 'date') {
        return (
          <DatePicker
            {...filterStyles.input}
            value={value?.[item.attr] || ""}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            maximumDate={new Date()}
            isOpen={openDatePicker === item.attr}
            onOpenChange={(isOpen: boolean) => {
              setOpenDatePicker(isOpen ? item.attr : null);
            }}
          />
        );
      }

      // Text type field
      if (item.type === 'text') {
        return (
          <Input {...filterStyles.input}>
            <InputField
              type="text"
              placeholder={getPlaceholder()}
              value={value?.[item.attr] || ""}
              onChangeText={handleInputChange}
            />
          </Input>
        );
      }

      // Search type field
      if (item.type === 'search') {
        return (
          <Input {...filterStyles.input}>
            <InputField
              {...({ type: 'search' } as any)}
              placeholder={getPlaceholder()}
              value={value?.[item.attr] || ""}
              onChangeText={handleInputChange}
            />
          </Input>
        );
      }

      // Select type field (default for 'select' type or undefined type)
      return (
        <Select
          key={`select-${item.attr}-${item.data?.length || 0}`} // Force re-render when options change
          value={value?.[item.attr] || getDefaultDisplayValue(item)}
          onChange={handleSelectChange}
          options={
            item?.data?.map((option: any) => {
              // If it's a string, return as-is (backward compatibility)
              if (typeof option === 'string') {
                return option;
              }
              // If it's an object with labelKey, translate it
              if (option.labelKey) {
                return {
                  ...option,
                  label: t(option.labelKey),
                };
              }
              // If it has label, return as-is
              return option;
            }) || []
          }
          disabled={item.disabled} // Disable filter when dependent filter not selected (e.g., district)
          {...filterStyles.input}
        />
      );
    };
    
    return (
      <VStack 
        key={item.attr}
        {...(useSearchContainer 
          ? filterStyles.searchContainer 
          : filterStyles.roleContainer)}
        width="$full"
        $md-width="auto"
      >
        {/* <Text {...filterStyles.label}>
          {item.nameKey ? t(item.nameKey) : item.name}
        </Text> */}
        {renderInputField()}
      </VStack>
    );
  };

  return (
    <VStack {...filterStyles.container}>
      {/* Title Row with User Count and Clear Button */}
      <HStack {...filterStyles.titleContainer}>
        {/* Left: Filter Icon + Title */}
        <HStack alignItems="center">
          <Image
            source={filterIcon}
            style={{ width: 16, height: 16 }}
            alt="Filter icon"
          />
          <Text {...filterStyles.titleText}>{t('common.filters')}</Text>
        </HStack>

        {/* Right: Configurable content (User Count + Clear Button or custom) */}
        {renderRightContent()}
      </HStack>

      {/* Filters Row */}
      <HStack {...filterStyles.filterFieldsContainer}>
        {data.map((item: any, index: number) => renderFilterItem(item, index))}
      </HStack>
    </VStack>
  );
}
