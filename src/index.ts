import { FlatfileListener } from '@flatfile/listener'
import { spaceConfigure } from './jobs/configure.space'
import { validateRecords } from './jobs/validate.records'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'

/**
 * This default export is used by Flatfile to register event handlers for any
 * event that occurs within the Flatfile Platform.
 *
 * @param listener
 */
export default function (listener: FlatfileListener) {
  listener.on('**', (event) => {
    console.log(
      `-> My event listener received an event: ${JSON.stringify(event)}`
    )
  })

  listener.use(spaceConfigure)
  listener.use(validateRecords)
  listener.use(ExcelExtractor())
}
