import { FlatfileListener } from '@flatfile/listener'
import { configureSpace } from '@flatfile/plugin-space-configure'

export async function spaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: 'Example Data Import Workbook',
          sheets: [
            {
              name: 'Import No 1',
              slug: 'import_no_1',
              allowAdditionalFields: true,
              fields: [
                {
                  key: 'Industry',
                  type: 'enum',
                  label: 'Industry',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                  config: {
                    options: [
                      {
                        value: 'Industry & Office',
                        label: 'Industry & Office',
                      },
                      {
                        value: 'Residential',
                        label: 'Residential',
                      },
                      {
                        value: 'Shopping & Entertainment',
                        label: 'Shopping & Entertainment',
                      },
                      {
                        value: 'Education & Culture',
                        label: 'Education & Culture',
                      },
                      {
                        value: 'Infrastructure',
                        label: 'Infrastructure',
                      },
                      {
                        value: 'Healthcare',
                        label: 'Healthcare',
                      },
                      {
                        value: 'Hotel & Wellness',
                        label: 'Hotel & Wellness',
                      },
                    ],
                  },
                },
                {
                  key: 'Project name',
                  type: 'string',
                  label: 'Project name',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'Customer / Client',
                  type: 'string',
                  label: 'Customer / Client',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'Contact person customer',
                  type: 'string',
                  label: 'Contact person customer',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'Cooperation partner',
                  type: 'string',
                  label: 'Cooperation partner',
                },
                {
                  key: 'Country (Project)',
                  type: 'enum',
                  label: 'Country (Project)',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                  config: {
                    options: [
                      { value: 'AT', label: 'AT' },
                      { value: 'IT', label: 'IT' },
                      { value: 'DE', label: 'DE' },
                      { value: 'UA', label: 'UA' },
                      { value: 'SK', label: 'SK' },
                    ],
                  },
                },
                {
                  key: 'Location (Project)',
                  type: 'string',
                  label: 'Location (Project)',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'Project start',
                  type: 'date',
                  label: 'Project start',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'Project end',
                  type: 'date',
                  label: 'Project end',
                },
                {
                  key: 'Construction start',
                  type: 'date',
                  label: 'Construction start',
                },
                {
                  key: 'Construction end',
                  type: 'date',
                  label: 'Construction end',
                },
                {
                  key: 'Construction costs',
                  type: 'string',
                  label: 'Construction costs',
                },
                {
                  key: 'Handover',
                  type: 'date',
                  label: 'Handover',
                },
                {
                  key: 'Status project',
                  type: 'enum',
                  label: 'Status project',
                  config: {
                    options: [
                      { value: 'finished', label: 'finished' },
                      { value: 'stopped', label: 'stopped' },
                      { value: 'ongoing', label: 'ongoing' },
                      { value: 'on hold', label: 'on hold' },
                    ],
                  },
                },
                {
                  key: 'Project type',
                  type: 'string',
                  label: 'Project type',
                },
                {
                  key: 'Services',
                  type: 'string',
                  label: 'Services',
                },
                {
                  key: 'DELTA Firma',
                  type: 'string',
                  label: 'DELTA Firma',
                },
                {
                  key: 'DELTA Intern',
                  type: 'string',
                  label: 'DELTA Intern',
                },
                {
                  key: 'Project lead internal',
                  type: 'string',
                  label: 'Project lead internal',
                },
                {
                  key: 'Subcontractors',
                  type: 'string',
                  label: 'Subcontractors',
                },
                {
                  key: 'Address',
                  type: 'string',
                  label: 'Address',
                  readonly: true,
                  constraints: [
                    {
                      type: 'computed',
                    },
                  ],
                },
                {
                  key: 'Address Line 1',
                  type: 'string',
                  label: 'Address Line 1',
                },
                {
                  key: 'City',
                  type: 'string',
                  label: 'City',
                },
                {
                  key: 'State',
                  type: 'string',
                  label: 'State',
                },
                {
                  key: 'Zip',
                  type: 'string',
                  label: 'Zip',
                },
                {
                  key: 'Email',
                  type: 'string',
                  label: 'Email',
                },
              ],
            },
          ],
        },
      ],
    })
  )
}
