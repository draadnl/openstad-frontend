/**
 *
 * @param {string} type
 * @returns {string[]}
 */
function getAcceptedFileTypes(type) {
  if (type === 'file') {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  }

  return [
    'image/*'
  ];
}

/**
 *
 * @param {string} type
 * @returns {{process: string, fetch: string, revert: null}|{process: (function(*, *=, *, *, *, *, *, *, *): {abort: function(): void})}}
 */
function getServer(type) {
  if (type === 'file') {
    return {
      process: function (fieldName, file, metadata, load, error, progress, abort, transfer, options) {

        // fieldName is the name of the input field
        // file is the actual file object to send
        var formData = new FormData();
        formData.append('file', file, file.name);

        var request = new XMLHttpRequest();
        request.open('POST', '/file');

        // Should call the progress method to update the progress to 100% before calling load
        // Setting computable to false switches the loading indicator to infinite mode
        request.upload.onprogress = function (e) {
          progress(e.lengthComputable, e.loaded, e.total);
        };

        // Should call the load method when done and pass the returned server file id
        // this server file id is then used later on when reverting or restoring a file
        // so your server knows which file to return without exposing that info to the client
        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            // the load method accepts either a string (id) or an object
            load(request.responseText);
          } else {
            // Can call the error method if something is wrong, should exit after
            error('oh no');
          }
        };

        request.send(formData);

        // Should expose an abort method so the request can be cancelled
        return {
          abort: function () {
            // This function is entered if the user has tapped the cancel button
            request.abort();

            // Let FilePond know the request has been cancelled
            abort();
          }
        };
      },
    };
  }

  return {
    process: window.siteUrl + '/image',
    fetch: window.siteUrl + '/fetch-image?img=',
    revert: null
  };
}

/**
 * @returns {{labelButtonRemoveItem: string, labelFileProcessingError: string, labelFileCountSingular: string, labelFileCountPlural: string, labelButtonAbortItemLoad: string, labelFileLoadError: string, labelFileProcessingAborted: string, labelInvalidField: string, labelFileRemoved: string, labelFileLoading: string, labelButtonRetryItemProcessing: string, labelFileProcessing: string, labelTapToRetry: string, labelButtonRetryItemLoad: string, labelTapToCancel: string, labelFileSizeNotAvailable: string, labelTapToUndo: string, labelButtonProcessItem: string, labelIdle: string, labelButtonAbortItemProcessing: string, labelFileAdded: string, labelFileProcessingRevertError: string, labelButtonUndoItemProcessing: string, labelFileWaitingForSize: string, labelFileProcessingComplete: string, labelFileRemoveError: string}}
 */
function getFileLabels() {
  return {
    labelIdle: "Sleep bestand(en) naar deze plek of <span class='filepond--label-action btn btn-primary'>klik hier</span>",
    labelInvalidField: "Field contains invalid files",
    labelFileWaitingForSize: "Wachtend op grootte",
    labelFileSizeNotAvailable: "Grootte niet beschikbaar",
    labelFileCountSingular: "Bestand in lijst",
    labelFileCountPlural: "Bestanden in lijst",
    labelFileLoading: "Laden",
    labelFileAdded: "Toegevoegd", // assistive only
    labelFileLoadError: "Fout bij het uploaden",
    labelFileRemoved: "Verwijderd", // assistive only
    labelFileRemoveError: "Fout bij het verwijderen",
    labelFileProcessing: "Laden",
    labelFileProcessingComplete: "Bestand geladen",
    labelFileProcessingAborted: "Upload cancelled",
    labelFileProcessingError: "Error during upload",
    labelFileProcessingRevertError: "Error during revert",
    labelTapToCancel: "tap to cancel",
    labelTapToRetry: "tap to retry",
    labelTapToUndo: "tap to undo",
    labelButtonRemoveItem: "Verwijderen",
    labelButtonAbortItemLoad: "Abort",
    labelButtonRetryItemLoad: "Retry",
    labelButtonAbortItemProcessing: "Verwijder",
    labelButtonUndoItemProcessing: "Undo",
    labelButtonRetryItemProcessing: "Retry",
    labelButtonProcessItem: "Upload"
  }
}

/**
 * @returns {{labelButtonRemoveItem: string, labelFileProcessingError: string, labelFileCountSingular: string, labelFileCountPlural: string, labelButtonAbortItemLoad: string, labelFileLoadError: string, labelFileProcessingAborted: string, labelInvalidField: string, labelFileRemoved: string, labelFileLoading: string, labelButtonRetryItemProcessing: string, labelFileProcessing: string, labelTapToRetry: string, labelButtonRetryItemLoad: string, labelTapToCancel: string, labelFileSizeNotAvailable: string, labelTapToUndo: string, labelButtonProcessItem: string, labelIdle: string, labelButtonAbortItemProcessing: string, labelFileAdded: string, labelFileProcessingRevertError: string, labelButtonUndoItemProcessing: string, labelFileWaitingForSize: string, labelFileProcessingComplete: string, labelFileRemoveError: string}}
 */
function getImageLabels() {
  return {
    labelIdle: "Sleep afbeelding(en) naar deze plek of <span class='filepond--label-action btn btn-primary'>klik hier</span>",
    labelInvalidField: "Field contains invalid files",
    labelFileWaitingForSize: "Wachtend op grootte",
    labelFileSizeNotAvailable: "Grootte niet beschikbaar",
    labelFileCountSingular: "Bestand in lijst",
    labelFileCountPlural: "Bestanden in lijst",
    labelFileLoading: "Laden",
    labelFileAdded: "Toegevoegd", // assistive only
    labelFileLoadError: "Fout bij het uploaden",
    labelFileRemoved: "Verwijderd", // assistive only
    labelFileRemoveError: "Fout bij het verwijderen",
    labelFileProcessing: "Laden",
    labelFileProcessingComplete: "Afbeelding geladen",
    labelFileProcessingAborted: "Upload cancelled",
    labelFileProcessingError: "Error during upload",
    labelFileProcessingRevertError: "Error during revert",
    labelTapToCancel: "tap to cancel",
    labelTapToRetry: "tap to retry",
    labelTapToUndo: "tap to undo",
    labelButtonRemoveItem: "Verwijderen",
    labelButtonAbortItemLoad: "Abort",
    labelButtonRetryItemLoad: "Retry",
    labelButtonAbortItemProcessing: "Verwijder",
    labelButtonUndoItemProcessing: "Undo",
    labelButtonRetryItemProcessing: "Retry",
    labelButtonProcessItem: "Upload"
  }
}

/**
 *
 * @param {string} element
 * @param {string|'image'|'file'} type
 * @param {object[]} uploadedFiles
 * @param {object|null} options
 * @returns {null|fieldsetElement}
 */
function initFilePond(element, type, uploadedFiles, options = null) {
  var fieldsetElement = document.querySelector('.filepondFieldset');

  if (!fieldsetElement) {
    return null;
  }

  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginFileValidateSize);
  FilePond.registerPlugin(FilePondPluginFileValidateType);
  FilePond.registerPlugin(FilePondPluginFilePoster);
  FilePond.registerPlugin(FilePondPluginImageExifOrientation);
  FilePond.registerPlugin(FilePondPluginGetFile);

  var filePondSettings = {
    // set allowed file types with mime types
    // labelButtonDownloadItem: 'custom label', // by default 'Download file'
    allowDownloadByUrl: true, // by default downloading by URL disabled
    acceptedFileTypes: getAcceptedFileTypes(type),
    imageCropAspectRatio: '1:1',
    imagePreviewHeight: 100,
    filePosterHeight: 100,
    filePosterMaxHeight: 100,
    allowFileSizeValidation: true,
    maxFileSize: '8mb', // Todo: make configurable in server env?
    name: type,
    maxFiles: 5, // Todo: make configurable in field option?
    allowBrowse: true,
    files: uploadedFiles,
    server: getServer(type),
  };
  var labels = type === 'file' ? getFileLabels() : getImageLabels();

  filePondSettings = $.extend(filePondSettings, labels)

  return FilePond.create(fieldsetElement, filePondSettings);
}
