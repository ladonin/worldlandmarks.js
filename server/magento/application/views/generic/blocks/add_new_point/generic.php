<div id="add_new_point">
    <div class="header_1"><?php echo(self::trace('text/new_point/title')); ?></div>
    <div class="header_2"><?php echo(self::trace('text/new_point/step_1')); ?></div>

    <?php
    $form_map_new_point = $data['form_map_new_point'];
    $fields = $form_map_new_point->get_all_fields();
    $email = isset($_COOKIE[MY_COOKIE_EMAIL_PLACEMARK]) ? $_COOKIE[MY_COOKIE_EMAIL_PLACEMARK] : '';

    // --> Create form
    echo($form_map_new_point->start_form());
    ?>

    <div id="new_placemark_email">
        <div class="label_1"><?php echo($form_map_new_point->show_label('email')); ?></div>
        <div class="field_1"><?php echo($form_map_new_point->show_field('email', false, $email)); ?></div>
    </div>
    <div id="update_placemark_password">
        <div class="label_1"><?php echo($form_map_new_point->show_label('password')); ?></div>
        <div class="field_1"><?php echo($form_map_new_point->show_field('password')); ?></div>
    </div>
    <button id="delete_placemark" type="button"><?php echo(my_pass_through(@self::trace('buttons/new_point/delete_placemark'))); ?></button>



    <?php if (self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()): ?>
        <div class="label_1"><?php echo($form_map_new_point->show_label('title')); ?></div>
        <div class="field_1"><?php echo($form_map_new_point->show_field('title')); ?></div>
    <?php endif; ?>









    <div class="label_1"><?php echo($form_map_new_point->show_label('comment')); ?></div>
    <?php $this->trace_block('placemarks/text_redactor', false, $data); ?>
    <div class="field_1"><?php echo($form_map_new_point->show_field('comment')); ?></div>

    <div class="label_1"><?php echo($form_map_new_point->show_label('category')); ?></div>
    <div class="field_1"><?php echo($form_map_new_point->show_field('category')); ?></div>


    <div class="field_1" id="update_placemark_field">
    </div>
    <?php
    echo($form_map_new_point->show_hidden_fields());
    echo($form_map_new_point->end_form());
    ?>

    <div class="label_1"><?php echo(self::trace('text/new_point/add_photos')); ?></div>


    <div class="field_1">
        <?php
        $this->trace_block('multiple_file_uploader', false, $data);
        // <-- Create form
        ?>
    </div>
    <br><br>
    <script>
        function file_uploader_success(photo) {
            if (photo) {
                my_new_point.add_photos(photo);
            }
        }
        function file_uploader_delete(photo) {
            if (photo) {
                my_new_point.delete_photos(photo);
            }
        }





















    </script>
    <?php
    $this->trace_block('_models/form/new_point/generic');
    ?>

</div>
