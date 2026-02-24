import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { VStack, HStack, Button, Text, Card, Avatar, AvatarFallbackText, Box, Divider, LucideIcon, Badge, BadgeText  } from '@ui';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import type { ViewProps, TextProps } from 'react-native';
import {
 SearchFilter,
 ParticipantSearchFilter,
 participantFilterOptions,
 participantList,
 useSupervisorFilterOptions,
 useSiteFilterOptions,
} from '@constants/ASSIGN_USERS_FILTERS';
import UserAvatarCard from '@components/UserAvatarCard';
import { AssignUsersStyles } from './Styles';
import { theme } from '@config/theme';
import { getLinkageChampions, assignLCsToSupervisor, getMappedLCsForSupervisor } from '../../services/assignUsersService';
import { getInitials } from '@utils/helper';

// Type declaration for process.env (injected by webpack DefinePlugin on web, available in React Native)
declare const process:
  | {
      env: {
        [key: string]: string | undefined;
      };
    }
  | undefined;

const AssignUsersScreen = () => {
 const { t } = useLanguage();
 const AssignParticipantFilterOptions = [ParticipantSearchFilter, ...participantFilterOptions];
 type AssignTab = 'LC_TO_SUPERVISOR' | 'PARTICIPANT_TO_LC';


 const [activeTab, setActiveTab] = useState<AssignTab>('LC_TO_SUPERVISOR');
 const [selectedLc, setSelectedLc] = useState<any>(null);
 // State to store filter values for each UserAvatarCard
 const [supervisorFilterValues, setSupervisorFilterValues] = useState<
   Record<string, any>
 >({});
 // State for linkage champions fetched from API
 const [linkageChampions, setLinkageChampions] = useState<any[]>([]);
 const [isLoadingLCs, setIsLoadingLCs] = useState(false);
 
 // Get dynamic supervisor filter options (supervisor disabled until province is selected)
 const { filters: supervisorFilterOptions, supervisors: supervisorsData } = useSupervisorFilterOptions(supervisorFilterValues);
 
 // Get dynamic site filter options based on province selected in Step 1
 const { filters: siteFilterOptions } = useSiteFilterOptions(supervisorFilterValues.filterByProvince);
 
 // Combine search filter with dynamic site filter for Step 2
 const AssignLCFilterOptions = [SearchFilter, ...siteFilterOptions];
 
 // Find the selected supervisor object from supervisorsData
 // Match by id (number) or _id (string) or email, converting to string for comparison
 const selectedSupervisor = supervisorsData.find(
   (supervisor: any) => {
     const supervisorId = String(supervisor.id || supervisor._id || supervisor.email || '');
     const selectedId = String(supervisorFilterValues.selectSupervisor || '');
     return supervisorId === selectedId;
   }
 );
 
 const [lcFilterValues, setLcFilterValues] = useState<Record<string, any>>({});
 // State for mapped LCs from API
 const [mappedLCs, setMappedLCs] = useState<any[]>([]);
 const [isLoadingMappedLCs, setIsLoadingMappedLCs] = useState(false);
 // State for participant filters and selected participants
 const [participantFilterValues, setParticipantFilterValues] = useState<Record<string, any>>({});
 const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
 // State to track assigned participants
 const [assignedParticipants, setAssignedParticipants] = useState<any[]>([]);


 // Handler for supervisor and LC filter changes (combined in Step 1)
 const handleSupervisorFilterChange = (values: Record<string, any>) => {
   // Clear supervisor selection when province changes
   if (values.filterByProvince !== supervisorFilterValues.filterByProvince) {
     values.selectSupervisor = undefined;
     setAssignedParticipants([]);
     setSelectedLc(null);
     // Clear site filter in Step 2 when province changes
     setLcFilterValues((prev) => {
       const updated = { ...prev };
       delete updated.site;
       return updated;
     });
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
     // Find the LC object from linkageChampions
     const lc = linkageChampions.find((lc: any) => lc.value === values.selectLC);
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
 };


 // Handler for LC UserAvatarCard filter changes
 const handleLcFilterChange = (values: Record<string, any>) => {
   setLcFilterValues(values);
 };

 // Handler for when LCs are assigned to supervisor
 const handleAssignLCs = async (selectedLCs: any[]) => {
   try {
     // Get supervisor ID from selected supervisor
     if (!selectedSupervisor) {
       console.error('No supervisor selected');
       return;
     }

     const supervisorId = String((selectedSupervisor as any).id || (selectedSupervisor as any)._id || '');
     if (!supervisorId) {
       console.error('Supervisor ID not found');
       return;
     }

     // Get programId from environment variable
     // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
     const programId = process.env.GLOBAL_LC_PROGRAM_ID;
     if (!programId) {
       console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
       return;
     }

     // Extract LC user IDs from selected LCs
     const assignedUserIds = selectedLCs
       .map((lc) => String(lc.id || lc._id || ''))
       .filter((id) => id !== '');

     if (assignedUserIds.length === 0) {
       console.error('No valid LC IDs found');
       return;
     }

    // Call API to assign LCs to supervisor
    // Service function will throw error if status is not 200 or if response contains error
    await assignLCsToSupervisor({
      userId: supervisorId,
      programId: programId,
      assignedUserIds: assignedUserIds,
      assignedUsersStatus: 'ACTIVE',
    });

    // Refresh mapped LCs from API after assignment
    const mappedResponse = await getMappedLCsForSupervisor({
      userId: supervisorId,
      programId: programId,
      type: 'org_admin',
      page: 1,
      limit: 100,
      search: '',
    });

    // Transform API response to match expected format
    const lcs = (mappedResponse.result?.data || []).map((lc: any) => {
      const name = lc.name || '';
      const userId = lc.userId || '';
      const email = lc.userDetails?.email || '';
      const location = lc.userDetails?.location || '';
      const lcId = `LC-${String(userId).padStart(3, '0')}`;
      
      return {
        labelKey: name,
        value: String(userId),
        location: location,
        status: 'assigned',
        email: email,
        site: '',
        lcId: lcId,
        id: userId,
      };
    });
    
    setMappedLCs(lcs);
    
    // Return success indicator
    return { success: true };
  } catch (error) {
    console.error('Error assigning LCs to supervisor:', error);
    // Re-throw error so it can be caught by the modal handler
    throw error;
  }
 };

 // Filter out mapped LCs from the available list
 const getAvailableLCs = () => {
   const mappedLCValues = new Set(mappedLCs.map(lc => lc.value));
   return linkageChampions.filter((lc: any) => !mappedLCValues.has(lc.value));
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


 // Fetch linkage champions when province or site filters change
 useEffect(() => {
   const fetchLinkageChampions = async () => {
     try {
       setIsLoadingLCs(true);
       // Get programId from environment variable
       // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
       const programId = process.env.GLOBAL_LC_PROGRAM_ID;
       
       if (!programId) {
         console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
         setLinkageChampions([]);
         return;
       }
       
       // Get province from supervisor filter values (Step 1)
       const province = supervisorFilterValues.filterByProvince;
       // Get site from LC filter values (Step 2)
       const site = lcFilterValues.site;
       
       const response = await getLinkageChampions(programId, {
         excludeMapped: true,
         limit: 100,
         province: province,
         site: site,
       });
       
       // Transform API response to match expected format
       const lcs = (response.result?.data || []).map((lc: any) => {
         const name = lc.name || lc.full_name || lc.email || 'Unknown';
         const value = lc.id || lc._id || lc.email || name;
         // Extract location from meta or use default
         const location = lc.meta?.location || lc.location || '';
         
         return {
           labelKey: name,
           value: String(value),
           location: location,
           status: 'unassigned',
           email: lc.email || '',
           id: value,
         };
       });
       
       setLinkageChampions(lcs);
     } catch (error) {
       console.error('Error fetching linkage champions:', error);
       setLinkageChampions([]);
     } finally {
       setIsLoadingLCs(false);
     }
   };

   fetchLinkageChampions();
 }, [supervisorFilterValues.filterByProvince, lcFilterValues.site]);

 // Fetch mapped LCs when supervisor is selected
 useEffect(() => {
   const fetchMappedLCs = async () => {
     if (!selectedSupervisor || !supervisorFilterValues.selectSupervisor) {
       setMappedLCs([]);
       return;
     }

     try {
       setIsLoadingMappedLCs(true);
       // Get programId from environment variable
       // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
       const programId = process.env.GLOBAL_LC_PROGRAM_ID;
       
       if (!programId) {
         console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
         setMappedLCs([]);
         return;
       }

       const supervisorId = String((selectedSupervisor as any).id || (selectedSupervisor as any)._id || '');
       if (!supervisorId) {
         console.error('Supervisor ID not found');
         setMappedLCs([]);
         return;
       }

       const response = await getMappedLCsForSupervisor({
         userId: supervisorId,
         programId: programId,
         type: 'org_admin',
         page: 1,
         limit: 100,
         search: '',
       });

       // Transform API response to match expected format
       const lcs = (response.result?.data || []).map((lc: any) => {
         const name = lc.name || '';
         const userId = lc.userId || '';
         const email = lc.userDetails?.email || '';
         const location = lc.userDetails?.location || '';
         const lcId = `LC-${String(userId).padStart(3, '0')}`;
         
         return {
           labelKey: name,
           value: String(userId),
           location: location,
           status: 'assigned',
           email: email,
           site: '',
           lcId: lcId,
           id: userId,
         };
       });
       
       setMappedLCs(lcs);
     } catch (error) {
       console.error('Error fetching mapped LCs:', error);
       setMappedLCs([]);
     } finally {
       setIsLoadingMappedLCs(false);
     }
   };

   fetchMappedLCs();
 }, [selectedSupervisor, supervisorFilterValues.selectSupervisor]);
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
         <UserAvatarCard
           title="admin.assignUsers.step1SelectSupervisor"
           description="admin.assignUsers.filterByProvince"
           filterOptions={supervisorFilterOptions}
           onChange={handleSupervisorFilterChange}
           selectedValues={{
             ...supervisorFilterValues,
             selectedSupervisorData: selectedSupervisor, // Pass full supervisor object
           }}
           showSelectedCard={!!supervisorFilterValues.selectSupervisor}
           showLcList={false}
         />


        {supervisorFilterValues.selectSupervisor && (
          <>
            <UserAvatarCard
              title="admin.assignUsers.step2AssignLinkageChampions"
              description="admin.assignUsers.filterByGeography"
              filterOptions={AssignLCFilterOptions}
              onChange={handleLcFilterChange}
              selectedValues={{
                ...lcFilterValues,
                selectedSupervisorData: selectedSupervisor, // Pass full supervisor object
                selectSupervisor: supervisorFilterValues.selectSupervisor, // Pass supervisor ID as fallback
              }}
              showLcList={true}
              onAssign={handleAssignLCs}
              lcList={getAvailableLCs()}
            />

            {/* List of LCs Mapped to Supervisor from API */}
            <Card {...(AssignUsersStyles.tableCardStyles as ViewProps)}>
              <VStack width="100%">
                <VStack space="xs">
                  <Text {...(AssignUsersStyles.tableTitleText as TextProps)}>
                    {t('admin.assignUsers.listOfLcsMappedToSupervisor')}
                  </Text>
                  <Text {...(AssignUsersStyles.tableSubtitleText as TextProps)}>
                    {t('admin.assignUsers.currentLcAssignmentsFor').replace(
                      '{{supervisor}}',
                      (selectedSupervisor as any)?.name || supervisorFilterValues.selectSupervisor || 'Supervisor'
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

                {/* Table Rows - From API */}
                {isLoadingMappedLCs ? (
                  <VStack space="xs" p="$4" alignItems="center">
                    <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                      {t('common.loading')}
                    </Text>
                  </VStack>
                ) : mappedLCs.length === 0 ? (
                  <VStack space="xs" p="$4" alignItems="center">
                    <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
                      {t('common.noDataFound')}
                    </Text>
                  </VStack>
                ) : (
                  <VStack space="xs" backgroundColor="$white">
                    {mappedLCs.map((lc, index) => {
                      // Get initials from name using common utility function
                      const initials = getInitials(lc.labelKey);

                      return (
                        <HStack
                          key={`${lc.value}-${index}`}
                          {...(AssignUsersStyles.tableRowHStack as ViewProps)}
                          borderBottomWidth={index === mappedLCs.length - 1 ? 0 : 1}
                        >
                          <Box flex={2}>
                            <HStack {...(AssignUsersStyles.avatarHStack as ViewProps)}>
                              <Box {...(AssignUsersStyles.avatarBgStyles as ViewProps)}>
                                <Text {...(AssignUsersStyles.avatarFallbackTextStyles as TextProps)}>{initials}</Text>
                              </Box>
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
                              <LucideIcon name="MapPin" size={12} color={theme.tokens.colors.textMutedForeground} />
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
                )}
              </VStack>
            </Card>
          </>
        )}
      </>
    )}


     {activeTab === 'PARTICIPANT_TO_LC' && (
       <>
         <UserAvatarCard
           title="admin.assignUsers.step1SelectSupervisorAndLC"
           description="admin.assignUsers.chooseSupervisor"
           filterOptions={[
             // Supervisor filter - use dynamic data from API
             {
               nameKey: 'admin.filters.selectSupervisor',
               attr: 'selectSupervisor',
               type: 'select',
               placeholderKey: 'admin.filters.chooseSupervisor',
               data: supervisorsData.map((supervisor: any) => {
                 const name = supervisor.name || supervisor.full_name || supervisor.email || 'Unknown';
                 const value = String(supervisor.id || supervisor._id || supervisor.email || name);
                 return {
                   label: name,
                   value: value,
                 };
               }),
             },
             // LC filter - populated dynamically based on selected supervisor (use mapped LCs)
             {
               nameKey: 'admin.filters.selectLC',
               attr: 'selectLC',
               type: 'select',
               placeholderKey: 'admin.filters.chooseLC',
               data: supervisorFilterValues.selectSupervisor && mappedLCs.length > 0
                 ? mappedLCs.map((lc: any) => ({
                     labelKey: lc.labelKey,
                     value: lc.value,
                   }))
                 : [],
             },
           ]}
           onChange={handleSupervisorFilterChange}
           selectedValues={{ ...supervisorFilterValues, selectLC: selectedLc?.value }}
           showSelectedCard={false}
           showLcList={false}
         />

         {selectedLc && (
           <>
             <UserAvatarCard
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
                    const isOutlineBadge = productivityColor === '$white';
                    const productivityTextColor =
                      participant.productivity?.toLowerCase() === 'high'
                        ? '$primary500'
                        : participant.productivity?.toLowerCase() === 'medium'
                          ? '$textSecondary'
                          : '$textMutedForeground';

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
                          <HStack justifyContent="flex-end">
                            <Badge
                              {...(AssignUsersStyles.productivityBadgeButton as ViewProps)}
                              variant={isOutlineBadge ? 'outline' : 'solid'}
                              bg={isOutlineBadge ? '$white' : productivityColor}
                              borderColor={isOutlineBadge ? '$border300' : productivityColor}
                              px="$2"
                              py="$1"
                              borderRadius="$lg"
                            >
                              <BadgeText
                                {...(AssignUsersStyles.productivityBadgeText as TextProps)}
                                color={isOutlineBadge ? productivityTextColor : '$white'}
                              >
                                {participant.productivity}
                              </BadgeText>
                            </Badge>
                          </HStack>
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