# DemoTable Component 

## Installation

1. pnpm install
2. pnpm dev



## Overview

This React component, `DemoTable`, is designed to render a dynamic user table with various features such as:

* **Data Display:** Username, email, created/updated timestamps, role, and user status.
* **Search:** Functionality to filter users by username, email, or role.
* **Permissions:** Conditionally displays "Edit" actions based on user permissions.
* **Customizable:** Leverages the `AppTable` and `GlobalTableHeadCell` components for layout and head cell configuration.
* **Status Chip:** Visually indicates user status (Enabled/Disabled).
* **Tooltips:** Provides helpful information on hover over interactive elements.

## Dependencies

* **@mui/material:** For UI components.
* **react:** Core React library for building components.
* **Custom Hooks:**
    * `useFetchUsers`: Fetches user data.
    * `useDate`: Formats dates.
    * `useGlobalTable`: Manages table state and functionality.
* **Shared Components:**
    * `PermissionWrapper`: Handles conditional rendering based on permissions.
    * `StatusChip`: Displays status with a color-coded chip.
    * `AppTable`: Base table component.
  
## Demo Table Component
  \<DemoTable />


## Configuration

* **tableHeadCells:** Array to define the table columns (label, getter, width, etc.).
* **searchCells:** Array of user properties that are searchable.
* **allowedToUpdate, allowedToDelete:** State variables controlling permissions for editing and deleting.
