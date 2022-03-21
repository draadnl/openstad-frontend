const fields = [
  {
    name: 'formTitle',
    type: 'string',
    label: 'Form title'
  },
  {
    name: 'formIntro',
    type: 'string',
    label: 'Form intro text',
    textarea: true
  },
  {
    name: 'formName',
    type: 'string',
    label: 'Unique form name',
    help: 'This form id must be unique on this site and must be lowercase with no whitespaces',
    required: true
  },
  {
    name: 'redirect',
    type: 'string',
    label: 'Redirect after submit',
    help: 'The url to redirect to after form submit',
    required: true
  },
  // {
  //     name: 'formType',
  //     type: 'select',
  //     label: 'How do you want to organise the form?',
  //     choices: [
  //         {
  //           value: 'static',
  //           label: "Static (default)"
  //         },
  //         {
  //           value: 'dynamic',
  //           label: "Dynamic",
  //           showFields: ['dynamicFormSections']
  //         },
  //     ]
  // },
  {
    name: 'formVisibility',
    type: 'select',
    label: 'Who can view this form?',
    choices: [
      {
        value: 'user',
        label: "Only users (and admin users)",
      },
      {
        value: 'always',
        label: "Everyone"
      },
    ],
    def: 'user'
  },
  {
    name: 'shouldDisplayUserName',
    type: 'boolean',
    label: 'Show user name in form header?',
    choices: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ],
    def: true
  },
  {
    name: 'hideAdminAfterPublicAction',
    label: 'Hide admin after first public action? (not yet connected to the API)',
    type: 'boolean',
    choices: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ],
    def: true
  },
  {
    name: 'dynamicFormSections',
    label: 'Form Sections',
    type: 'array',
    titleField: 'title',
    schema: [
      {
        type: 'string',
        name: 'title',
        label: 'Title'
      },
      {
        type: 'string',
        name: 'info',
        label: 'Info'
      },
      {
        type: 'array',
        titleField: 'fieldKey',
        name: 'fields',
        label: 'Form fields',
        schema: [
          {
            type: 'select',
            name: 'type',
            label: 'Type',
            required: true,
            choices: [
              {
                value: 'checkbox',
                label: 'Checkbox',
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldOptions', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'agreed-checkbox',
                label: 'Checkbox privacy',
                showFields: ['agreedLabel', 'fieldWidth']
              },
              {
                value: 'choicesSlider',
                label: "Choices slider",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldOptions', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'date',
                label: "Date",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldWidth']
              },
              {
                value: 'fileUpload',
                label: "File upload",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldWidth']
              },
              {
                value: 'hidden',
                label: "Hidden",
                showFields: ['descriptionText', 'fieldKey', 'fieldValue', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'image',
                label: "Image",
                showFields: ['descriptionText', 'fieldWidth']
              },
              {
                value: 'imageChoice',
                label: "Image choices",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldImages', 'fieldWidth']
              },
              {
                value: 'info',
                label: "Information",
                showFields: ['descriptionText', 'descriptionImage', 'imageCaptionText', 'imageAltText', 'descriptionAccordeon', 'fieldWidth']
              },
              {
                value: 'map',
                label: "Map",
                showFields: ['descriptionText', 'fieldWidth']
              },
              {
                value: 'radio',
                label: "Radio",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldOptions', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'raw',
                label: "Raw",
                showFields: ['rawInput', 'fieldWidth']
              },
              {
                value: 'select',
                label: 'Select',
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldOptions', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'text',
                label: "Text",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'textarea',
                label: "Textarea",
                showFields: ['descriptionText', 'fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax', 'notExtraDataKey', 'fieldWidth']
              },
              {
                value: 'vimeo',
                label: "Vimeo",
                showFields: ['descriptionText', 'fieldRequired', 'fieldWidth']
              },
            ]
          },
          {
            name: 'fieldKey',
            type: 'string',
            label: 'Key (for storing, must be unique, no spaces and special characters)',
          },
          {
            name: 'fieldInfo',
            type: 'string',
            label: 'Info',
          },
          {
            name: 'descriptionText',
            label: 'Description',
            type: 'string',
            textarea: true
          },
          {
            name: 'fieldValue',
            type: 'string',
            label: 'Default value (will be overwritten by url and resource value)',
          },
          {
            name: 'fieldRequired',
            label: 'Required',
            type: 'boolean'
          },
          {
            name: 'fieldMin',
            label: 'Min length',
            type: 'string',
          },
          {
            name: 'fieldMax',
            label: 'Max length',
            type: 'string',
          },
          {
            name: 'agreedLabel',
            label: 'Text label',
            help: 'Place text here that will replace the default text',
            type: 'string',
          },
          {
            name: 'rawInput',
            label: 'Raw input',
            type: 'string',
            textarea: true
          },
          {
            name: 'descriptionImage',
            label: 'Image',
            type: 'attachment',
          },
          {
            name: 'imageAltText',
            type: 'string',
            label: 'Image textual alternative for screenreaders',
          },
          {
            name: 'imageCaptionText',
            type: 'string',
            label: 'Image caption for below the image',
          },
          {
            name: 'descriptionAccordeon',
            label: 'Make this an accordeon',
            help: 'The info field will be used as a button. The description is than used as the hidden content in the accordeon',
            type: 'boolean'
          },
          {
            name: 'notExtraDataKey',
            label: 'Save field in root if data object and not in extraData, will only work if column exists in database)',
            type: 'boolean',
            choices: [
              {
                label: 'Yes',
                value: true,
              },
              {
                label: 'No',
                value: false,
              }
            ],
            def: false
          },
          {
            name: 'onlyForModerator',
            label: 'Only show to moderators',
            type: 'boolean',
            choices: [
              {
                label: 'Yes',
                value: true,
              },
              {
                label: 'No',
                value: false,
              }
            ],
            def: false
          },
          {
            name: 'fieldOptions',
            label: 'Field options',
            titleField: 'label',
            type: 'array',
            schema: [
              {
                type: 'string',
                name: 'value',
                label: 'Value',
              },
              {
                type: 'string',
                name: 'label',
                label: 'Label',
              },
            ]
          },
          {
            name: 'fieldImages',
            label: 'Field choices',
            titleField: 'label',
            type: 'array',
            schema: [
              {
                type: 'string',
                name: 'value',
                label: 'Value',
              },
              {
                type: 'string',
                name: 'imageDesc',
                label: 'Image description',
              },
              {
                type: 'attachment',
                name: 'image',
                label: 'Image',
              },
              {
                type: 'string',
                name: 'imageAlt',
                label: 'Image textual alternative for screenreaders',
              },
            ]
          },
          {
            name: 'fieldWidth',
            label: 'Choose the width of this field',
            type: 'select',
            choices: [
              {
                label: 'Full width',
                value: 'full',
              },
              {
                label: 'Half width',
                value: 'half',
              }
            ],
            def: 'full'
          },
        ]
      },
    ]
  },
  {
    name: 'buttonTextSubmit',
    type: 'string',
    label: 'Text for button to submit',
  },
  {
    name: 'buttonTextSave',
    type: 'string',
    label: 'Text for button to save',
  },
  {
    name: 'confirmationEnabledUser',
    type: 'boolean',
    label: 'Confirmation to user',
    help: 'Only implemented for resource `submissions` at the moment, other resource will use the "default" notification flow',
    choices: [
      {
        value: 1,
        label: "Yes",
        showFields: ['confirmationTemplateNameUser', 'confirmationSubjectUser', 'confirmationEmailFieldUser', 'confirmationTemplateUser', 'confirmationEmailContentUser']
      },
      {
        value: 0,
        label: "No"
      }
    ]
  },
  {
    name: 'confirmationTemplateNameUser',
    type: 'select',
    label: 'User template name',
    choices: [
      {
        label: 'Submission default',
        value: 'submission_default.njk'
      },
      {
        label: 'Blanco template',
        value: 'blanco.njk'
      }
    ]
  },
  {
    name: 'confirmationSubjectUser',
    type: 'string',
    label: 'Confirmation subject to user',
  },
  {
    name: 'confirmationEmailFieldUser',
    type: 'string',
    label: 'Confirmation email field',
  },
  {
    name: 'confirmationEmailContentUser',
    type: 'string',
    label: 'Confirmation email content',
    textarea: true
  },
  {
    name: 'confirmationEnabledAdmin',
    type: 'boolean',
    label: 'Confirmation to admin',
    help: 'Only implemented for resource `submissions` at the moment, other resource will use the "default" notification flow',
    choices: [
      {
        value: 1,
        label: "Yes",
        showFields: ['confirmationTemplateNameAdmin', 'confirmationSubjectAdmin', 'confirmationEmailFieldAdmin', 'confirmationTemplateAdmin', 'confirmationEmailContentAdmin']
      },
      {
        value: 0,
        label: "No"
      }
    ]
  },
  {
    name: 'confirmationTemplateNameAdmin',
    type: 'select',
    label: 'Admin template name',
    choices: [
      {
        label: 'submission default',
        value: 'submission_default.njk'
      },
      {
        label: 'Blanco template',
        value: 'blanco.njk'
      }
    ]
  },
  {
    name: 'confirmationSubjectAdmin',
    type: 'string',
    label: 'Confirmation subject to Admin',
  },
  {
    name: 'confirmationEmailFieldAdmin',
    type: 'string',
    label: 'Admin email field',
  },
  {
    name: 'confirmationEmailContentAdmin',
    type: 'string',
    label: 'Admin email content',
    textarea: true
  }
];

module.exports = fields;
