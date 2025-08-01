class AssignedExam{

    // progress animation, other exam showing animation

    // quiz archive -> create question?

    constructor(){

        if(!document.querySelector('.assigned-exam-post')) return
        this.examId = document.querySelector('.assigned-exam-post').dataset.examId
        this.quizOptionsDivEl = document.querySelectorAll('.quiz-options')
        this.answeredQuestionSpanEl = document.querySelectorAll('.answered-question-count')
        this.scoreViewEl = document.getElementById('score-view')

        this.timeSpanEl = document.querySelectorAll('.exam-time')
        this.progressBar = document.getElementById('progress-bar')
        this.totalTime = 0
        this.hours = 0
        this.minutes = 0

        this.totalQuestionsCount = this.quizOptionsDivEl.length
        this.responseMap = new Map()
        this.answeredQuestionCount = 0

        this.submitBtn = document.getElementById('exam-submit')

        if(document.querySelector('.assigned-exam-post').dataset.examStatus !== 'assigned'){
            return
        }
        this.events()
    }

    events(){
        this.submitBtn.addEventListener('click', () => {
            if(this.submitBtn.classList.contains('disabled')){
                return
            }
            this.examSubmitHandler()
        })

        this.quizOptionsDivEl.forEach((divEl) => {
            this.optionClickHandler(divEl)
        })

        //timer setting
        document.addEventListener('DOMContentLoaded', () => {

            const timeText = this.timeSpanEl[0].innerText
            if(timeText === 'unlimited') return 
            const {hours, minutes} = this.parseTimeString(timeText)

            this.hours = hours
            this.minutes = minutes
            this.totalTime = (hours * 60) + minutes

            this.timer = setInterval(() => this.updateTimer(), 100)
        })
    }

    examSubmitHandler(){

        this.submitBtn.classList.add('disabled')
        clearInterval(this.timer)

        fetch(simulatorData.root_url + '/wp-json/custom/v1/submit-exam',{
            method: "POST",
            headers: {
                "Content-type" : "application/json",
                "WP-X-Nonce" : simulatorData.api_nonce
            },
            body: JSON.stringify({
                qids: Array.from(this.responseMap.keys()),
                answers: Array.from(this.responseMap.values()),
                assignedId: this.examId
            })
        })
        .then(res => res.json())
        .then(data => {
            this.resultHandler(data.result, data.score)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    optionClickHandler(divEl){
        
        const qid = divEl.dataset.qid

        divEl.addEventListener('click', () => {

            const checkedInput = divEl.querySelectorAll(`input[name="question-${qid}"]:checked`)

            if(checkedInput.length > 0){
                if(!this.responseMap.has(qid)){
                    this.answeredQuestionCount++
                }
                const inputValues = []
                checkedInput.forEach((inputEl) => {
                    inputValues.push(inputEl.value)
                } )
                this.responseMap.set(qid, inputValues)
            }
            else if(checkedInput.length === 0 && this.responseMap.has(qid)){
                this.responseMap.delete(qid)
                this.answeredQuestionCount--
            }
            if(this.totalQuestionsCount === this.answeredQuestionCount){
                this.submitBtn.classList.remove('disabled')
            }
            else if(!this.submitBtn.classList.contains('disabled')){
                this.submitBtn.classList.add('disabled')
            }

            this.answeredQuestionSpanEl.forEach((el) => {
                el.innerText = this.answeredQuestionCount
            })
        })
    }
 
    resultHandler(result, score){
        
        // object type
        this.quizOptionsDivEl.forEach((divEl) => {

            const divQid = divEl.dataset.qid
            const cardElement = divEl.previousElementSibling

            let mark = result[divQid][0]
            if(!result[divQid]) mark = 'incorrect'

            cardElement.classList.add(mark)
        })

        this.scoreViewEl.innerText = `Score: ${score}`
    }

    updateTimer(){

        this.minutes --

        if(this.minutes === 0){
            if(this.hours > 0){
                this.hours--
                this.minutes = 59
            }
            else{
                this.examSubmitHandler()
            }
        }

        const formattedMinutes = String(this.minutes).padStart(2, '0')

        this.timeSpanEl.forEach((spanEl) => {
            spanEl.innerText = String(this.hours) + 'h ' + formattedMinutes + 'm'
        })

        const widthPercentage = ((this.hours * 60) + this.minutes)/this.totalTime * 100
        this.progressBar.style.width = widthPercentage + '%'

    }

    parseTimeString(timeStr){

        const h = timeStr.match(/(\d+)\s*h/)
        const m = timeStr.match(/(\d+)\s*m/)

        return {
            hours: h ? parseInt(h[1], 10) : 0,
            minutes: m ? parseInt(m[1], 10) : 0
        }
    }
    
}

export default AssignedExam




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