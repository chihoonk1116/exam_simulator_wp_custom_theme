<?php 

if(in_array('student', wp_get_current_user()->roles)){
  wp_redirect(home_url('/student'));
  exit;
}

$instId = (string) get_current_user_id();
function getAssignedExams($studentId){
    $assignedExams = new WP_Query([
        'posts_per_page' => -1,
        'post_type' => 'assigned_exam',
        'meta_query' => [
          [
            'key' => 'student_id',
            'value' => $studentId,
            'compare' => '='
          ],
          [
            'key' => 'status',
            'value' => 'assigned',
            'compare' => '='
          ]
        ]
    ]);

    return $assignedExams;
}

function getOtherStatusExams($studentId){
  $assignedExams = new WP_Query([
        'posts_per_page' => -1,
        'post_type' => 'assigned_exam',
        'meta_query' => [
          [
            'key' => 'student_id',
            'value' => $studentId,
            'compare' => '='
          ],
          [
            'key' => 'status',
            'value' => 'assigned',
            'compare' => '!='
          ]
        ]
    ]);

    return $assignedExams;
}

// write query to get students and exams
$exams = new WP_Query(array(
    'posts_per_page' => -1,
    'post_type' => 'exam',
    'order' => 'ASC',
    'meta_query' => [
      'relation' => 'or',
      [
        'key' => 'status',
        'compare' => 'NOT EXISTS'
      ],
      [
        'key' => 'status',
        'value' => 'deactive',
        'compare' => '!='
      ]
    ]
));

$archiveExams = new WP_Query([
  'posts_per_page' => -1,
  'post_type' => 'exam',
  'meta_query' => [
    [
      'key' => 'status',
      'compare' => '=',
      'value' => 'deactive'
    ]
  ]
]);

$students = new WP_User_Query([
    'role' => 'student',
    'orderby' => 'registered',
    'order' => 'DESC',
    'number' => -1
]);

// output code should be the last 
get_template_part('layout/header');

$downArrowIcon = '<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" stroke="#000000" stroke-width="1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M78.466,35.559L50.15,63.633L22.078,35.317c-0.777-0.785-2.044-0.789-2.828-0.012s-0.789,2.044-0.012,2.827L48.432,67.58 c0.365,0.368,0.835,0.563,1.312,0.589c0.139,0.008,0.278-0.001,0.415-0.021c0.054,0.008,0.106,0.021,0.16,0.022 c0.544,0.029,1.099-0.162,1.515-0.576l29.447-29.196c0.785-0.777,0.79-2.043,0.012-2.828S79.249,34.781,78.466,35.559z"></path> </g> </g></svg>'
?>

<section style="poistion:relative" class="dashboard-inst" data-userid="<?php echo $instId; ?>">
  <div class="container container-common-flex">
    <div class="dashboard-inst_students container-left">
      <h2>Student List</h2>
      <div class="dashboard-inst_students_cards cards">
        <?php foreach($students->get_results() as $student):?>
        <div class="dashboard-inst_students_cards-card card">
          <div class="dashboard-inst_students_cards-card-top card-top card-top-details">
            <h5 style="margin: var(--spacing-sm) 0;"><?php echo $student->display_name; ?></h5>
            <div class="card-details flex-between">
              <button 
                data-student-name="<?php echo $student->display_name?>" data-student-id="<?php echo $student->ID;?>" 
                class="primary-btn select-student-btn">
                Select
              </button>
              <button 
                class="card-top_student-more-exams_btn" 
                data-student-id="<?php echo $student->ID;?>">
                <?php echo $downArrowIcon; ?>
              </button>
            </div>
          </div>
          <?php 
            $assigned_exam_post = getAssignedExams($student->ID);
            if($assigned_exam_post->post_count !== 0):
          ?>
            <div class="dashboard-inst_students_cards-card-bottom card-bottom">
              <?php 
              while($assigned_exam_post->have_posts()):
                  $assigned_exam_post->the_post();
                  $assigned_exam = get_field('exam_id', get_the_ID())[0];
              ?>
              <span class="assigned-exam">
                <?php 
                  echo $assigned_exam->post_title;
                ?>
              </span>
              <?php endwhile; wp_reset_postdata();?>
            </div>
          <?php else: ?>
            <div class="dashboard-inst_students_cards-card-bottom card-bottom">
              <p>No assigned exam</p>
            </div>
          <?php endif; ?>

          <div class="dashboard-inst_students_cards-card-bottom_other-exams" id="other-exams_container-<?php echo $student->ID?>">
            <div class="other-exams-content hidden">
            <?php
              $otherStatusExams = getOtherStatusExams($student->ID);
              
              $completedExams = [];
              $otherExams = [];

              while($otherStatusExams->have_posts()){
                $otherStatusExams->the_post();
                $status = get_field('status', get_the_ID());
                
                if($status === 'completed'){
                  $completedExams[] = get_the_ID();
                }
                else{
                  $otherExams[] = get_the_ID();
                }
              }
              wp_reset_postdata();
            ?>
              <div class="completed-exams">
                <p>Completed</p>
                <?php 
                  foreach($completedExams as $completedExam):
                    $score = get_field('score', $completedExam);
                    $examName= get_field('exam_id', $completedExam)[0]->post_title;
                ?>
                <span class="assigned-exam completed-exam">
                  <?php echo $examName . ' : ' . $score;?>
                </span>
                <?php endforeach;?>
              </div>

              <div class="other-exams">
                <p>Others</p>
                <?php 
                  foreach($otherExams as $otherExam):
                    $examName= get_field('exam_id', $otherExam)[0]->post_title;
                    $status = get_field('status', $otherExam);
                ?>
                <span class="assigned-exam <?php echo $status === 'missing' ? 'missing-exam' : 'cancelled-exam'; ?>">
                  <?php echo $examName;?>
                </span>
                <?php endforeach;?>
              </div>
                
            </div>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="dashboard-inst_exams container-right">
      <div class="flex-between">
        <h2>Exam List</h2>
        <div class="">
          <button id="manage-exam-btn" class="info-btn">Manage Exam(s)</button>
          <button id="create-new-exam_btn" class="info-btn">Create New Exam</button>
          <a href="/exam-simulator/questions" class="info-btn">Quizs</a>
        </div>
      </div>
      <div class="archive-exam-list flex-between">
        <h5>Exam Archive</h5>
        
        <select name="archive-exams" id="archive-exams">
          <option value="">Select Exam...</option>
          <?php while($archiveExams->have_posts()):
                  $archiveExams->the_post();  
          ?>
          <option value="<?php the_ID()?>"><?php the_title();?></option>
          <?php endwhile; wp_reset_postdata();?>
        </select>
        <button id="active-exam-btn" class="primary-btn">Active</button>
        <button id="delete-exam-btn" class="danger-btn">Delete</button>
        
        
      </div>
      <div class="dashboard-inst_exams_cards cards">
        <?php while($exams->have_posts()):
          $exams->the_post();

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
        ?>
        <div class="dashboard-inst_exams_cards-card card">
          <div class="dashboard-inst_exams_cards-card-top card-top-details ">
            <h5 style="margin: var(--spacing-sm) 0;"><?php echo the_title(); ?></h5>
            <div class="card-details">
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
          </div>
          <div class="dashboard-inst_exams_cards-card-bottom card-bottom">
            <button class="primary-btn select-exam-btn" data-exam-title="<?php echo the_title();?>" data-exam-id="<?php echo the_ID();?>">Select</button>
            <a href="<?php the_permalink();?>" class="primary-btn">Edit Exam</a>
          </div>
        </div>
        <?php endwhile; wp_reset_postdata();?>
      </div>
    </div>
  </div>
<!-- manage exams overlay -->
  <div class="manage-exam-overlay flex-center hidden">
    <div class="container flex-center">
        <h1>Manage Exam(s)</h1>
        <div class="flex-between selected-items_wrapper">
            <div>
                <h5>Selected Exam(s)</h5>
                <div class="manage-exam-overlay_selected-exams">
                    <span class="selected-items">Exam1</span>
                    <span class="selected-items">Exam2</span>
                </div>
            </div>
            <div class="">
                <h5>Selected Student(s)</h5>
                <div class="manage-exam-overlay_selected-students">

                </div>
            </div>
        </div>
        <div class="manage-exam_date-input_wrapper">
            <p>Due Date</p>
            <div class="flex-center">
                <div class="">
                    <input type="date" name="due-date" id="due-date">
                </div>
                <div class="br_vertical"></div>
                <div class="flex-center">
                    <input type="checkbox" name="no-due-date" id="no-due-date" class="hidden">
                    <label for="no-due-date">No Due Date</label>
                </div>
            </div>
        </div>
        <div class="flex-center btns-row">
            <button class="primary-btn" id="assign-exam_btn">Assign Exam</button>
            <button class="primary-btn" id="edit-due_btn">Edit Due Date</button>
            <button class="danger-btn" id="unassign-exam_btn">Unassign Exam</button>
            <button class="danger-btn" id="to-archive-btn">To Archive</button>
            <button class="info-btn" id="close-overlay-btn">Close</button>
        </div>
    </div>
  </div>
<!-- create exam window -->
  <div class="create-exam-window flex-center hidden">
    <div class="container flex-center">
        <h1>Create Exam</h1>
        <div class="create-exam-window_input-wrapper flex-center">
            <label for="exam-title">Title:</label>
            <input type="text" id="exam-title" name="exam-title" placeholder="Enter the exam title...">
        </div>
        <div class="flex-center btns-row">
            <button class="primary-btn" id="save-new-exam_btn">Save Exam</button>
            <button class="info-btn" id="close-exam-window_btn">Close</button>
        </div>
    </div>
  </div>


</section>

<?php
 get_template_part('layout/footer');

?>


