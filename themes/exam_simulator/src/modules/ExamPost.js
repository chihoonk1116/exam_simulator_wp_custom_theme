import { showAlert } from "./Alert"

class ExamPost{
  constructor(){
    if(!document.querySelector('.exam-post')) return
    this.examId = document.querySelector('.exam-post').dataset.examId

    this.editOpenBtn = document.getElementById('exam-edit-btn')
    this.saveEditBtn = document.getElementById('exam-edit-save-btn')
    this.editExamWindowEl = document.getElementById('edit-exam-window')

    this.selectedQuizId = []
    this.selectBtn = document.querySelectorAll('.select-student-btn')

    this.addQuestionBtn = document.getElementById('add-question')
    this.removeQuestionBtn = document.getElementById('remove-question')
    this.removeTheQuestionBtn = document.querySelectorAll('.remove-the-question')

    
    this.events()
  }

  events(){

    this.selectBtn.forEach((btn) => {
      btn.addEventListener('click', () => this.selectButtonHandler(btn))
    })
    
    this.addQuestionBtn.addEventListener('click', () => this.addQuestionToExam())
    this.removeQuestionBtn.addEventListener('click', () => this.removeQuestionFromExam())
    this.removeTheQuestionBtn.forEach((btn) => {
      btn.addEventListener('click', () => this.removeTheQuestion(btn))
    })

    this.editOpenBtn.addEventListener('click', () => {
      this.editExamWindowEl.classList.toggle('hidden')
    })

    this.saveEditBtn.addEventListener('click', () => {
      this.editExamSaveHandler()
    })

  }

  selectButtonHandler(btn){

    const quizId = btn.dataset.quizId

    if(btn.classList.contains('selected')){
      this.selectedQuizId = this.selectedQuizId.filter(id => id !== quizId)
      btn.classList.remove('selected')
    }else{
      this.selectedQuizId.push(quizId)
      btn.classList.add('selected')
    }
  }

  // add question
  addQuestionToExam(){

    if(!this.examId || !this.selectedQuizId || this.examId === '' || this.selectedQuizId.length === 0){
      showAlert('Select questions to add')
      return
    }

    document.getElementById('spinner-container').classList.remove('hidden')
    fetch(simulatorData.root_url + '/wp-json/custom/v1/add-question', {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId : this.examId,
        questionIds : this.selectedQuizId
      })
    })
    .then((res) =>{
      location.reload()
    })
    .catch((err) => {
      showAlert(err)
    })
  }

  // remove question
  removeQuestionFromExam(){
    if(!this.examId || !this.selectedQuizId || this.examId === '' || this.selectedQuizId.length === 0){
      showAlert('Select questions to remove')
      return
    }

    document.getElementById('spinner-container').classList.remove('hidden')
    fetch(simulatorData.root_url + '/wp-json/custom/v1/remove-question', {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        questionIds : this.selectedQuizId
      })
    })
    .then((res) => {
      location.reload()
    })
    .catch((err) => {
      showAlert(err)
    })
  }

  removeTheQuestion(btn){
    const qid = btn.dataset.qid
    
    if(!this.examId || !qid || this.examId === '' || qid === ''){
      showAlert('Select question to delete')
      return
    }

    document.getElementById('spinner-container').classList.remove('hidden')

    fetch(simulatorData.root_url + '/wp-json/custom/v1/remove-question', {
      method: "POST",
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        questionIds : [qid]
      })
    })
    .then((res) => {
      location.reload()
    })
    .catch((err) => {
      showAlert(err)
    })

  }

  editExamSaveHandler(){

    const title = document.getElementById('exam-edit-title').value
    const hours = document.getElementById('duration-hour').value
    const mins = document.getElementById('duration-mins').value

    if(!title || !hours || !mins || title === ''){
      showAlert('Write the exam title')
      return
    }

    document.getElementById('spinner-container').classList.remove('hidden')

    fetch(simulatorData.root_url + '/wp-json/custom/v1/edit-exam-info', {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json',
        'WP-X-Nonce' : simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        title, hours, mins
      })
    })
    .then((res) => {
      location.reload()
    })
    .catch((err) => {
      showAlert(err)
    })
  }

}

export default ExamPost
