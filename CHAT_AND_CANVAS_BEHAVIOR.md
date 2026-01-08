# Chat and Main Canvas Functionality & Working Behavior

## Overview
The application uses a three-pane layout where the **RightPane (Chat)** and **MainCanvas** work together to provide an interactive AI-powered temple management interface. The chat handles user input and displays conversation, while the canvas dynamically renders contextual information and planner actions.

---

## Architecture Flow

```
User Input (RightPane)
    ↓
startSimulation() hook
    ↓
Query Processing (useSimulation.ts)
    ↓
Generate Sections & Messages
    ↓
Update State (sections, messages, status)
    ↓
Render in MainCanvas & RightPane
```

---

## 1. RightPane (Chat Interface) - `RightPane.tsx`

### Core Functionality

#### **Message Display**
- **Message Types:**
  - `user`: User queries (dark background, right-aligned)
  - `assistant`: AI responses (white background, left-aligned)
  - `system`: Status messages like "Planning..." (centered, with animated dots)

#### **Input Handling**
- **Text Input:** Users type queries in the input field
- **File Upload:** PDF files can be uploaded (extracts content and generates summary)
- **Quick Actions:** Pre-defined action buttons for common queries
- **Smart Recommendations:** Context-aware suggestions based on planner actions

#### **Key Features:**
1. **Typewriter Effect:** Assistant messages stream character-by-character for better UX
2. **Auto-scroll:** Messages automatically scroll to bottom when new messages arrive
3. **File Processing:** PDFs are extracted and summarized using `PDFExtractor`
4. **Recommendation Engine:** Generates contextual suggestions based on:
   - Planner action keywords (security, VIP, prasadam, approval, finance)
   - Current planner content
   - Query context

#### **State Management:**
- `messages`: Array of chat messages
- `status`: Current simulation status (`idle`, `generating`, `complete`)
- `sections`: Canvas sections data (shared with MainCanvas)

---

## 2. MainCanvas - `MainCanvas.tsx`

### Core Functionality

#### **Display Modes**

1. **Module Views** (when `activeModule` is set):
   - `Operations` → `OperationsView`
   - `People` → `PeopleView`
   - `Finance` → `FinanceView`
   - `Assets` → `AssetManagementView`
   - `Projects` → `ProjectsView`

2. **Dashboard Mode** (default, when no module active):
   - **Top Slot:** Focus card area (replaces "Today's Appointments")
   - **Bottom Slot:** Planner Actions & Insights section

#### **Section Types**

**Focus Sections** (`id` starts with `focus-`):
- `focus-appointments`: Shows appointments list
- `focus-approval` / `focus-approvals`: Shows pending approvals
- `focus-vip`: Shows VIP visits
- `focus-finance`: Shows financial summary
- `focus-alert`: Shows alerts
- `focus-ceo-card`: Executive mode card (special formatting)
- `focus-visit-*`: Visit protocol briefs
- `focus-event-*`: Event protocol briefs
- `focus-summary-*`: Summary cards

**Planner Section:**
- Title: "Your Planner Actions"
- Uses `InteractivePlannerActions` component
- Supports action assignment, deadlines, status tracking

**Insight Sections:**
- Additional contextual information
- Rendered as glass cards with typewriter effect

#### **Rendering Logic**

```typescript
// 1. Check for active module → show module view
if (activeModule === 'Operations') return <OperationsView />;

// 2. Dashboard mode
const visibleSections = sections.filter(s => s.isVisible);
const focusSection = sections.find(s => s.id.startsWith('focus-'));
const plannerSection = sections.find(s => s.title === 'Your Planner Actions');

// 3. Render focus card in top slot
// 4. Render planner & insights in bottom slot
```

#### **Typewriter Effect**
- Sections stream content character-by-character
- `visibleContent` gradually fills with `content`
- Creates smooth, progressive disclosure of information

---

## 3. useSimulation Hook - `useSimulation.ts`

### Core Processing Logic

#### **Query Processing Flow**

1. **Module Detection** (Early Exit):
   ```typescript
   const detectedModule = ModuleDetector.detectModule(query);
   if (detectedModule) {
     // Switch to module view, show message in chat
     return;
   }
   ```

2. **Special Query Handler** (Priority):
   - Handles VIP visits, appointments, approvals, etc.
   - Returns structured data for focus cards
   - Generates planner actions automatically

3. **Quick Action Handler**:
   - Processes common actions (show, approve, etc.)
   - Fast path for frequently used queries

4. **Data Lookup Service**:
   - Fetches information from mock data
   - Returns structured responses

5. **Flexible Query Parser**:
   - Fallback for general queries
   - Generates contextual responses

#### **Section Generation**

```typescript
CanvasSection {
  id: string;              // Unique identifier
  title: string;           // Section title
  subTitle?: string;       // Subtitle (for planner)
  content: string;         // Full content
  type: 'text' | 'list' | 'steps' | 'components';
  visibleContent: string;  // Currently visible (typewriter)
  isVisible: boolean;      // Has section started appearing?
}
```

#### **Typewriter Effect Implementation**

1. **Section Streaming:**
   - Sections appear one at a time
   - Each section streams its content character-by-character
   - `visibleContent` updates incrementally

2. **Chat Message Streaming:**
   - Assistant messages use typewriter effect
   - `fullText` stored, `text` updates progressively
   - 15ms per character for chat, variable for canvas

#### **Status Management**

- `idle`: No active query
- `generating`: Processing query, streaming content
- `complete`: Query finished, all content displayed

---

## 4. Data Flow Between Components

### State Sharing

```typescript
// page.tsx (Root Component)
const { status, messages, sections, startSimulation } = useSimulation();

// Passed to RightPane
<RightPane 
  messages={messages}
  status={status}
  sections={sections}
  onSendMessage={startSimulation}
/>

// Passed to MainCanvas
<MainCanvas 
  status={status}
  sections={sections}
  activeModule={activeModule}
/>
```

### Interaction Flow

1. **User sends message** → `RightPane.handleSend()`
2. **Calls** → `startSimulation(query)`
3. **Processes query** → Creates sections and messages
4. **Updates state** → `setSections()`, `setMessages()`, `setStatus()`
5. **Re-renders** → Both `RightPane` and `MainCanvas` update
6. **Typewriter effect** → Content streams progressively

---

## 5. Key Behaviors

### Focus Card Replacement
- When a focus section is created, it replaces the default "Today's Appointments" card
- The title updates dynamically based on focus section
- Visual indicator (pulsing dot) shows when focus is active

### Planner Actions
- Generated automatically from query context
- Supports interactive features:
  - Assign to employees/departments
  - Set deadlines
  - Mark as complete
  - Add notes

### File Upload Flow
1. User uploads PDF → `RightPane.handleFileSelect()`
2. Extract content → `PDFExtractor.extractAndSummarize()`
3. Simulate upload → Progress bar animation
4. Create `UploadedFile` object → Passed to `MainCanvas`
5. Display summary → `FileSummaryView` component in canvas

### Module Switching
- When module detected → `activeModule` state updates
- `MainCanvas` routes to module view
- Chat shows confirmation message
- Previous sections remain in state (can return to dashboard)

### Smart Recommendations
- Analyzes planner actions for keywords
- Generates contextual suggestions
- Only shows when planner actions exist and streaming is complete
- Clicking recommendation sends prefixed query: `[REC] {query}`

---

## 6. Visual States

### Generating State
- Status: `generating`
- Chat: Shows "Planning..." system message
- Canvas: Shows "Generating insight..." indicator
- Sections: Stream content progressively

### Complete State
- Status: `complete`
- Chat: All messages fully displayed
- Canvas: All sections visible, typewriter complete
- Recommendations: Appear if planner actions exist

### Idle State
- Status: `idle`
- Chat: Shows "Ready to help" with quick actions
- Canvas: Shows default dashboard (appointments, etc.)

---

## 7. Section Visibility Logic

```typescript
// Sections become visible when:
1. Section is created and added to sections array
2. Typewriter effect starts for that section
3. isVisible flag set to true
4. visibleContent starts filling

// MainCanvas filters:
const visibleSections = sections.filter(s => s.isVisible);
// But also checks all sections for focus detection:
const focusSection = sections.find(s => s.id.startsWith('focus-'));
```

---

## 8. Error Handling

- **Module Detection:** Falls back to dashboard if detection fails
- **JSON Parsing:** Try-catch blocks for parsing focus card data
- **File Upload:** Continues with empty content if extraction fails
- **Query Processing:** Falls back to flexible parser if special handlers don't match

---

## 9. Performance Optimizations

1. **Typewriter Effect:** Uses `setTimeout` with incremental delays
2. **Section Filtering:** Only renders visible sections
3. **Memoization:** Components use React hooks for optimization
4. **Lazy Rendering:** Module views only load when active

---

## 10. Key Interactions

### User Types Query
→ Chat shows user message immediately
→ Status changes to `generating`
→ Query processed in `useSimulation`
→ Sections created and streamed
→ Canvas updates progressively

### User Clicks Recommendation
→ Query prefixed with `[REC] `
→ Processed as recommendation
→ May merge with existing planner actions

### User Uploads File
→ Upload progress shown in chat
→ File processed and summarized
→ Summary appears in canvas
→ Can be referenced in subsequent queries

### User Switches Module
→ Module detected from query
→ `activeModule` state updates
→ Canvas routes to module view
→ Chat shows confirmation

---

## Summary

The chat and main canvas work as a unified system:
- **Chat** handles input/output and conversation flow
- **Canvas** displays contextual information and actions
- **useSimulation** orchestrates query processing and state management
- **Typewriter effects** create smooth, progressive disclosure
- **Smart recommendations** enhance user workflow
- **Module routing** provides specialized views when needed

Both components share the same state (`sections`, `messages`, `status`) and update in real-time as queries are processed, creating a seamless, interactive experience.


