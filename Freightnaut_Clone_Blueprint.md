# MASTER DEVELOPER BLUEPRINT: FREIGHTNAUT SAAS CLONE
**Project Type:** Full-Stack Web Application (SaaS)
**Primary Tech Stack:** Next.js (React), Tailwind CSS, Zustand (State Management), Prisma ORM + SQLite (for local prototyping).
**Design Paradigm:** Light-theme, enterprise SaaS with rounded corners, subtle shadows, and a blue/indigo primary accent (`#1E3A8A` / `#3B82F6`).

---

## 1. GLOBAL LAYOUT & NAVIGATION
The application uses a persistent left sidebar and a top app bar.

### 1.1 Left Sidebar (Dark Blue/Navy Background)
* **Header:** User Profile (e.g., "Shree Krishna", "1 member").
* **Navigation Links (with standard Material/Lucide icons):**
  * Dashboard
  * Export Docs
  * Shipments
  * Tracking
  * Products
  * Packages
  * Contacts
  * Inventory
  * Accounting
* **Footer Navigation:**
  * Settings
  * Sign Out

### 1.2 Top App Bar
* Global Search Bar (`Search by name, type, reference, tracking ID, or container number`).
* App Menu grid icon.
* Notification Bell.
* Create Shipment Button (`+ Create Shipment`).

---

## 2. CORE DATABASE SCHEMA (Prisma/SQLite)
Generic schema to support the exact modules seen in the video.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./freightnaut.db"
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  role  String  @default("Admin")
}

model Shipment {
  id               Int      @id @default(autoincrement())
  shipment_name    String
  shipment_number  String   @unique
  mode_of_transport String  // SEA, AIR, ROAD, RAIL
  type_of_shipment  String  // LCL, FCL
  status           String   @default("Draft") // Draft, Untracked, New, In Progress, Booked, Loaded, Sailing, Arrived, Discharged, Delivered
  created_at       DateTime @default(now())
}

model Document {
  id          Int      @id @default(autoincrement())
  doc_name    String
  doc_type    String   // Commercial Invoice, Packing List, etc.
  linked_shipment String?
  created_by  String
  updated_at  DateTime @default(now())
}
```

---

## 3. SCREEN-BY-SCREEN SPECIFICATIONS (From Video Walkthrough)

### Screen 1: Dashboard (`/dashboard`)

* **Header:** "Good afternoon, [User Name]" with a "Year to date" date-picker dropdown.
* **Top KPI Strip (4 Cards):**
1. TOTAL INVOICED ($0)
2. TOTAL BUYERS (0)
3. TOTAL SHIPMENTS (2)
4. TOTAL PRODUCTS (0)


* **Main Grid Layout:**
* **Revenue Trend (Chart Area):** Empty state reads "No revenue data available. Revenue analytics will appear once invoices are generated."
* **Shipment by Status (List):** Shows progress percentages for Untracked, Booked, Sailing, Completed.
* **Top Destinations (Map/List):** Empty state reads "No destination data yet."
* **Buyer Insights (Right Sidebar):** Sections for 'Top buyers' ("No buyers registered yet") and 'Buyer concentration' ("Not enough data to calculate").
* **Top Products (Bottom List):** Empty state reads "No products added yet."



### Screen 2: Export Docs (`/export-docs`)

* **Tabs:** `My Documents` | `Document Studio`
* **My Documents View:**
* Search bar, `+ Create Document` button.
* Datatable: `Document` (Icon + Name), `Linked shipment`, `Created by`, `Updated by`, `Updated on`, `Action` (3-dots menu).


* **Document Studio (Template Builder):**
* "Start Creating" block.
* Template Gallery Modal featuring distinct cards: Bill of Lading, Certificate of Origin, Commercial Invoice, Packing List, Proforma Invoice, Declaration of Origin, Bill of Exchange, Quotation, Phytosanitary Certificate, Non Asbestos Declaration, Forwarding Instruction, Shipping Document.


* **Document Editor:**
* Split/Form view for Commercial Invoice.
* Fields: Exporter, Invoice Number, Bill of Lading Number, Consignee, Method of Dispatch, Type of Shipment, Port of Loading, Port of Discharge.
* Line items grid. Footer with "Signatory Company" and "Upload Signature" drag-and-drop box.



### Screen 3: Shipments (`/shipments`)

* **List View:**
* Card-based layout. Example cards: "Milk Powder - UAE Consignment" and "milk".
* Status indicator (e.g., "Draft") and "Update Status" dropdown checklist.
* Action buttons: "View Shipment", "Edit Shipment".


* **Create Shipment Modal (AI Assistant Flow):**
* **Tabs:** `AI Assistant` | `Fill Details Manually`.
* **AI Assistant View:** Textbox for natural language ("Type message"). Example prompt: "Initiate a new export shipment by sea with FCL...". Output converts text into standard fields.
* **Manual View:** Select `Type of transaction` (Export/Import), `Mode of transport` (SEA, AIR, ROAD, RAIL), `Type of shipment` (LCL, FCL), `Shipment Name`, `Shipment Number`.



### Screen 4: Tracking (`/tracking`)

* **Layout:** Centered empty state "No tracking data found. Start tracking your first shipment".
* **Track Shipment Modal:**
* Dropdown: `Shipment type` (Ocean Shipment).
* Inputs: `Tracking Name`, `Notifier` (Email tagging).



### Screen 5: Inventory & Accounting (`/inventory` & `/accounting`)

* **Inventory Overview:**
* Tabs: `Inventory items`, `Warehouses`, `Orders`, `Stock movements`.
* KPI Cards: Total items, Low stock items, Total warehouses, Total orders, Total stock movements.


* **Accounting:**
* Empty state graphic featuring an illustration of a person on a laptop.
* Integration prompt: "Set Up Accounting for Your Business" with a button `Connect Zoho Books`.



### Screen 6: Settings (`/settings`)

* **Sub-navigation:** `Account`, `Team`, `Usage`, `Workflow`.
* **Team Tab:** Users and Roles datatable. Button `+ New User` opens modal (First Name, Last Name, Email, Role dropdown [Admin]).
* **Usage Tab (AI Assistant Usage):**
* Line chart plotting Token Spend over the last 7 days.
* Token Usage panel: `Input Tokens: 3.0K / 1,000,000` and `Output Tokens: 1.4K / 1,000,000`.



---

## 4. CORE REACT / NEXT.JS IMPLEMENTATION RULES

1. **Routing:** Implement Next.js App Router (`/app` directory). The Sidebar and Topbar should sit in the root `layout.tsx`.
2. **State Management:** Use Zustand to manage the global state of Shipments and Documents so that when a shipment is added via the AI modal, it immediately populates the Dashboard KPIs and Shipments list.
3. **UI Components:** Utilize Tailwind CSS for all styling. Use Headless UI or Radix UI for accessible dropdowns (Update Status menu), modals (Create Shipment), and tabs (My Documents vs. Document Studio).
4. **AI Parsing Simulation:** Create a mock AI service in the frontend. When a user types in the "AI Assistant" tab of the Create Shipment modal, write a function that parses keywords (e.g., "sea", "FCL", "Export") and auto-fills the manual form state.
