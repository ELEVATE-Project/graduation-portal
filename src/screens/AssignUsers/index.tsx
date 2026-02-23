import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { VStack, HStack, Button, Text, Card, Avatar, AvatarFallbackText, Box, Divider, LucideIcon, Badge, BadgeText, Checkbox, CheckboxIndicator, CheckboxIcon, CheckIcon  } from '@ui';
import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import type { ViewProps, TextProps } from 'react-native';
import DataTable from '@components/DataTable';
import type { ColumnDef } from '@app-types/components';
import {
  SearchFilter,
  ParticipantSearchFilter,
  participantFilterOptions,
  useSupervisorFilterOptions,
  useSiteFilterOptions,
  useParticipantFilterOptions,
} from '@constants/ASSIGN_USERS_FILTERS';
import UserAvatarCard from '@components/UserAvatarCard';
import { AssignUsersStyles } from './Styles';
import { theme } from '@config/theme';
import { getLinkageChampions, assignLCsToSupervisor, getMappedLCsForSupervisor, getParticipants, assignParticipantsToLC, getMappedParticipantsForLC } from '../../services/assignUsersService';
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
 // State for participants fetched from API
 const [participants, setParticipants] = useState<any[]>([]);
 const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
 // State for mapped participants from API
 const [mappedParticipants, setMappedParticipants] = useState<any[]>([]);
 const [isLoadingMappedParticipants, setIsLoadingMappedParticipants] = useState(false);
 // Pagination state for mapped participants table
 const [mappedParticipantsPage, setMappedParticipantsPage] = useState(1);
 const [mappedParticipantsPageSize, setMappedParticipantsPageSize] = useState(5);
 const [mappedParticipantsTotal, setMappedParticipantsTotal] = useState(0);

 // Get dynamic participant filter options (Province and Site)
 const { filters: participantProvinceSiteFilters } = useParticipantFilterOptions(participantFilterValues.filterByProvince);
 const AssignParticipantFilterOptions = [ParticipantSearchFilter, ...participantProvinceSiteFilters];

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
    // Find the LC object from mappedLCs (for Participant to LC flow) or linkageChampions (for LC to Supervisor flow)
    const lc = mappedLCs.find((lc: any) => lc.value === values.selectLC) || 
               linkageChampions.find((lc: any) => lc.value === values.selectLC);
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
 const handleAssignParticipants = async (selectedParticipants: any[]) => {
   try {
     // Get LC's user ID from selectedLc
     if (!selectedLc) {
       throw new Error('No LC selected');
     }
     
     const lcId = String(selectedLc.id || selectedLc.value || '');
     if (!lcId) {
       throw new Error('LC ID is missing');
     }
     
     // Get programId from environment variable
     // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
     const programId = process.env.GLOBAL_LC_PROGRAM_ID;
     if (!programId) {
       throw new Error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
     }
     
     // Extract participant IDs from selectedParticipants
     const participantIds = selectedParticipants.map((p: any) => String(p.id || p.value || '')).filter((id: string) => id);
     
     if (participantIds.length === 0) {
       throw new Error('No valid participant IDs found');
     }
     
     // Call API to assign participants to LC
     await assignParticipantsToLC({
       userId: lcId,
       programId: programId,
       assignedUserIds: participantIds,
       assignedUsersStatus: 'NOT_ONBOARDED',
     });
     
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
     
     // Return success indicator
     return { success: true };
   } catch (error) {
     console.error('Error assigning participants to LC:', error);
     // Re-throw error so it can be caught by the modal handler
     throw error;
   }
 };

// Filter out assigned participants from the available list
const getAvailableParticipants = () => {
  const assignedParticipantValues = new Set(assignedParticipants.map(p => p.value));
  // Use API participants data
  return participants.filter((p: any) => !assignedParticipantValues.has(p.value));
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

// Fetch participants when LC is selected in Participant to LC flow or when filters change
useEffect(() => {
  const fetchParticipants = async () => {
    // Only fetch participants when in Participant to LC flow and LC is selected
    if (activeTab !== 'PARTICIPANT_TO_LC' || !selectedLc) {
      setParticipants([]);
      return;
    }

    try {
      setIsLoadingParticipants(true);
      // Get programId from environment variable
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      
      if (!programId) {
        console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
        setParticipants([]);
        return;
      }
      
      // Get province and site from participant filter values
      const province = participantFilterValues.filterByProvince;
      const site = participantFilterValues.site;
      const search = participantFilterValues.search;
      
      const response = await getParticipants(programId, {
        excludeMapped: true,
        limit: 100,
        province: province && province !== 'all-provinces' && province !== 'all-Provinces' ? province : undefined,
        site: site && site !== 'all-sites' ? site : undefined,
        search: search && String(search).trim() ? String(search).trim() : undefined,
      });
      
      // Transform API response to match expected format
      const participantsData = (response.result?.data || []).map((participant: any) => {
        const name = participant.name || participant.full_name || participant.email || 'Unknown';
        const value = String(participant.id || participant._id || participant.email || name);
        const email = participant.email || participant.userDetails?.email || '';
        
        // Extract province and site from userDetails
        const province = participant.province?.label || participant.userDetails?.province?.label || '';
        const site = participant.site?.label || participant.userDetails?.site?.label || participant.userDetails?.district?.label || participant.userDetails?.local_municipality?.label || '';
        
        // Build location string with province and site
        const locationParts = [];
        if (province) locationParts.push(province);
        if (site) locationParts.push(site);
        const location = locationParts.length > 0 ? locationParts.join(' • ') : '';
        
        return {
          labelKey: name,
          value: value,
          location: location,
          province: province,
          site: site,
          status: 'unassigned',
          email: email,
          id: participant.id || participant._id,
        };
      });
      
      setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  fetchParticipants();
}, [
  selectedLc,
  activeTab,
  participantFilterValues.filterByProvince,
  participantFilterValues.site,
  participantFilterValues.search,
]);

// Fetch mapped participants when LC is selected in Participant to LC flow
useEffect(() => {
  const fetchMappedParticipants = async () => {
    // Only fetch when in Participant to LC flow and LC is selected
    if (activeTab !== 'PARTICIPANT_TO_LC' || !selectedLc) {
      setMappedParticipants([]);
      return;
    }

    try {
      setIsLoadingMappedParticipants(true);
      // Get programId from environment variable
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      
      if (!programId) {
        console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
        setMappedParticipants([]);
        return;
      }
      
      const lcId = String(selectedLc.id || selectedLc.value || '');
      if (!lcId) {
        setMappedParticipants([]);
        return;
      }
      
      const response = await getMappedParticipantsForLC({
        userId: lcId,
        programId: programId,
        type: 'user',
        page: mappedParticipantsPage,
        limit: mappedParticipantsPageSize,
        search: '',
      });
      
      // Get total count from API response
      const totalCount = response.total || response.result?.total || response.result?.count || 0;
      setMappedParticipantsTotal(totalCount);
      
      // Transform API response to match expected format
      const participantsData = (response.result?.data || []).map((participant: any) => {
        const name = participant.name || participant.userDetails?.name || participant.email || 'Unknown';
        const userId = participant.userId || participant.userDetails?.id || '';
        const email = participant.userDetails?.email || participant.email || '';
        const province = participant.userDetails?.province?.label || '-';
        const site = participant.userDetails?.site?.label || participant.userDetails?.district?.label || participant.userDetails?.local_municipality?.label || '-';
        
        return {
          labelKey: name,
          value: String(userId),
          email: email,
          province: province,
          site: site,
          id: userId,
        };
      });
      
      setMappedParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching mapped participants:', error);
      setMappedParticipants([]);
    } finally {
      setIsLoadingMappedParticipants(false);
    }
  };

  fetchMappedParticipants();
}, [activeTab, selectedLc, mappedParticipantsPage, mappedParticipantsPageSize]);

// Define columns for mapped participants table (moved outside conditional render to avoid React hooks error)
const mappedParticipantsColumns: ColumnDef<any>[] = useMemo(() => [
  {
    key: 'participant',
    label: 'admin.assignUsers.participant',
    align: 'left',
    flex: 2,
    render: (item: any) => (
      <HStack {...(AssignUsersStyles.avatarHStack as ViewProps)}>
        <Avatar {...(AssignUsersStyles.avatarBgStyles as ViewProps)}>
          <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as TextProps)}>
            {getInitials(item.labelKey)}
          </AvatarFallbackText>
        </Avatar>
        <VStack space="xs">
          <Text {...(AssignUsersStyles.tableRowNameText as TextProps)}>
            {item.labelKey}
          </Text>
          <Text {...(AssignUsersStyles.tableRowIdText as TextProps)}>
            PAR-{String(item.id || item.value || '').padStart(3, '0')}
          </Text>
        </VStack>
      </HStack>
    ),
  },
  {
    key: 'email',
    label: 'admin.assignUsers.email',
    align: 'left',
    flex: 2,
    render: (item: any) => (
      <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
        {item.email || '-'}
      </Text>
    ),
  },
  {
    key: 'province',
    label: 'admin.users.province',
    align: 'left',
    flex: 1.2,
    render: (item: any) => (
      <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
        {item.province || '-'}
      </Text>
    ),
  },
  {
    key: 'site',
    label: 'admin.users.site',
    align: 'left',
    flex: 1.2,
    render: (item: any) => (
      <Text {...(AssignUsersStyles.tableRowDataText as TextProps)}>
        {item.site || '-'}
      </Text>
    ),
  },
], []);

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
               isLoading={isLoadingParticipants}
               lcList={getAvailableParticipants().map((p: any) => {
                 // Build location string with province and site
                 const locationParts = [];
                 if (p.province) locationParts.push(p.province);
                 if (p.site) locationParts.push(p.site);
                 const location = locationParts.length > 0 ? locationParts.join(' • ') : '';
                 
                 return {
                   labelKey: p.labelKey,
                   value: p.value,
                   location: location,
                   province: p.province,
                   site: p.site,
                   status: p.status,
                 };
               })}
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

                 <Box marginTop="$1">
                   <DataTable
                     data={mappedParticipants || []}
                     columns={mappedParticipantsColumns}
                     getRowKey={(item: any) => item.value}
                     isLoading={isLoadingMappedParticipants}
                     emptyMessage="common.noDataFound"
                     responsive={true}
                     pagination={{
                       enabled: true,
                       pageSize: mappedParticipantsPageSize,
                       maxPageNumbers: 5,
                       showPageSizeSelector: true,
                       pageSizeOptions: [5, 10, 25, 50],
                       serverSide: {
                         total: mappedParticipantsTotal,
                         count: mappedParticipantsPage,
                       },
                     }}
                     onPageChange={setMappedParticipantsPage}
                     onPageSizeChange={(size: number) => {
                       setMappedParticipantsPageSize(size);
                       setMappedParticipantsPage(1); // Reset to first page when page size changes
                     }}
                   />
                 </Box>
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