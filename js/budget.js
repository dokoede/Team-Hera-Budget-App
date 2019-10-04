/* js file for budget page */

const addBudgetForm = document.getElementById("budgetform");
const budgetResponseMessage = document.getElementById("budgetResponseMessage");
const expenseResponseMessage = document.getElementById(
  "expenseResponseMessage"
);
const addedBudgetResponseMessage = document.getElementById(
  "addedBudgetResponseMessage"
);
// const addedExpenseResponseMessage document.getElementById('addedExpenseResponseMessage');

const addExpenseForm = document.querySelector("#expenseform");
const calculateBtn = document.getElementById("calculate");
const table = document.getElementById("table");
const tbody = document.getElementById("tbody");

const expenseArray = [];
let Budget = {};
let userBudget;
let totalBudget;
let balance;

//  Adding New Budget
addBudgetForm.addEventListener("submit", event => {
  event.preventDefault();
  userBudget = document.getElementById("userbudget").value;

  if (userBudget < 0 || userBudget === "" || userBudget === null) {
    budgetResponseMessage.append("Please, enter a valid budget.");
    setTimeout(function() {
      budgetResponseMessage.remove();
      addBudgetForm.reset();
    }, 2000);
    // setTimeout(function () {
    //   budgetResponseMessage.append('Please, enter a valid budget.'), 1000);
    // budgetResponseMessage.append('Please, enter a valid budget.');
  } else {
    budgetResponseMessage.textContent = null;
    // send Success Message
    addedBudgetResponseMessage.append("Budget added.");
    document.getElementById("userbudget").setAttribute("readonly", true);
    document.getElementById("budgetButton").setAttribute("disabled", true);

    // initiate new budget
    const budgetValue = parseInt(userBudget);
    Budget.totalBudget = budgetValue;
  }
});

//   Adding New Expense
addExpenseForm.addEventListener("submit", event => {
  event.preventDefault();

  let expenseName = document.querySelector("#expensename").value;
  const priorities = document.querySelector("#priorities");
  let priority = priorities.options[priorities.selectedIndex].value;
  console.log(expenseName);
  console.log(priority);

  if (expenseName.length < 2 || expenseName === "") {
    expenseResponseMessage.append("Please, enter a valid budget title.");
  } else {
    const newExpense = { expenseName, priority };
    expenseArray.push(newExpense);
    expenseResponseMessage.textContent = null;
    // Send Success MEssage
    addedExpenseResponseMessage.append(`Added "${expenseName}" to Budget.`);

    // Render table here
    const tr = document.createElement("tr");

    const _id = expenseName.trim().slice(0, 2);
    tr.innerHTML = `
    <td> <span class="budget-icon"> ${_id}  </span> </td>
    <td> ${expenseName}  </td>
    <td> ${priority}  </td>
    <td> ₦ ...  </td>
    <hr>
    `;

    console.log(tr);

    table.append(tr);

    // console.log(expenseArray);

    expenseName = document.querySelector("#expensename");
    expenseName.value = null;
    expenseName = null;

    setTimeout(function() {
      addedExpenseResponseMessage.textContent = null;
    }, 1000);
  }
});

// Calculate Budget
const calculateBudget = async () => {
  let totalPriority = 0;
  let totalInversePriority = 0;
  let totalFundAllocated = 0;

  await expenseArray.map(expense => {
    totalPriority = eval(parseInt(totalPriority) + parseInt(expense.priority));
  });

  await expenseArray.map(expense => {
    expense.inversePriority = eval(parseInt(totalPriority) - expense.priority);
  });

  await expenseArray.map(expense => {
    totalInversePriority = eval(
      parseInt(totalInversePriority) + parseInt(expense.inversePriority)
    );
  });

  await expenseArray.map(expense => {
    expense._id = expense.expenseName.trim().slice(0, 2);
  });

  await expenseArray.map(expense => {
    const { inversePriority } = expense;
    // console.log(inversePriority, totalPriority);
    calculateFundAllocated = Math.floor(
      eval(
        (parseInt(inversePriority) / parseInt(totalInversePriority)) *
          parseInt(Budget.totalBudget)
      )
    );
    const FundsAllocated = roundDown(calculateFundAllocated, 100);
    totalFundAllocated = eval(
      parseInt(totalFundAllocated) + parseInt(FundsAllocated)
    );

    const styledFundsAllocated = FundsAllocated.toLocaleString();
    expense.fundAllocated = styledFundsAllocated;
  });
  balance = eval(parseInt(Budget.totalBudget) - parseInt(totalFundAllocated));
  renderExpenses(expenseArray, balance);

  return;
};

// Start Calculating
calculateBtn.addEventListener("click", calculateBudget);

const renderExpenses = (array, balance) => {
  console.log(tbody);

  const thead = `
  <thead  class="thead-light">
  <tr>
                          <th scope="col"></th>
                          <th scope="col">Item</th>
                          <th scope="col">Priority</th>
                          <th scope="col">Amount</th>

                        </tr>
                        
                      </thead>
  `;
  table.innerHTML = " ";
  table.innerHTML = thead;
  for (expense in array) {
    const tr = document.createElement("tr");
    // let _id = array[expense].expenseName.slice(0 , 1);
    // console.log(array[expense]);
    tr.innerHTML = `
    <td> <span class="budget-icon"> ${array[expense]._id}  </span> </td>
    <td> ${array[expense].expenseName}  </td>
    <td> ${array[expense].priority}  </td>
    <td> ₦ ${array[expense].fundAllocated}  </td>
    <hr>
    `;
    // console.log(tr);

    table.append(tr);
    // _id = " "
    // alert(balance)
    // console.log(array[expense]);
  }
  if (balance) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td> </td>
    <td> </td>
    <td> <b> BALANCE </b>  </td>
    <td> ₦ ${balance}  </td>`;

    table.append(tr);
  } else {
    // Do nothing ;
  }

  // CHART
};

const roundDown = (num, precision) => {
  num = parseFloat(num);
  if (!precision) return num.toLocaleString();
  return Math.floor(num / precision) * precision;
};

const chartfn = function() {
  const labels = [];
  const expenseData = [];
  const color = [];

  for (var i = 0; i < expenseArray.length; i += 1) {
    labels.push(expenseArray[i].expenseName);
    color.push("#" + Math.floor(Math.random() * 16777215).toString(16));
  }
  // console.log(expenseArray.fundAllocated);
  for (var i = 0; i < expenseArray.length; i += 1) {
    expenseData.push(
      Number(expenseArray[i].fundAllocated.replace(/[^0-9.-]+/g, ""))
    );
  }

  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "pie",

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: "Budget Allocation",
          backgroundColor: color,
          borderColor: "#fff",
          borderWidth: 5,
          data: expenseData
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Budget Allocation Chart",
        fontSize: 15
      },
      legend: {
        position: "bottom",
        fontSize: "16"
      },
      plugins: {
        datalabels: {
          color: "#fff",
          anchor: "end",
          borderRadius: 25,
          borderWidth: 2,
          align: "start",
          borderColor: "#fff",
          font: {
            weight: "bold",
            size: "10"
          },
          formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(2) + "%";
            return percentage;
          }
        }
      }
    }
  });
};
const dchart = document.querySelector(".dchart");
dchart.addEventListener("click", chartfn);
