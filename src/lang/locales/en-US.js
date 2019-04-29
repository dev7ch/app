/* eslint-disable max-len */

export const dateTimeFormats = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric"
  },
  long: {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }
};

export default {
  about_directus: "About Directus",
  activity: "Activity",
  my_activity: "My Activity",
  activity_log: "Activity Log",
  activity_outside_directus: "Item created outside of Directus",
  admin_email: "Admin Email",
  admin_password: "Admin Password",
  additional_info: "Additional Info",
  add_new: "Add New",
  add_field_filter: "Add a field filter",
  add_note: "Add a helpful note for users...",
  admin_settings: "Admin Settings",
  advanced_options: "Advanced options",
  almost_done_options: "Almost Done! Now just review the interface options below.",
  almost_done_copy:
    "Every interface can be perfectly tailored to your needs. Below are the available options for this field, but only some are required.",
  all: "All",
  api_url: "API URL",
  api_installed: "API Successfully Installed",
  auto_generate: "Auto-Generate",
  auto_generated: "Automatically generated...",
  batch: "Batch",
  batch_edit: "Batch Editing Items: {collection}",
  batch_delete: "Batch Delete",
  batch_delete_confirm:
    "No items have been selected | Are you sure you want to delete this item? This action can not be undone. | Are you sure you want to delete these {count} items? This action can not be undone.",
  between: "Between",
  both: "Both",
  bookmarks: "Bookmarks",
  bookmark_global: "Global: All Users",
  bookmark_personal: "Personal: Just Me",
  bookmark_role: "Role: {role}",
  bookmark_select_visibility: "Select bookmark visibility:",
  cancel: "Cancel",
  change_project: "Change Project",
  choose_one: "Choose One",
  choose_project: "Choose Project",
  choose_interface: "Choose an interface for how this data should be managed.",
  clear: "Clear",
  click_to_toggle_all_none: "Click to toggle entire column on/off",
  connection: "Connection",
  collection: "Collection",
  collections_and_fields: "Collection & Fields",
  collection_invalid_name: "Invalid collection name",
  collection_updated: "{collection} Collection Updated",
  collection_removed: "{collection} Collection Removed",
  collection_names_cannot_be_changed: "Collection names cannot be edited at this time.",
  collections: "Collections",
  collection_count: "No Collections | One Collection | {count} Collections",
  "collections-directus_files": "Files",
  "collections-directus_users": "Users",
  "collections-directus_activity": "Activity",
  comment: "Comment",
  comments: "Comments",
  coming_soon: "Coming Soon",
  compact: "Compact",
  cozy: "Cozy",
  comfortable: "Comfortable",
  confirm: "Confirm",
  contains: "Contains",
  config_error: "Missing Config",
  config_error_copy: "Make sure you've created the application's configuration file",
  collection_contains_items: "{collection} contains {count} items",
  currently_selected: "Currently selected: {thing}",
  create: "Create",
  creating_item: "Creating Item",
  creating_item_page_title: "Creating Item: {collection}",
  creating_role: "Creating Role",
  create_role: "Create Role",
  create_field: "Create Field",
  update_field: "Update Field",
  create_collection: "Create Collection",
  created_by: "Created By",
  created_on: "Created On",
  database_connection: "Database Connection",
  database_connection_copy:
    "Next, we need to know how to connect to the database where this project will be managed.",
  datatype: "Datatype",
  db_datatype: "{db} Datatype",
  editing_my_profile: "Editing My Profile",
  embed: "Embed",
  embed_placeholder: "YouTube, Vimeo, or other link",
  fieldtypes: {
    alias: "Fields that do not save data or do not have corresponding database columns",
    array: "Standard array format in API response",
    datetime: "A date and time in ISO format, eg: 2018-09-19T14:00:43.381Z",
    date: "Date, eg: 2018-09-19",
    time: "Time, eg: 14:09:22",
    file: "Foreign key to directus_files.id",
    group: "Groups fields together visually, children save group into directus_fields.group",
    integer: "Whole number",
    decimal: "Number that includes a decimal",
    json: "Standard JSON format in API response",
    lang: "Specific to translation interfaces, this stores the language key",
    m2o: "Many-to-One Relationship",
    o2m: "One-to-Many Relationship",
    managed: "Managed",
    sort: "System field used in drag-and-drop item reordering",
    status: "System field used for publishing workflows",
    string:
      "Any text, numbers, spaces, or symbols; defined and limited by its length (number of characters)",
    translation: "Specific to translation interfaces, this o2m is stores multi-lingual content",
    uuid: "A Universally Unique Identifier",
    datetime_created: "System field to track the datetime an item was created, used by revisions",
    datetime_updated: "System field to track the datetime an item was updated, used by revisions",
    user_created: "System field to track the user who created an item, used by revisions",
    user_updated: "System field to track the user who updated an item, used by revisions"
  },
  datatypes: {
    mysql: {
      CHAR:
        "A fixed-length non-binary string right-padded with spaces. Length can be 0 to 255 characters.",
      VARCHAR:
        "A variable-length non-binary string. Length can be 0 to 65,535 characters (MySQL 5.0.3+).",
      TINYTEXT: "A string with a max length of 255 characters.",
      TEXT: "A string with a max length of 65,535 characters.",
      MEDIUMTEXT: "A string with a max length of 16,777,215 characters.",
      LONGTEXT: "A string with a max length of 4,294,967,295 characters.",

      BOOLEAN: "True or false. Is saved as either 1 or 0 respectively.",
      TINYINT:
        "An integer. When signed (allows negative) length is -128 to 127, otherwise the max is 255.",
      SMALLINT:
        "An integer. When signed (allows negative) length is -32,768 to 32,767, otherwise the max is 65,535.",
      MEDIUMINT:
        "An integer. When signed (allows negative) length is -8,388,608 to 8,388,607, otherwise the max is 16,777,215.",
      INT:
        "An integer. When signed (allows negative) length is -2,147,483,648 to 2,147,483,647, otherwise the max is 4,294,967,295.",
      BIGINT:
        "An integer. When signed (allows negative) length is -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807, otherwise the max is 18,446,744,073,709,551,615.",

      DECIMAL:
        "An accurate number (eg: for currency), with 1 to 65 digits length (L) and 0 to 30 digits decimal (D). Length format: `L,D`",
      FLOAT: "An approximate binary number, 4 bytes with a floating decimal point.",
      DOUBLE: "An approximate binary number, 8 bytes with a floating decimal point.",

      DATE: "A date. Allows `1000-01-01` to `9999-12-31`.",
      DATETIME: "A date and time. Allows `1000-01-01 00:00:00` to `9999-12-31 23:59:59`.",
      TIMESTAMP: "A date and time. Allows `1970-01-01 00:00:01` UTC to `2038-01-19 03:14:07` UTC.",
      TIME: "A time. Allows `-838:59:59` to `838:59:59`.",
      YEAR: "A year. Allows `1901` to `2155` or `0000`"
    }
  },
  date_and_time: "Date & Time",
  db_user: "Database User",
  db_password: "Database User Password",
  db_name: "Database Name",
  db_type: "Database Type",
  db_column_name: "Database column name...",
  db_updated: "Database successfully updated",
  db_update_failed: "The database couldn't be updated.",
  default: "Default",
  default_value: "Default Value",
  delete: "Delete",
  delete_are_you_sure: "Are you sure you want to delete this item? This action can not be undone.",
  delete_collection_are_you_sure:
    "Are you sure you want to delete this collection? This action can not be undone.",
  delete_field_are_you_sure:
    'Are you sure you want to delete the field "{field}"? This action can not be undone.',
  delete_role_are_you_sure:
    'Are you sure to delete the role "{name}"? This action cannot be undone.',
  delete_bookmark: "Delete Bookmark",
  delete_bookmark_body:
    "Are you sure you want to delete this bookmark? This action cannot be undone.",
  description: "Description",
  delete_confirmation: "Delete Confirmation",
  dialog_beginning: "Beginning of dialog window.",
  discard_changes: "Discard Changes",
  display_name: "Display Name",
  drop_files: "Can't Drop Files | Drop file here... | Drop files here...",
  done: "Done",
  dont_show: "Don't Show",
  editing: "Editing Item: {collection}",
  editing_item: "Editing Item",
  editing_items: "Batch Editing {count} Items",
  editing_single: "Editing {collection}",
  editor: {
    bold: "Bold",
    italic: "Italic",
    strike: "Strikethrough",
    underline: "Underline",
    code: "Code",
    code_block: "Code Block",
    paragraph: "Paragraph",
    bullet_list: "Bullet List",
    ordered_list: "Ordered List",
    blockquote: "Blockquote",
    link: "Link",
    image: "Image",
    heading: "Heading {level}",
    horizontal_rule: "Horizontal Rule",
    table: "Table",
    table_remove: "Remove Table",
    table_add_column_before: "Add Column to the Left",
    table_add_column_after: "Add Column to the Right",
    table_delete_column: "Delete Column",
    table_add_row_before: "Add Row Above",
    table_add_row_after: "Add Row Below",
    table_delete_row: "Delete Row",
    table_merge_cells: "Merge Cells",
    undo: "Undo",
    redo: "Redo",
    view_source: "View Source"
  },
  email_address: "Email Address",
  email: "Email",
  empty_collection: "Empty Collection",
  empty_collection_body: "There are no items in this collection yet",
  enable_manual_sorting: "Enable manual sorting",
  enter_value: "Enter Value",
  enter_collection_name: "Enter collection name...",
  enter_role_name: "Enter role name...",
  environment: "Environment",
  project_key: "Project Key",
  errors: {
    "-1": "Couldn't reach API",
    11: "Can't connect to database",
    100: "Wrong username and/or password",
    101: "Logged out due to inactivity",
    102: "Logged out due to inactivity",
    103: "User inactive",
    106: "Wrong username and/or password",
    107: "User not found"
  },
  error_unknown: "Unknown error. Try again later.",
  esc_cancel: "Escape will cancel and close the window.",
  equal_to: "Equal to",
  existing: "Existing",
  fetching_data: "Fetching Data",
  field: "Field",
  field_type: "Field Type",
  field_created: "{field} Field Created",
  field_updated: "{field} Field Updated",
  field_removed: "{field} Field Removed",
  field_already_exists: "{field} Already Exists",
  field_width: "Field Width",
  fields: "Fields",
  fields_are_saved_instantly: "Changes to fields are saved instantly",
  file: "File",
  file_library: "File Library",
  file_upload: "Upload File(s)",
  forgot_password: "Forgot Password",
  greater_than_equal: "Greater than or equal to",
  greater_than: "Greater than",
  help_and_docs: "Help & Docs",
  keep_editing: "Keep Editing",
  hidden: "Hidden",
  hidden_detail: "Hidden on Detail",
  hidden_browse: "Hidden on Browse",
  host: "Host",
  icon: "Icon",
  in_list: "One of these",
  initial_schema: "Choose an Initial Schema",
  initial_schema_copy:
    "Choose from existing database architectures or start fresh. You can always extend and tweak this later.",
  interface: "Interface",
  interface_count: "No Interfaces | One Interface | {count} Interfaces",
  interfaces: "Interfaces",
  info: "Info",
  intelligent_defaults:
    "Advanced options lets you configure how data will be stored in the database and tweak additional app settings.",
  interface_settings:
    "Every interface can be perfectly tailored to your needs. Below are the available options for this interface, but only some are required.",
  install: "Install",
  install_copy: "This API has not been setup yet. Would you like to install and configure it now?",
  is_empty: "Is empty",
  is_not_null: "Is not NULL",
  is_null: "Is NULL",
  item_count: "No Items | One Item | {count} Items",
  event_count: "No Events | One Event | {count} Events",
  role_count: "No Roles | One Role | {count} Roles",
  item_count_filter: "No Results | One Result | {count} Results",
  item_deleted: "Item Deleted",
  item_saved: "Item Saved | {count} Items Saved",
  junction_collection: "Junction Collection",
  cant_disable_primary:
    "You can't disable primary key on an existing field. Remove this field instead.",
  cant_sort_by_this_field: "You can't sort by this field",
  extension_error: "There was a problem loading the {ext} extension.",
  extensions_missing: "No Extensions Found",
  extensions_missing_copy: "Make sure you have the system extensions installed.",
  latency: "Latency",
  learn_more: "Learn More",
  leave_comment: "Leave a comment...",
  length: "Length",
  length_disabled_placeholder: "Length is determined by the datatype",
  less_than_equal: "Less than or equal to",
  less_than: "Less than",
  limited: "Limited",
  loading: "Loading...",
  loading_more: "Loading more items...",
  login: "Log in",
  m2m: "Many-to-Many (M2M)",
  m2o: "Many-to-One (M2O)",
  modified_by: "Modified By",
  modified_on: "Modified On",
  o2m: "One-to-Many (O2M)",
  name: "Name",
  name_field: "Let’s name this {field} field and add a helpful note for users.",
  navigate_changes:
    "Are you sure you want to leave this page? The changes you made will be lost if you navigate away from this page.",
  new: "New",
  new_file: "New File",
  new_field: "New Field",
  no_related_entries: "Has no related entries",
  not_between: "Not between",
  not_contains: "Doesn't contain",
  note: "Note",
  note_note: "An internal description...",
  note_hidden: "[Learn More](https://docs.directus.io/guides/collections.html#hidden)",
  note_icon: "The icon shown in the App's navigation sidebar",
  note_managed:
    "[Learn More](https://docs.directus.io/guides/collections.html#managing-collections)",
  note_single: "[Learn More](https://docs.directus.io/guides/collections.html#single)",
  notifications: "Notifications",
  no_results: "No Results",
  no_results_body: "The current filters do not match any collection items",
  no_collections: "No Collections Setup",
  no_collections_body: "It seems like there aren't any collections setup yet",
  no_fields: "No Fields Setup",
  no_fields_body: "It seems like this collection doesn't have any fields setup yet",
  no_files: "No Files",
  no_files_body: "It seems like there haven't been any files uploaded yet",
  numeric: "Numeric",
  page_not_found: "Page Not Found",
  page_not_found_body: "The page you are looking for doesn't seem to exist.",
  permissions: "Permissions",
  name_bookmark: "What would you like to name this bookmark?",
  next: "Next",
  none: "None",
  not_empty: "Is not empty",
  not_equal_to: "Not equal to",
  not_in_list: "Not one of these",
  no_interface_error: "Field {field} doesn't have an interface setup",
  optional: "Optional",
  manage: "Manage",
  manage_started: "Started Managing {collection}",
  manage_stopped: "Stopped Managing {collection}",
  max_size: "Max. Size: {size}",
  max_one_primary_key: "You can only have 1 primary key field per collection",
  dont_manage: "Don't Manage",
  dont_manage_copy:
    "Privileges, preferences, and settings for the {collection} collection will be permanently removed from the system! Are you sure?",
  more_options: "More options",
  mixed: "Mixed",
  my_profile: "My Profile",
  other: "Other",
  ok: "OK",
  operator: "Operator",
  open_on_gh: "Open on GitHub",
  options: "Options",
  password: "Password",
  password_reset_sent: "Password reset email sent to {email}",
  permissions_no_collections: "This project does not have any collections yet.",
  permissions_admin: "Admins have access to all managed data within the system by default.",
  permission_states: {
    none: "None",
    mine: "Mine Only",
    role: "Role Only",
    full: "All",
    read: "Readonly",
    create: "Create",
    on_create: "On Creation",
    update: "Update",
    on_update: "On Update",
    always: "Always"
  },
  popular: "Popular",
  powered_by_directus: "Powered by Directus",
  preview_and_revert: "Preview and Revert",
  primary_key: "Primary Key",
  port: "Port",
  project: "Project",
  project_name: "Project Name",
  project_info: "Project Information",
  project_info_copy:
    "Below are a few questions about your project, including the credentials of your first administrator.",
  read: "Read",
  readable_fields: "Readable Fields",
  readable_fields_copy: "Select the fields that the user can view",
  readonly: "Readonly",
  relational: "Relational",
  report_issue: "Report Issue",
  request_feature: "Request Feature",
  regex: "RegEx",
  relation_setup: "Since this is a relational field, we need to map-out the related fields.",
  relation_setup_copy:
    "There are different types of relational data, this interface uses one called {relation}.",
  related_entries: "Has related entries",
  related_collection: "Related Collection",
  remove: "Remove",
  remove_related: "Remove Related Item",
  relationship: "Relationship",
  required: "Required",
  reset_preferences: "Reset all listing preferences",
  reset_password: "Reset Password",
  revert: "Revert",
  revert_copy: "Do you want to revert this item to how it was on {date}?",
  roles: "User Roles",
  role_settings: "Role Settings",
  save: "Save",
  save_and_add: "Save and Add New",
  save_and_stay: "Save and Stay",
  save_as_copy: "Save as Copy",
  save_as_bookmark: "Save as Bookmark",
  schema: "Schema",
  search: "Search",
  select_from_device: "Select from device",
  select_existing: "Select Existing",
  select_field: "Select a Field",
  select_fields: "Select Fields",
  search_interface: "Search for an interface...",
  select_interface_below: "Select an interface below",
  select_statuses: "Select Statuses",
  select_statuses_copy: "Select the statuses the user can use",
  settings: "Settings",
  settings_project: "Project Settings",
  settings_global: "Global Settings",
  settings_update_database: "Update Database",
  settings_update_database_subtext: "Run Script",
  settings_update_database_confirm:
    "This will update your database schema to work with the latest version of Directus. Always create a database backup before running this operation.",
  settings_collections_fields: "Collections & Fields",
  settings_permissions: "Roles & Permissions",
  settings_extensions: "Extensions",
  settings_saved: "Settings Saved",
  server_details: "Server Details",
  server_error: "Server Error",
  server_error_copy: "Something is wrong with this instance’s server or database.",
  server_trouble: "Server Trouble",
  server_trouble_copy: "Try again later or contact your system administrator help.",
  show_directus_collections: "Show Directus System Collections",
  single: "Single",
  something_went_wrong: "Something went wrong.",
  something_went_wrong_body: "Trouble processing request. Try again after refreshing the page.",
  sort: "Sort",
  sort_by: "Sort By",
  spacing: "Spacing",
  sign_in: "Sign In",
  signing_in: "Signing In",
  sign_out: "Sign Out",
  sign_out_confirm: "Are you sure you want to sign out?",
  sign_out_confirm_edits: "Are you sure you want to sign out? All unsaved changes will be lost.",
  status: "Status",
  statuses: "Statuses",
  submit: "Submit",
  text: "Text",
  this_collection: "This Collection",
  to: "To",
  unsaved_changes_copy: "You have unsaved changes! Are you sure you want to leave this page?",
  user_directory: "User Directory",
  update: "Update",
  update_confirm: "Are you sure you want to update {count} items?",
  unique: "Unique",
  user_edit_warning:
    "{first_name} {last_name} is editing this item too. Please coordinate with them so you don't lose your changes.",
  value: "Value",
  values: "Values",
  validation: "Validation",
  version: "Version",
  version_and_updates: "Version and Updates",
  view_type: "View As...",
  visible_all_users: "Visible for all users",
  welcome: "Welcome",
  writable_fields: "Writable Fields",
  writable_fields_copy: "Select the fields that the user can edit",
  yes: "Yes",
  duplicating_field: "Duplicating Field",
  duplicate: "Duplicate",
  upload_exceeds_max_size:
    "{filename} can't be uploaded. Your server is not configured to handle uploads of this size.",
  file_type_not_accepted:
    "{filename} can't be uploaded. It is not a valid file type for this field."
};
