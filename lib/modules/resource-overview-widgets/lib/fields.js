const ideaStates      = require('../../../../config/idea.js').states;
const sortingOptions  = require('../../../../config/sorting.js').options;

module.exports = [
      {
        name: 'displayType',
        label: 'Type ',
        type: 'select',
        choices: [
          {
            label: 'Minimum stemmen (stemvan type)',
            value: 'minimalVotes',
          },

          {
            label: 'Uitklap',
            value: 'gridder',
          },
          {
            label: 'Row',
            value: 'row',
          },
          {
            label: 'Raw (activeResource is the variable)',
            value: 'raw',
          },
        ]
      },
      {
        name: 'fallBackToMapImage',
        label: 'Fall back to map image if no image available?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true,
            showFields: []
          },
          {
            label: 'No',
            value: false,
          }
        ]
      },
      {
        name: 'displayPagination',
        label: 'Display pagination',
        type: 'boolean',
      },
      {
        name: 'pathForResource',
        label: 'Url structure for the resource (for instance /article, the code turns that into /article/10)',
        type: 'string',
      },

      {
        name: 'defaultImage',
        type: 'attachment',
        label: 'Default image',
        trash: true
      },
      {
        name: 'showVoteCounter',
        label: 'Show vote counter (for gridder)',
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
        ]
      },
      {
        name: 'displayRanking',
        label: 'Display ranking',
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
        ]
      },
      {
        name: 'amountCharsSummary',
        label: 'Amount of characters for the summary',
        type: 'string',
        def: '60'
      },
      {
        name: 'rawInput',
        label: 'Raw input',
        type: 'string',
        textarea: true
      },

      {
        name: 'gridder_text_open',
        label: 'Text for hover on image',
        type: 'string'
      },
      {
        name: 'gridder_tile_image_aspect_ratio',
        label: 'Aspect ratio of images in tiles',
        type: 'string',
        def: '1:1',
      },
      {
        name: 'gridder_use_field_as_title',
        label: 'Which field should be used as title for an idea',
        type: 'string',
        def: 'title',
      },
      {
        type: 'checkboxes',
        name: 'selectedSorting',
        label: 'Select sorting available (check one or more)',
        choices: sortingOptions
      },
      {
        type: 'select',
        name: 'defaultSorting',
        label: 'Select the default sorting (needs to be checked)',
        choices: sortingOptions
      },
      {
        type: 'string',
        name: 'filterResources',
        label: 'Show only following ideas: (idea id\'s, comma seperated)',
      },
      {
        type: 'string',
        name: 'pageSize',
        label: 'Amount of items per page',
        help: "There is a max of 100 per page"
      },
      {
        name: 'filterClassName',
        type: 'select',
        label: 'Select styling class for filter and sorting',
        choices: [
          {
            label: 'Default',
            value: 'filterDefault',
          },
          {
            label: 'Clean',
            value: 'filterClean',
          },
        ]
      },
      {
        name: 'displayFilterVoting',
        label: 'Display filter & sorting?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
        def: true
      },
      {
        name: 'displayNewFilter',
        label: 'Display new filter & sorting?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
    ].concat(
      ideaStates.map((state) => {
        return {
          type: 'string',
          name: 'label' +  state.value,
          label: 'Label for: ' + state.value,
        }
      })
  );