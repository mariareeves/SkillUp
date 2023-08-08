console.log('create js')

//Base url 
const BASE_URL = 'http://localhost:4000'

// POST flashcards
// Create Form
const formCards = document.getElementById('form-cards')
const questionInput = document.getElementById('question')
const cardSelect = document.getElementById('category')
const textareaAnswer = document.getElementById('answer')
const cancelBtn = document.getElementById('cancel')
const createBtn = document.getElementById('create')

// create the flashcards
// form handler
function createFlashcards(evt) {
  evt.preventDefault()
  let token = sessionStorage.getItem("token");
  let userId = sessionStorage.getItem("userId")

  let body = {
    question: questionInput.value,
    category: cardSelect.value,
    answer: textareaAnswer.value,
    user_id: userId,
  }

  questionInput.value = ''
  textareaAnswer.value = ''
  console.log('this is the body', body)
  token == null
    ? alert("Please login to create cards")
    : axios.post(`${BASE_URL}/api/flashcards`, body)
      .then(() => {
        console.log('create function front end')
      })
      .catch(err => console.log('error coming form front end create function', err))
}

// form event listener 
formCards.addEventListener('submit', createFlashcards)

// cancel button 
function cancel(evt) {
  evt.preventDefault();
  // Reset the values of the input fields to empty strings
  questionInput.value = '';
  cardSelect.value = 'behavioral'; // Set the default value for the category
  textareaAnswer.value = '';
}

//cancel button listener
cancelBtn.addEventListener('click', cancel)
