import { FlatfileRecord } from '@flatfile/hooks'
import { bulkRecordHook } from '@flatfile/plugin-record-hook'
import { FlatfileEvent, FlatfileListener } from '@flatfile/listener'
import api from '@flatfile/api'

// Define a list of valid project names
const validProjectNames = ['Project A', 'Project B', 'Project C'] // Update this list as needed

// Function to check if the date string is in a valid format
function isValidDate(dateStr: string): boolean {
  const dateFormats = ['MM/YYYY', 'YYYY'] // Define formats to check
  return dateFormats.some((format) => {
    switch (format) {
      case 'MM/YYYY':
        return /^\d{2}\/\d{4}$/.test(dateStr)
      case 'YYYY':
        return /^\d{4}$/.test(dateStr)
      default:
        return false
    }
  })
}

// Function to compare if date1 is before or the same as date2
function isBeforeOrSame(date1Str: string, date2Str: string): boolean {
  // Parse the dates into date objects
  let date1: Date | undefined
  let date2: Date | undefined

  if (isValidDate(date1Str) && isValidDate(date2Str)) {
    // Attempt to parse date strings based on their apparent format
    if (date1Str.includes('/')) {
      // Date is in MM/YYYY format
      const [month, year] = date1Str.split('/').map(Number)
      date1 = new Date(year, month - 1) // Month is 0-indexed in JavaScript Date
    } else {
      // Date is in YYYY format
      date1 = new Date(parseInt(date1Str), 0) // January of the given year
    }

    if (date2Str.includes('/')) {
      const [month, year] = date2Str.split('/').map(Number)
      date2 = new Date(year, month - 1)
    } else {
      date2 = new Date(parseInt(date2Str), 0)
    }

    // Compare the dates
    return date1.getTime() <= date2.getTime()
  }
  return false // If either date string is invalid, return false
}

export function validateRecords(listener: FlatfileListener) {
  listener.use(
    bulkRecordHook(
      'import_no_1',
      async (records: FlatfileRecord[], event: FlatfileEvent) => {
        // Retrieve the spaceId from the event.context
        const spaceId = event.context.spaceId

        // Log the spaceId for debugging purposes
        console.log(`Space ID from Bulk Record Hook: ${spaceId}`)

        let namespace = ''

        // Get space information using the spaceId
        try {
          const spaceResponse = await api.spaces.get(spaceId)
          console.log(`Space Information: ${JSON.stringify(spaceResponse)}`)
          namespace = spaceResponse.data.namespace // Extract the namespace
          console.log(`Namespace: ${namespace}`) // Log the namespace value
        } catch (e) {
          console.error(`Error fetching space information: ${e.message}`)
          return records // Return records as is if there's an error fetching space information
        }

        return records.map((record) => {
          // Email validation
          const email = record.get('Email') as string
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Simple regex for email validation
          if (email && !emailRegex.test(email)) {
            record.addError(
              'Email',
              'The Email field must be a valid email address.'
            )
          }
          // Fields for full address
          const addressLine1 = record.get('Address Line 1') || ''
          const city = record.get('City') || ''
          const state = record.get('State') || ''
          const zip = record.get('Zip') || ''

          // Check if any field is populated
          if (addressLine1 || city || state || zip) {
            // Add error to individual fields if they are empty
            if (!addressLine1)
              record.addError(
                'Address Line 1',
                'Address Line 1 is required for a full address.'
              )
            if (!city)
              record.addError('City', 'City is required for a full address.')
            if (!state)
              record.addError('State', 'State is required for a full address.')
            if (!zip)
              record.addError('Zip', 'Zip is required for a full address.')
          }

          // If all fields are populated, combine them
          if (addressLine1 && city && state && zip) {
            const fullAddress = `${addressLine1} ${city}, ${state} ${zip}`
            record.set('Address', fullAddress.trim())
          }

          // Validate date fields
          const projectStart = record.get('Project start')
          const projectEnd = record.get('Project end')
          const constructionStart = record.get('Construction start')
          const constructionEnd = record.get('Construction end')

          // Convert the values to strings if they are not already
          const projectStartStr =
            typeof projectStart === 'string'
              ? projectStart
              : projectStart?.toString()
          const projectEndStr =
            typeof projectEnd === 'string' ? projectEnd : projectEnd?.toString()
          const constructionStartStr =
            typeof constructionStart === 'string'
              ? constructionStart
              : constructionStart?.toString()
          const constructionEndStr =
            typeof constructionEnd === 'string'
              ? constructionEnd
              : constructionEnd?.toString()

          // Check for valid dates and logical consistency
          if (projectStartStr && !isValidDate(projectStartStr)) {
            record.addError(
              'Project start',
              'Invalid date format for Project start.'
            )
          }
          if (projectEndStr && !isValidDate(projectEndStr)) {
            record.addError(
              'Project end',
              'Invalid date format for Project end.'
            )
          }
          if (constructionStartStr && !isValidDate(constructionStartStr)) {
            record.addError(
              'Construction start',
              'Invalid date format for Construction start.'
            )
          }
          if (constructionEndStr && !isValidDate(constructionEndStr)) {
            record.addError(
              'Construction end',
              'Invalid date format for Construction end.'
            )
          }

          // Check if start dates are before end dates
          if (
            projectStartStr &&
            projectEndStr &&
            !isBeforeOrSame(projectStartStr, projectEndStr)
          ) {
            record.addError(
              'Project start',
              'Project start date must be before Project end date.'
            )
          }
          if (
            constructionStartStr &&
            constructionEndStr &&
            !isBeforeOrSame(constructionStartStr, constructionEndStr)
          ) {
            record.addError(
              'Construction start',
              'Construction start date must be before Construction end date.'
            )
          }

          // Check if construction dates are within the project dates
          if (
            projectStartStr &&
            constructionStartStr &&
            !isBeforeOrSame(projectStartStr, constructionStartStr)
          ) {
            record.addError(
              'Construction start',
              'Construction start date cannot be before the Project start date.'
            )
          }
          if (
            projectEndStr &&
            constructionEndStr &&
            !isBeforeOrSame(constructionEndStr, projectEndStr)
          ) {
            record.addError(
              'Construction end',
              'Construction end date cannot be after the Project end date.'
            )
          }

          // Namespace-specific validation for 'Update Records'
          if (namespace === 'Update Records') {
            // Ensure the project name is treated as a string
            const projectName = String(record.get('Project name'))
            if (!validProjectNames.includes(projectName)) {
              record.addError(
                'Project name',
                'Invalid project name. In order to update a project, the project name must already exist in the system.'
              )
            }
          }

          return record
        })
      },
      { chunkSize: 100, parallel: 2 } // Optional configuration for parallel processing
    )
  )
}
