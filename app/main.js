const APP_VERSION = '0.0.2';
$(document).ready(function () {
    $('#appVersion').text('Version: ' + APP_VERSION);
});

/*
    Variable initialization. Any variables whose scope is not limited
    to a function should be declared here so we can be sure not to overwrite.
*/
const Highcharts = window.Highcharts;
const INITIAL_ITEMS = 5;
const FADE_TIME = 300;
let i;  // incremented value used to create id tags for item fields
let results;    // object used to record user selections & display them

/*
    We have several templating functions that must be used in order to
    create components to be dynamically inserted into the DOM.
*/
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

function templateChoiceField(i, optionA, optionB) {
    var choiceId = 'choice-'+i
    return `
    <div class="card-group" id="${choiceId}">
        <div class="card">
            <div class="card-body text-center d-flex align-items-stretch">
                <button class="btn btn-outline-dark btn-block btn-lg" onclick="recordAndRemove('${choiceId}', '${optionA}')">${optionA}</button>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center d-flex align-items-stretch">
                <button class="btn btn-outline-dark btn-block btn-lg" onclick="recordAndRemove('${choiceId}', '${optionB}')">${optionB}</button>
            </div>
        </div>
    </div>
    `;
}

/*
    General utility & helper functions
*/
function removeItemField(identifier) {
    // Pop an input field/row when user clicks the X
    $(identifier).fadeOut(FADE_TIME, function() { $(this).remove(); });
}

function shuffle(a) {
    // CAUTION: SHUFFLES THE ARRAY !IN-PLACE!
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initializeResults(array) {
    // Prepares our results object we have previously initialized
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

function recordAndRemove(id, choice) {
    results[choice]++;
    // use a fade to remove item to provide the user with feedback
    $('#'+id).fadeOut(FADE_TIME, function() { 
        $(this).remove();
        // if we removed the last set of choices, show the results
        if ($('#theChoices').children().toArray().length === 0) {
            displayResultsChart(results);
        }
    });
}

function getArrayOfFieldValues() {
    // Gather an array containing all the user input values
    var inputValues = $('#theItems div input').map(function () {
        return $(this).val();
    }).get();
    var filteredArray = inputValues.filter(function(e) {
        return e;
    });
    return filteredArray;
};

/*
    Event handler and listener functions
*/
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
    // shuffle the pairs before looping as to not bias by input order
    shuffle(pairs);
    // loop thru the pairs, populating modal window and storing results
    for (var i=0; i<pairs.length; i++) {
        // populate the choices and template the logic for recording responses
        var shuffledPair = shuffle(pairs[i])
        $('#theChoices').append(templateChoiceField(i, shuffledPair[0], shuffledPair[1]));
        // when the user makes a selection, record the answer and remove that list item.
    }
});

/*
    This is anything to do with displaying the final results for viewing
*/
function displayResultsChart(results) {
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