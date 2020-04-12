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
const INITIAL_ITEMS = 3;
let i;  // incremented value used to create id tags for item fields
const Highcharts = window.Highcharts;

function removeItemField(identifier) {
    $(identifier).remove();
}

function templateItemField(i) {
    var identifier = 'item-'+i
    return `
    <div class="input-group mb-3" id="${identifier}">
        <input type="text" class="form-control" placeholder="">
        <div class="input-group-append">
            <button onclick="removeItemField('#${identifier}')" class="btn btn-danger" type="button">&cross;</button>
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

function recordAndRemove(id, choice) {
    results[choice]++;
    $('#'+id).remove();
    // if we removed the last set of choices, show the results
    if ($('#theChoices').children().toArray().length === 0) {
        // convert our results object into something more usable
        var data = new Array();
        var keys = Object.keys(results);
        for (var k=0; k<keys.length; k++) {
            data.push([ keys[k], results[keys[k]] ]);
        }
        Highcharts.chart('theResults', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Results',
                align: 'center',
                verticalAlign: 'middle',
                y: 60
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%'],
                    size: '110%'
                }
            },
            series: [{
                type: 'pie',
                name: 'Results',
                innerSize: '50%',
                data: data,
            }]
        });
    }
}

function templateChoiceField(i, optionA, optionB) {
    var choiceId = 'choice-'+i
    return `
    <div class="card-group" id="${choiceId}">
        <div class="card">
            <div class="card-body text-center">
                <p class="card-text">${optionA}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-info btn-block btn-sm" onclick="recordAndRemove('${choiceId}', '${optionA}')">Select</button>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="card-text">${optionB}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-info btn-block btn-sm" onclick="recordAndRemove('${choiceId}', '${optionB}')">Select</button>
            </div>
        </div>
    </div>
    `;
}

/*
    This is the manner in which we select all of the input fields.
    If an input field is empty, we omit it. Pass the array of values
    to the function which populates the modal window and records results.
*/
let results;

function getArrayOfFieldValues() {
    var inputValues = $('#theItems div input').map(function () {
        return $(this).val();
    }).get();
    var filteredArray = inputValues.filter(function(e) {
        return e;
    });
    return filteredArray;
};

$('#btnStart').on('click', function() {
    // Remove any previous content
    $('#theResults').text('');
    $('#theChoices').children().remove();
    var theArray = getArrayOfFieldValues();
    if (theArray.length < 2) {
        return alert('Try adding some more items, you need at least 2');
    }
    // turn filtered array into an object for tallies (added benefit of dropping dupe keys)
    results = initializeResults(theArray);
    // create a list of [A, B] options (list of lists)
    var pairs = createComparisonPairs(results);
    // loop thru the pairs, populating modal window and storing results
    for (var i=0; i<pairs.length; i++) {
        // populate the choices and template the logic for recording responses
        // when the user makes a selection, record the answer and remove that list item.
        $('#theChoices').append(templateChoiceField(i, pairs[i][0], pairs[i][1]));
    }
});

/*
    This is the actual comparison logic. The formula for number of
    comparisons that must occur with an N-numbered set of criteria is
    >>> N(N-1) / 2
    N  |  Compares
    --------------
    2  |    1
    3  |    3
    4  |    6
    5  |    10
    6  |    15
*/
function initializeResults(array) {
    var results = {};
    for (var i=0; i<array.length; i++) {
        results[array[i]] = 0;
    }
    return results;
};

function createComparisonPairs(results) {
    // Operate on the object keys in case array contains duplicates
    var pairs = new Array();
    var keys = Object.keys(results);
    for (var i=0; i<keys.length-1; i++) {
        for (var j=i+1; j<keys.length; j++) {
            pairs.push([ keys[i], keys[j] ]);
        }
    }
    return pairs;
}
