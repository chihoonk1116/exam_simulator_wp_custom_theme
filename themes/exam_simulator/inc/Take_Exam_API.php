<?php 
class Take_Exam_API{
  public function __construct() {
    add_action('rest_api_init', [$this, 'register_routes']);
  }

  public function register_routes(){
    register_rest_route('custom/v1', 'submit-exam', [
      'methods' => 'POST',
      'callback' => [$this, 'submit_exam_handler'],
      'permission_callback' => '__return_true'
    ]);
  }

  public function submit_exam_handler(WP_REST_Request $req){
    
    $params = $req->get_json_params();

    $qids = $params['qids'];
    $answers = $params['answers'];
    $assignedId  = $params['assignedId'];

    $score = 0;
    $result = [];
    
    for($ind=0; $ind<count($qids); $ind++){
      $correct_answer = get_field('correct_answer', $qids[$ind]);
      $stuResponses = $answers[$ind];

      if(count($stuResponses) === count($correct_answer)){
        $resInd = 0;
        foreach($stuResponses as $stuResponse){
          if(!in_array($stuResponse, $correct_answer)){
            $result[$qids[$ind]] = ["incorrect", $stuResponses];
            break;
          }
          else{
            if(count($stuResponses)-1 == $resInd){
              $result[$qids[$ind]] = ["correct", $stuResponses];
              $score += 10;
            }
          }
          $resInd++;
        }
      }
      else{
        $result[$qids[$ind]] = ["incorrect", $stuResponses];
      }
    }

    update_field('score', $score, $assignedId);
    update_field('student_response', $result, $assignedId);
    update_field('completed_at', date("Y-m-d"), $assignedId);
    update_field('status', 'completed', $assignedId);

    return new WP_REST_Response([
      'status' => 'success',
      'score' => $score,
      'result' => $result
    ], 200);
  }
}