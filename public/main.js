
console.log('test mainjs')

// *----------------*-------------* //
//display quotes 
const displayQuotes = document.getElementById('display-quotes')
let randomQuote;
let quoteInterval;

function getQuotes(req, res) {
  axios.get('https://type.fit/api/quotes')
    .then(response => {
      const quotes = response.data;
      const randomIndex = Math.floor(Math.random() * quotes.length);
      randomQuote = quotes[randomIndex].text;
      res.status(200).send(randomQuote);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error fetching quotes');
    });
}

function displayRandomQuote() {
  axios.get('https://type.fit/api/quotes')
    .then(response => {
      displayQuotes.innerHTML = '';
      const quotes = response.data;
      const randomIndex = Math.floor(Math.random() * quotes.length);
      let quote = quotes[randomIndex].text;
      // console.log(quote);

      displayQuotes.innerHTML = `<div>${quote}</div>`;
    })
    .catch(err => {
      console.log(err);
      displayQuotes.innerHTML = '<div>Error fetching quote</div>';
    });
}
console.log('line 44', sessionStorage.getItem('token'))
// Call the displayRandomQuote function initially to show a quote immediately
if (sessionStorage.getItem('token') == null) {
  displayRandomQuote();
  // Set an interval to display a new random quote every 3 seconds
  quoteInterval = setInterval(displayRandomQuote, 3000);
}


// *----------------*-------------* //

// Sign up / Login form button toggle
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.toggle('hidden'); // Toggle the 'hidden' class

  // Add event listener to the close button
  const closeButton = document.getElementById('modal-close-btn');
  closeButton.addEventListener('click', function () {
    modal.classList.add('hidden'); // Hide the modal when the close button is clicked
  });
}

function showLoginForm() {
  document.getElementById('login-div').classList.remove('hidden');
  document.getElementById('createAccount-div').classList.add('hidden');
}

function showCreateAccountForm() {
  document.getElementById('login-div').classList.add('hidden');
  document.getElementById('createAccount-div').classList.remove('hidden');
}

//show login or logout button

// Function to hide login button and show logout button
function showLogoutButton() {
  document.getElementById("login-btn").style.display = "none";
  document.getElementById("logout-btn").style.display = "block";
}

// Function to hide logout button and show login button
function showLoginButton() {
  document.getElementById("login-btn").style.display = "block";
  document.getElementById("logout-btn").style.display = "none";
}


// *----------------*-------------* //
//login and signup features

// Set this variable to true if the user is logged in, or false if not logged in
let isLoggedIn = false;

function checkSession() {
  const token = sessionStorage.getItem("token");
  if (token) {
    // User has an active session
    isLoggedIn = true;
  } else {
    // User does not have an active session
    isLoggedIn = false;
  }
}

checkSession();
// Function to check the login status and update buttons
function updateButtons() {
  if (isLoggedIn) {
    showLogoutButton();
  } else {
    showLoginButton();
  }
}

const loginForm = document.getElementById('login-form')
const signupForm = document.getElementById('create-form')
const inputLogin = document.getElementById('email-login')
const passwordLogin = document.getElementById('password-login')
const inputSignup = document.getElementById('email-signup')
const passwordSignup = document.getElementById('password-signup')

// signup
function signup(evt) {
  evt.preventDefault()
  const body = {
    email: inputSignup.value,
    password: passwordSignup.value
  }
  axios
    .post(`/api/signUp`, body)
    .then(async (res) => {
      alertify.success('Your account was created succesfully.')
      let token = await res.data.token
      console.log(res.data);
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("userId", res.data.flashcards_users_id);
      isLoggedIn = true;
      clearInterval(quoteInterval)
      const displayQuotesDiv = document.getElementById('div-quotes');
      displayQuotesDiv.classList.add('hidden')
      updateButtons();
      window.location.href = `/`;
    })
    .catch((err) => console.log(err));
}



function logout() {
  console.log('logout')
  sessionStorage.removeItem("token")
  isLoggedIn = false;
  updateButtons()
  window.location.href = `/`;


}
updateButtons();


//login form 
function login(event) {
  event.preventDefault()
  console.log('test function')
  console.log(inputLogin);
  console.log(passwordLogin);
  const body = {
    email: inputLogin.value,
    password: passwordLogin.value
  }
  console.log('body', body)
  axios
    .post(`/api/login`, body)
    .then((res) => {
      console.log('line 69 front end', res.data);
      let token = res.data.token;
      console.log('token', token)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", res.data.flashcards_users_id);
      console.log('After setting session items');
      isLoggedIn = true;
      console.log('isLoggedIn', isLoggedIn)
      console.log('After updating isLoggedIn');
      const displayQuotesDiv = document.getElementById('div-quotes');
      console.log(displayQuotesDiv)
      displayQuotesDiv.classList.add('hidden')
      console.log('Reached here');
      clearInterval(quoteInterval)
      updateButtons();
      console.log('After updateButtons call');
      window.location.href = `/`;
    })
    .catch(err => console.log(err))

}
loginForm.addEventListener('submit', login)
//signup form
signupForm.addEventListener('submit', signup)



// *----------------*-------------* //
// // handle create card if users are not logged in 
function handleCreateClick() {
  let token = sessionStorage.getItem("token");

  if (token === null) {
    alertify.alert('SkillUp', 'Please login to create flashcards!')
  } else {
    // Redirect to the create page or perform any other action
    window.location.href = "create.html"; // Replace with the actual URL
  }
}


// GET flashcards
const createBtn = document.getElementById('create-tag')

// display cards
function displayCards() {
  let userId = sessionStorage.getItem("userId")
  let token = sessionStorage.getItem("token");
  console.log(token)
  if (token !== null) {
    axios.get(`/api/flashcards?user_id=${userId}`)
      .then(res => {
        // console.log('from displayCards', res.data)

        const displayCards = document.getElementById('display-flashcards')
        displayCards.innerHTML = `
        <div class="shadow-2xl p-6">
          <h2 class="pt-8 mt-2 mb-3 text-center font-bold drop-shadow-xl text-sky-600 text-2xl">Behavioral Questions
          </h2>
          <div class="grid grid-cols-2 justify-items-center" id="behavioral-flashcards"></div>
        </div>

    <div class="shadow-2xl p-6">
        <h2 class="pt-8 mt-2 mb-3 text-center font-bold drop-shadow-xl text-sky-600 text-2xl">Technical Questions
        </h2>
        <div class="grid grid-cols-2 justify-items-center" id="technical-flashcards"></div>
    </div>

        `
        const behavioralList = document.getElementById('behavioral-flashcards')
        const technicalList = document.getElementById('technical-flashcards')
        res.data.forEach(card => {
          console.log('from each inside displayCards', card.favoritecard)


          //random colors from tailwindcss
          const cardColors = ['bg-pink-100',
            'bg-yellow-100',
            'bg-sky-100',
            'bg-green-100']
          // Calculate the random index
          const randomIndex = Math.floor(Math.random() * cardColors.length);
          const randomColor = cardColors[randomIndex]; //add the random index to the colors array
          const cardElement = `
          <div data-card-id="${card.flashcard_id}" class="h-64 w-64 m-8 cursor-pointer group perspective">
            <div class="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-1000 flex justify-center shadow-lg">
              <div class="absolute backface-hidden w-full h-full flex flex-col items-center ${randomColor}">
                <h2 class="flex-grow text-center text-gray-800 font-semibold flex items-center justify-center px-4 text-lg tracking-wider">
                  ${card.question}
                </h2>
              </div>
              <div class="absolute my-rotate-y-180 backface-hidden w-full h-full ${randomColor} overflow-hidden flex flex-col items-center">
                <h2 class="flex-grow text-center text-gray-800 font-semibold flex items-center justify-center px-4 text-[10px]">
                  ${card.answer}
                </h2>
              </div>
            </div>
            <div class="flex justify-center gap-4 mt-3">
                <a href="updateCards.html?id=${card.flashcard_id}" class="flex p-3 bg-green-500 rounded-xl hover:rounded-3xl hover:bg-green-600 transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                </a>
                <button onclick="deleteCard(${card.flashcard_id})"    class="flex p-3 bg-sky-500 rounded-xl hover:rounded-3xl hover:bg-sky-600 transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
                </button>
                <button onclick="favoriteCard(${card.favoritecard}, ${card.flashcard_id})"  class="flex p-3 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
</svg></button>
            </div>
        </div>

      
        `;


          if (card.category === 'behavioral') {
            behavioralList.innerHTML += cardElement;
          } else if (card.category === 'technical') {
            technicalList.innerHTML += cardElement;
          }


        });
      })
      .catch(error => {
        console.error('Error fetching flashcards:', error);
      });
  }
}

function deleteCard(id) {
  // console.log('id in deleteCard', id)
  axios.delete(`/api/flashcards/${id}`)
    .then(() => {
      console.log('deleted!')
      // Find the card element with the corresponding data-card-id attribute
      const cardElement = document.querySelector(`[data-card-id="${id}"]`);
      if (cardElement) {
        // Remove the card element from its parent node
        cardElement.parentNode.removeChild(cardElement);
      }
    })
    .catch(err => console.log(err))
}

function favoriteCard(isFavorited, flashcardId) {
  console.log('update favorites', flashcardId)
  console.log('isFavorited', isFavorited)
  console.log('!isFavorited', !isFavorited)
  // Send a request to update the favoriteCard value
  axios.put(`/api/flashcard/${flashcardId}`, { favoritecard: !isFavorited })
    .then(res => {
      alertify.success('Card favorited succesfully!');
      displayCards()
    })
    .catch(err => {
      console.error('Error favoriting the card:', err);
    });
}

displayCards()