const rp = require('request-promise');
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Form',
  addFields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
    },
    {
      type: 'string',
      name: 'intro',
      label: 'Intro',
      textarea: true
    },
    {
      type: 'string',
      name: 'redirectUrl',
      label: 'Where do we redirect the user after a successful submission?'
    },
    {
      type: 'select',
      name: 'sendMail',
      label: 'Send confirmation mail',
      choices: [
          {
            label: 'Yes',
            value: 1
          },
          {
            label: 'No',
            value: 0
          }
      ]
    },
    {
        type: 'select',
        name: 'emailTemplate',
        label: 'Email template',
        choices: [
          {
              label: 'De Brinken Knapt Op submission confimation template',
              value: 'dhknaptop_submission_confirmation',
          },
          {
              label: 'Houtwijk Knapt Op submission confimation template',
              value: 'houtwijk_submission_confirmation',
          }
        ]
    },
    {
        type: 'string',
        name: 'emailSubject',
        label: 'Email subject user'
    },
    {
        type: 'string',
        name: 'emailSubjectAdmin',
        label: 'Email subject admin'
    },
    {
      name: 'formFields',
      label: 'Form fields',
      type: 'array',
      titleField: 'title',
      required: true,
      schema: [
        {
          type: 'string',
          name: 'title',
          label: 'Title'
        },
        {
          type: 'string',
          name: 'description',
          label: 'Beschrijving',
          textarea: true
        },
        {
          name: 'inputType',
          label: 'Type veld',
          type: 'select',
          choices: [
            {
              label: 'Multiple choice',
              value: 'multiple-choice',
            },
            {
              label: 'Text',
              value: 'text',
            },
            {
              label: 'Textarea',
              value: 'textarea',
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
          name: 'choices',
          label: 'Keuzes (enkel voor multiple choice)',
          type: 'array',
          titleField: 'title',
          schema: [
            {
              name: 'image',
              type: 'attachment',
              label: 'Icon',
              required: false,
              trash: true
            },
            {
              type: 'string',
              name: 'title',
              label: 'Titel'
            },
            {
              type: 'string',
              name: 'value',
              label: 'Waarde'
            }
          ]
        },
        {
          type: 'string',
          name: 'inputKey',
          label: 'Key (waaronder op te slaan)'
        },
        {
          type: 'string',
          name: 'validation',
          label: 'Validatie (Komma gescheiden, bv: required, postcode, min2)',
        },
        {
          type: 'string',
          name: 'options',
          label: 'Configuratie',
          textarea: true
        }
      ]
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = styleSchema.generateId();
          widget.containerId = containerId;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }
      });

      return superLoad(req, widgets, callback);
    }


     var newOptions = options;
     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'filepond', { when: 'always' });
     };

     var superOutput = self.output;
     var formFields;

     var superOutput = self.output;
     self.output = function(widget, options) {
       formFields  = widget.formFields;
       return superOutput(widget, options);
     };

     self.route('post', 'submit', (req, res) => {
       //let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const appUrl = self.apos.settings.getOption(req, 'appUrl');
       const redirectUrl = (req.body.redirectUrl ? appUrl + req.body.redirectUrl : req.header('Referer') || appUrl);
       const siteId = req.data.global.siteId;
       const body = {
         submittedData: {},
         titles: {}
       };
       const auth = ` Bearer ${req.session.jwt}`;
       const errors = []
       const isValid = (fieldValidation, fieldValue) => {
         return true;
       }

      // const formFields =  self.schema.find(field => field.name === 'formFields');
  //     console.log('res', res);
       // console.log('formFields', formFields);
       // console.log('options', newOptions);

       /**
        * How do we secure the API?
        */
       
       var bodyData = req.body.data;
       
       if (req.body.image && req.body.imageInputKey) {
         var image = JSON.parse(req.body.image);
         bodyData[req.body.imageInputKey] = image.url;
        //body.submittedData
       }
       
       console.log ('===> data', bodyData);
       
       body.submittedData = bodyData;
       body.titles = req.body.title;
       body.sendMail = req.body.sendMail;
       body.emailTemplate = req.body.emailTemplate;
       body.emailSubject = req.body.emailSubject;
       body.emailSubjectAdmin = req.body.emailSubjectAdmin;
       /*
       formFields.data.forEach((field) => {
         var fieldKey = field.inputKey;
         var fieldValue = req.body[field.inputKey];

         if (isValid(field.validation, fieldValue)) {
           body.submittedData[fieldKey] = fieldValue;
         } else {
           errors.push(`${field.title} niet correct ingevuld`);
         }
       });
       */


         const options = {
            method: 'POST',
             uri:  apiUrl + `/api/site/${siteId}/submission`,
             headers: {
               'Accept': 'application/json',
        //         "Authorization" : auth,
             },
             body: body,
             json: true // Automatically parses the JSON string in the response
         };

         rp(options)
           .then(function (response) {
              res.redirect(redirectUrl);
           })
           .catch(function (err) {
              res.redirect(req.header('Referer')  || appUrl);
           });




      // Access req.body here
      // Send back an AJAX response with `res.send()` as you normally do with Express
    });
/*
     var superOutput = self.output;
     self.output = function(widget, options) {
       widget.formFields = widget.formFields.map((formField) => {
         let validationArray = formField.validation.length > 0 ? formField.validation.join(',').map(field => 'validate-' + field.trim()) : [];
         formField.inputAttributes = [];
         formField.inputClasses = validationArray;
       });


       return result;
     };

     */
  }
};
