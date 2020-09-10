/**********************************************
 *** Start budgety Project
 **********************************************/
"use strict";

//budget controller module that handle our budget Data.
const budgetController = (function () {

    const Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    // let exp = new Expense(1, 'ada', 2000);
    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
        }
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
            console.log(data.allItems[type])

            return newItem;
        }
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
        inputBtn: '.add__btn'
    }

    //methods that is exposed to the public
    return {
        getInput: function () {
            //best solution is to return 3 value in the same time inside of an object
            return {
                type: document.querySelector(DOMstring.inputType).value, // will be eather inc or exp 
                description: document.querySelector(DOMstring.inputDescription).value,
                value: document.querySelector(DOMstring.inputValue).value
            };

        },
        getDOMstring: function () {
            //expose the DOMstring into the public
            return DOMstring;
        }
    }

})();

/**********************************************************************/

// GlOBAL APP CONTROLLER the controller module of our app that we pass the other modules too here
const controller = (function (budgetCtrl, UICtrl) {

    const setupEventListeners = () => {
        //on click execute the ctrlAddItem function
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        //on keydown execute the ctrlAddItem function when the user hit return key
        document.addEventListener('keydown', function () {
            if (event.key === 'Enter' || event.which === 13 || event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    }

    //Selected controller Classes
    const DOM = UICtrl.getDOMstring();

    // console.log(DOM)
    const ctrlAddItem = function () {
        let input, newItem;

        //1- get the input value 
        input = UICtrl.getInput();
        //2- add the new item to our data structure
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3- add the new items to the ui

        //4- calculate the new budget 

        //5- update the ui with the new budget

    };

    return {
        //init method
        init: () => {
            console.log('Your app start Working');
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();