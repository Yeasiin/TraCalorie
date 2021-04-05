const itemCtrl = (function () {
  const item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: [
    //   { id: 0, name: "Stack Dinner", calories: 1200 },
    //   { id: 1, name: "Cookies", calories: 400 },
    //   { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItems: null,
    totalCalories: 0,
  };

  return {
    getItem: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (name, calorie) {
      let ID;

      if (data.items.length > 0) {
        // ID = data.items.length + 1;
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calorie = parseInt(calorie);
      newItem = new item(ID, name, calorie);
      data.items.push(newItem);

      return newItem;
    },
  };
})();

const UICtrl = (function () {
  const UISelector = {
    listItem: "item-list",
    addBtn: ".add-btn",
    nameInput: "item-name",
    calorieInput: "item-calories",
  };

  return {
    populateItemList: function (items) {
      let output = "";
      items.forEach((item) => {
        output += `<li id="item-${item.id}" class="collection-item" > <strong> ${item.name}: </strong> <em> ${item.calories} Calories </em> <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a> </li>`;
      });
      document.getElementById(UISelector.listItem).innerHTML = output;
    },
    getInputValue: function () {
      return {
        name: document.getElementById(UISelector.nameInput).value,
        calorie: document.getElementById(UISelector.calorieInput).value,
      };
    },
    hideList: function () {
      document.getElementById(UISelector.listItem).style.display = "none";
    },
    addListItem: function (item) {
      document.getElementById(UISelector.listItem).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong> ${item.name}: </strong> <em> ${item.calories} Calories </em> <a href="#" class="secondary-content">
        <i class="edit-item fas fa-pencil-alt"></i>
      </a> `;
      document
        .getElementById(UISelector.listItem)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function () {
      document.getElementById(UISelector.nameInput).value = "";
      document.getElementById(UISelector.calorieInput).value = "";
    },
    getSelector: function () {
      return UISelector;
    },
  };
})();

const App = (function (itemCtrl, UICtrl) {
  const loadEventListener = function () {
    const UISelector = UICtrl.getSelector();

    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  function itemAddSubmit(e) {
    const input = UICtrl.getInputValue();

    if (input.name !== "" && input.calorie !== "") {
      const newItem = itemCtrl.addItem(input.name, input.calorie);
      UICtrl.addListItem(newItem);
      UICtrl.clearInput();
      console.log(newItem);
    } else {
      console.log("fuck You");
    }

    e.preventDefault();
    // console.log("hello");
  }

  return {
    init: function () {
      const items = itemCtrl.getItem();
      if (items.length < 1) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      loadEventListener();
    },
  };
})(itemCtrl, UICtrl);

App.init();
