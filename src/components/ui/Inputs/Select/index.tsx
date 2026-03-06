import React, { useMemo, useRef, useState } from 'react';
import { I18nManager, useWindowDimensions } from 'react-native';
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
  Pressable,
  Box,
  Text,
} from '@gluestack-ui/themed';
import { getSelectTriggerStyles } from './Styles';
import { CustomMenu, MenuItemData } from '../../Menu';
import { theme } from '@config/theme';
import { isWeb } from '@utils/platform';

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
  onChange: (value: string, label: string) => void;
  placeholder?: string;
  bg?: string;
  borderColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: string;
  disabled?: boolean; // Support for disabling select (used in district filter)
};

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  bg='$white',
  borderColor='$borderColor',
  size = 'sm',
  borderRadius = '$xl',
  disabled = false,
}: SelectProps) {
  const { width } = useWindowDimensions();
  // Desktop web only: use custom menu to avoid native <select> rendering
  // Mobile web should keep Gluestack Select behavior.
  const isDesktopWeb = isWeb && width >= 768;
  const [measuredWidthPx, setMeasuredWidthPx] = useState<number | null>(null);

  // Track select width (web only) so we can apply the same width to the dropdown menu.
  // Deduped to avoid unnecessary state updates.
  const lastLoggedWidthRef = useRef<number | null>(null);

  const handleMeasuredWidth = (w?: number) => {
    if (!isWeb) return;
    if (typeof w !== 'number' || !Number.isFinite(w) || w <= 0) return;
    if (lastLoggedWidthRef.current === w) return;
    lastLoggedWidthRef.current = w;
    setMeasuredWidthPx(w);
  };

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
      const next = normalizedOptions.find((opt) => opt.value === stringValue);
      onChange(stringValue, next?.name || '');
    }
  };

  const webMenuItems = useMemo<MenuItemData[]>(() => {
    if (!isDesktopWeb) {
      return [];
    }

    return normalizedOptions.map((opt) => {
      const label = opt.nativeName || opt.name || opt.value;
      const isSelected = opt.value === value;
      return {
        key: opt.value,
        label,
        textValue: label,
        rightIconName: isSelected ? 'Check' : undefined,
        rightIconColor: isSelected ? theme.tokens.colors.primary500 : undefined,
        rightIconSizeValue: 18,
      };
    });
  }, [isDesktopWeb, normalizedOptions, value]);

  // On desktop web, force a custom popover menu to avoid native <select> rendering
  if (isDesktopWeb) {
    const hasValue = !!value && value !== '__NULL_VALUE__';
    const triggerText = hasValue ? displayValue : localizedPlaceholder;
    const triggerTextColor = hasValue ? '$textForeground' : '$textMutedForeground';

    return (
      <CustomMenu
        items={webMenuItems}
        placement="bottom left"
        offset={6}
        // Apply width to the actual Menu container (ul) by overriding Gluestack Menu's default minWidth=200
        menuProps={
          measuredWidthPx
            ? { minWidth: Math.round(measuredWidthPx), width: Math.round(measuredWidthPx) }
            : undefined
        }
        onSelect={(key) => handleValueChange(key)}
        trigger={(triggerProps) => (
          <Pressable
            {...triggerProps}
            disabled={disabled}
            opacity={disabled ? 0.5 : 1}
            borderWidth={1}
            borderColor={borderColor}
            borderRadius={borderRadius}
            bg={bg}
            px="$3"
            py="$2"
            onLayout={(e) => {
              const w = e?.nativeEvent?.layout?.width;
              handleMeasuredWidth(w);
            }}
            $web-style={{
              outline: 'none',
              boxShadow: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                fontSize="$sm"
                color={triggerTextColor}
                // @ts-ignore - writingDirection is a valid style prop but may not be in types
                style={{ writingDirection }}
                numberOfLines={1}
              >
                {triggerText}
              </Text>
              <Box ml="$3">
                <ChevronDownIcon />
              </Box>
            </Box>
          </Pressable>
        )}
      />
    );
  }

  return (
    <GluestackSelect
      selectedValue={value}
      onValueChange={handleValueChange}
      isDisabled={disabled}
    >
      <SelectTrigger
        {...((getSelectTriggerStyles as any)(bg, borderColor, size, borderRadius) as any)}
        disabled={disabled}
        opacity={disabled ? 0.5 : 1}
        onLayout={(e: any) => {
          const w = e?.nativeEvent?.layout?.width;
          handleMeasuredWidth(w);
        }}
      >
        <SelectInput
          placeholder={localizedPlaceholder}
          value={displayValue}
          bg={bg}
          backgroundColor={bg}
          editable={!disabled}
          // @ts-ignore - writingDirection is a valid style prop but may not be in types
          style={{ writingDirection, backgroundColor: bg }}
          fontFamily='Inter'
        />
        <SelectIcon mr="$3">
          <ChevronDownIcon />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop
          // On web/desktop, keep backdrop subtle (or effectively off) to match other selects
          $web-style={{ backgroundColor: 'transparent' }}
        />
        <SelectContent
          bg="$white"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$lg"
          p="$1"
          $web-style={{
            // Desktop dropdown styling (match the nicer Select UI)
            boxShadow: '0 10px 30px rgba(16, 24, 40, 0.12)',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          <SelectDragIndicatorWrapper $web-display="none">
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {normalizedOptions.map((option: Option, index: number) => (
            <SelectItem
              key={option?.value ?? option?.name ?? index.toString()}
              label={option?.nativeName || option?.name || option?.value}
              value={option?.value ?? option?.name ?? ''}
              borderRadius="$md"
              px="$3"
              py="$2"
              $web-cursor="pointer"
              $web-style={{
                userSelect: 'none',
                // Hover state for desktop
                ':hover': {
                  backgroundColor: '#F2F4F7',
                },
              }}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </GluestackSelect>
  );
}
