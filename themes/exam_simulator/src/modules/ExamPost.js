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
      console.log(err)
    })
  }

  // remove question
  removeQuestionFromExam(){
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
      console.log(err)
    })
  }

  removeTheQuestion(btn){
    const qid = btn.dataset.qid
    console.log(qid)

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
      console.log(err)
    })

  }

  editExamSaveHandler(){

    const title = document.getElementById('exam-edit-title').value
    const hours = document.getElementById('duration-hour').value
    const mins = document.getElementById('duration-mins').value

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
      console.log(err)
    })
    
  
  }

}

export default ExamPost
