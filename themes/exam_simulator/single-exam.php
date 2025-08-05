<?php

$quizIdsInExam = [];
$paged = isset($_GET['question_page']) ? $_GET['question_page'] : 1;

$questions = get_field('related_questions', get_the_ID());
if(!isset($questions)){
   $questions = [];
}

$duration = get_field('duration', get_the_ID()); 
if(!isset($duration)){
   $duration = 'unlimited';
}else{
   if(is_string($duration)){
      $duration = json_decode($duration, 1);
   }
}

$quizPosts = new WP_Query([
   'posts_per_page' => 10,
   'post_type' => 'question',
   'paged' => $paged
]);

if(have_posts()){
   the_post();
}

get_template_part('layout/header');

?>

<section id="single-exam_section" style="position:relative" class="exam-post" data-exam-id="<?php echo the_ID();?>">
   <div class="container container-common-flex">
      <div class="container-left">
         <div class="flex-between exam-heading">
            <h2><?php the_title();?></h2>
            <div class="exam-details">
               <p>Total Questions : <?php echo count($questions);?></p>
               <p>Duration : 
                  <?php 
                  if($duration !== 'unlimited'){
                     echo $duration['hour'] . ' h '; echo $duration['minute'] . ' min'; 
                  }else{
                     echo $duration;
                  }
                  ?>
               </p>
            </div>
            <button class="info-btn" id="exam-edit-btn">Edit</button>
         </div>
      
         <div class= "exam-input hidden" id="edit-exam-window">
            <div class="input-wrapper flex-center">
               <label for="exam-title">Title:</label>
               <input type="text" value="<?php the_title();?>" name="exam-edit-title" id="exam-edit-title">
            </div>
            <div class="input-wrapper duration flex-between">
               <div class="duration">
                  <label>Duration:</label>
                  <input type="number" min="0" 
                     value="<?php echo $duration !== 'unlimited' ? $duration['hour'] : '';?>" 
                     name="duration-hour" id="duration-hour"> h
                  <input type="number" min="1" max="59" 
                     value="<?php echo $duration !== 'unlimited' ? $duration['minute'] : '';?>" 
                     name="duration-mins" id="duration-mins"> mins
               </div>
               <button 
                  class="primary-btn" id="exam-edit-save-btn">
                  Save
               </button>
            </div>
         </div>
         
         <div class="exam-quizs">
            <?php 
               $relatedQuestionsCount = 0;
               foreach($questions as $question):
                  $answers = get_field('answers', $question->ID);
                  $correctAnswers = get_field('correct_answer', $question->ID);   
                  $quizIdsInExam[] = $question->ID;
                  $relatedQuestionsCount++;
            ?>
            <div class="quiz-card card">
               <div class="card-top quiz-card_top flex-between">
                  <h4 class="quiz-card_top-title">
                     <?php 
                        echo $relatedQuestionsCount . '. ' . $question->post_title;
                     ?>
                  </h4>
                  <div class="flex-center quiz-card_top-info">
                     <p>
                        Correct Answer: 
                        <?php foreach($correctAnswers as $ca):
                           echo $ca;
                        ?>
                        <?php endforeach;?>
                     </p>
                     <button class="danger-btn remove-the-question" data-qid="<?php echo $question->ID; ?>">X</button>
                  </div>
               </div>
               <div class="card-details quiz-options">
                  <ol>
                     <?php $index=1; foreach($answers as $answer):?>
                        <li><?php echo $index . '. ' . $answer; $index++;?></li>
                     <?php endforeach;?>
                  </ol>
               </div>
            </div>
            <?php endforeach; ?>
         </div>
      </div>

      <div style="position:relative" class="container-right">
         <div class="float-container">
            <div class="flex-between quiz-list-heading">
            <h2>Quiz List</h2>
            <div>
               <button class="primary-btn" id="add-question">Add Question(s)</button>
               <button class="danger-btn" id="remove-question">Remove Question(s)</button>
            </div>
            </div>
            <div class="quiz-list">
               <?php while($quizPosts->have_posts()):
                     $quizPosts->the_post();   
               ?>
               <div class="card">
                  <div class= "card-top card-top-details">
                     <h5 
                        style="margin: var(--spacing-sm) 0;" 
                        class="<?php if(in_array((int) get_the_ID(), $quizIdsInExam)){
                           echo 'included_question';
                        } ?>">
                        <?php echo the_title(); ?>
                     </h5>
                     <div class="card-details">
                        <button 
                           data-quiz-title="<?php echo the_title(); ?>" 
                           data-quiz-id="<?php echo the_ID();?>" 
                           class="primary-btn select-student-btn">
                           Select
                        </button>
                     </div>
                  </div>
               </div>
               <?php endwhile; wp_reset_postdata();?>
               <div class="pagination flex-center">
                  <?php
                     $current_url = get_permalink();
                     echo paginate_links([
                        'total' => $quizPosts->max_num_pages,
                        'current' => $paged,
                        'format' => '?question_page=%#%',
                        'base' => $current_url . '%_%'
                     ])
                  ?>
               </div>
            </div>                    
         </div>
      </div>

   </div>
</section>
<?php 
 get_template_part('layout/footer');
?>