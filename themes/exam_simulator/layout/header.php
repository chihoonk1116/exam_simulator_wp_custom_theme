<?php

// is_page single_assigned exam, is assigned status -> dont print out heading container

 $current_user = wp_get_current_user();

 $current_url = in_array('instructor', $current_user->roles) ? 'instructor' : 'student'; 

 if (is_user_logged_in()) {
    if (isset($_GET['logout']) && $_GET['logout'] == 'logout') {
        wp_logout();
        wp_redirect(home_url('/login'));
        exit();
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head();?>
    <title>Document</title>
</head>
<body>
    <div class="hidden" id="spinner-container">
        <div class="spinner"></div>
    </div>
    <div class="" id="alert-container">
        <div class="alert">Error</div>
    </div>
    <header>
        <?php if(!is_singular('assigned_exam')):?>
        <div class="heading-container">
            <h1>Hello <?php echo esc_html($current_user->display_name); ?></h1>
            <div class="links-wrapper">
                <a href="<?php echo home_url() . '/' . $current_url;?>">To Dashboard</a>
                <form method="GET" action="logout">
                    <input type="submit" name="logout" value="logout">
                </form>
            </div>
        </div>
        <?php endif; ?>
    </header>
    <main>