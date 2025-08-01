<?php
if(have_posts()){
   the_post();
}

$examStatus = get_field('status', get_the_ID());

$score = NULL;
$stuResult = NULL;
if($examStatus === 'completed'){
  $score = get_field('score', get_the_ID());
  $stuResult = get_field('student_response');
  if(is_string($stuResult)){
    $stuResult = json_decode($stuResult, 1);
  }
}


$examPost = get_field('exam_id', get_the_ID())[0];
$examId = $examPost->ID;

$duration = get_field('duration', $examId);
if(!isset($duration)){
   $duration = 'unlimited';
}
else{
  if(is_string($duration)){
    $duration = json_decode($duration);
  }
}
$examTitle = $examPost->post_title;
$examQuestions = get_field('related_questions', $examId);

get_template_part('layout/header');

?>

<section style="position:relative" class="assigned-exam-post" 
  data-exam-id="<?php echo the_ID();?>" data-exam-status="<?php echo $examStatus;?>">
  <div class="container">
    <div class="flex-between exam-heading">
      <h2><?php echo $examTitle;?></h2>
      <h5 id="score-view">Score: <?php if($examStatus === 'completed') echo $score?></h5>
      <div class="exam-details flex-between">
        <p class="exam-duration">Duration : 
          <span class="exam-time">
          <?php 
            if($duration !== 'unlimited'){
                echo $duration['hour'] . 'h '; echo $duration['minute'] . "m"; 
            }else{
                echo $duration;
            }
          ?>
          </span>
        </p>
        <p class="question-count">
          Answered: 
            <span class="answered-question-count">
              <?php echo $examStatus === "completed" ? count($examQuestions) : "0"; ?>

            </span> 
          / Total: <?php echo count($examQuestions)?>
        </p>
      </div>
    </div>
    <div class="exam-quizs">
      <div id="time-bar">
        <div id="progress-bar">
          <span class="exam-time">
            <?php 
              if($duration !== 'unlimited'){
                  echo $duration['hour'] . 'h ' . $duration['minute'] . 'm'; 
              }else{
                  echo $duration;
              }
            ?>
          </span>
        </div>
      </div>
      <?php 
        $examQuestionsCount = 0;
        foreach($examQuestions as $question):
          $qid = $question->ID;

          if($examStatus === 'completed'){

            $quizMark = $stuResult[$qid][0];
            $studentResponse = $stuResult[$qid][1];
            // if(is_string($studentResponse)){
            //   $studentResponse = json_decode($studentResponse, 1);
            // }
          }
          
          
          
          $answers = get_field('answers', $qid);
          $correctAnswers = get_field('correct_answer', $qid);
          $examQuestionsCount++;
      ?>
      <div class="quiz-card card">
        <div class="card-top quiz-card_top flex-between <?php echo isset($quizMark) ? $quizMark : ''; ?>">
          <h5 class="quiz-card_top-title">
            <?php 
              echo $examQuestionsCount . '. ' . $question->post_title;
            ?>
          </h5>
        </div>
        <div class="card-details quiz-options" data-qid="<?php echo $qid; ?>">
          <?php 
            $index = 0;
            foreach($answers as $answer):
              $index++;
          ?>
            <?php if(count($correctAnswers) > 1):?>
              <label>
                <input 
                  class="hidden"
                  type="checkbox" 
                  name="question-<?php echo $qid?>" 
                  value="<?php echo $index?>"
                  <?php 
                    
                    if(isset($studentResponse) && in_array($index, $studentResponse)){
                      echo "checked ";
                    }
                    if($examStatus !== 'assigned'){
                      echo "disabled";
                    }
                  ?>
                >
                <span><?php echo $answer?></span>
              </label>
            <?php else:?>
              <label>
                <input 
                  class="hidden"
                  type="radio" 
                  name="question-<?php echo $qid?>" 
                  value="<?php echo $index?>"
                  <?php 
                    if(isset($studentResponse) && in_array($index, $studentResponse)){
                      echo "checked ";
                    }
                    if($examStatus !== 'assigned'){
                      echo "disabled";
                    }
                  ?>
                >
                <span><?php echo $answer?></span>
              </label>
            <?php endif;?>
          <?php endforeach;?>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
    
    <div class="submit-wrapper">
      <?php if($examStatus !== 'completed'):?>
      <p class="question-count">Answered: <span class="answered-question-count">0</span> / Total: <?php echo count($examQuestions)?></p>
      <button class="primary-btn disabled" id="exam-submit">Submit</button>            
      <?php else: ?>
      <a href="./student" class="primary-btn">To Dashboard</a>
      <?php endif; ?>
    </div>



  </div>
</section>

<?php 
 get_template_part('layout/footer');
?>