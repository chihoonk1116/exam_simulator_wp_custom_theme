<?php

// implement correct answer ui

$paged = isset($_GET['question_page']) ? $_GET['question_page'] : 1;

$quizPosts = new WP_Query([
   'posts_per_page' => 10,
   'post_type' => 'question',
   'paged' => $paged
]);

get_template_part('layout/header');

?>

<section style="position:relative" id="question-archive">
   <div class="container">
      <div class="flex-between quiz-list-heading">
        <h2>Quiz List</h2>
        <div id="btns">
          <button class="primary-btn" id="save-edit-btn" disabled>Save</button>
          <button class="primary-btn" id="create-question">Create Question</button>
          <button class="primary-btn" id="onedit-question-btn">Edit Mode</button>
          <button class="danger-btn" id="delete-question">Delete Mode</button>
        </div>
      </div>

      <div class="quiz-list">
        <div class="card" id="new-question_input_card">
          <div class= "card-top flex-between">
            <input 
              class="question-title" 
              type="text" value=""
              name="new-question-title"
              id="new-question-title"
              placeholder="Title.."
            >
            <div class="card-details">
              <div class="select-answers">
                
              </div>
            </div>
          </div>
          <div class="card-bottom">

            <div class="new-question_span-wrapper">
              <span class="delete-answer">-</span>
              <span class="add-answer">+</span>
            </div>
          </div>
        </div>

        <?php while($quizPosts->have_posts()):
          $quizPosts->the_post();   
          $answers = get_field('answers', get_the_ID());
          if(is_string($answers)){
            $answers = json_decode($answers);
          }
          $correctAnswer = get_field('correct_answer', get_the_ID());
          if(is_string($correctAnswer)){
            $correctAnswer = json_decode($correctAnswer);
          }

          $numOfAnswerOptions = count($answers);
        ?>
        <div class="card" data-quiz-id="<?php echo esc_attr(the_ID());?>">
          <div class= "card-top flex-between">
            <input 
              readonly
              class="question-title" 
              type="text" value="<?php esc_attr(the_title()); ?>"
              name="question-title-<?php esc_attr(the_ID())?>"
              id="question-title-<?php esc_attr(the_ID())?>"
            >
            <div class="card-details">
              <div class="select-answers">
                <?php for($i=0;$i<$numOfAnswerOptions;$i++):?>
                  <label class="select-correct-answer_label" for="select-correct-answer-<?php echo get_the_ID() . '-' . $i+1; ?>">
                    <input 
                      hidden
                      disabled
                      type="checkbox"
                      id="select-correct-answer-<?php echo get_the_ID() . '-' . $i+1; ?>"
                      value="<?php echo $i+1; ?>"
                      <?php echo in_array((string) $i+1, $correctAnswer) ? 'checked' : ''; ?>
                    >
                    <span><?php echo $i+1;?></span>
                  </label>
                <?php endfor;?>
              </div>
              <button class="info-btn select-question-btn" disabled>
                Select
              </button>
            </div>
          </div>
          <div class="card-bottom">
          <?php   
            $index = 1;
            foreach ($answers as $answer) :?>
              <input 
                readonly
                class="answer-input-<?php the_ID(); ?> question-answers" 
                id="answer-input-<?php the_ID(); echo '-' . $index; ?>" 
                type="text" 
                value="<?php echo esc_attr($answer);?>"
              >
          <?php 
            $index++;
            endforeach;?>
            <div class="span-wrapper">
              <span class="delete-answer">-</span>
              <span class="add-answer">+</span>
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
            ]);
          ?>
        </div>
      </div>   
      

   </div>
</section>
<?php 
 get_template_part('layout/footer');
?>