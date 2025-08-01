<?php

class Manage_Question_API{
  public function __construct() {
    add_action('rest_api_init', [$this, 'register_routes']);
  }

  public function register_routes(){
    register_rest_route('custom/v1', 'edit-question', [
      'methods' => 'POST',
      'callback' => [$this, 'save_edit_question'],
    ]);

    register_rest_route('custom/v1', 'delete-question', [
      'methods' => 'POST',
      'callback' => [$this, 'delete_question'],
    ]);

    register_rest_route('custom/v1', 'create-question', [
      'methods' => 'POST',
      'callback' => [$this, 'create_question'],
    ]);
  }

  public function save_edit_question(WP_REST_Request $req){

    $params = $req->get_json_params();

    $data = $params['data'];

    foreach($data as $question){
      $id = $question['qId'];
      $title = $question['qTitle'];
      $correctAnswer= $question['correctAnswer'];
      $options= $question['options'];

      wp_update_post([
        'ID' => $id,
        'post_title' => $title
      ]);
      
      update_field('answers', $options, $id);
      update_field('correct_answer', $correctAnswer, $id);

    }

    return new WP_REST_Response([
      'status' => 'success'
    ], 200);
  }

  public function delete_question(WP_REST_Request $req){

    $params = $req->get_json_params();

    $ids = $params['ids'];

    foreach($ids as $id){
      wp_delete_post($id);
    }

    return new WP_REST_Response([
      'status' => 'success'
    ], 200);
  }

  public function create_question(WP_REST_Request $req){

    $params = $req->get_json_params();

    $title = $params['title'];
    $correctAnswers = $params['correctAnswers'];
    $answerOptions = $params['answerOptions'];

    error_log(print_r($title, 1));
    error_log(print_r($correctAnswers, 1));
    error_log(print_r($answerOptions, 1));

    $newPostId = wp_insert_post([
      'post_title' => $title,
      'post_type' => 'question',     
      'post_status' => 'publish',
      'meta_input' => [
        'answers' => $answerOptions,
        'correct_answer' => $correctAnswers
      ]
    ]);



    // if(is_wp_error($newPostId)){
    //   update_field('answers', $answerOptions, $newPostId);
    //   update_field('correct_answer', $correctAnswers, $newPostId);
    // }

    return new WP_REST_Response([
      'status' => 'success'
    ], 200);
  }

}