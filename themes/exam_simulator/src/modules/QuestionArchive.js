import { showAlert } from "./Alert"

class QuestionArchive{

  constructor(){

    if(!document.getElementById('question-archive')){
      return
    }

    // edit mode
    this.editModeBtn = document.getElementById('onedit-question-btn')
    this.saveEditBtn = document.getElementById('save-edit-btn')
    this.inputEls = document.querySelectorAll('input')
    this.selectAnswerDiv = document.querySelectorAll('.select-answers')

    // delete mode
    this.deleteModeBtn = document.getElementById('delete-question')
    this.selectQuestionBtns = document.querySelectorAll('.select-question-btn')

    // create question
    this.createQuestionBtn = document.getElementById('create-question')
    this.newQuestionInputCard = document.getElementById('new-question_input_card')
    this.isActiveNewQuestionCard = false
    
    // question answer options manage elements
    this.addAnotherAnswerSpan = document.querySelectorAll('.add-answer')
    this.deleteAnswerSpan = document.querySelectorAll('.delete-answer')

    // stores
    this.editQuestionList = new Map()
    this.selectedQuestionToDelete = new Set()

    this.events()
  }

  events(){
    
    this.editModeBtn.addEventListener('click', () => this.editMode())
    this.saveEditBtn.addEventListener('click', () => this.saveEditHandler())
    
    this.addAnotherAnswerSpan.forEach((span) => {
      span.addEventListener('click', this.addAnotherAnswer.bind(this, span))
    })

    this.deleteAnswerSpan.forEach((span) => {
      span.addEventListener('click', this.deleteAnswer.bind(this, span))
    })


    document.querySelectorAll('.card').forEach(el => {
      el.addEventListener('click', () => {
        this.editQuestionList.set(el.dataset.quizId, el) 
      })
    })

    this.selectQuestionBtns.forEach((el) => {
      el.addEventListener('click', () => {
        el.classList.toggle('selected')

        const qId = el.closest('.card').dataset.quizId
        if(this.selectedQuestionToDelete.has(qId)){
          this.selectedQuestionToDelete.delete(qId)
        }
        else{
          this.selectedQuestionToDelete.add(qId)
        }

      })
    })

    this.deleteModeBtn.addEventListener('click', () =>{

      this.selectQuestionBtns.forEach((el) => {
        el.style.opacity = el.style.opacity === '1' ? 0 : 1
        el.disabled = !el.disabled
        if(el.classList.contains('selected')){
          el.classList.remove('selected')
        }
      })

      if(this.deleteModeBtn.innerText === 'DELETE MODE'){
        this.createQuestionBtn.classList.add('hidden')
        this.editModeBtn.classList.add('hidden')
        this.saveEditBtn.innerText = 'confirm delete'
        this.deleteModeBtn.innerText = 'cancel'
      }
      else{
        this.createQuestionBtn.classList.remove('hidden')
        this.editModeBtn.classList.remove('hidden')
        this.deleteModeBtn.innerText = 'delete mode'
        this.saveEditBtn.innerText = 'save'
      }

      this.saveEditBtn.disabled = !this.saveEditBtn.disabled
      this.saveEditBtn.classList.toggle('primary-btn')
      this.saveEditBtn.classList.toggle('danger-btn')

      if(this.selectedQuestionToDelete.size > 0){
        this.selectedQuestionToDelete.clear()
      }
      
    })

    // create question btn event

    this.createQuestionBtn.addEventListener('click', () => {
      if(this.createQuestionBtn.innerText === 'CREATE QUESTION'){
        this.deleteModeBtn.classList.add('hidden')
        this.editModeBtn.classList.add('hidden')
        this.createQuestionBtn.innerText = 'cancel'
        this.newQuestionInputCard.style.height = '200px'
        this.newQuestionInputCard.style.opacity = '1'
        this.newQuestionInputCard.style.transform = 'translateX(0)'
        this.isActiveNewQuestionCard = true
      }//cancel event
      else{
        this.deleteModeBtn.classList.remove('hidden')
        this.editModeBtn.classList.remove('hidden')
        this.createQuestionBtn.innerText = 'create question'
        this.newQuestionInputCard.style.height = '0px'
        this.newQuestionInputCard.style.opacity = '0'
        this.newQuestionInputCard.style.transform = 'translateX(-100%)'
        this.isActiveNewQuestionCard = false
      }
      this.saveEditBtn.disabled = !this.saveEditBtn.disabled
      
    })
    

  }

  editMode(){

    if(this.editModeBtn.innerText === 'EDIT MODE'){
      this.createQuestionBtn.classList.add('hidden')
      this.deleteModeBtn.classList.add('hidden')
      this.editModeBtn.innerText = 'Cancel'
      this.saveEditBtn.disabled = false
    }
    else{ //click cancel event
      this.createQuestionBtn.classList.remove('hidden')
      this.deleteModeBtn.classList.remove('hidden')
      this.editModeBtn.innerText = 'Edit Mode'
      this.saveEditBtn.disabled = true
      document.querySelectorAll('.temp_created-input').forEach((el) => el.remove())
      this.editQuestionList.clear()
    }

    this.editModeBtn.classList.toggle('danger-btn')
    this.editModeBtn.classList.toggle('primary-btn')
    
    this.selectAnswerDiv.forEach((el) => {
      el.classList.toggle('edit-mode')
    })
    
    document.querySelectorAll('.span-wrapper').forEach((el) => {
      el.classList.toggle('edit-on')
    })

    this.inputEls.forEach(el => {
      if(el.type === 'checkbox'){
        el.disabled = !el.disabled
      }
      else{
        el.readOnly = !el.readOnly
      }
    })

  }

  saveEditHandler(){

    if(this.selectedQuestionToDelete.size > 0){
      this.deleteHandler()
    }
    else if(this.isActiveNewQuestionCard){
      this.createNewQuestion()
    }
    else{
      this.saveEdit()
    }
    
    

  }

  addAnotherAnswer(span){

    const cardDiv = span.closest('.card')
    const cardTopSelectAnswerDiv = cardDiv.querySelector('.select-answers')
    const cardBottomEl = span.closest('.card-bottom')
    const answerTextInput = cardBottomEl.querySelectorAll('input')

    let quizId = cardDiv.dataset.quizId
    if(this.isActiveNewQuestionCard){
      quizId = "new"
    }

    const newTextInput = this.createNewTextInput(quizId, answerTextInput.length + 1)
    const newCheckboxInput = this.createNewCheckInput(quizId, answerTextInput.length + 1)

    if(answerTextInput.length === 0){
      cardBottomEl.prepend(newTextInput)
    }else{
      answerTextInput[answerTextInput.length - 1].nextElementSibling.before(newTextInput)
    }

    cardTopSelectAnswerDiv.append(newCheckboxInput)
  }

  deleteAnswer(span){

    const cardDiv = span.closest('.card')
    const selectCorrectAnswerLabel = cardDiv.querySelectorAll('.select-correct-answer_label')

    const cardBottomEl = span.closest('.card-bottom')

    const inputsInTheQuestion = cardBottomEl.querySelectorAll('input')
    if(inputsInTheQuestion.length === 1){
      return
    }
    if(inputsInTheQuestion.length > 0){
      inputsInTheQuestion[inputsInTheQuestion.length - 1].remove()
      selectCorrectAnswerLabel[selectCorrectAnswerLabel.length - 1].remove()
    }

  }

  createNewQuestion(){
    const title = this.newQuestionInputCard.querySelector('#new-question-title').value
    const correctAnswerInputs = this.newQuestionInputCard.querySelectorAll("input[type='checkbox']:checked")
    const answerOptionInputs = this.newQuestionInputCard.querySelectorAll(".answer-input-new")

    if(!title || title === ''){
      showAlert("Enter the title")
      return
    }

    const correctAnswers = []
    const answerOptions = []

    answerOptionInputs.forEach((input) => {
      answerOptions.push(input.value)
    })

    if(answerOptionInputs.length === 0){
      showAlert("type answer options")
      return
    }

    correctAnswerInputs.forEach((input) => {
      correctAnswers.push(input.value)
    })

    if(correctAnswerInputs.length === 0){
      alert("mark correct answer")
      return
    }


    document.getElementById('spinner-container').classList.remove('hidden')
    fetch(simulatorData.root_url + '/wp-json/custom/v1/create-question', {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        title, correctAnswers, answerOptions
      })
    })
    .then((res) => {
      location.reload()
    })
    .catch((err) => {
      console.log(err)
    })
  
    
  }

  saveEdit(){
    const questionDataList = []
    let isError = false

    this.editQuestionList.forEach((cardDiv, id) => {
      
      const title = cardDiv.querySelector(`.question-title`)
      const correctAnswer = cardDiv.querySelectorAll('input[type="checkbox"]')
      const options = cardDiv.querySelectorAll('.question-answers')

      if(!title || title.value === '' || !correctAnswer || correctAnswer.length === 0
        || !options || options.length === 0
      ){
        isError = true
        return
      }

      const questionData = {
        'qId': id,
        'qTitle' : title.value,
        'correctAnswer': [],
        'options': []
      }

      correctAnswer.forEach((input) => {
        if(input.checked){
          questionData.correctAnswer.push(input.value)
        }
      })

      options.forEach((input) => {
        questionData.options.push(input.value)
      })

      questionDataList.push(questionData)
    });

    if(isError){
        showAlert("Please fill out all of questions' title, correct answer, options")
        return
    }

    document.getElementById('spinner-container').classList.remove('hidden')

    fetch(simulatorData.root_url + '/wp-json/custom/v1/edit-question', {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        data : questionDataList
      })
    })
    .then((res) => {
      location.reload()
    })
    .catch((err) => {
      showAlert(err)
    })
  }

  deleteHandler(){
    if(!this.selectedQuestionToDelete || this.selectedQuestionToDelete.size === 0){
      showAlert("Select questions to delete")
      return
    }
    document.getElementById('spinner-container').classList.remove('hidden')
    fetch(simulatorData.root_url + '/wp-json/custom/v1/delete-question', {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        ids : Array.from(this.selectedQuestionToDelete.keys())
      })
    })
    .then((res) => {
      location.reload()
    })
    .catch((err) => {
      console.log(err)
    })
  }   


  createNewTextInput(qid, index){
    const input = document.createElement('input')
    input.type = 'text'
    input.value = ''
    // mark the new input using a class name to track after creating it
    input.className = `answer-input-${qid} question-answers temp_created-input`
    input.id = `answer-input-${qid}-${index}`

    return input
  }

  createNewCheckInput(qid, index){

    const label = document.createElement('label')
    // mark the new input using a class name to track after creating it
    label.className = 'select-correct-answer_label temp_created-input'
    label.htmlFor = `select-correct-answer-${qid}-${index}`

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.value = index
    input.id = `select-correct-answer-${qid}-${index}`
    input.hidden = true

    const span = document.createElement('span')
    span.innerText = index

    label.append(input, span)

    return label
  }

}

export default QuestionArchive