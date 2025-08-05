<?php

if(in_array('instructor', wp_get_current_user()->roles)){
  wp_redirect(home_url('/instructor'));
  exit;
}

$studentId = (string) get_current_user_id();

$allAssignedExams = new WP_Query([
  'posts_per_page' => -1,
  'post_type' => 'assigned_exam',
  'meta_query' => [
    [
      'key' => 'student_id',
      'value' => $studentId,
      'compare' => '='
    ]
  ]
]);

$assignedExamsArray = [];
$completedExamsArray = [];
$otherExamsArray = [];

while($allAssignedExams->have_posts()){
  $allAssignedExams->the_post();

  $date = get_field('complete_by', get_the_ID());
  $status = get_field('status', get_the_ID());

  if($status === 'assigned'){

    $givenDate = new DateTime($date);
    $now = new DateTime('now');

    if($givenDate < $now){
      update_field('status', 'missing', get_the_ID());
      $otherExamsArray[] = get_the_ID();
    }
    else{
      $assignedExamsArray[] = get_the_ID();
    }

  }
  else if($status === 'completed'){
    $completedExamsArray[] = get_the_ID();
  }
  else{
    $otherExamsArray[] = get_the_ID();
  }
}
wp_reset_postdata();
         
function getDurationExp($examPost){

  $duration = get_field('duration', $examPost->ID); 
  if(!isset($duration)) return 'unlimited';
  
  if(is_string($duration)){
    $duration = json_decode($duration, 1);
  }
  
  $durationExp = 'unlimited';

  if($duration['hour'] === '00' && $duration['minute'] === '00'){
    return $durationExp;
  }else{
    $durationExp = $duration['hour'] . 'h ' . $duration['minute'] . 'mins'; 
  }
  return $durationExp;
}

get_template_part('layout/header');
?>

<section style="poistion:relative" class="dashboard-student" data-userid="<?php echo $studentId; ?>">
  <div class="container container-common-flex">
    <div class="dashboard-student_info container-left">
      <h2>Overview</h2>
      <div class="flex-center">
        <p class="general-info">Completed Exams: <?php echo count($completedExamsArray); ?></p>
        <p class="general-info">Exams to Take: <?php echo count($assignedExamsArray); ?></p>
        <p class="general-info">Canceled Or Missing: <?php echo count($otherExamsArray); ?></p>
      </div>
      <div class="dashboard-student_info-card cards">
        <h2>Completed Exams</h2>
        <?php foreach($completedExamsArray as $completedExamId):
          $score = get_field('score', $completedExamId);
          $completedAt = explode(' ', get_field('completed_at', $completedExamId));
          $examName = get_field('exam_id', $completedExamId)[0]->post_title;
        ?>
        <div class="dashboard-inst_exams_cards-card card">
          <div class="dashboard-inst_exams_cards-card-top card-top-details ">
            <h5 style="margin: var(--spacing-sm) 0;"><?php echo $examName; ?></h5>
            <div class="card-details">
              <p>Score: <?php echo $score; ?></p>
              <p>Date: <?php echo $completedAt[0]; ?> </p>
            </div>
          </div>
          <div class="dashboard-inst_exams_cards-card-bottom card-bottom">
            <a href="<?php echo get_permalink($completedExamId);?>" class="primary-btn">Exam Details</a>
          </div>
        </div>
        <?php endforeach;?>
      </div>
    </div>
    
    <div class="dashboard-inst_exams container-right">
      <h2>Exam List</h2>
      <div class="dashboard-inst_exams_cards cards">
        <?php foreach($assignedExamsArray as $assignedExamId):

          $completeBy = explode(' ', get_field('complete_by', $assignedExamId))[0];
          if($completeBy === '9999-12-31'){
            $completeBy = 'No Due Date';
          }
          $assignedBy = get_user_by('ID', (int) get_field('assigned_by', $assignedExamId));

          $examPost = get_field('exam_id', $assignedExamId)[0];

          $examName = $examPost->post_title;
          $examDuration = getDurationExp($examPost);
          $examQuestions = get_field('related_questions', $examPost->ID);
          $examNumOfQuestions = isset($examQuestions) ? count($examQuestions) : 0;
        ?>
        <div class="dashboard-inst_exams_cards-card card">
          <div class="dashboard-inst_exams_cards-card-top card-top-details ">
            <h5 style="margin: var(--spacing-sm) 0;"><?php echo $examName; ?></h5>
            <div class="card-details">
              <p>Total Quetions: <?php echo $examNumOfQuestions;?></p>
              <p>Duration: <?php echo $examDuration; ?></p>
              <p>Due Date: <?php echo $completeBy; ?></p>
              <p>Assigned By: <?php echo $assignedBy->display_name; ?></p>
            </div>
          </div>
          <div class="dashboard-inst_exams_cards-card-bottom card-bottom">
            <a href="<?php echo get_permalink($assignedExamId);?>" class="primary-btn">Take Exam</a>
          </div>
        </div>
        <?php endforeach;?>
      </div>
    </div>
  </div>

  <div class="container other-exam_container">
    <h2>Other Exams</h2>
    <div class="cards flex-center">
      <?php foreach($otherExamsArray as $otherExamId):
        $examPost = get_field('exam_id', $otherExamId)[0];
        $examName = $examPost->post_title;

        $completeBy = get_field('complete_by', $otherExamId);
        $assignedBy = get_user_by('ID', (int) get_field('assigned_by', $otherExamId));
        $status = get_field('status', $otherExamId);
        
      ?>
      <div class="dashboard-inst_exams_cards-card card">
        <div class="dashboard-inst_exams_cards-card-top card-top-details other-exam_card_top">
          <h5 style="margin: var(--spacing-sm) 0;"><?php echo $examName; ?></h5>
          <p>Due Date: <?php echo $completeBy; ?></p>
          <p>Assigned By: <?php echo $assignedBy->display_name; ?></p>
        </div>
        <div class="dashboard-inst_exams_cards-card-bottom card-bottom other-exam_card_bottom">
          <span class="<?php echo $status === 'missing' ? 'missing-span' : 'cancelled-span' ?>">
            <?php echo $status === 'missing' ? 'missing' : 'cancelled' ?>
          </span>
        </div>
      </div>
      <?php endforeach;?>
    </div>
  </div>
  
</section>

<?php
 get_template_part('layout/footer');
        
?>
