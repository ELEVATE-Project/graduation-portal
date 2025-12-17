import React from 'react';
import { I18nManager } from 'react-native';
import i18n from '@config/i18n';
import {
  SelectItem,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectContent,
  SelectBackdrop,
  Select as GluestackSelect,
  SelectIcon,
  SelectInput,
  SelectTrigger,
  ChevronDownIcon,
  SelectPortal,
} from '@gluestack-ui/themed';
import { getSelectTriggerStyles } from './Styles';

type Option = {
  value: string;
  name?: string;
  nativeName?: string;
  isRTL?: boolean;
};

// Input format can be strings, objects, or already normalized Option[]
type RawOption = string | { label?: string; name?: string; value: string | null } | Option;

type SelectProps = {
  options: RawOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  bg?: string;
  borderColor?: string;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  bg,
  borderColor,
}: SelectProps) {
  // Normalize options: handle strings, objects, or already normalized Option[]
  const normalizedOptions: Option[] = options.map((e: RawOption, index: number) => {
    // If already normalized Option format (has value and optional name/nativeName)
    if (typeof e === 'object' && 'value' in e && typeof e.value === 'string' && ('name' in e || 'nativeName' in e)) {
      return e as Option;
    }

    // If string format
    if (typeof e === 'string') {
      return {
        value: e,
        name: e,
      };
    }

    // If object with label/value format (from Filter component)
    if (typeof e === 'object' && e !== null) {
      let optionValue: string;
      let optionName: string;

      if ('value' in e && e.value !== undefined) {
        // Use marker for actual null, keep string "null" as is
        optionValue = e.value === null ? '__NULL_VALUE__' : String(e.value);
      } else {
        optionValue = '';
      }

      // Prefer label, then name, then value
      optionName = ('label' in e ? e.label : undefined) ??
        ('name' in e ? e.name : undefined) ??
        optionValue;

      return {
        value: optionValue,
        name: optionName,
      };
    }

    // Fallback
    return {
      value: String(index),
      name: 'Unknown',
    };
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);
  const displayValue =
    selectedOption?.nativeName ||
    selectedOption?.name ||
    selectedOption?.value ||
    '';

  // Get localized placeholder with fallback
  const localizedPlaceholder =
    placeholder ?? i18n.t('common.selectOption', 'Select an option');

  // Determine writing direction for RTL support
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  const handleValueChange = (newValue: string | undefined) => {
    if (newValue !== undefined && newValue !== null) {
      const stringValue = String(newValue);
      // Allow empty strings and special markers (like __NULL_VALUE__) to pass through
      // Empty strings are valid selections for filters (e.g., "String Null" option)
      onChange(stringValue);
    }
  };

  return (
    <GluestackSelect
      selectedValue={value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger {...(getSelectTriggerStyles(bg, borderColor) as any)}>
        <SelectInput
          placeholder={localizedPlaceholder}
          value={displayValue}
          bg={bg}
          backgroundColor={bg}
          // @ts-ignore - writingDirection is a valid style prop but may not be in types
          style={{ writingDirection, backgroundColor: bg }}
        />
        <SelectIcon mr="$3">
          <ChevronDownIcon />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {normalizedOptions.map((option: Option, index: number) => (
            <SelectItem
              key={option?.value ?? option?.name ?? index.toString()}
              label={option?.nativeName || option?.name || option?.value}
              value={option?.value ?? option?.name ?? ''}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </GluestackSelect>
  );
}
