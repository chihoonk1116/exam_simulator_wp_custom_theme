<?php

class Manage_Exam_Single_API{
  public function __construct() {
    add_action('rest_api_init', [$this, 'register_routes']);
  }

  public function register_routes(){
    register_rest_route('custom/v1', 'add-question', [
      'methods' => 'POST',
      'callback' => [$this, 'addQuestion']
    ]);

    register_rest_route('custom/v1', 'remove-question', [
      'methods' => 'POST',
      'callback' => [$this, 'removeQuestion']
    ]);

    register_rest_route('custom/v1', 'edit-exam-info', [
      'methods' => 'POST',
      'callback' => [$this, 'editExamInfo']
    ]);
  }

  public function addQuestion(WP_REST_Request $req){

    $params = $req->get_json_params();

    $questionIds = $params['questionIds'];
    $examId = $params['examId'];

    if(!isset($examId) || !isset($questionIds)){
      return new WP_REST_Response([
        'status' => 'fail'
      ], 400);
    }

    $related_questions = get_field('related_questions', $examId);
    if(!isset($related_questions)) $related_questions = [];

    foreach($questionIds as $qid){
      $questionPost = get_post($qid);
      if(in_array($questionPost, $related_questions)) continue;
      $related_questions[] = get_post($qid);
    }

    error_log(print_r($related_questions, 1));
    
    update_field('related_questions', $related_questions, $examId);
   
    return new WP_REST_Response([
      'status' => 'success'
    ], 200);
  }

  public function removeQuestion(WP_REST_Request $req){
    
    $params = $req->get_json_params();

    $questionIds = $params['questionIds'];
    $examId = $params['examId'];

    if(!isset($questionIds) || !isset($examId)){
      return new WP_REST_Response([
        'status' => 'fail'
      ], 400);
    }

    $related_questions = get_field('related_questions', $examId);

    foreach($questionIds as $qid){
      $questionPost = get_post($qid);
      if(in_array($questionPost, $related_questions)){
        $related_questions = array_filter(
          $related_questions, 
          function($qPost) use($qid){
            return $qPost->ID !== (int )$qid;
        });
      }
    }

    update_field('related_questions', $related_questions, $examId);

    return new WP_REST_Response([
      'status' => 'success'
    ], 200);
  }

  public function editExamInfo(WP_REST_Request $req){
    
    $params = $req->get_json_params();

    $examId = $params['examId'];
    $title = $params['title'];
    $originalTitle = get_post($examId)->post_title;
    $hours = empty($params['hours']) ? '00' : $params['hours'];
    $mins = empty($params['mins']) ? '00' : $params['mins'];

    if(!isset($examId)){
      return new WP_REST_Response([
        'status' => 'fail',
      ], 400);
    }

    $duration = ($hours === '00' && $mins === '00') ? "unlimited" : ['hour' => $hours, 'minute' => $mins];

    if($title !== $originalTitle){
      wp_update_post(['ID' => $examId, 'post_title' => $title]);
    }

    update_field('duration', $duration, $examId);

    return new WP_REST_Response([
      'status' => 'success'
    ], 200);
  }


}