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
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calorie = parseInt(calorie);
      newItem = new item(ID, name, calorie);
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItems = item;
    },
    getCurrentItem: function () {
      return data.currentItems;
    },
    updateItem: function (name, calorie) {
      calorie = parseInt(calorie);

      let found = null;

      data.items.forEach((item) => {
        if (item.id === data.currentItems.id) {
          item.name = name;
          item.calories = calorie;
          found = item;
        }
      });
      return found;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
  };
})();

const UICtrl = (function () {
  const UISelector = {
    listItem: "item-list",
    itemList: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    nameInput: "item-name",
    calorieInput: "item-calories",
    total: ".total-calories",
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
    updateItem: function (item) {
      let listItems = document.querySelectorAll(UISelector.itemList);
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute("id");

        if (itemId === `item-${item.id}`) {
          document.querySelector(
            `#${itemId}`
          ).innerHTML = `<strong> ${item.name}: </strong> <em> ${item.calories} Calories </em> <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a> `;
        }
      });
      const totalCalories = itemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.clearInput();
      UICtrl.clearEditState();

    },
    clearInput: function () {
      document.getElementById(UISelector.nameInput).value = "";
      document.getElementById(UISelector.calorieInput).value = "";
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelector.deleteBtn).style.display = "none";
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.addBtn).style.display = "block";
    },
    showEditState: function () {
      document.querySelector(UISelector.deleteBtn).style.display =
        "inline-block";
      document.querySelector(UISelector.updateBtn).style.display =
        "inline-block";
      document.querySelector(UISelector.backBtn).style.display = "inline-block";
      document.querySelector(UISelector.addBtn).style.display = "none";
    },
    addItemToForm: function () {
      document.getElementById(
        UISelector.nameInput
      ).value = itemCtrl.getCurrentItem().name;
      document.getElementById(
        UISelector.calorieInput
      ).value = itemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelector.total).textContent = totalCalories;
    },
    getSelector: function () {
      return UISelector;
    },
  };
})();

const App = (function (itemCtrl, UICtrl) {
  const loadEventListener = function () {
    const UISelector = UICtrl.getSelector();

    document.querySelector(UISelector.addBtn).addEventListener("click", (e) => {
      const input = UICtrl.getInputValue();
      if (input.name !== "" && input.calorie !== "") {
        const newItem = itemCtrl.addItem(input.name, input.calorie);
        UICtrl.addListItem(newItem);
        const totalCalories = itemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearInput();
      }
      e.preventDefault();
    });
    document
      .querySelector(UISelector.backBtn)
      .addEventListener("click", (e) => {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    document
      .getElementById(UISelector.listItem)
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-item")) {
          const listId = e.target.parentElement.parentElement.id;
          const listIdArr = listId.split("-");
          const id = parseInt(listIdArr[1]);
          const itemToEdit = itemCtrl.getItemById(id);
          itemCtrl.setCurrentItem(itemToEdit);
          UICtrl.addItemToForm();
        }
        e.preventDefault();
      });
    document
      .querySelector(UISelector.updateBtn)
      .addEventListener("click", (e) => {
        const input = UICtrl.getInputValue();
        const updateItem = itemCtrl.updateItem(input.name, input.calorie);
        UICtrl.updateItem(updateItem);
        console.log(input);
        e.preventDefault();
      });

    // disabling Enter Key
    document.addEventListener("keypress", (e) => {
      // if(e.keyCode === 13 || e.which === 13){

      // }
      if (e.key === "Enter" || e.code === "Enter") {
        e.preventDefault();
        console.log("you Can't Do This");
      }
    });
  };

  return {
    init: function () {
      UICtrl.clearEditState();
      const items = itemCtrl.getItem();
      if (items.length < 1) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      const totalCalories = itemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      loadEventListener();
    },
  };
})(itemCtrl, UICtrl);

App.init();
