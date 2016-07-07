function split() {
    //total amount
    var total_amount = document.getElementById("amount").value;
    //number of people
    var num_of_people = document.getElementById("people").value;

    //paid_amount will hold the sum of values of amount paid by an individual
    var paid_amount = 0;
    //calculate the paid_amount
    for ( i = 1; i <= num_of_people; i++) {
        paid_amount += parseInt(document.getElementById("paid" + i).value);
    }
    //check if paid_amount is not equal to total_amount, else re-do
    if (parseInt(paid_amount) !== parseInt(total_amount)) {
        alert('Split amount not equal to the total amount paid by each person.\nCheck and re-enter the split amount or paid values!');
    } else {
        //Variable declared to hold the value of total ratio
        var total_ratio = 0;
        // Array which holds ratio-values
        var p_ratio = [];
        //calculate ratio
        for( i = 1; i <= num_of_people; i++) {
            if (document.getElementById("friend" + i).value > 0) {
                //ratio-value of each person
                p_ratio["person" + i] = parseInt(document.getElementById("friend" + i).value) + 1;
            }
            else {
                //default ratio-value
                p_ratio["person" + i] = 1;
            }
            //total ratio
            total_ratio += parseInt(p_ratio["person" + i]);
        }

        //Array which holds initial share of each person
        var each_share = []; 
        //calculate initial shares
        for( i = 1; i <= num_of_people; i++){
            each_share["person" + i] = ((total_amount/total_ratio)*parseInt(p_ratio["person" + i])).toFixed(2);
        }

        //Array which holds balance-amount(after deducting their respective initial paid amount)
        var balance_arr = []; 
        //calulate balance amount
        for(i=1;i<=num_of_people;i++) {
            balance_arr.push({key:"Person" + i, value: (each_share["person" + i] - parseInt(document.getElementById("paid" + i).value)).toFixed(2) });
        }

        //Array which holds sorted list of values
        var sorted_arr = []; 
        //sort an array
        sorted_arr = balance_arr.sort(function(a, b){return a.value - b.value}); 
        //console.log(JSON.stringify(sorted_arr));

        // summary <div> where dynamic content will be placed
        var summary = document.getElementById("summary");
        // Clear previous contents of the summary
        removeDiv();

        //heading of summary <div>
        var h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode("Expense Summary:"));
        summary.appendChild(h3);

        // total_value holds the sum of all values of sorted_arr
        var total_value = 0;
        //calculate total_value(the sum of all values of sorted_arr)
        for( i=(sorted_arr.length - 1); i > 0; i--) {
            total_value += parseInt(sorted_arr[i].value);
        }
        //check if all values of sorted_arr are zero, which means share is settles among all members
        if (total_value === 0) {
            summary.appendChild(document.createTextNode("Expense settled among all!"));
            return false;
        } else {
            //Determine "Who owes what?"
            for( i=(sorted_arr.length - 1); i > 0; i--) {
                //difference of min and max values
                var diff = (parseFloat(sorted_arr[i].value) + parseFloat(sorted_arr[0].value)).toFixed(2);

                if(diff <= 0) {
                    if((parseFloat(sorted_arr[i].value)) === 0) {
                        while(i > 0){
                            summary.appendChild(document.createTextNode("Expense settled between "+sorted_arr[0].key+" & "+sorted_arr[i].key));
                            i--;
                            summary.appendChild(document.createElement("br"));
                        }
                        return false;
                    }
                    summary.appendChild(document.createTextNode(sorted_arr[i].key+ " owes Rs. " +Math.abs(sorted_arr[i].value)+" to " + sorted_arr[0].key));
                    sorted_arr[i].value = 0;
                    sorted_arr[0].value = diff;
                } else if (diff > 0) {
                    summary.appendChild(document.createTextNode(sorted_arr[i].key+ " owes Rs. " +Math.abs(sorted_arr[0].value)+" to " + sorted_arr[0].key));
                    sorted_arr[0].value = 0;
                    sorted_arr[i].value = diff;
                } 
                //remove element value with '0'
                if (sorted_arr[i].value === 0 && sorted_arr[0].value === 0) {
                    sorted_arr.splice(i,1);
                    sorted_arr.splice(0,1);
                } else if(sorted_arr[i].value === 0) {
                    sorted_arr.splice(i,1);
                } else if(sorted_arr[0].value === 0) {
                    sorted_arr.splice(0,1);
                }
                //sort the array, again(in the loop)
                sorted_arr = sorted_arr.sort(function(a, b){return a.value - b.value})
                // Append a line-break 
                summary.appendChild(document.createElement("br"));
            }
        }
    }
    return false;
}
        
function removeDiv() {
    // Clear previous contents of the summary
    while (summary.hasChildNodes()) {
        summary.removeChild(summary.lastChild);
    }
}

function addPeople() {
    // Number of inputs to create
    var number = document.getElementById("people").value;
    // Container <div> where dynamic content will be placed
    var container = document.getElementById("container");
    // Clear previous contents of the summary
    removeDiv();
    // Clear previous contents of the container
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for ( i=1; i<=number; i++){
        // Append a node with a random text
        container.appendChild(document.createTextNode("Person" +i+ " paid Rs. "));
        // Create an <input> element, set its attributes
        var input = document.createElement("INPUT");
        input.id = "paid" + i;
        input.type = "number";
        input.name = "paid" + i;
        input.min = "0";
        input.placeholder = "Amount paid by individal";
        input.required = "required";
        // Clear previous contents of the summary
        input.onkeyup = function() { return removeDiv(); };
        //setCustomValidity when text is invalid, and clear when valid.
        input.oninvalid= function() {this.setCustomValidity('Please enter the amount paid by the individual!');}
        input.oninput = function() {this.setCustomValidity('');}
        container.appendChild(input);
        // Append a node with a random text
        container.appendChild(document.createTextNode(" & brought "));
        // Create an <input> element, set its attributes
        var input1 = document.createElement("INPUT");
        input1.id = "friend" + i;
        input1.type = "number";
        input1.name = "friend" + i;
        input1.value = "0";
        input1.min = "0";
        // Clear previous contents of the summary
        input1.onkeyup = function() { return removeDiv(); };
        container.appendChild(input1);
        // Append a node with a random text
        container.appendChild(document.createTextNode(" friends along."));
        // Append a line-break 
        container.appendChild(document.createElement("br"));
    }
}