<?php 
 get_template_part('layout/header');
?>

<h1 style="height:70vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">404 Page Not Found...Redirect Soon.</h1>

<script>
  setTimeout(function(){
    window.location.href = "<?php echo home_url('/');?>"
  },2000)
</script>
   
<?php
 get_template_part('layout/footer');
?>