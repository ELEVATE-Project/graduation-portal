import React, { useCallback, useMemo } from "react";
import { VStack, HStack, Text, Image, Input, InputField, Pressable, Box } from "@ui";
import Select from "../ui/Inputs/Select";
import DatePicker from "../ui/Inputs/DatePicker";
import { filterStyles } from "./Styles";
import filterIcon from "../../assets/images/FilterIcon.png";
import { useLanguage } from "@contexts/LanguageContext";
import SearchBar from "@components/SearchBar";

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
  const [searchKey, setSearchKey] = React.useState('');
  const isInitialSearchRef = React.useRef(true);

  // Find search field item
  const searchItem = useMemo(() => {
    return data.find((item: any) => item.type === 'search');
  }, [data]);

  // Handle search changes - same pattern as ParticipantsList
  const handleSearch = useCallback((text: string) => {
    // Search functionality can be implemented here when needed
    setSearchKey(text);
    // Skip initial empty search call to prevent duplicate API call on page load
    if (isInitialSearchRef.current && (!text || text.trim() === "")) {
      isInitialSearchRef.current = false;
      return;
    }
    isInitialSearchRef.current = false;
    
    // Update value state to include search for filter system (only if text is not empty)
    if (searchItem) {
      if (!text || text.trim() === "") {
        setValue((prev: any) => {
          // Only update if the key actually exists to avoid unnecessary object recreation
          if (prev[searchItem.attr] !== undefined) {
            const updated = { ...prev };
            delete updated[searchItem.attr];
            return updated;
          }
          return prev;
        });
      } else {
        setValue((prev: any) => ({ ...prev, [searchItem.attr]: text.trim() }));
      }
    }
  }, [searchItem]);

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
    if (item.data && item.data.length > 0) {
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

  // Track clear count to force SearchBar remount when filters are cleared
  const [clearCount, setClearCount] = React.useState(0);

  const handleClearFilters = () => {
    const clearedValue = {};
    setValue(clearedValue);
    // Clear search key
    setSearchKey('');
    // Reset initial search ref so that clearing and then typing works correctly
    isInitialSearchRef.current = true;
    // Increment clear count to force SearchBar remount with empty value
    if (searchItem) {
      setClearCount(prev => prev + 1);
    }
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
    // Handle value change for input fields (text, date)
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

      // Select type field (default for 'select' type or undefined type)
      return (
        <Select
          key={`select-${item.attr}-${item.data?.length || 0}`} // Force re-render when options change
          value={value?.[item.attr] || getDefaultDisplayValue(item)}
          onChange={handleSelectChange}
          placeholder={getPlaceholder()}
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
        {...filterStyles.roleContainer}
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

      {/* Filters Row - Includes search bar if present */}
      <HStack {...filterStyles.filterFieldsContainer}>
        {/* Search Bar - Only show if there's a search field in data, placed first */}
        {searchItem && (
          <Box width="$full" $md-width="20%" flex={1} $md-flex={2}>
            <SearchBar
              key={`search-${clearCount}`}
              placeholder={t('admin.filters.searchPlaceholder')}
              onSearch={handleSearch}
              debounceMs={500}
              defaultValue={searchKey}
            />
          </Box>
        )}
        {/* Render filter items, excluding the search item */}
        {data.filter((item: any) => item.type !== 'search').map((item: any) => renderFilterItem(item))}
      </HStack>
    </VStack>
  );
}
