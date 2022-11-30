// array to store users
let users = [];

// checking if a user attribute exists in session ( users details are stored in session )
if (sessionStorage.getItem('users') != null) {
    users = JSON.parse(sessionStorage.getItem('users'));
}

// function to check if user is logged in
function isLoggedIn() {
    // if currentUser attribute doesn't exist in session logIn button is made visible and logout button & products nav is hidden
    if (sessionStorage.getItem('currentUser') == null) {
        document.getElementById('productsNav').style.display = 'none';
        document.getElementById('logoutNav').style.display = 'none';
        document.getElementById('loginNav').style.display = 'block';
        return false;
    }

    // if currentUser attribute exists logIn button is hidden and remaining is made visible
    document.getElementById('productsNav').style.display = 'block';
    document.getElementById('logoutNav').style.display = 'block';
    document.getElementById('loginNav').style.display = 'none';

    // details of logged in user is fetched from session
    let currentUser = sessionStorage.getItem('currentUser');
    return true;
}

// function which removes currentUser attribute from session and heads to index page
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// function to fetch data from url ( api )
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// function for logging in
function login() {
    let user = [];
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let loginFlag = false;
    let emailExistFlag = false;
    let loginFail = document.getElementById('loginFail');
    if (!(email && password)) {
        loginFail.innerHTML = 'Enter credentials to login';
        return;
    }

    // if no users are registered ( available in session ) login can't be initiated
    if (sessionStorage.getItem('users') == null) {
        loginFail.innerHTML = 'Not a registered user';
        return;
    }

    // if currentUser was set previously it's unset
    sessionStorage.removeItem('currentUser');

    // fetching all users
    users = JSON.parse(sessionStorage.getItem('users'));

    // loops through users
    for (let i = 0; i < users.length; ++i) {
        usersEmail = users[i].email;

        // loop is continued until input email matches one in user email ( fetched from session )
        if (usersEmail != email) {
            continue;
        }
        emailExistFlag = true;
        // reaches this section only if an email in session matches the entered email
        usersPassword = users[i].password;

        // if the input password is same as password in session login is success
        if (password == usersPassword) {
            document.getElementById('status').value = 'true';
            // current user details stored in array and is set to session
            user = users[i];
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            loginFlag = true;

            // forwarded to index page
            window.location.href = './index.html';
        }
    }

    // emailExistFlag becomes true only when the email entered by user exists in the session variable 'users'
    // if it's false, user is not registered
    if (!emailExistFlag) {
        loginFail.innerHTML = 'User not registered';
        return;
    }
    // login flag remains false until entered password matches the one in the session for the corresponding email
    // if login credentials are wrong it is displayed
    if (!loginFlag) {
        loginFail.innerHTML = 'Invalid credentials';
    }
}

// loads product
async function productLoad() {
    // if user isn't logged in product page can't be accessed
    if (!isLoggedIn()) {
        logout();
    }
    // fetching data
    url = 'https://mockyard.herokuapp.com/products';
    const data = await fetchData(url);

    let table = document.getElementById('productTable');
    let count = 1;

    // populating table with fetched data
    data.forEach((element) => {
        let row = table.insertRow();
        let no = row.insertCell(0);
        no.outerHTML =
            '<th scope="row" class="align-items-center justify-content-center">' +
            count +
            '</th>';
        count++;
        let name = row.insertCell(1);
        name.innerHTML = element.name;
        let price = row.insertCell(2);
        price.innerHTML = element.price;
        let description = row.insertCell(3);
        description.innerHTML = element.description;
        let category = row.insertCell(4);
        category.innerHTML = element.category;
        let createdAt = row.insertCell(5);
        createdAt.innerHTML = element.createdAt;
        let prodId = row.insertCell(6);
        prodId.innerHTML = element.productId;
    });
}

// user is registered by pushing it to 'users' array and storing it into session
function signup(user) {
    users.push(user);
    sessionStorage.setItem('users', JSON.stringify(users));
}

// signup form validation
function validate() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstname = document.getElementById('firstname').value;
    let lastname = document.getElementById('lastname').value;
    let form = document.getElementById('signupForm');

    let fnameLabel = document.getElementById('fnameLabel');
    let lnameLabel = document.getElementById('lnameLabel');
    let emailLabel = document.getElementById('emailLabel');
    let passwordLabel = document.getElementById('passwordLabel');
    let validateFlag = true;

    // checking if form details are filled and showing error correspondingly
    if (!firstname) {
        fnameLabel.classList.add('invalid');
        fnameLabel.innerHTML = 'Enter firstname';
        validateFlag = false;
    } else {
        fnameLabel.innerHTML = 'First Name';
        fnameLabel.classList.remove('invalid');
    }
    if (!lastname) {
        lnameLabel.classList.add('invalid');
        lnameLabel.innerHTML = 'Enter lastname';
        validateFlag = false;
    } else {
        lnameLabel.innerHTML = 'Last Name';
        lnameLabel.classList.remove('invalid');
    }

    // regex for email and password validation
    var mailFormat = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.(com|in|org)/;
    var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    // matching email and password with regex and if fails, error is displayed
    if (!email.match(mailFormat)) {
        emailLabel.innerHTML = 'Enter a valid email id';
        emailLabel.classList.add('invalid');
        validateFlag = false;
    } else {
        emailLabel.innerHTML = 'Email';
        emailLabel.classList.remove('invalid');
    }
    if (!password.match(passwordFormat)) {
        passwordLabel.innerHTML =
            'Password must be 8 or more characters in length and should contain atleast one uppercase and lower case';
        passwordLabel.classList.add('invalid');
        validateFlag = false;
    } else {
        passwordLabel.innerHTML = 'Password';
        passwordLabel.classList.remove('invalid');
    }

    // if any of the above validation is invalid function is returned
    if (!validateFlag) {
        return;
    }

    // if all validations are success user object is created and signed up
    let user = {
        firstname,
        lastname,
        email,
        password,
    };
    signup(user);

    // moving to login page after signup
    window.location.href = './login.html';
}
