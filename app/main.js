const APP_VERSION = '0.0.1';
$(document).ready(function () {
    $('#appVersion').text('Version: ' + APP_VERSION);
});

/*
    On page load, we insert N input fields to start with.
    When the user clicks the `Add Another` button, append a new
    input group to the containing div. When the user clicks the 'X'
    we remove the item from the dom. If the user removes all the
    items, they can easily add more by clicking the button.
*/
const INITIAL_ITEMS = 4;
let i;  // incremented value used to create id tags for item fields

function removeItemField(identifier) {
    $(identifier).remove();
}

function templateItemField(i) {
    var identifier = 'item-'+i
    return `
    <div class="input-group mb-3" id="${identifier}">
        <input type="text" class="form-control" placeholder="Enter your task, option, or whatever else you need help deciding">
        <div class="input-group-append">
            <button onclick="removeItemField('#${identifier}')" class="btn btn-outline-danger" type="button">&cross;</button>
        </div>
    </div>`;
}

$(document).ready(function() {
    // Initialize some empty input fields on page load
    for ( i = 0; i < INITIAL_ITEMS; i++ ) {
        $('#theItems').append(templateItemField(i));
    }
});

$('#btnAdd').on('click', function() {
    // Add more fields when user clicks the button
    $('#theItems').append(templateItemField(i));
    i++;
});

/*
    This is the manner in which we select all of the input fields.
    If an input field is empty, we omit it. Pass the array of values
    to the function which populates the modal window and records results.
*/
function getArrayOfFieldValues() {
    var inputValues = $('#theItems div input').map(function () {
        // returns an array of values, may be empty or contain empty strings
        return $(this).val();
    }).get();
    var filteredArray = inputValues.filter(function(e) {
        return e;
    });
    if (filteredArray.length < 2) {
        return alert('Try adding some more items, you need at least 2');
    } else {
        // Launch the modal window and prompt the user for input, recording it.

    };
}

$('#btnStart').on('click', function() {
    var theValues = getArrayOfFieldValues();
    console.log(theValues);
});
