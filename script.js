'use strict';


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const locale = navigator.language
let currentAccount;
let timer;
/////////////////////////////////////////////////
// Functions
const showDate = function(date=new Date()) {
 

  const options = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }
  return new Intl.DateTimeFormat(locale, options).format(date)
}
const startLogoutTimer = function() {
  let TIMEINSECONDS = 300;

  const timeFinished = setInterval(() => {
    const minute = String(Math.trunc(TIMEINSECONDS / 60)).padStart(2, 0)
    const second = String(TIMEINSECONDS % 60).padStart(2,0)
    labelTimer.textContent = `${minute}:${second}`
    if(TIMEINSECONDS === 0) {
      clearInterval(timeFinished)
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
      window.scrollTo(0,0)
    }
    TIMEINSECONDS--

  }, 1000)
  return timeFinished
}
const calcDaysPassed = function(day1, day2) {
  const MILISECOND = 1000;
  const SECOND = 60;
  const MINUTE = 60;
  const DAY = 24
  const difference = Number(day2) - Number(day1)
  // convert it to day
  const daysPassed = Math.trunc(Math.abs(difference / (MILISECOND * SECOND * MINUTE * DAY)));
  if(daysPassed == 0) return 'Today';
  if(daysPassed == 1) return 'yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`
}


const displayMovements = function ({movements, movementsDates}, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = calcDaysPassed(new Date(movementsDates[i]), new Date()) || showDate(new Date(movementsDates[i]))
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${date}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const showNotification = function(text, background='red') {
  Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    gravity: "top", 
    position: "right", 
    stopOnFocus: true, 
    style: {
      background: background,
      width: 'text-content',
      fontSize: '14px'
    },
  }).showToast();
}

///////////////////////////////////////
// Event handlers


btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // show notifictation if user doesn't exist 
  if(!currentAccount) showNotification('There is no user with username')

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //show date 
    labelDate.textContent = showDate();

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    console.log(timer)
    if(timer) clearInterval(timer)
    timer = startLogoutTimer()
    // Update UI
    updateUI(currentAccount);
    // show notification to the user 
    showNotification('logged in successfully', "linear-gradient(to right, #00b09b, #96c93d)")
  }else{
    //showing notification to the user 
    showNotification('your password is incorrect')
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // add tranfer date
    currentAccount.movementsDates.push(new Date().toISOString())
    receiverAcc.movementsDates.push(new Date().toISOString())

    //restart timer function
    clearInterval(timer)
    timer = startLogoutTimer()
    // Update UI
    updateUI(currentAccount);
    
    showNotification('money is transfered successfully', '#ffb003')
    // handling edge cases 
  }else if(receiverAcc?.username === currentAccount.username) {
    showNotification('you can not transfer money to yourself')
  }else if(amount < 0) {
    showNotification(`please enter valid amount`)
  }else if(!receiverAcc) {
    showNotification('There is no user with username')
  }else if(currentAccount.balance <= amount) {
    showNotification(`you don't have enough money to transfer`)
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    //add tranfer date
    currentAccount.movementsDates.push(new Date().toISOString())
    //restart timer function
    clearInterval(timer)
    timer = startLogoutTimer()
    // Update UI
    updateUI(currentAccount);
  }else if(amount < 0) {
    showNotification('please enter correct amount');
  }else if(!currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    showNotification('you can not loan this amount')
  }
  inputLoanAmount.value = '';

});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
   

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // scroll the screen to the top
    window.scrollTo(0, 0)
    // show notification
    showNotification('account is closed', 'red')
  }else{
    showNotification('your username or password is incorrect')
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});




