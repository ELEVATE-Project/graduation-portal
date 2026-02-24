import React, { useState, useEffect, useCallback } from 'react';
import { Box, Input, InputField, InputSlot } from '@gluestack-ui/themed';
import { LucideIcon } from '@ui/index';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { SearchBarProps } from '@app-types/components';
import { useLanguage } from '@contexts/LanguageContext';

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearch,
  debounceMs = 500,
  defaultValue = '',
}) => {
  const { t } = useLanguage();
  const [searchText, setSearchText] = useState(defaultValue);

  const finalPlaceholder = placeholder || t('common.search');
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchText, debounceMs, onSearch]);

  const handleChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  return (
    <Box width="$full">
      <Input
        variant="outline"
        size="sm"
        borderColor="$borderColor"
        borderRadius="$10px"
        bg="$white"
      >
        <InputSlot pl="$10px">
          <LucideIcon
            name="Search"
            size={16}
            color="$textMutedForeground"
          />
        </InputSlot>
        <InputField
          placeholder={t(finalPlaceholder)}
          value={searchText}
          onChangeText={handleChange}
          {...TYPOGRAPHY.input}
          placeholderTextColor="$textMutedForeground"
          borderColor="$borderColor"
          bg="$white"
          height="$9"
          pl="$10px"
          lineHeight="$md"
        />
      </Input>
    </Box>
  );
};

export default SearchBar;
