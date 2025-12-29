# Project Player - Feature Documentation

## Overview

The **Project Player** is a reusable, mode-driven component (`<ProjectPlayer />`) that enables Learning Coordinators (LC) to view, preview, and edit project templates and project instances using a unified interface across web and native platforms.

## User Story

**As a Learning Coordinator (LC),**  
I want to view, preview, and edit project templates and project instances using a unified Project Player  
**So that** I can complete tasks, upload files, fill observations, manage nested project tasks, and view progress in a consistent UI across web and native.

---

## Component Architecture

The Project Player loads a project template or project instance based on the provided `config` and `data` props.

### Props Interface

```typescript
interface ProjectPlayerConfig {
  mode: 'preview' | 'edit' | 'read-only';
  solutionId?: string;
  projectId?: string;
  permissions?: {
    canEdit: boolean;
    canAddTask: boolean;
    canDelete: boolean;
  };
  maxFileSize?: number; // Maximum file size in MB (default: 10)
  baseUrl?: string; // API base URL
  accessToken?: string; // Authentication token
  language?: string; // UI language (e.g., 'en', 'ar', 'es')
  profileInfo?: {
    id: number | string;
    name: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
  redirectionLinks?: {
    unauthorizedRedirectUrl?: string;
    loginRedirectUrl?: string;
    homeRedirectUrl?: string;
    [key: string]: any;
  };
}

interface ProjectPlayerData {
  solutionId?: string;
  projectId?: string;
  data?: ProjectData;
}
```

---

## Operating Modes

### 🔹 Preview Mode

**Trigger Conditions:**

- `config.mode = "preview"` OR
- Only `solutionId` is provided (no `projectId`)

**Behavior:**

- Loads template details via `GET /template/details/:solutionId`
- Renders tasks in **read-only state**
- Allows **Add Custom Task** using the add-task form (if enabled)
- **No** edit, delete, or status change allowed

**API Endpoint:**

```
GET /template/details/:solutionId
```

---

### 🔹 Read-Only Mode

**Trigger Conditions:**

- User does not have edit permissions OR
- API restricts edits

**Behavior:**

- Same UI as Preview mode
- Entire UI is **non-interactive** except viewing
- No modifications allowed

---

### 🔹 Edit Mode

**Trigger Conditions:**

- `config.mode = "edit"` AND
- Both `solutionId` + `projectId` are available

**Behavior:**

- Loads project instance details via `GET /project/details/:projectId`

**Allowed Actions:**

- ✅ Mark task as complete / pending / submitted
- ✅ Upload files (Simple Task)
- ✅ Open Observation Form (Observation type)
- ✅ Add nested tasks
- ✅ Add custom tasks
- ✅ Edit project-as-task structure

**API Endpoint:**

```
GET /project/details/:projectId
```

---

## Rendering Rules

The Project Player uses conditional rendering based on task types:

| Task Type        | Rendering Component                                    |
| ---------------- | ------------------------------------------------------ |
| `simple`         | `<TaskCard />`                                         |
| `file upload`    | `<TaskCard />` with `<UploadComponent />`              |
| `profile update` | `<TaskCard />`                                         |
| `observation`    | `<TaskCard />` with Observation Form trigger           |
| `project`        | `<Accordion />` with nested `<TaskComponent />` inside |

---

## Implementation Steps

### Step 1 — Create Folder Structure

See [Folder Structure](#folder-structure) section below.

### Step 2 — Setup `<ProjectPlayer />` Wrapper

**Responsibilities:**

1. Read `config` + `data` props
2. Detect mode
3. Load appropriate data
4. Setup `GlobalProvider`

**Logic:**

```typescript
if (config.mode === 'edit' && data.projectId) {
  loadProjectDetails();
} else {
  loadTemplateDetails();
}
```

**Context Provided:**

- `projectData`
- `updateTask()`
- `updateProjectInfo()`
- `saveLocal()`

---

### Step 3 — Load Template / Project Details

#### Preview Mode

```typescript
GET /template/details/:solutionId
→ Set projectData
```

#### Edit Mode

```typescript
if (localProjectExists) {
  loadLocalData();
} else {
  GET /project/details/:projectId
}
```

---

### Step 4 — Render `<ProjectComponent />`

**Component Structure:**

```tsx
<ProjectComponent>
  <ProjectInfoCard />

  {tasks.map(task =>
    task.type === 'project' ? (
      <Accordion>
        <TaskComponent />
      </Accordion>
    ) : (
      <TaskComponent />
    ),
  )}
</ProjectComponent>
```

---

### Step 5 — Implement `<TaskComponent />` Logic

#### Preview / Read-Only Mode

- Disable all action buttons
- Render only:
  - Title
  - Description
  - Status
  - File thumbnails

#### Edit Mode

| Task Type     | Actions                          |
| ------------- | -------------------------------- |
| `file`        | Show `<UploadComponent />`       |
| `observation` | Show "Complete Form" button      |
| `simple`      | Show checkbox or status switch   |
| `project`     | Show accordion with nested tasks |

---

### Step 6 — Implement `<UploadComponent />`

**Handles:**

- 📷 Camera input (native)
- 📁 File picker (web)

**Storage:**

- **Web:** IndexedDB
- **Native:** Local FileSystem

**Features:**

- File preview
- Multiple file upload
- File type validation
- Size restrictions

---

### Step 7 — Observation Form Integration

**Flow:**

1. User clicks "Complete Form" on observation task
2. Modal opens with `DynamicFormLibrary`
3. Form schema loaded from task config
4. On submit:
   - Validate data
   - Save to local storage
   - Update task status
   - Sync to API (if online)

---

### Step 8 — Add Task Flow

**Implementation:**

1. Show modal with `<AddTaskForm />`
2. Use `DynamicFormLibrary` to render schema
3. On save:
   - Validate input
   - Add new task to `projectData.tasks`
   - Update local storage
   - Sync to API

**Form Fields:**

- Task Name
- Task Type (dropdown)
- Description
- Due Date (optional)
- Attachments (optional)

---

### Step 9 — Save & Sync Mechanism

**Local State Management:**

- Updates after every modification
- Debounced auto-save to local storage (500ms)

**Sync Strategy:**

- Manual sync button
- Auto-sync on task completion
- Periodic background sync (future enhancement)

**Conflict Resolution:**

- Last-write-wins
- Server timestamp comparison
- Manual merge UI (future enhancement)

---

## Folder Structure

```
/src/project-player/
│
├── index.tsx                 // <ProjectPlayer /> entry point
│
├── hooks/
│   ├── useProjectLoader.ts   // Load template/project data
│   ├── useLocalStorage.ts    // Local storage management
│   ├── useTaskActions.ts     // Task CRUD operations
│   └── useSyncManager.ts     // Sync logic
│
├── context/
│   └── ProjectContext.tsx    // GlobalProvider for project state
│
├── components/
│   ├── ProjectComponent/
│   │   ├── index.tsx
│   │   ├── ProjectInfoCard.tsx
│   │   ├── TaskComponent.tsx
│   │   ├── ProjectAsTaskComponent.tsx
│   │   └── helpers.ts
│   │
│   └── Task/
│       ├── TaskCard.tsx
│       ├── TaskStatus.tsx
│       ├── UploadComponent.tsx
│       ├── ObservationPopupForm.tsx
│       └── TaskAccordion.tsx
│
├── utils/
│   ├── api.ts               // API calls
│   ├── taskUtils.ts         // Task manipulation helpers
│   ├── validators.ts        // Form validation
│   └── storage.ts           // IndexedDB/FileSystem abstraction
│
└── types/
    ├── project.types.ts
    ├── task.types.ts
    ├── form.types.ts
    ├── components.types.ts
    └── index.ts
```

**Note:** UI components are imported from global `@ui` folder. Forms folder removed (not needed currently).

---

## Data Models

### Project Data Structure

```typescript
interface ProjectData {
  _id: string;
  solutionId: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'submitted';
  progress: number;
  tasks: Task[];
  metaData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

### Task Data Structure

```typescript
interface Task {
  _id: string;
  name: string;
  description?: string;
  type: 'simple' | 'file' | 'observation' | 'project' | 'profile-update';
  status: 'pending' | 'in-progress' | 'completed' | 'submitted';
  isRequired: boolean;
  children?: Task[]; // For nested project tasks
  attachments?: Attachment[];
  observationFormId?: string;
  metadata?: Record<string, any>;
}
```

### Attachment Structure

```typescript
interface Attachment {
  _id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  localPath?: string;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  createdAt: string;
}
```

---

## API Endpoints

### Get Template Details

```
GET /template/details/:solutionId

Response:
{
  data: {
    _id: string;
    name: string;
    description: string;
    tasks: Task[];
  }
}
```

### Get Project Details

```
GET /project/details/:projectId

Response:
{
  data: ProjectData
}
```

### Update Task Status

```
PATCH /project/:projectId/task/:taskId

Body:
{
  status: 'completed' | 'pending' | 'submitted'
}
```

### Upload File

```
POST /project/:projectId/task/:taskId/upload

Body: FormData
{
  file: File
}
```

### Add Custom Task

```
POST /project/:projectId/task

Body:
{
  name: string;
  type: string;
  description?: string;
}
```

---

## State Management

### Context Structure

```typescript
interface ProjectContextValue {
  projectData: ProjectData | null;
  isLoading: boolean;
  error: Error | null;
  mode: 'preview' | 'edit' | 'read-only';

  // Actions
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateProjectInfo: (updates: Partial<ProjectData>) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  saveLocal: () => void;
  syncToServer: () => Promise<void>;
}
```

---

## Key Features Summary

✅ **Mode-Driven Architecture**

- Preview, Edit, and Read-Only modes
- Automatic mode detection based on props and permissions

✅ **Nested Project Support**

- Projects can contain other projects (accordion-based)
- Recursive task rendering

✅ **File Upload Management**

- Cross-platform file picker
- Local storage (IndexedDB/FileSystem)
- Upload progress tracking

✅ **Dynamic Forms**

- Observation forms rendered dynamically
- Add task form with schema validation

✅ **Offline Support**

- Local data storage
- Sync mechanism
- Conflict resolution

✅ **Responsive UI**

- Works on web and native
- Uses Gluestack UI components
- Consistent styling across platforms

---

## Development Guidelines

### Component Design Principles

1. **Use Gluestack UI components first** - Maintain consistency with project design system
2. **Platform compatibility** - All libraries must support both web and native
3. **Reusability** - Build modular, composable components
4. **Type safety** - Use TypeScript interfaces for all data structures

### Testing Strategy

1. Unit tests for utilities and hooks
2. Component tests for UI elements
3. Integration tests for API calls
4. E2E tests for critical flows

### Performance Considerations

1. Lazy load nested projects
2. Virtual scrolling for large task lists
3. Debounced auto-save
4. Optimistic UI updates

---

## Future Enhancements

- [ ] Collaborative editing
- [ ] Real-time sync
- [ ] Task comments and mentions
- [ ] Rich text editor for descriptions
- [ ] Task templates library
- [ ] Analytics and reporting
- [ ] Export to PDF
- [ ] Task dependencies and scheduling

---

## References

- [Gluestack UI Documentation](https://ui.gluestack.io/)
- [React Navigation](https://reactnavigation.org/)
- Project API Documentation (internal)

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Maintained by:** BRAC Development Team
