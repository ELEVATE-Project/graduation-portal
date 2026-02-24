import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { VStack, HStack, Button, Text, Card, Avatar, AvatarFallbackText, Box, Divider, LucideIcon, Badge, BadgeText  } from '@ui';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import type { ViewProps, TextProps } from 'react-native';
import {
 lcFilterOptions,
 participantLCFilterOptions,
 SearchFilter,
 ParticipantSearchFilter,
 selectedLCList,
 participantFilterOptions,
 participantList,
} from '@constants/USER_MANAGEMENT_FILTERS';
import { supervisorFilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import SelectionCard from '@components/SelectionCard';
import { AssignUsersStyles } from './Styles';
import { theme } from '@config/theme';

const AssignUsersScreen = () => {
 const { t } = useLanguage();
 const AssignLCFilterOptions = [SearchFilter, ...lcFilterOptions];
 const AssignParticipantFilterOptions = [ParticipantSearchFilter, ...participantFilterOptions];
 type AssignTab = 'LC_TO_SUPERVISOR' | 'PARTICIPANT_TO_LC';


 const [activeTab, setActiveTab] = useState<AssignTab>('LC_TO_SUPERVISOR');
 const [selectedLc, setSelectedLc] = useState<any>(null);
 // State to store filter values for each SelectionCard
 const [supervisorFilterValues, setSupervisorFilterValues] = useState<
   Record<string, any>
 >({});
 const [lcFilterValues, setLcFilterValues] = useState<Record<string, any>>({});
 // State to track assigned LCs
 const [assignedLCs, setAssignedLCs] = useState<any[]>([]);
 // State for participant filters and selected participants
 const [participantFilterValues, setParticipantFilterValues] = useState<Record<string, any>>({});
 const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
 // State to track assigned participants
 const [assignedParticipants, setAssignedParticipants] = useState<any[]>([]);


 // Handler for supervisor and LC filter changes (combined in Step 1)
 const handleSupervisorFilterChange = (values: Record<string, any>) => {
   // Reset assigned LCs when supervisor changes
   if (values.selectSupervisor !== supervisorFilterValues.selectSupervisor) {
     setAssignedLCs([]);
   }
   // Reset assigned participants and selected LC when supervisor changes (for Participant to LC tab)
   if (values.selectSupervisor !== supervisorFilterValues.selectSupervisor) {
     setAssignedParticipants([]);
     setSelectedLc(null);
     // Clear LC selection when supervisor changes
     values.selectLC = null;
   }
   
   // Handle LC selection from filter
   if (values.selectLC && values.selectLC !== supervisorFilterValues.selectLC) {
     // Find the LC object from selectedLCList
     const lc = selectedLCList.find((lc: any) => lc.value === values.selectLC);
     if (lc) {
       // Reset assigned participants when LC changes
       if (lc.value !== selectedLc?.value) {
         setAssignedParticipants([]);
       }
       setSelectedLc(lc);
     }
   } else if (!values.selectLC && supervisorFilterValues.selectLC) {
     // LC was cleared
     setSelectedLc(null);
     setAssignedParticipants([]);
   }
   
   setSupervisorFilterValues(values);
   console.log('Supervisor filter values changed:', values);
 };


 // Handler for LC SelectionCard filter changes
 const handleLcFilterChange = (values: Record<string, any>) => {
   setLcFilterValues(values);
   console.log('LC filter values changed:', values);
   // Add your logic here to handle LC filter changes
   // Example: fetchFilteredLCs(values);
 };

 // Handler for when LCs are assigned to supervisor
 const handleAssignLCs = (selectedLCs: any[]) => {
   // Generate additional data for assigned LCs (email, LC ID, site)
   const lcsWithFullData = selectedLCs.map((lc, index) => {
     // Generate email from name (simple conversion)
     const nameParts = lc.labelKey.toLowerCase().split(' ');
     const email = nameParts.length > 1
       ? `${nameParts[0]}.${nameParts[1]}@gbl.co.za`
       : `${nameParts[0]}@gbl.co.za`;
     
     // Generate LC ID (increment from existing)
     const lcId = `LC-${String(assignedLCs.length + 2 + index).padStart(3, '0')}`;
     
     // Extract site from location or use default
     const site = lc.location?.includes('eThekwini') ? 'Site B' : 
                  lc.location?.includes('Johannesburg') ? 'Site A' : 'Site C';
     
     return {
       ...lc,
       email,
       lcId,
       site,
     };
   });
   
   // Add to assigned LCs list
   setAssignedLCs((prev) => [...prev, ...lcsWithFullData]);
   console.log('LCs assigned:', lcsWithFullData);
 };

 // Filter out assigned LCs from the available list
 const getAvailableLCs = () => {
   const assignedLCValues = new Set(assignedLCs.map(lc => lc.value));
   return selectedLCList.filter((lc: any) => !assignedLCValues.has(lc.value));
 };

 // Handler for when participants are assigned to LC
 const handleAssignParticipants = (selectedParticipants: any[]) => {
   // Generate additional data for assigned participants (email, participant ID)
   const participantsWithFullData = selectedParticipants.map((participant, index) => {
     // Generate email from name (simple conversion)
     const nameParts = participant.labelKey.toLowerCase().split(' ');
     const email = nameParts.length > 1
       ? `${nameParts[0]}.${nameParts[1]}@example.com`
       : `${nameParts[0]}@example.com`;
     
     // Generate Participant ID (increment from existing)
     const participantId = `PAR-${String(assignedParticipants.length + 1 + index).padStart(3, '0')}`;
     
     // Extract bio and productivity from location (format: "Bio • Productivity")
     const locationParts = participant.location?.split(' • ') || [];
     const bio = locationParts[0] || '';
     const productivity = locationParts[1] || '';
     
     return {
       ...participant,
       email,
       participantId,
       bio,
       productivity,
     };
   });
   
   // Add to assigned participants list
   setAssignedParticipants((prev) => [...prev, ...participantsWithFullData]);
   console.log('Participants assigned:', participantsWithFullData);
 };

 // Filter out assigned participants from the available list
 const getAvailableParticipants = () => {
   const assignedParticipantValues = new Set(assignedParticipants.map(p => p.value));
   return participantList.filter((p: any) => !assignedParticipantValues.has(p.value));
 };


 // Use filter values to perform actions when filters change
 useEffect(() => {
   if (Object.keys(supervisorFilterValues).length > 0) {
     console.log('Current supervisor filter values:', supervisorFilterValues);
     // Add your filtering/fetching logic here for supervisors
   }
 }, [supervisorFilterValues]);


 useEffect(() => {
   if (Object.keys(lcFilterValues).length > 0) {
     console.log('Current LC filter values:', lcFilterValues);
     // Add your filtering/fetching logic here for LCs
   }
 }, [lcFilterValues]);
 return (
   <VStack space="md" width="100%">
     <TitleHeader
       title="admin.menu.assignUsers"
       description="admin.assignUsersDescription"
       bottom={
         <HStack space="md" alignItems="center">
           <Button
             {...(activeTab === 'LC_TO_SUPERVISOR'
               ? titleHeaderStyles.solidButton
               : titleHeaderStyles.outlineButton)}
             onPress={() => setActiveTab('LC_TO_SUPERVISOR')}
           >
             <Text
               {...(activeTab === 'LC_TO_SUPERVISOR'
                 ? titleHeaderStyles.solidButtonText
                 : titleHeaderStyles.outlineButtonText)}
             >
               {t('admin.actions.lctosupervisior')}
             </Text>
           </Button>


           <Button
             {...(activeTab === 'PARTICIPANT_TO_LC'
               ? titleHeaderStyles.solidButton
               : titleHeaderStyles.outlineButton)}
             onPress={() => setActiveTab('PARTICIPANT_TO_LC')}
           >
             <Text
               {...(activeTab === 'PARTICIPANT_TO_LC'
                 ? titleHeaderStyles.solidButtonText
                 : titleHeaderStyles.outlineButtonText)}
             >
               {t('admin.actions.participanttolc')}
             </Text>
           </Button>
         </HStack>
       }
     />


     {activeTab === 'LC_TO_SUPERVISOR' && (
       <>
         <SelectionCard
           title="admin.assignUsers.step1SelectSupervisor"
           description="admin.assignUsers.filterByProvince"
           filterOptions={supervisorFilterOptions}
           onChange={handleSupervisorFilterChange}
           selectedValues={supervisorFilterValues}
           showSelectedCard={!!supervisorFilterValues.selectSupervisor}
           showLcList={false}
         />


        {supervisorFilterValues.selectSupervisor && (
          <>
            <SelectionCard
              title="admin.assignUsers.step2AssignLinkageChampions"
              description="admin.assignUsers.filterByGeography"
              filterOptions={AssignLCFilterOptions}
              onChange={handleLcFilterChange}
              selectedValues={lcFilterValues}
              showLcList={true}
              onAssign={handleAssignLCs}
              lcList={getAvailableLCs()}
            />

            {/* Hardcoded List of LCs Mapped to Supervisor - TODO: Replace with API data */}
            <Card {...(AssignUsersStyles.tableCardStyles as ViewProps)}>
              <VStack width="100%">
                <VStack space="xs">
                  <Text {...(AssignUsersStyles.tableTitleText as TextProps)}>
                    {t('admin.assignUsers.listOfLcsMappedToSupervisor')}
                  </Text>
                  <Text {...(AssignUsersStyles.tableSubtitleText as TextProps)}>
                    {t('admin.assignUsers.currentLcAssignmentsFor').replace(
                      '{{supervisor}}',
                      supervisorFilterValues.selectSupervisor || 'Supervisor'
                    )}
                  </Text>
                </VStack>

                {/* Table Header */}
                <HStack {...(AssignUsersStyles.tableHeaderHStack as ViewProps)}>
                  <Box flex={2}>
                    <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                      {t('admin.assignUsers.linkageChampion')}
                    </Text>
                  </Box>
                  <Box flex={2}>
                    <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                      {t('admin.assignUsers.email')}
                    </Text>
                  </Box>
                  <Box flex={2}>
                    <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                      {t('admin.assignUsers.location')}
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                      {t('admin.assignUsers.site')}
                    </Text>
                  </Box>
                </HStack>

                {/* Table Rows - Hardcoded + Dynamically Assigned */}
                <VStack space="xs">
                  {/* Hardcoded Row: Nomsa Dlamini */}
                  <HStack {...(AssignUsersStyles.tableRowHStack as ViewProps)}>
                    <Box flex={2}>
                      <HStack {...(AssignUsersStyles.avatarHStack as ViewProps)}>
                        <Avatar {...(AssignUsersStyles.avatarBgStyles as ViewProps)}>
                          <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as TextProps)}>ND</AvatarFallbackText>
                        </Avatar>
                        <VStack space="xs">
                          <Text {...(AssignUsersStyles.tableRowNameText as TextProps)}>
                            Nomsa Dlamini
                          </Text>
                          <Text {...(AssignUsersStyles.tableRowIdText as TextProps)}>
                            LC-002
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                    <Box flex={2}>
                      <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                        nomsa.dlamini@gbl.co.za
                      </Text>
                    </Box>
                    <Box flex={2}>
                      <HStack {...(AssignUsersStyles.locationHStack as ViewProps)}>
                        <LucideIcon name="MapPin" size={12} color={theme.tokens.colors.textMutedForeground} />
                        <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                          eThekwini, KwaZulu-Natal
                        </Text>
                      </HStack>
                    </Box>
                    <Box flex={1}>
                      <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                        Site B
                      </Text>
                    </Box>
                  </HStack>

                  {/* Dynamically Assigned LCs */}
                  {assignedLCs.map((lc, index) => {
                    // Get initials from name
                    const nameParts = lc.labelKey.split(' ');
                    const initials = nameParts.length > 1
                      ? `${nameParts[0][0]}${nameParts[1][0]}`
                      : nameParts[0].substring(0, 2).toUpperCase();

                    return (
                      <HStack
                        key={`${lc.value}-${index}`}
                        {...(AssignUsersStyles.tableRowHStack as ViewProps)}
                        borderBottomWidth={index === assignedLCs.length - 1 ? 0 : 1}
                      >
                        <Box flex={2}>
                          <HStack {...(AssignUsersStyles.avatarHStack as ViewProps)}>
                            <Avatar {...(AssignUsersStyles.avatarBgStyles as ViewProps)}>
                              <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as TextProps)}>{initials}</AvatarFallbackText>
                            </Avatar>
                            <VStack space="xs">
                              <Text {...(AssignUsersStyles.tableRowNameText as TextProps)}>
                                {lc.labelKey}
                              </Text>
                              <Text {...(AssignUsersStyles.tableRowIdText as TextProps)}>
                                {lc.lcId}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box flex={2}>
                          <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                            {lc.email}
                          </Text>
                        </Box>
                        <Box flex={2}>
                          <HStack {...(AssignUsersStyles.locationHStack as ViewProps)}>
                            <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                              📍
                            </Text>
                            <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                              {lc.location}
                            </Text>
                          </HStack>
                        </Box>
                        <Box flex={1}>
                          <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                            {lc.site}
                          </Text>
                        </Box>
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
            </Card>
          </>
        )}
      </>
    )}


     {activeTab === 'PARTICIPANT_TO_LC' && (
       <>
         <SelectionCard
           title="admin.assignUsers.step1SelectSupervisorAndLC"
           description="admin.assignUsers.chooseSupervisor"
           filterOptions={participantLCFilterOptions.map(filter => {
             // Populate LC filter data when supervisor is selected
             if (filter.attr === 'selectLC') {
               if (supervisorFilterValues.selectSupervisor) {
                 return {
                   ...filter,
                   data: selectedLCList.map((lc: any) => ({
                     labelKey: lc.labelKey,
                     value: lc.value,
                   })),
                 };
               } else {
                 // Show LC filter but with empty data (will show placeholder)
                 return {
                   ...filter,
                   data: [],
                 };
               }
             }
             return filter;
           })}
           onChange={handleSupervisorFilterChange}
           selectedValues={{ ...supervisorFilterValues, selectLC: selectedLc?.value }}
           showSelectedCard={false}
           showLcList={false}
         />

         {selectedLc && (
           <>
             <SelectionCard
               title="admin.assignUsers.step2AssignParticipants"
               description="admin.assignUsers.filterAndSelectParticipants"
               filterOptions={AssignParticipantFilterOptions}
               onChange={(values) => setParticipantFilterValues(values)}
               selectedValues={{ ...participantFilterValues, selectedLc }}
               showLcList={true}
               isParticipantList={true}
               lcList={getAvailableParticipants().map(p => ({
                 labelKey: p.labelKey,
                 value: p.value,
                 location: `${p.bio} • ${p.productivity}`,
                 status: p.status,
               }))}
               onAssign={handleAssignParticipants}
             />

             {/* Hardcoded List of Participants Mapped to LC - TODO: Replace with API data */}
             <Card {...(AssignUsersStyles.tableCardStyles as ViewProps)}>
               <VStack space="md" width="100%">
                 <VStack space="sm">
                   <Text {...(AssignUsersStyles.tableTitleText as TextProps)}>
                     {t('admin.assignUsers.listOfParticipantsMappedToLc')}
                   </Text>
                   <Text {...(AssignUsersStyles.tableSubtitleText as TextProps)}>
                     {t('admin.assignUsers.currentParticipantAssignmentsFor').replace(
                       '{{lc}}',
                       selectedLc?.labelKey || 'LC'
                     )}
                   </Text>
                 </VStack>

                 {/* Table Header */}
                 <HStack {...(AssignUsersStyles.tableHeaderHStack as ViewProps)}>
                   <Box flex={2}>
                     <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                       {t('admin.assignUsers.participant')}
                     </Text>
                   </Box>
                   <Box flex={2}>
                     <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                       {t('admin.assignUsers.email')}
                     </Text>
                   </Box>
                   <Box flex={1.5}>
                     <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                       {t('admin.filters.bio')}
                     </Text>
                   </Box>
                   <Box flex={1.5}>
                     <Text {...(AssignUsersStyles.tableHeaderText as TextProps)}>
                       {t('admin.filters.productivity')}
                     </Text>
                   </Box>
                 </HStack>

                 {/* Table Rows - Hardcoded + Dynamically Assigned */}
                 <VStack space="xs">
                   {/* Hardcoded Row: Mandla Zwane */}
                   <HStack {...(AssignUsersStyles.tableRowHStack as ViewProps)}>
                     <Box flex={2}>
                       <HStack {...(AssignUsersStyles.avatarHStack as ViewProps)}>
                         <Avatar {...(AssignUsersStyles.avatarBgStyles as ViewProps)}>
                           <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as TextProps)}>MZ</AvatarFallbackText>
                         </Avatar>
                         <VStack space="xs">
                           <Text {...(AssignUsersStyles.tableRowNameText as TextProps)}>
                             Mandla Zwane
                           </Text>
                           <Text {...(AssignUsersStyles.tableRowIdText as TextProps)}>
                             PAR-001
                           </Text>
                         </VStack>
                       </HStack>
                     </Box>
                     <Box flex={2}>
                       <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                         mandla.zwane@example.com
                       </Text>
                     </Box>
                     <Box flex={1.5}>
                       <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                         Youth Development
                       </Text>
                     </Box>
                     <Box flex={1.5}>
                       <Badge {...(AssignUsersStyles.productivityBadgeButton as ViewProps)} bg="$primary500">
                         <BadgeText {...(AssignUsersStyles.productivityBadgeText as TextProps)}>
                           High
                         </BadgeText>
                       </Badge>
                     </Box>
                   </HStack>

                   {/* Dynamically Assigned Participants */}
                   {assignedParticipants.map((participant, index) => {
                     // Get initials from name
                     const nameParts = participant.labelKey.split(' ');
                     const initials = nameParts.length > 1
                       ? `${nameParts[0][0]}${nameParts[1][0]}`
                       : nameParts[0].substring(0, 2).toUpperCase();

                     // Determine productivity badge color
                     const productivityColor = 
                       participant.productivity?.toLowerCase() === 'high' ? '$primary500' :
                       participant.productivity?.toLowerCase() === 'medium' ? '$textSecondary' :
                       '$white';

                     return (
                       <HStack
                         key={`${participant.value}-${index}`}
                         {...(AssignUsersStyles.tableRowHStack as ViewProps)}
                         borderBottomWidth={index === assignedParticipants.length - 1 ? 0 : 1}
                       >
                         <Box flex={2}>
                           <HStack {...(AssignUsersStyles.avatarHStack as ViewProps)}>
                             <Avatar {...(AssignUsersStyles.avatarBgStyles as ViewProps)}>
                               <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as TextProps)}>{initials}</AvatarFallbackText>
                             </Avatar>
                             <VStack space="xs">
                               <Text {...(AssignUsersStyles.tableRowNameText as TextProps)}>
                                 {participant.labelKey}
                               </Text>
                               <Text {...(AssignUsersStyles.tableRowIdText as TextProps)}>
                                 {participant.participantId}
                               </Text>
                             </VStack>
                           </HStack>
                         </Box>
                         <Box flex={2}>
                           <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                             {participant.email}
                           </Text>
                         </Box>
                         <Box flex={1.5}>
                           <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                             {participant.bio}
                           </Text>
                         </Box>
                         <Box flex={1.5}>
                           <Badge
                             {...(AssignUsersStyles.productivityBadgeButton as ViewProps)}
                             bg={productivityColor}
                           >
                             <BadgeText {...(AssignUsersStyles.productivityBadgeText as TextProps)}>
                               {participant.productivity}
                             </BadgeText>
                             
                           </Badge>
                         </Box>
                       </HStack>
                     );
                   })}
                 </VStack>
               </VStack>
             </Card>
           </>
         )}
       </>
     )}
   </VStack>
 );
};


export default AssignUsersScreen;