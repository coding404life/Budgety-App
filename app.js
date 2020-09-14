/**********************************************
 *** Start budgety Project
 **********************************************/
"use strict";
//budget controller module that handle our budget Data.
const budgetController = (function () {
    // expense function constructor
    const Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // income function constuctor
    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //calculate the total income nad expenses
    const calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.total[type] = sum;
    }

    //data structure 
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        precentage: -1
    }

    //public method
    return {
        addItem: function (type, des, val) {
            let newItem, ID;
            //[1 2 3 4 5 6] next id = 7;
            //[1 2 4 5 6 8] next id should be 9

            //create new id
            //id will return the last number of newItem in the array and add one to it
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            //push it into our data structure
            data.allItems[type].push(newItem);
            console.log(data)
            return newItem;
        },

        deleteItem: function (type, id) {
            let ids, index
            // id = 6
            //data.allitems[type][id];
            // ids = [1 2 4 6 8]
            // index = 3

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                //splice(position, number of elements)
                data.allItems[type].splice(index, 1)
            }
        },


        //calculate the budget and percentage fun
        calculateBudget: function () {
            // calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses 
            data.budget = data.total.inc - data.total.exp;

            // calculate the percentage of income that we spent
            if (data.total.inc > 0) {
                data.precentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.precentage = -1;
            }
            // expense = 100 and inc = 200 spent 50% = 100/200 = 0.5 * 100
        },

        // get the budget from data structure
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.precentage
            };
        },

    }

})();

/**********************************************************************/

//UI controller module
const UIController = (function () {
    //selected UI Classes its exposed now in puplic
    const DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    //methods that is exposed to the public
    return {
        getInput: function () {
            //best solution is to return 3 value in the same time inside of an object
            return {
                type: document.querySelector(DOMstring.inputType).value, // will be eather inc or exp 
                description: document.querySelector(DOMstring.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstring.inputValue).value)
            };

        },

        //expose the DOMstring into the public
        getDOMstring: function () {
            return DOMstring;
        },

        // add list items to the UI
        addListItem: function (obj, type) {
            let html, newHtml, element;

            //create html string with placeholder text
            if (type === 'inc') {
                element = DOMstring.incomeContainer;
                //insert Income html the to the dom
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstring.expensesContainer;
                //insert Expenses html the to the dom
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value)

            // insert the html into te DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        //remove the list item from the Ui
        deleteListItem: function (SelectedID) {
            // select the item id 
            let el = document.getElementById(SelectedID);
            // remove the selected item from the node  
            el.parentNode.removeChild(el);
        },

        //clear fields after inputing a description and a value
        clearFields: function () {
            let fields, fieldsArr;
            // select the descrpition and values from the from the dom
            fields = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);
            // a trick to make the list cames from querySelectorAll method become an array
            fieldsArr = Array.prototype.slice.call(fields);
            // using the forEach method to return the current items from this list and clear them
            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldsArr[0].focus();
        },
        //display the budget 
        displayBudget: function (obj) {
            //change the dom element text with the obj values
            document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstring.expenseLabel).textContent = obj.totalExp;
            //display the percentage if the value is greater than 0 
            if (obj.percentage > 0) {
                document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstring.percentageLabel).textContent = '--';
            }

        }

    }

})();

/**********************************************************************/

// GlOBAL APP CONTROLLER the controller module of our app that we pass the other modules too here
const controller = (function (budgetCtrl, UICtrl) {
    //Selected DOM Classes
    const DOM = UICtrl.getDOMstring();
    //  event listeneres function 
    const setupEventListeners = () => {
        //on click execute the ctrlAddItem function
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        //on keydown execute the ctrlAddItem function when the user hit return key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.which === 13 || event.keyCode === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };



    //update the budget
    const updateBudget = function () {
        //1- calculate the new budget 
        budgetCtrl.calculateBudget();
        //2- return the budget 
        let budget = budgetCtrl.getBudget();
        //6- Display the ui with the new budget
        UICtrl.displayBudget(budget);
    };

    // controller center 
    const ctrlAddItem = () => {
        let input, newItem;

        //1- get the input value 
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the new item to our data structure 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add the new items to the ui
            UICtrl.addListItem(newItem, input.type);

            // 4. clear fields
            UICtrl.clearFields();

            // 5. calcualte and update budget
            updateBudget();

            // 6. Calcualate and update the percentages 
            updatePercentages();
        }
    };

    const updatePercentages = () => {

        // 1. calculate the percentages 

        // 2. Read percentages from the budget controller 

        // 3. update the ui with the new percentages
    }

    const ctrlDeleteItem = (event) => {
        let itemID, splitID, type, ID;
        //select the parentnode of the button
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)
            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. update and show the new budget
            updateBudget();
            // 4. Calcualate and update the percentages 
            updatePercentages();
        }
        console.log(itemID);


    };

    return {
        //init method
        init: () => {
            console.log('Your app start Working');
            //set up the event listeners at the start of the app
            setupEventListeners();
            //display this obj at the beginnig of the the app
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };

})(budgetController, UIController);

controller.init();