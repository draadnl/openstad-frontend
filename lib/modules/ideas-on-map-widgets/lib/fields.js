const sortingOptions  = require('../../../../config/sorting.js').ideasOnMapOptions;

module.exports = [

	{
		type: 'select',
		name: 'displayType',
		label: 'Weergave',
		choices: [
			{
				label: 'Simpel',
				value: 'simple',
				showFields: [
					'displayWidth',
					'displayHeight',
					'linkToCompleteUrl'
				]
			},
			{
				label: 'Volledig',
				value: 'complete',
				showFields: [
          'ideaName', 'typeLabel', 'typesFilterLabel', 'startWithListOpenOnMobile'
				]
			}
		],
    def: 'complete',
	},
  {
    name: 'displayWidth',
    type: 'string',
    label: 'Width',
	},
  {
    name: 'displayHeight',
    type: 'string',
    label: 'Height',
	},

  {
    name: 'linkToCompleteUrl',
    type: 'string',
    label: 'Link naar',
	},

  {
    name: 'linkToUserPageUrl',
    type: 'string',
    label: 'Link naar gebruikers pagina',
	},

	{
		type: 'select',
		name: 'startWithListOpenOnMobile',
		label: 'Op mobiel opent de lijst van ideeen over de kaart',
    def: false,
		choices: [
			{
				label: 'Nee',
				value: false
			},
			{
				label: 'Ja',
				value: true,
			},
		]
	},

	{
		type: 'select',
		name: 'canSelectLocation',
		label: 'Op de kaart klikken selecteert een locatie',
    def: true,
		choices: [
			{
				label: 'Ja',
				value: true,
			},
			{
				label: 'Nee',
				value: false
			},
		]
	},
  
  {
    name: 'noSelectionLoggedInHTML',
    type: 'string',
    label: 'noSelectionLoggedInHTML',
    help: 'Er is geen punt of plan geselecteerd, met een {loginButton}.',
    textarea: true,
    required: false,
  },
  {
    name: 'noSelectionNotLoggedInHTML',
    type: 'string',
    label: 'noSelectionNotLoggedInHTML',
    help: 'Er is geen punt of plan geselecteerd, met een {addButton}.',
    textarea: true,
    required: false,
  },

	{
		type: 'select',
		name: 'showNoSelectionOnMobile',
		label: 'Toon het noSelection blok op mobiel',
    def: false,
		choices: [
			{
				label: 'Nee',
				value: false
			},
			{
				label: 'Ja',
				value: true,
			},
		]
	},


  {
    name: 'selectionActiveLoggedInHTML',
    type: 'string',
    label: 'selectionActiveLoggedInHTML',
    help: 'Ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {addButton}.',
    textarea: true,
    required: false,
  },
  {
    name: 'selectionInactiveLoggedInHTML',
    type: 'string',
    label: 'selectionInactiveLoggedInHTML',
    help: 'Ingelogd: er is een punt geselecteerd buiten de polygon, met een {address}',
    textarea: true,
    required: false,
  },
  {
    name: 'mobilePreviewLoggedInHTML',
    type: 'string',
    label: 'mobilePreviewLoggedInHTML',
    help: 'Ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {addButton}.',
    textarea: true,
    required: false,
  },
  {
    name: 'selectionActiveNotLoggedInHTML',
    type: 'string',
    label: 'selectionActiveNotLoggedInHTML',
    help: 'Niet ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {loginButton} of <a href="{loginLink}">login link</a>.',
    textarea: true,
    required: false,
  },
  {
    name: 'selectionInactiveNotLoggedInHTML',
    type: 'string',
    label: 'selectionInactiveNotLoggedInHTML',
    help: 'Niet ingelogd: er is een punt geselecteerd buiten de polygon, met een {address}',
    textarea: true,
    required: false,
  },
  {
    name: 'mobilePreviewNotLoggedInHTML',
    type: 'string',
    label: 'mobilePreviewNotLoggedInHTML',
    help: 'Niet ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {loginButton} of <a href="{loginLink}">login link</a>.',
    textarea: true,
    required: false,
  },
  {
    name: 'enableAddressSearchClickEvent',
    type: 'boolean',
    label: 'Enable address search click event?',
    choices: [
      {
        value: true,
        label: "Yes",
      },
      {
        value: false,
        label: "No"
      },
    ],
    def: true
  },
  {
    name: 'redirectAfterSubmitIdea',
    type: 'string',
    label: 'set redirect page'
  },
  {
    name: 'addressSearchCity',
    type: 'string',
    label: 'Set address search city',

  },
	{
		name: 'mapVariant',
		type: 'select',
		label: 'Variant',
    choices: [
      {
        label: 'NLMaps',
        value: '',
      },{
        label: 'Amsterdam',
        value: 'amaps',
      },
    ],
		required: false
	},
	{
		name: 'mapAutoZoomAndCenter',
		type: 'select',
		label: 'Zoom en center op',
    choices: [
      {
        label: 'Markers',
        value: 'markers',
      },{
        label: 'Polygon',
        value: 'polygon',
      },
    ],
		required: false
	},
  // zonder clusering werkt hij niet goed, dus die kun je nog niet uit zetten
	// {
	//   name: 'mapClustering',
	//   type: 'select',
	//   label: 'Clustering actief',
  //   choices: [
  //     {
  //       label: 'Ja',
  //       value: true,
	//   		showFields: [
	//   			'mapMaxClusterRadius'
	//   		]
  //     },{
  //       label: 'Nee',
  //       value: false,
  //     },
  //   ],
	//   required: false
	// },
  {
    name: 'mapMaxClusterRadius',
    type: 'integer',
    label: 'Gevoeligheid van clusering',
		def: 40
	},

	{
		name: 'ideaName',
		type: 'string',
		label: 'Naam voor idea',
		def: 'Inzending',
		required: false
	},
	{
		name: 'typeField',
		type: 'string',
		label: 'Veld voor type inzending',
		def: 'extraData.theme',
		required: false
	},
	{
		name: 'typeLabel',
		type: 'string',
		label: 'Label voor type in detail pagina',
		def: 'Thema',
		required: false
	},
	{
		name: 'typesFilterLabel',
		type: 'string',
		label: 'Label voor type in filters',
		def: 'Alle thema\'s',
		required: false
	},

	{
		type: 'select',
		name: 'showReactions',
		label: 'Toon reacties',
    def: true,
		choices: [
			{
				label: 'Ja',
				value: true,
        showFields: ['reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds'],
			},
			{
				label: 'Nee',
				value: false
			},
		]
	},

	{
		name: 'reactionsTitle',
		type: 'string',
		label: 'Titel boven reaties',
		required: false
	},

	{
		name: 'reactionsFormIntro',
		type: 'string',
		label: 'Tekst boven reaactie invoerveld',
		required: false
	},

	{
		name: 'reactionsPlaceholder',
		type: 'string',
		label: 'Tekst in leeg reactie invoerveld',
		required: false
	},

	{
		name: 'ignoreReactionsForIdeaIds',
		type: 'string',
		label: 'Ids van Ideas waarvoor reacties niet actief zijn',
		required: false
	},

	{
		name: 'closeReactionsForIdeaIds',
		type: 'string',
		label: 'Ids van Ideas waarvoor reacties gesloten zijn',
		required: false
	},

  {
    type: 'checkboxes',
    name: 'selectedSorting',
    label: 'Select sorting available',
    choices: sortingOptions
  },
  {
    type: 'select',
    name: 'defaultSorting',
    label: 'Select the default sorting',
    choices: sortingOptions
  },

  {
    name: 'showShareButtons',
    type: 'boolean',
    label: 'Display share buttons?',
    choices: [
      {
        value: true,
        label: "Yes",
        showFields: ['shareChannelsSelection']
      },
      {
        value: false,
        label: "No"
      },
    ],
    def: true
  },
  {
    name: 'shareChannelsSelection',
    type: 'checkboxes',
    label: 'Select which share buttons you want to display (if left empty all social buttons will be shown)',
    choices: [
      {
        value: 'facebook',
        label: "Facebook"
      },
      {
        value: 'twitter',
        label: "Twitter"
      },
      {
        value: 'mail',
        label: "E-mail"
      },
      {
        value: 'whatsapp',
        label: "Whatsapp"
      },
    ]
  },

  
  // ----------------------------------------------------------------------------------------------------
  // dit komt uit user-form en moet daarmee gelijk getrokken als dat echt werkt
  // {
  //   type:  'string',
  //   name:  'formTitle',
  //   label: 'Title',
  // },
  // {
  //   type:     'string',
  //   name:     'formIntro',
  //   label:    'Intro',
  //   textarea: true
  // },
  {
		type:	 'string',
		name:	 'formUrl',
    help:  'dit overschrijft de onderstaande formulier definitie',
		label: 'Form Url',
	},
  // TODO: dit is al de zovelste kopie en moet dus naar een lib
  {
    name:       'formFields',
    label:      'Form fields',
    type:       'array',
    titleField: 'title',
    schema:     [
      {
        type:  'string',
        name:  'name',
        label: 'Name of the database field',
			  required: true,
      },
      {
        type:  'string',
        name:  'title',
        label: 'Title'
      },
      {
        type:     'string',
        name:     'description',
        label:    'Beschrijving',
        textarea: true
      },
      {
        name:    'inputType',
        label:   'Type veld',
        type:    'select',
        choices: [
          {
            label: 'Select',
            value: 'select',
          },
          {
            label: 'Text',
            value: 'text-with-counter',
          },
          {
            label: 'Textarea',
            value: 'textarea-with-counter',
          },
          {
            label: 'HTML',
            value: 'html-with-counter',
          },
          {
            label: 'Radio buttons',
            value: 'radios',
          },
          {
            label: 'Image upload',
            value: 'image-upload',
          },
          {
            label: 'Locatie picker',
            value: 'location-picker',
          }
        ]
      },
      {
        name:       'choices',
        label:      'Keuzes (enkel voor multiple choice of select)',
        type:       'array',
        titleField: 'title',
        schema:     [
          {
            type:  'string',
            name:  'title',
            label: 'Titel'
          },
          {
            type:  'string',
            name:  'value',
            label: 'Waarde'
          }
        ]
      },
		  {
			  type: 'select',
			  name: 'required',
			  label: 'Is verplicht',
        def: 'none',
			  choices: [
				  {
					  label: 'Ja',
					  value: true,
				  },
				  {
					  label: 'Nee',
					  value: false
				  },
			  ]
		  },
    ]
  },
  {
    type: 'color',
    name: 'polygonColor',
    label: 'Polygon outline color',
  },
  {
    type: 'color',
    name: 'polygonFillColor',
    label: 'Polygon fill color',
  },
  {
    type: 'float',
    name: 'polygonFillOpacity',
    label: 'Polygon fill opacity',
    help: 'Enter a value between 0 and 1, where 1 is visible, and 0 is invisible',
    min: 0,
    max: 1
  },

]
