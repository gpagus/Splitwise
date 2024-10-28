/////////////////////////// CLASS USER S/////////////////////////////////////////////////////


class User {
  constructor(name, pfp, pronoun) {
    this.name = name;
    this.pfp = pfp;
    this.pronoun = pronoun;
    this.paid = 0;
    this.owed = 0;
  }
}

let users = [];
let expenses = [];
let totalAmount = 0;

function addUser(name, pfp, pronoun) {
  const newUser = new User(name, pfp, pronoun);
  users.push(newUser);
  updateUserSelect();
  addUserToDisplay(newUser);
}


/////////////////////////// CONSTANTS /////////////////////////////////////////////////////


const userSelect = document.getElementById('user');
const amountInput = document.getElementById('amount');
const titleInput = document.getElementById('title');
const confirmBtn = document.getElementById('confirmBtn');
const expensesContainer = document.getElementById('expensesContainer');


const nameInput = document.getElementById('name');
const genreInputs = document.querySelectorAll('input[name="genre"]');
const optionInputs = document.querySelectorAll('input[name="option"]');
const submitBtn = document.getElementById('submitBtn');
const usersContainer = document.getElementById("usersContainer");
const balancesContainer = document.getElementById("balancesContainer");

const nameRegex = /^[a-zA-Z\s]+$/;



////////////////////////////////// ADD USER METHODS ///////////////////////////////////////
function validateName() {
  return nameRegex.test(nameInput.value.trim());
}

function validateGenre() {
  return Array.from(genreInputs).some(input => input.checked);
}

function validateOption() {
  return Array.from(optionInputs).some(input => input.checked);
}

function validateFormAddUser() {
  if (validateOption() && validateGenre() && validateName()) {
    console.log("YES");
    submitBtn.style.filter = 'grayscale(0%)';
    submitBtn.disabled = false;
    return true;
  } else {
    console.log("NOPE");
    submitBtn.style.filter = 'grayscale(100%)';
    submitBtn.disabled = true;
    return false;
  }
}

nameInput.addEventListener('input', validateFormAddUser);
genreInputs.forEach(input => input.addEventListener('change', validateFormAddUser));
optionInputs.forEach(input => input.addEventListener('change', validateFormAddUser));

function addUserToDisplay(user) {
  if (user instanceof User) {
    const userDiv = document.createElement('div');
    const balanceDiv = document.createElement('div');

    userDiv.classList.add('user');
    balanceDiv.classList.add('user');

    userDiv.innerHTML = `
    <img src="./src/images/pfp${user.pfp}.png" alt="${user.name}'s Profile Picture" class="profile-picture" />
    <p>User: ${user.name}</p>
  `;

    balanceDiv.innerHTML = `
    <img src="./src/images/pfp${user.pfp}.png" alt="${user.name}'s Profile Picture" class="profile-picture" />
    <p>User: ${user.name}</p>
    <ul>
      <li>${user.pronoun} has paid: ${user.paid}$</li>
      <li>${user.pronoun} is owed: ${user.owed}$</li>
    </ul>
  `;

    usersContainer.appendChild(userDiv);
    balancesContainer.appendChild(balanceDiv);
  }

}

document.getElementById('add-user-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let genre = document.querySelector('input[name="genre"]:checked').value;
  let name = document.getElementById('name').value.trim();
  let pfp = document.querySelector('.image-radio input[name="option"]:checked ').value;
  let pronoun;
  if (genre == "men") {
    pronoun = "He";
  } else pronoun = "She"


  document.getElementById('add-user-form').reset();

  submitBtn.disabled = true;
  submitBtn.style.filter = 'grayscale(100%)';

  addUser(name, pfp, pronoun);
});
/////////////////////////// NAVIGATION METHODS /////////////////////////////////////////////////////


function displayPage(pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}

////////////////////////////////// ADD EXPENSE METHODS ///////////////////////////////////////

function addExpense(user, amount, title) {
  const payingUser = users.find(u => u.name === user);
  if (payingUser instanceof User) {

    payingUser.paid += amount;

    expenses.push({ title, amount, user: payingUser.name });

    displayExpense(title, amount, payingUser.name);

    calculateBalances();
    updateBalancesDisplay();
  }
}


function calculateBalances() {

  const totalAmount = users.reduce((acc, user) => acc + user.paid, 0);

  const perPerson = totalAmount / users.length;

  users.forEach(user => {
    user.owed = (perPerson - user.paid).toFixed(2);
  });
}


function displayExpense(title, amount, user) {
  const expenseDiv = document.createElement('div');
  expenseDiv.setAttribute("id", "expenseDiv")
  const date = new Date();
  const options = { day: 'numeric', month: 'long' };
  const formattedDate = date.toLocaleDateString('en-EN', options);

  expenseDiv.innerHTML = `
    <div>
    <h4>${title}</h4>
    <p>Date: ${formattedDate}</p>
    <p>Paid by: ${user}</p>
    <p>Amount: ${amount.toFixed(2)}$</p>
    </div>
    <div>
      <img src="./src/images/money.png" alt="png of racks" id="money">
    </div>
  `;

  expensesContainer.appendChild(expenseDiv);
}


function updateBalancesDisplay() {
  balancesContainer.innerHTML = '';
  users.forEach(user => {
    const balanceDiv = document.createElement('div');
    balanceDiv.classList.add('user');
    balanceDiv.innerHTML = `
      <img src="./src/images/pfp${user.pfp}.png" alt="${user.name}'s Profile Picture" class="profile-picture" />
      <p>User: ${user.name}</p>
      <ul>
        <li>${user.pronoun} has paid: ${user.paid.toFixed(2)}$</li>
        <li>${user.pronoun} ${user.owed < 0 ? 'is owed' : 'owes'}: ${Math.abs(user.owed)}$</li>
      </ul>
    `;
    balancesContainer.appendChild(balanceDiv);
  });
}




function updateUserSelect() {
  const userSelect = document.getElementById('user');
  userSelect.innerHTML = '';
  if (users.length > 0) {
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.name;
      option.textContent = user.name;
      userSelect.appendChild(option);
    });
  } else {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'empty';
    userSelect.appendChild(option);
  }
}

function validateAddExpense() {
  const isUserSelected = users.length > 0 && userSelect.value !== '';
  const isAmountValid = !isNaN(amountInput.value) && amountInput.value > 0;
  const isTitleValid = /^[a-zA-Z\s]+$/.test(titleInput.value.trim());

  confirmBtn.disabled = !(isUserSelected && isAmountValid && isTitleValid);
}

userSelect.addEventListener('change', validateAddExpense);
amountInput.addEventListener('input', validateAddExpense);
titleInput.addEventListener('input', function () {
  this.value = this.value.replace(/\s+/g, ' ').trim();
  validateAddExpense();
});

document.getElementById('add-expense-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const user = userSelect.value;
  const amount = parseFloat(amountInput.value);
  const title = titleInput.value.trim();

  addExpense(user, amount, title);

  amountInput.value = '';
  titleInput.value = '';
  userSelect.value = '';

  confirmBtn.disabled = true;
});

///////////////////////////////// RESET AND SETTLE UP /////////////////////////////////////


function settleUp() {
  users.forEach(user => {
    user.paid = 0;
    user.owed = 0;
  });

  expenses = [];

  updateBalancesDisplay();

}

document.querySelector('#settleUpBtn').addEventListener('click', settleUp);


updateUserSelect();

