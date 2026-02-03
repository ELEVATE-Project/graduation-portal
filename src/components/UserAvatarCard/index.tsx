import React, { useState } from 'react';
import {
 Text,
 Card,
 Heading,
 Avatar,
 AvatarFallbackText,
 View,
 Checkbox,
 CheckboxIndicator,
 CheckboxIcon,
 CheckIcon,
 CheckboxLabel,
 VStack,
 HStack,
 Divider,
 Button,
 Pressable,
} from '@ui';
import FilterButton from '@components/Filter';
import { AssignUsersStyles } from './Styles';
import type { TextProps, ViewProps } from 'react-native';
import { useLanguage } from '@contexts/LanguageContext';
import { selectedLCList } from '@constants/ASSIGN_USERS_FILTERS';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';


interface SelectionCardProps {
 title: string;
 description: string;
 filterOptions?: any;
 onChange?: (values: Record<string, any>) => void;
 selectedValues?: Record<string, any>;
 showSelectedCard?: boolean;
 showLcList?: boolean;
 showLcListforSupervisorTeam?: boolean;
 onLcSelect?: (lc: any) => void;
 onAssign?: (selectedLCs: any[]) => void;
 lcList?: any[]; // Optional filtered LC list (if not provided, uses default selectedLCList)
 isParticipantList?: boolean; // Flag to indicate if this is a participant list (different button text)
}


const SelectionCard = ({
  title,
  description,
  filterOptions,
  onChange,
  selectedValues = {},
  showSelectedCard = false,
  showLcList = true,
  showLcListforSupervisorTeam = false,
  onLcSelect,
  onAssign,
  lcList,
  isParticipantList = false,
}: SelectionCardProps) => {
  const { t } = useLanguage();

  const [selectedLc, setSelectedLc] = useState<any>(null);
  const [selectedLCs, setSelectedLCs] = useState<Set<string>>(new Set());
  
  // Use provided lcList or fall back to default selectedLCList
  const displayLCList = lcList || selectedLCList;
 // Handler to receive filter changes from FilterButton and pass to parent
 const handleFilterChange = (values: Record<string, any>) => {
   // Call parent's onChange handler if provided
   onChange?.(values);
 };


  return (
    <Card {...(AssignUsersStyles.coverCardStyles as ViewProps)}>
      <Heading {...(AssignUsersStyles.headingStyles as any)}>{t(title)}</Heading>
      <Text {...(AssignUsersStyles.descriptionTextStyles as TextProps)}>
        {description.includes('{{supervisor}}') && selectedValues?.selectSupervisor
          ? t(description).replace('{{supervisor}}', selectedValues.selectSupervisor)
          : description.includes('{{lc}}') && selectedValues?.selectedLc?.labelKey
          ? t(description).replace('{{lc}}', selectedValues.selectedLc.labelKey)
          : t(description)}
      </Text>


      {!showLcListforSupervisorTeam && (
        <FilterButton
          data={filterOptions}
          showClearButton={false}
          onFilterChange={handleFilterChange}
        />
      )}
     {/* Display selected values if showSelectedCard is true and values exist */}
     {showSelectedCard && selectedValues && (() => {
       // Get supervisor data - prefer full object, fallback to filter values
       const supervisorData = selectedValues.selectedSupervisorData;
       
       // Get supervisor name from API response (name field) or fallback to filter value
       const supervisorName = supervisorData?.name || 
                             selectedValues.selectSupervisor ||
                             selectedValues.selectedValue ||
                             '';
       
       // Extract initials from supervisor name (first letter of first name + first letter of last name)
       // Example: "Amol Patil" -> "AP"
       const getInitials = (name: string): string => {
         if (!name || typeof name !== 'string') return '';
         
         // Split by space, get first character of each part, join and uppercase
         // This handles names with any number of parts (e.g., "Amol Patil" -> "AP", "John Doe Smith" -> "JS")
         const initials = name
           .trim()
           .split(/\s+/)
           .filter(part => part && part.length > 0)
           .map(part => part[0])
           .join('')
           .toUpperCase();
         
         // If we have at least 2 initials, return first and last
         // Otherwise, return first 2 characters of the name
         if (initials.length >= 2) {
           return initials.length === 2 
             ? initials 
             : initials[0] + initials[initials.length - 1];
         } else if (initials.length === 1) {
           // Single name - use first 2 letters
           return name.trim().substring(0, 2).toUpperCase();
         }
         return '';
       };
       
       // Get location from selected province name (API response has location: null)
       // Use the province name from the filter selection as the location
       const supervisorLocation = selectedValues.selectedProvinceName || 
                                  supervisorData?.meta?.province ||
                                  '';
       
       return (
         <Card {...(AssignUsersStyles.cardStyles as ViewProps)}>
           <HStack space="md" alignItems="center">
             <Avatar {...(AssignUsersStyles.avatarBgStyles as any)}>
               <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as any)}>
                 {getInitials(supervisorName)}
               </AvatarFallbackText>
             </Avatar>
             <View flex={1}>
               <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
                 {supervisorName}
               </Text>
               {supervisorLocation && (
                 <Text {...(AssignUsersStyles.provinceName as TextProps)}>
                   {supervisorLocation}
                 </Text>
               )}
             </View>
           </HStack>
         </Card>
       );
     })()}
     {showLcList && (
       <VStack marginTop={'$3'}>
         <Text {...(AssignUsersStyles.provinceName as TextProps)} color="$textForeground">
           {isParticipantList 
             ? t('admin.assignUsers.selectParticipants', { count: selectedLCs.size })
             : t('admin.assignUsers.selectedLinkageChampions')}
         </Text>
        <Card variant="outline" padding="$0" marginTop="$1">
          {displayLCList?.map((lc: any) => {
             const isChecked = selectedLCs.has(lc.value);
             return (
               <React.Fragment key={lc.value}>
                 <Checkbox
                   isDisabled={false}
                   isInvalid={false}
                   size="sm"
                   padding="$3"
                   value={lc.value}
                   isChecked={isChecked}
                   onChange={(checked: boolean) => {
                     setSelectedLCs((prev) => {
                       const newSet = new Set(prev);
                       if (checked) {
                         newSet.add(lc.value);
                       } else {
                         newSet.delete(lc.value);
                       }
                       return newSet;
                     });
                   }}
                 >
                 <CheckboxIndicator borderWidth={1} borderColor="$textForeground">
                   <CheckboxIcon as={CheckIcon} color="$modalBackground" />
                 </CheckboxIndicator>


                 <CheckboxLabel>
                   <View {...(AssignUsersStyles.viewstyles as ViewProps)}>
                     <Avatar {...(AssignUsersStyles.avatarBgStyles as any)} width="$8" height="$8">
                       <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as any)} fontSize="$sm">{lc.labelKey}</AvatarFallbackText>
                     </Avatar>


                     <View>
                       <Text
                         {...(AssignUsersStyles.supervisorName as TextProps)} fontSize="$sm"
                       >
                         {lc.labelKey}
                       </Text>
                       <HStack gap="$1">
                         <LucideIcon
                           name="MapPin"
                           size={12}
                           color={theme.tokens.colors.textMutedForeground}
                         />
                         <Text
                           {...(AssignUsersStyles.provinceName as TextProps)} fontSize="$xs"
                         >
                           {lc.location}
                         </Text>
                       </HStack>
                     </View>
                     {/* <Button
                       {...titleHeaderStyles.outlineButton}
                       marginLeft="auto"
                     >
                       <HStack>
                         <Text {...titleHeaderStyles.outlineButtonText}>
                           {t(`admin.assignUsers.status.${lc.status}`) || lc.status}
                         </Text>
                       </HStack>
                     </Button> */}
                   </View>
                 </CheckboxLabel>
               </Checkbox>
               <Divider />
             </React.Fragment>
           );
           })}
         </Card>


        <Button
          {...titleHeaderStyles.solidButton}
          mt={'$3'}
          onPress={() => {
            // Handle assign LCs to supervisor
            const selectedLCValues = Array.from(selectedLCs);
            const selectedLCObjects = displayLCList.filter((lc: any) =>
              selectedLCValues.includes(lc.value)
            );
            console.log('Assigning LCs:', selectedLCObjects);
            // Call parent's onAssign callback if provided
            onAssign?.(selectedLCObjects);
            // Clear selection after assignment
            setSelectedLCs(new Set());
            // TODO: Implement API call to assign LCs
          }}
          isDisabled={selectedLCs.size === 0}
        >
          <HStack space="sm" alignItems="center">
            <Text {...titleHeaderStyles.solidButtonText}>
              {isParticipantList
                ? t('admin.assignUsers.assignParticipantsToLc').replace('{{count}}', String(selectedLCs.size))
                : t('admin.actions.assignLCsToSupervisor')}
            </Text>
          </HStack>
        </Button>
       </VStack>
     )}


     {showLcListforSupervisorTeam &&
       displayLCList?.map((lc: any) => {
         const isSelected = selectedLc?.value === lc.value;


         return (
           <Pressable
             key={lc.value}
             onPress={() => {
               setSelectedLc(lc); // local highlight
               onLcSelect?.(lc); // notify parent
             }}
           >
             <Card
               {...(isSelected
                 ? (AssignUsersStyles.cardStyles as ViewProps)
                 : (AssignUsersStyles.selectedCardStyles as ViewProps))}
             >
               <Avatar {...(AssignUsersStyles.avatarBgStyles as any)}>
                 <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as any)}>{lc.labelKey || ''}</AvatarFallbackText>
               </Avatar>


               <View>
                 <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
                   {lc.labelKey}
                 </Text>
                 <Text {...(AssignUsersStyles.provinceName as TextProps)}>
                   {lc.location}
                 </Text>
               </View>
             </Card>
           </Pressable>
         );
       })}
   </Card>
 );
};


export default SelectionCard;