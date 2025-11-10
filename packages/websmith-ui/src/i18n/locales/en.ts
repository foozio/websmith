/**
 * English translations for Websmith UI components
 */

export const en = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    submit: 'Submit',
    reset: 'Reset',
    clear: 'Clear',
    apply: 'Apply',
    select: 'Select',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    expand: 'Expand',
    collapse: 'Collapse',
    more: 'More',
    less: 'Less',
    showMore: 'Show More',
    showLess: 'Show Less'
  },
  
  dialog: {
    title: 'Dialog',
    close: 'Close dialog'
  },
  
  alert: {
    dismiss: 'Dismiss alert'
  },
  
  toast: {
    close: 'Close notification'
  },
  
  table: {
    noData: 'No data available',
    rowsPerPage: 'Rows per page',
    of: 'of',
    page: 'Page',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    selectRow: 'Select row',
    selectAllRows: 'Select all rows',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    clearSort: 'Clear sort',
    filter: 'Filter',
    clearFilter: 'Clear filter',
    showing: 'Showing {start} to {end} of {total} entries'
  },
  
  form: {
    required: 'This field is required',
    invalid: 'Invalid value',
    minLength: 'Minimum length is {min} characters',
    maxLength: 'Maximum length is {max} characters',
    min: 'Minimum value is {min}',
    max: 'Maximum value is {max}',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    pattern: 'Please match the requested format',
    fileSize: 'File size must be less than {size}',
    fileType: 'File type must be {types}'
  },
  
  select: {
    placeholder: 'Select an option',
    noOptions: 'No options available',
    search: 'Search...',
    loading: 'Loading options...',
    selected: '{count} selected',
    clearSelection: 'Clear selection'
  },
  
  datepicker: {
    placeholder: 'Select a date',
    today: 'Today',
    clear: 'Clear',
    selectDate: 'Select date',
    selectTime: 'Select time',
    selectDateTime: 'Select date and time',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    weekdays: {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday'
    },
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December'
    }
  },
  
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page {page}',
    of: 'of {total}',
    goToPage: 'Go to page',
    itemsPerPage: 'Items per page'
  },
  
  fileUpload: {
    dropzone: 'Drop files here or click to browse',
    uploading: 'Uploading...',
    uploaded: 'Uploaded successfully',
    failed: 'Upload failed',
    remove: 'Remove file',
    retry: 'Retry upload',
    maxFiles: 'Maximum {max} files allowed',
    maxSize: 'Maximum file size is {size}'
  },
  
  accessibility: {
    menu: 'Menu',
    menuButton: 'Open menu',
    closeMenu: 'Close menu',
    toggleMenu: 'Toggle menu',
    navigation: 'Navigation',
    skipToContent: 'Skip to content',
    openInNewWindow: 'Opens in a new window',
    externalLink: 'External link',
    required: 'Required',
    optional: 'Optional',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    information: 'Information'
  }
}

export type TranslationKeys = typeof en
