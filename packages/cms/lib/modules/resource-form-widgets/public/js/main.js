// Idea form extensions
// --------------------
       // Used by poster file upload and description editor to register
// a reference to each uploaded file. This reference list is used
// by the server to connect the correct image uploads to this idea.

//Fixme: don't use global vars
var formHasChanged = false;

apos.define('resource-form-widgets', {
  extend: 'map-widgets',
  construct: function (self, options) {

    /**
     *
     * @param ideaForm
     * @returns {*|jQuery}
     */
    self.setValidator = function(ideaForm) {
      if (self.validator) {
        return self.validator;
      }

      self.validator = $(ideaForm).validate({
        ignore: '',
        rules: {
          ignore: [],
          title: {
            required: true,
            minlength: titleMinLength,
            maxlength: titleMaxLength,
          },
          summary: {
            minlength: summaryMinLength,
            maxlength: summaryMaxLength,
          },
          description: {
            required: true,
            minlength: descriptionMinLength,
            maxlength: descriptionMaxLength,
          },
          validateImages: {
            validateFilePondImages: true,
            validateFilePondProcessingImages: true
          },
          validateFiles: {
            validateFilePondFiles: true,
            validateFilePondProcessingFiles: true
          }
        },
        submitHandler: function (form) {

          $(form).find('input[type="submit"]').val('Verzenden...');
          $(form).find('input[type="submit"]').attr('disabled', true);

          $.ajax({
            url: $(form).attr('action'),
            //  context: document.body,
            type: 'POST',
            data: $(form).serialize(),
            dataType: 'json',
            success: function (response) {
              formHasChanged = false;
              var redirect = $(form).find('.form-redirect-uri').val();
              redirect = redirect.replace(':id', response.id);
              //use href to simulate a link click! Not replace, that doesn't allow for back button to work
              window.location.href = window.siteUrl + redirect;
            },
            error: function (response) {
              // "this" the object you passed
              alert(response.responseJSON.msg);
              $(form).find('input[type="submit"]').val('Opslaan');
              $(form).find('input[type="submit"]').attr('disabled', false);
            },

          });
          return false;
        },
        errorPlacement: function (error, element) {
          if (element.attr("type") === "radio" || element.attr("type") === "checkbox") {
            var elementContainer = $(element).closest('.form-field-container')
            error.insertAfter(elementContainer);
          } else {
            error.insertAfter(element);
          }
        },
        invalidHandler: function (form, validator) {

          if (!validator.numberOfInvalids()) {
            return;
          }

          var $firstErrorEl = $(validator.errorList[0].element).closest('.form-group');
          if ($firstErrorEl.length > 0) {
            var scrollOffset = parseInt($firstErrorEl.offset().top, 10);
            scrollOffset = scrollOffset;// - 1200;

            $('html, body').scrollTop(scrollOffset);
          }

        }
      });
    }

    /**
     * Find filepond by type
     * @param filePonds
     * @param type
     * @returns {*}
     */
    self.findFilePond = function(filePonds, type) {
      return filePonds.find(function(pond) {
        if (pond.type === type) {
          return true;
        }

        return null;
      });
    }

    /**
     * Get resource images
     * @param images
     * @returns {*}
     */
    self.getResourceImages = function(images) {
      if (!images) {
        return [];
      }
      return images.map(function (image) {
        return {
          source: '{"url":"' + image + '"}',
          options: {
            type: 'local',
            // mock file information
            file: {
              name: image,
            },
            metadata: {
              poster: image,
              url: image
            }
          }
        };
      });
    }

    /**
     * Get files
     * @param files
     * @returns {*}
     */
    self.getResourceFiles = function(files) {
      if (!files) {
        return [];
      }
      return files.map(function (file) {
        return {
          source: '{"url":"' + file + '"}',
          options: {
            type: 'local',
            // mock file information
            file: {
              name: file,
            },
            metadata: {
              url: file
            }
          }
        };
      });
    }

    self.playAfterlibsLoaded = function ($widget, data, options) {
      var mapConfig = typeof resourceMapConfig !== 'undefined' && resourceMapConfig ? resourceMapConfig : {};

      if (mapConfig) {
        self.createMap(mapConfig);
        self.addPolygon(mapConfig);
        self.setIdeaMarker(mapConfig);
        self.addFormEventListeners(mapConfig);
        self.center();
      }
      var fieldsetElements = $widget.find('.filepondFieldset');

      var uploadedImages = self.getResourceImages(data.resourceImages)
      var uploadedFiles = self.getResourceFiles(data.resourceFiles);

      var ideaForm = $widget.find('#js-form');
      var sortableInstance;

      var filePonds = [];
      fieldsetElements.each(function(index, fieldsetElement) {
        var type = fieldsetElement.dataset.type;
        var uploadedItems = type === 'file' ? uploadedFiles : uploadedImages;
        var pondObject = initFilePond(fieldsetElement, type, uploadedItems);
        filePonds.push({
          type: fieldsetElement.dataset.type,
          pond: pondObject
        });

        var pondEl = $.find('.filepond--root')[0];

        if (ideaForm && pondEl) {
          self.setValidator(ideaForm);

          // check if files are being uploaded
          pondEl.addEventListener('FilePond:addfile', function (e) {
            if (sortableInstance) {
              $("ul.filepond--list").sortable('refresh');
            } else {
              sortableInstance = true;
              $("ul.filepond--list").sortable();
            }
          });

          pondEl.addEventListener('FilePond:processfile', function (e) {
              if ($(e.target).hasClass('filepond-image')) {
                self.validator.element($('input[name=validateImages]'))
              }
              if ($(e.target).hasClass('filepond-file')) {
                self.validator.element($('input[name=validateFiles]'))
              }
          });
        }
      })

      $.validator.addMethod("minLengthWithoutHTML", function (val, el, params) {
        var mainEditor = document.getElementById('js-editor');
        var lengthOfChars = stripHTML(mainEditor.innerHTML).length;
        return lengthOfChars >= params;
      }, "Minimaal {0} tekens.");


      $.validator.addMethod("validateFilePondImages", function () {
        if ($('.filepond-file').prop('required')) {
          var filePond = self.findFilePond(filePonds, 'image');

          var files = filePond ? filePond.pond.getFiles() : [];
          var pondFileStates = FilePond.FileStatus;

          files = files.filter(function (file) {
            return file.status === pondFileStates.PROCESSING_COMPLETE;
          });

          return files && files.length > 0;
        } else {
          return true;
        }

      }, "Eén of meerdere plaatjes zijn verplicht.");

      $.validator.addMethod("validateFilePondFiles", function () {
        if ($('.validateFiles').prop('required')) {
          var filePond = self.findFilePond(filePonds, 'file');
          var files = filePond ? filePond.pond.getFiles() : [];
          var pondFileStates = FilePond.FileStatus;

          files = files.filter(function (file) {
            return file.status === pondFileStates.PROCESSING_COMPLETE;
          });

          return files && files.length > 0;
        } else {
          return true;
        }

      }, "Eén of meerdere bestanden zijn verplicht.");

      $.validator.addMethod("validateFilePondProcessingFiles", function () {
        var filePond = self.findFilePond(filePonds, 'file');

        var files = filePond ? filePond.pond.getFiles() : [];
        var pondFileStates = FilePond.FileStatus;

        var processingFiles = files.filter(function (file) {
          return file.status !== pondFileStates.PROCESSING_COMPLETE;
        });

        return processingFiles.length === 0;
      }, "Bestanden zijn nog aan het uploaden.");

      $.validator.addMethod("validateFilePondProcessingImages", function () {
        var filePond = self.findFilePond(filePonds, 'image');

        var files = filePond ? filePond.pond.getFiles() : [];
        var pondFileStates = FilePond.FileStatus;

        var processingFiles = files.filter(function (file) {
          return file.status !== pondFileStates.PROCESSING_COMPLETE;
        });

        return processingFiles.length === 0;

      }, "Plaatjes zijn nog aan het uploaden.");

      if (ideaForm) {
        initLeavePageWarningForForm();

        self.setValidator(ideaForm);
      }
    }
  }
});


// characters counters ------------------------------

function initCharsLeftInfo(target, contentDiv, minLen, maxLen, isHTML) {

  if (!contentDiv) {
    return;
  }

	var msg = {
		min: contentDiv.querySelector('div.min'),
		max: contentDiv.querySelector('div.max')
	};
	var span = {
		min: msg.min.querySelector('span'),
		max: msg.max.querySelector('span')
	};

	updateCharsLeftInfo(isHTML);

	target.addEventListener('focus', function( event ) {
		contentDiv.className += ' visible';
	});

	target.addEventListener('blur', function( event ) {
		contentDiv.className = contentDiv.className.replace(' visible', '');
	});

	target.addEventListener('keyup', function() {
		updateCharsLeftInfo(isHTML);
	});

  if (isHTML) {
	  target.addEventListener('change', function() {
		  updateCharsLeftInfo(isHTML);
	  });
  }

	function updateCharsLeftInfo(isHTML) {
		var value = target.value || '';
		value = value.trim();

    if (isHTML) { // strip html
      var tmp = document.createElement("DIV");
      tmp.innerHTML = value;
      value = tmp.textContent || tmp.innerText || "";
    }

		var num_newlines = value.split(/\r\n|\r|\n/).length - 1;
		var len = value.length + num_newlines;

		var enable  = len < minLen ? 'min' : 'max';
		var disable = enable == 'max' ? 'min' : 'max';
		var ok = enable == 'max' ? len < maxLen : len > minLen;
		var chars   = len < minLen ?
			    minLen - len :
			    maxLen - len;

		msg[enable].className  = enable + ' ' + ( ok ? 'ok' : 'error' ) + ' visible';
		msg[disable].className = disable;
		span[enable].innerHTML = chars;
	}

}

window.addEventListener('load', function() {

	// title
	var textarea  = document.querySelector('textarea[name="title"]') || document.querySelector('input[name="title"]');
	var charsLeft = document.querySelector('#charsLeftTitle');
  if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, titleMinLength, titleMaxLength);

	// summary
	var textarea  = document.querySelector('textarea[name="summary"]') || document.querySelector('input[name="summary"]');
	var charsLeft = document.querySelector('#charsLeftSummary');
	if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, summaryMinLength, summaryMaxLength);

	// description
	var textarea  = document.querySelector('textarea[name="description"]') || document.querySelector('#js-editor');
	var charsLeft = document.querySelector('#charsLeftDescription');
	if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, descriptionMinLength, descriptionMaxLength, true);

  // add dynamic fields if exist
  $('.chars-counter').each(function () {
    var $inputEl = $(this);
    var minChar = $inputEl.attr('minlength');
    var maxChar = $inputEl.attr('maxlength');
    var $charsLeft = $inputEl.siblings('.charsLeft');

    initCharsLeftInfo($inputEl.get(0), $charsLeft.get(0), minChar, maxChar, true);
  })

  var $inputsAndSelects = $('#formulier-block input, #formulier-block select');

  if ($inputsAndSelects && $inputsAndSelects.length) {

    $inputsAndSelects.on('keydown', function (e) {
      if (e.key === "Enter") {
        var $nextGroup = $(this).closest('div').next('div');

        e.preventDefault();

        if ($nextGroup) {
          $nextGroup.find('input,select,textarea').first().focus();
          return false;
        } else {
          return $(this).closest('form').submit();
        }
      }
    })

  }

});

// einde characters counters ------------------------------

function initLeavePageWarningForForm () {
  if ($('.add-warning-when-leaving-page').length > 0) {

    $(document).on('change', 'form.add-warning-when-leaving-page input, form.add-warning-when-leaving-page select, form.add-warning-when-leaving-page textarea', function (e) {
      formHasChanged = true;
    });

    $(document).ready(function () {

      $(window).on('beforeunload', function(e){
        if (formHasChanged) {
          var message = 'Weet u zeker dat u de pagina wilt verlaten? (Het formulier wordt dan geleegd)', e = e || window.event;
          if (e) {  e.returnValue = message; }
          return message;
        } else {
        }
      });


    });
  }
}
