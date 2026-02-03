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
import { selectedLCList } from '@constants/USER_MANAGEMENT_FILTERS';
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
     {showSelectedCard && selectedValues && (
       <Card {...(AssignUsersStyles.cardStyles as ViewProps)}>
         <Avatar {...(AssignUsersStyles.avatarBgStyles as any)}>
           <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as any)}>
             {selectedValues.selectSupervisor ||
               selectedValues.selectedValue ||
               selectedValues.labelKey ||
               ''}
           </AvatarFallbackText>
         </Avatar>
         <View>
           <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
             {selectedValues.selectSupervisor ||
               selectedValues.selectedValue ||
               ''}
           </Text>
           <Text {...(AssignUsersStyles.provinceName as TextProps)}>
             {selectedValues.filterByProvince || selectedValues.province || 'eThekwini, KwaZulu-Natal'}
           </Text>
         </View>
       </Card>
     )}
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