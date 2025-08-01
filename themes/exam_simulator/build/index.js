/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/AssignedExam.js":
/*!*************************************!*\
  !*** ./src/modules/AssignedExam.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class AssignedExam {
  // progress animation, other exam showing animation

  // quiz archive -> create question?

  constructor() {
    if (!document.querySelector('.assigned-exam-post')) return;
    this.examId = document.querySelector('.assigned-exam-post').dataset.examId;
    this.quizOptionsDivEl = document.querySelectorAll('.quiz-options');
    this.answeredQuestionSpanEl = document.querySelectorAll('.answered-question-count');
    this.scoreViewEl = document.getElementById('score-view');
    this.timeSpanEl = document.querySelectorAll('.exam-time');
    this.progressBar = document.getElementById('progress-bar');
    this.totalTime = 0;
    this.hours = 0;
    this.minutes = 0;
    this.totalQuestionsCount = this.quizOptionsDivEl.length;
    this.responseMap = new Map();
    this.answeredQuestionCount = 0;
    this.submitBtn = document.getElementById('exam-submit');
    if (document.querySelector('.assigned-exam-post').dataset.examStatus !== 'assigned') {
      return;
    }
    this.events();
  }
  events() {
    this.submitBtn.addEventListener('click', () => {
      if (this.submitBtn.classList.contains('disabled')) {
        return;
      }
      this.examSubmitHandler();
    });
    this.quizOptionsDivEl.forEach(divEl => {
      this.optionClickHandler(divEl);
    });

    //timer setting
    document.addEventListener('DOMContentLoaded', () => {
      const timeText = this.timeSpanEl[0].innerText;
      if (timeText === 'unlimited') return;
      const {
        hours,
        minutes
      } = this.parseTimeString(timeText);
      this.hours = hours;
      this.minutes = minutes;
      this.totalTime = hours * 60 + minutes;
      this.timer = setInterval(() => this.updateTimer(), 100);
    });
  }
  examSubmitHandler() {
    this.submitBtn.classList.add('disabled');
    clearInterval(this.timer);
    fetch(simulatorData.root_url + '/wp-json/custom/v1/submit-exam', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "WP-X-Nonce": simulatorData.api_nonce
      },
      body: JSON.stringify({
        qids: Array.from(this.responseMap.keys()),
        answers: Array.from(this.responseMap.values()),
        assignedId: this.examId
      })
    }).then(res => res.json()).then(data => {
      this.resultHandler(data.result, data.score);
    }).catch(err => {
      console.log(err);
    });
  }
  optionClickHandler(divEl) {
    const qid = divEl.dataset.qid;
    divEl.addEventListener('click', () => {
      const checkedInput = divEl.querySelectorAll(`input[name="question-${qid}"]:checked`);
      if (checkedInput.length > 0) {
        if (!this.responseMap.has(qid)) {
          this.answeredQuestionCount++;
        }
        const inputValues = [];
        checkedInput.forEach(inputEl => {
          inputValues.push(inputEl.value);
        });
        this.responseMap.set(qid, inputValues);
      } else if (checkedInput.length === 0 && this.responseMap.has(qid)) {
        this.responseMap.delete(qid);
        this.answeredQuestionCount--;
      }
      if (this.totalQuestionsCount === this.answeredQuestionCount) {
        this.submitBtn.classList.remove('disabled');
      } else if (!this.submitBtn.classList.contains('disabled')) {
        this.submitBtn.classList.add('disabled');
      }
      this.answeredQuestionSpanEl.forEach(el => {
        el.innerText = this.answeredQuestionCount;
      });
    });
  }
  resultHandler(result, score) {
    // object type
    this.quizOptionsDivEl.forEach(divEl => {
      const divQid = divEl.dataset.qid;
      const cardElement = divEl.previousElementSibling;
      let mark = result[divQid][0];
      if (!result[divQid]) mark = 'incorrect';
      cardElement.classList.add(mark);
    });
    this.scoreViewEl.innerText = `Score: ${score}`;
  }
  updateTimer() {
    this.minutes--;
    if (this.minutes === 0) {
      if (this.hours > 0) {
        this.hours--;
        this.minutes = 59;
      } else {
        this.examSubmitHandler();
      }
    }
    const formattedMinutes = String(this.minutes).padStart(2, '0');
    this.timeSpanEl.forEach(spanEl => {
      spanEl.innerText = String(this.hours) + 'h ' + formattedMinutes + 'm';
    });
    const widthPercentage = (this.hours * 60 + this.minutes) / this.totalTime * 100;
    this.progressBar.style.width = widthPercentage + '%';
  }
  parseTimeString(timeStr) {
    const h = timeStr.match(/(\d+)\s*h/);
    const m = timeStr.match(/(\d+)\s*m/);
    return {
      hours: h ? parseInt(h[1], 10) : 0,
      minutes: m ? parseInt(m[1], 10) : 0
    };
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AssignedExam);

// constructor(){
//         this.examContainer = document.querySelector('.assigned-exam-container')
//         if(this.examContainer){
//             this.examStatus = this.examContainer.dataset.status
//             this.examDuration = this.examContainer.dataset.duration.split(':')
//         }

//         if(this.examStatus === 'assigned'){
//             this.allQuizBlocks = document.querySelectorAll('.quiz-answers')
//             this.displayElement = document.getElementById('answered-count')
//             this.answeredQuestions = new Set()
//             this.answerCount = 0
//             this.displayElement.textContent = `0 / ${this.allQuizBlocks.length}`

//             if(this.examDuration){
//                 this.hours = parseInt(this.examDuration[0])
//                 this.minutes = parseInt(this.examDuration[1])
//             }
//             this.timer = null
//             this.timeDisplay = document.getElementById('timer')

//             this.examSubmitBtn = document.getElementById('exam-submit')
//             this.initTimer()
//             this.events()
//         }
//     }

//     events(){

//         this.allQuizBlocks.forEach(block => {
//             const inputs = block.querySelectorAll('input[type="checkbox"], input[type="radio"]')
//             if(inputs.length === 0) return

//             const nameAttr = inputs[0].getAttribute('name')
//             const questionId = nameAttr.replace(/\[\]$/, '')

//             inputs.forEach(input => {
//                 input.addEventListener('change', () => this.updateAnswerStatus(block, questionId))
//             })
//         })

//     }

//     updateAnswerStatus(block, questionId){

//         const checkedInputs = block.querySelectorAll('input:checked')
//         const isAnswers = checkedInputs.length > 0

//         if(isAnswers > 0 && !this.answeredQuestions.has(questionId)){
//             this.answeredQuestions.add(questionId)
//             this.answerCount++
//         }
//         else if(!isAnswers && this.answeredQuestions.has(questionId)){
//             this.answeredQuestions.delete(questionId)
//             this.answerCount--
//         }

//         this.displayElement.textContent = `${this.answerCount} / ${this.allQuizBlocks.length}`

//     }

//     initTimer(){

//         if(this.hours === 0 && this.minutes === 0){
//             this.timeDisplay.textContent = 'Click submit button when you finish the exam'
//         }else{
//             this.timeDisplay.textContent = this.hours + 'h ' + this.minutes + ' min left'
//             this.timer = setInterval(this.updateTimer.bind(this), 100);
//         }
//     }

//     updateTimer(){

//         this.minutes--

//         if(this.hours === 0 && this.minutes === 0){
//             this.examSubmitBtn.click()
//             clearInterval(this.timer)
//         }else if(this.minutes === 0){
//             this.minutes = 59
//             this.hours--
//         }

//         const formattedMinutes = String(this.minutes).padStart(2, '0')
//         const formattedHours = String(this.hours).padStart(2,'0')

//         this.timeDisplay.textContent = `${formattedHours} h ${formattedMinutes}min left`
//     }

/***/ }),

/***/ "./src/modules/Dashboard.js":
/*!**********************************!*\
  !*** ./src/modules/Dashboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// get due value, improve response

class Dashboard {
  constructor() {
    if (!document.querySelector('.dashboard-inst')) {
      return;
    }
    this.instId = document.querySelector('.dashboard-inst').dataset.userid;
    this.studentButtons = document.querySelectorAll('.select-student-btn');
    this.examButtons = document.querySelectorAll('.select-exam-btn');
    this.studentIds = new Map();
    this.examIds = new Map();

    // student details
    this.openMoreExamsBtns = document.querySelectorAll('.card-top_student-more-exams_btn');

    // manage exam elements
    this.openOverlayBtn = document.getElementById("manage-exam-btn");
    this.closeOverlayBtn = document.getElementById("close-overlay-btn");
    this.overlayEl = document.querySelector('.manage-exam-overlay');
    this.createExamBtn = document.getElementById('create-new-exam_btn');
    this.closeCreateExamWindow = document.getElementById('close-exam-window_btn');
    this.saveNewExam = document.getElementById('save-new-exam_btn');
    this.createExamWindow = document.querySelector('.create-exam-window');
    this.assignBtn = document.getElementById('assign-exam_btn');
    this.unassignBtn = document.getElementById('unassign-exam_btn');
    this.editDueBtn = document.getElementById('edit-due_btn');
    this.dueDateInput = document.getElementById('due-date');
    this.isNoDueDate = document.getElementById('no-due-date');

    //active exam button
    this.activeExamBtn = document.getElementById('active-exam-btn');
    this.deleteExamBtn = document.getElementById('delete-exam-btn');
    this.selectArchiveExamEl = document.getElementById('archive-exams');
    this.toArchiveBtn = document.getElementById('to-archive-btn');
    this.events();
  }
  events() {
    // other exam btn
    this.openMoreExamsBtns.forEach(btn => {
      const studentId = btn.dataset.studentId;
      btn.addEventListener('click', this.openMoreExamContents.bind(this, studentId));
    });

    // select btns
    this.studentButtons.forEach(btn => btn.addEventListener('click', this.selectStudentHandler.bind(this)));
    this.examButtons.forEach(btn => btn.addEventListener('click', this.selectExamHandler.bind(this)));

    // manage exam overlay open & close btn
    this.openOverlayBtn.addEventListener('click', () => this.openOverlayHandler());
    this.closeOverlayBtn.addEventListener('click', () => {
      this.overlayEl.classList.add('hidden');
    });

    // manage exam btns
    this.assignBtn.addEventListener('click', this.createAssignPost.bind(this));
    this.unassignBtn.addEventListener('click', this.deleteAssignPost.bind(this));
    this.editDueBtn.addEventListener('click', this.editDueDate.bind(this));

    // due date events
    this.dueDateInput.addEventListener('input', () => {
      this.isNoDueDate.checked = false;
    });
    this.isNoDueDate.addEventListener('input', () => {
      this.dueDateInput.value = '';
    });

    // create window
    this.createExamBtn.addEventListener('click', () => {
      this.createExamWindow.classList.remove('hidden');
    });
    this.closeCreateExamWindow.addEventListener('click', () => {
      this.createExamWindow.classList.add('hidden');
    });
    this.saveNewExam.addEventListener('click', () => {
      this.createNewExam();
    });

    // active exam events
    this.activeExamBtn.addEventListener('click', () => this.activeExam());
    this.toArchiveBtn.addEventListener('click', () => this.examToArchive());
    this.deleteExamBtn.addEventListener('click', () => this.deleteArchivedExam());
  }
  openMoreExamContents(studentId) {
    const otherExamContainerEl = document.getElementById(`other-exams_container-${studentId}`);
    if (!otherExamContainerEl) return;
    const otherExamContentEl = otherExamContainerEl.querySelector('.other-exams-content');
    if (otherExamContentEl.classList.contains('hidden')) {
      otherExamContentEl.classList.remove('hidden');
    } else {
      otherExamContentEl.classList.add('hidden');
    }
  }
  selectStudentHandler(event) {
    const btn = event.currentTarget;
    const studentId = btn.dataset.studentId;
    const studentName = btn.dataset.studentName;
    if (btn.classList.contains("selected")) {
      this.studentIds.delete(studentId);
      btn.classList.remove("selected");
    } else {
      this.studentIds.set(studentId, studentName);
      btn.classList.add("selected");
    }
  }
  selectExamHandler(event) {
    const btn = event.currentTarget;
    const examId = btn.dataset.examId;
    const examTitle = btn.dataset.examTitle;
    if (btn.classList.contains("selected")) {
      this.examIds.delete(examId);
      btn.classList.remove("selected");
    } else {
      this.examIds.set(examId, examTitle);
      btn.classList.add("selected");
    }
  }
  openOverlayHandler() {
    const overlaySelectedExamsEl = document.querySelector(".manage-exam-overlay_selected-exams");
    const overlaySelectedStudentsEl = document.querySelector(".manage-exam-overlay_selected-students");
    overlaySelectedExamsEl.innerHTML = this.examIds.size === 0 ? 'Please Select Exams' : '';
    overlaySelectedStudentsEl.innerHTML = this.studentIds.size === 0 ? 'Please Select Students' : '';
    this.overlayEl.classList.remove('hidden');
    this.studentIds.forEach(name => {
      const span = document.createElement('span');
      span.classList.add('selected-items');
      span.textContent = name;
      overlaySelectedStudentsEl.appendChild(span);
    });
    this.examIds.forEach(title => {
      const span = document.createElement('span');
      span.classList.add('selected-items');
      span.textContent = title;
      overlaySelectedExamsEl.appendChild(span);
    });
  }
  createAssignPost() {
    if (this.studentIds.size === 0 || this.examIds.size === 0) {
      console.log("Please select student or exam");
      return;
    }
    let completeByDate = this.dueDateInput.value;
    const isNoDue = this.isNoDueDate.checked;
    if (isNoDue) {
      completeByDate = '9999-12-31';
    }

    //create assigned_exam post 
    fetch(simulatorData.root_url + '/wp-json/custom/v1/create-assign-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examIds: Array.from(this.examIds.keys()),
        stuIds: Array.from(this.studentIds.keys()),
        instId: this.instId,
        completeByDate,
        completeByTime: ""
      })
    }).then(res => {
      // add spinner and alert, improve ux
      location.reload();
    }).catch(error => {
      console.log('error', error);
    });
  }
  deleteAssignPost() {
    if (this.studentIds.size === 0 || this.examIds.size === 0) {
      console.log("Please select student or exam");
      return;
    }
    fetch(simulatorData.root_url + '/wp-json/custom/v1/delete-assign-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examIds: Array.from(this.examIds.keys()),
        studentIds: Array.from(this.studentIds.keys())
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  editDueDate() {
    if (this.studentIds.size === 0 || this.examIds.size === 0) {
      console.log("Please select student or exam");
      return;
    }
    let completeByDate = this.dueDateInput.value;
    const isNoDue = this.isNoDueDate.checked;
    if (isNoDue) {
      completeByDate = '9999-12-31';
    }
    fetch(simulatorData.root_url + '/wp-json/custom/v1/edit-due-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examIds: Array.from(this.examIds.keys()),
        studentIds: Array.from(this.studentIds.keys()),
        completeByDate
      })
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
  createNewExam() {
    const examTitle = document.getElementById('exam-title').value;
    fetch(simulatorData.root_url + '/wp-json/wp/v2/exam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        title: examTitle,
        status: 'publish'
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  examToArchive() {
    fetch(simulatorData.root_url + '/wp-json/custom/v1/exam-to-archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examIds: Array.from(this.examIds.keys())
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  activeExam() {
    const deactiveExamId = this.selectArchiveExamEl.value;
    fetch(simulatorData.root_url + '/wp-json/custom/v1/active-exam-from-archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: deactiveExamId
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  deleteArchivedExam() {
    const deactiveExamId = this.selectArchiveExamEl.value;
    fetch(simulatorData.root_url + '/wp-json/custom/v1/delete-exam-from-archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: deactiveExamId
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dashboard);

/***/ }),

/***/ "./src/modules/ExamPost.js":
/*!*********************************!*\
  !*** ./src/modules/ExamPost.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ExamPost {
  constructor() {
    if (!document.querySelector('.exam-post')) return;
    this.examId = document.querySelector('.exam-post').dataset.examId;
    this.editOpenBtn = document.getElementById('exam-edit-btn');
    this.saveEditBtn = document.getElementById('exam-edit-save-btn');
    this.editExamWindowEl = document.getElementById('edit-exam-window');
    this.selectedQuizId = [];
    this.selectBtn = document.querySelectorAll('.select-student-btn');
    this.addQuestionBtn = document.getElementById('add-question');
    this.removeQuestionBtn = document.getElementById('remove-question');
    this.removeTheQuestionBtn = document.querySelectorAll('.remove-the-question');
    this.events();
  }
  events() {
    this.selectBtn.forEach(btn => {
      btn.addEventListener('click', () => this.selectButtonHandler(btn));
    });
    this.addQuestionBtn.addEventListener('click', () => this.addQuestionToExam());
    this.removeQuestionBtn.addEventListener('click', () => this.removeQuestionFromExam());
    this.removeTheQuestionBtn.forEach(btn => {
      btn.addEventListener('click', () => this.removeTheQuestion(btn));
    });
    this.editOpenBtn.addEventListener('click', () => {
      this.editExamWindowEl.classList.toggle('hidden');
    });
    this.saveEditBtn.addEventListener('click', () => {
      this.editExamSaveHandler();
    });
  }
  selectButtonHandler(btn) {
    const quizId = btn.dataset.quizId;
    if (btn.classList.contains('selected')) {
      this.selectedQuizId = this.selectedQuizId.filter(id => id !== quizId);
      btn.classList.remove('selected');
    } else {
      this.selectedQuizId.push(quizId);
      btn.classList.add('selected');
    }
  }

  // add question
  addQuestionToExam() {
    fetch(simulatorData.root_url + '/wp-json/custom/v1/add-question', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        questionIds: this.selectedQuizId
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }

  // remove question
  removeQuestionFromExam() {
    fetch(simulatorData.root_url + '/wp-json/custom/v1/remove-question', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        questionIds: this.selectedQuizId
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  removeTheQuestion(btn) {
    const qid = btn.dataset.qid;
    console.log(qid);
    fetch(simulatorData.root_url + '/wp-json/custom/v1/remove-question', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        questionIds: [qid]
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  editExamSaveHandler() {
    const title = document.getElementById('exam-edit-title').value;
    const hours = document.getElementById('duration-hour').value;
    const mins = document.getElementById('duration-mins').value;
    fetch(simulatorData.root_url + '/wp-json/custom/v1/edit-exam-info', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        examId: this.examId,
        title,
        hours,
        mins
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExamPost);

/***/ }),

/***/ "./src/modules/QuestionArchive.js":
/*!****************************************!*\
  !*** ./src/modules/QuestionArchive.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class QuestionArchive {
  constructor() {
    // edit mode
    this.editModeBtn = document.getElementById('onedit-question-btn');
    this.saveEditBtn = document.getElementById('save-edit-btn');
    this.inputEls = document.querySelectorAll('input');
    this.selectAnswerDiv = document.querySelectorAll('.select-answers');

    // delete mode
    this.deleteModeBtn = document.getElementById('delete-question');
    this.selectQuestionBtns = document.querySelectorAll('.select-question-btn');

    // create question
    this.createQuestionBtn = document.getElementById('create-question');
    this.newQuestionInputCard = document.getElementById('new-question_input_card');
    this.isActiveNewQuestionCard = false;

    // question answer options manage elements
    this.addAnotherAnswerSpan = document.querySelectorAll('.add-answer');
    this.deleteAnswerSpan = document.querySelectorAll('.delete-answer');

    // stores
    this.editQuestionList = new Map();
    this.selectedQuestionToDelete = new Set();
    this.events();
  }
  events() {
    this.editModeBtn.addEventListener('click', () => this.editMode());
    this.saveEditBtn.addEventListener('click', () => this.saveEditHandler());
    this.addAnotherAnswerSpan.forEach(span => {
      span.addEventListener('click', this.addAnotherAnswer.bind(this, span));
    });
    this.deleteAnswerSpan.forEach(span => {
      span.addEventListener('click', this.deleteAnswer.bind(this, span));
    });
    document.querySelectorAll('.card').forEach(el => {
      el.addEventListener('click', () => {
        this.editQuestionList.set(el.dataset.quizId, el);
      });
    });
    this.selectQuestionBtns.forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('selected');
        const qId = el.closest('.card').dataset.quizId;
        if (this.selectedQuestionToDelete.has(qId)) {
          this.selectedQuestionToDelete.delete(qId);
        } else {
          this.selectedQuestionToDelete.add(qId);
        }
      });
    });
    this.deleteModeBtn.addEventListener('click', () => {
      this.selectQuestionBtns.forEach(el => {
        el.style.opacity = el.style.opacity === '1' ? 0 : 1;
        el.disabled = !el.disabled;
        if (el.classList.contains('selected')) {
          el.classList.remove('selected');
        }
      });
      if (this.deleteModeBtn.innerText === 'DELETE MODE') {
        this.saveEditBtn.innerText = 'confirm delete';
        this.deleteModeBtn.innerText = 'cancel';
      } else {
        this.deleteModeBtn.innerText = 'delete mode';
        this.saveEditBtn.innerText = 'save';
      }
      this.saveEditBtn.disabled = !this.saveEditBtn.disabled;
      this.saveEditBtn.classList.toggle('primary-btn');
      this.saveEditBtn.classList.toggle('danger-btn');
      if (this.selectedQuestionToDelete.size > 0) {
        this.selectedQuestionToDelete.clear();
      }
    });

    // create question btn event

    this.createQuestionBtn.addEventListener('click', () => {
      if (this.createQuestionBtn.innerText === 'CREATE QUESTION') {
        this.createQuestionBtn.innerText = 'cancel';
        this.newQuestionInputCard.style.height = '200px';
        this.newQuestionInputCard.style.opacity = '1';
        this.newQuestionInputCard.style.transform = 'translateX(0)';
        this.isActiveNewQuestionCard = true;
      } //cancel event
      else {
        this.createQuestionBtn.innerText = 'create question';
        this.newQuestionInputCard.style.height = '0px';
        this.newQuestionInputCard.style.opacity = '0';
        this.newQuestionInputCard.style.transform = 'translateX(-100%)';
        this.isActiveNewQuestionCard = false;
      }
      this.saveEditBtn.disabled = !this.saveEditBtn.disabled;
    });
  }
  editMode() {
    if (this.editModeBtn.innerText === 'EDIT MODE') {
      this.editModeBtn.innerText = 'Cancel';
      this.saveEditBtn.disabled = false;
    } else {
      //click cancel event
      this.editModeBtn.innerText = 'Edit Mode';
      this.saveEditBtn.disabled = true;
      document.querySelectorAll('.temp_created-input').forEach(el => el.remove());
      this.editQuestionList.clear();
    }
    this.editModeBtn.classList.toggle('danger-btn');
    this.editModeBtn.classList.toggle('primary-btn');
    this.selectAnswerDiv.forEach(el => {
      el.classList.toggle('edit-mode');
    });
    document.querySelectorAll('.span-wrapper').forEach(el => {
      el.classList.toggle('edit-on');
    });
    this.inputEls.forEach(el => {
      if (el.type === 'checkbox') {
        el.disabled = !el.disabled;
      } else {
        el.readOnly = !el.readOnly;
      }
    });
  }
  saveEditHandler() {
    if (this.selectedQuestionToDelete.size > 0) {
      this.deleteHandler();
    } else if (this.isActiveNewQuestionCard) {
      this.createNewQuestion();
    } else {
      this.saveEdit();
    }
  }
  addAnotherAnswer(span) {
    const cardDiv = span.closest('.card');
    const cardTopSelectAnswerDiv = cardDiv.querySelector('.select-answers');
    const cardBottomEl = span.closest('.card-bottom');
    const answerTextInput = cardBottomEl.querySelectorAll('input');
    let quizId = cardDiv.dataset.quizId;
    if (this.isActiveNewQuestionCard) {
      quizId = "new";
    }
    const newTextInput = this.createNewTextInput(quizId, answerTextInput.length + 1);
    const newCheckboxInput = this.createNewCheckInput(quizId, answerTextInput.length + 1);
    if (answerTextInput.length === 0) {
      cardBottomEl.prepend(newTextInput);
    } else {
      answerTextInput[answerTextInput.length - 1].nextElementSibling.before(newTextInput);
    }
    cardTopSelectAnswerDiv.append(newCheckboxInput);
  }
  deleteAnswer(span) {
    const cardDiv = span.closest('.card');
    const selectCorrectAnswerLabel = cardDiv.querySelectorAll('.select-correct-answer_label');
    const cardBottomEl = span.closest('.card-bottom');
    const inputsInTheQuestion = cardBottomEl.querySelectorAll('input');
    if (inputsInTheQuestion.length === 1) {
      return;
    }
    if (inputsInTheQuestion.length > 0) {
      inputsInTheQuestion[inputsInTheQuestion.length - 1].remove();
      selectCorrectAnswerLabel[selectCorrectAnswerLabel.length - 1].remove();
    }
  }
  createNewQuestion() {
    const title = this.newQuestionInputCard.querySelector('#new-question-title').value;
    const correctAnswerInputs = this.newQuestionInputCard.querySelectorAll("input[type='checkbox']:checked");
    const answerOptionInputs = this.newQuestionInputCard.querySelectorAll(".answer-input-new");
    const correctAnswers = [];
    const answerOptions = [];
    correctAnswerInputs.forEach(input => {
      correctAnswers.push(input.value);
    });
    answerOptionInputs.forEach(input => {
      answerOptions.push(input.value);
    });
    fetch(simulatorData.root_url + '/wp-json/custom/v1/create-question', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        title,
        correctAnswers,
        answerOptions
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  saveEdit() {
    const questionDataList = [];
    this.editQuestionList.forEach((cardDiv, id) => {
      const title = cardDiv.querySelector(`.question-title`);
      const correctAnswer = cardDiv.querySelectorAll('input[type="checkbox"]');
      const options = cardDiv.querySelectorAll('.question-answers');
      const questionData = {
        'qId': id,
        'qTitle': title.value,
        'correctAnswer': [],
        'options': []
      };
      correctAnswer.forEach(input => {
        if (input.checked) {
          questionData.correctAnswer.push(input.value);
        }
      });
      options.forEach(input => {
        questionData.options.push(input.value);
      });
      questionDataList.push(questionData);
    });
    fetch(simulatorData.root_url + '/wp-json/custom/v1/edit-question', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        data: questionDataList
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  deleteHandler() {
    fetch(simulatorData.root_url + '/wp-json/custom/v1/delete-question', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'WP-X-Nonce': simulatorData.api_nonce
      },
      body: JSON.stringify({
        ids: Array.from(this.selectedQuestionToDelete.keys())
      })
    }).then(res => {
      location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  createNewTextInput(qid, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    // mark the new input using a class name to track after creating it
    input.className = `answer-input-${qid} question-answers temp_created-input`;
    input.id = `answer-input-${qid}-${index}`;
    return input;
  }
  createNewCheckInput(qid, index) {
    const label = document.createElement('label');
    // mark the new input using a class name to track after creating it
    label.className = 'select-correct-answer_label temp_created-input';
    label.htmlFor = `select-correct-answer-${qid}-${index}`;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = index;
    input.id = `select-correct-answer-${qid}-${index}`;
    input.hidden = true;
    const span = document.createElement('span');
    span.innerText = index;
    label.append(input, span);
    return label;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QuestionArchive);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_AssignedExam__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/AssignedExam */ "./src/modules/AssignedExam.js");
/* harmony import */ var _modules_Dashboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Dashboard */ "./src/modules/Dashboard.js");
/* harmony import */ var _modules_ExamPost__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/ExamPost */ "./src/modules/ExamPost.js");
/* harmony import */ var _modules_QuestionArchive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/QuestionArchive */ "./src/modules/QuestionArchive.js");




const assignedExam = new _modules_AssignedExam__WEBPACK_IMPORTED_MODULE_0__["default"]();
const dashboard = new _modules_Dashboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
const examPost = new _modules_ExamPost__WEBPACK_IMPORTED_MODULE_2__["default"]();
const questionArchive = new _modules_QuestionArchive__WEBPACK_IMPORTED_MODULE_3__["default"]();
})();

/******/ })()
;
//# sourceMappingURL=index.js.map