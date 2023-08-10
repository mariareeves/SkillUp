console.log('update js')



// POST flashcards
const formUpdate = document.getElementById('form-update')
const questionInput = document.getElementById('question')
const textareaAnswer = document.getElementById('answer')
const updatelBtn = document.getElementById('update')
const cancelBtn = document.getElementById('cancel')
// questionInput.value = 'test'


// Function to get the flashcard ID from the URL query parameters
function getFlashcardIdFromUrl() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString);
  console.log('urlParams', urlParams)
  console.log('id', urlParams.get('id'))
  return urlParams.get('id');
}

// Function to retrieve the flashcard details from the backend based on the ID
function getFlashcardDetails(flashcardId) {
  console.log('getFlashcardDetails: ', flashcardId)
  return axios.get(`/api/flashcard/${flashcardId}`);
}

// Function to update the flashcards
function updateCard(evt) {
  evt.preventDefault();
  console.log('update')

  const flashcardId = getFlashcardIdFromUrl();
  if (!flashcardId) {
    console.error("Flashcard ID not found in URL query parameters.");
    return;
  }


  let body = {
    question: questionInput.value,
    answer: textareaAnswer.value,
  };

  questionInput.value = '';
  textareaAnswer.value = '';

  axios
    .put(`/api/flashcards/${flashcardId}`, body)
    .then((res) => {
      alertify.success('Flashcard updated successfully.');
      console.log('Update function front end', res);
      window.location.href = "index.html"
      // Optionally, you can redirect the user back to the main page or do something else after the update.
      // For example: window.location.href = "main.html";
    })
    .catch((err) => console.log('Error coming from the front end update function', err));
}

// On page load, fetch the flashcard details based on the ID in the URL and populate the form with the existing data
document.addEventListener('DOMContentLoaded', function () {
  const flashcardId = getFlashcardIdFromUrl();
  console.log('linha 64', flashcardId)
  if (flashcardId) {
    getFlashcardDetails(flashcardId)
      .then((res) => {
        console.log('res.data', res.data)
        const flashcard = res.data[0];
        console.log('question', flashcard.question)
        console.log('answer', flashcard.answer)
        questionInput.value = flashcard.question;
        textareaAnswer.value = flashcard.answer;
      })
      .catch((err) => console.log('Error fetching flashcard details', err));
  }
});


// form event listener 
formUpdate.addEventListener('submit', updateCard)

// cancel button 
function cancel(evt) {
  evt.preventDefault();
  // Reset the values of the input fields to empty strings
  questionInput.value = '';
  textareaAnswer.value = '';
}

//cancel button listener
cancelBtn.addEventListener('click', cancel)
