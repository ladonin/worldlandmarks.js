<div id="hat">
    <div class="hat_logo">
        <div class="hat_logo_img">
            <a href="<?php echo(MY_DOMEN); ?>">
                <img src="<?php echo("/logo.png"); ?>"/>
            </a>
        </div>
        <div class="hat_logo_text_main">
            <a href="<?php echo(MY_DOMEN); ?>">WORLD-LANDMARKS.RU</a>
        </div>
        <div class="hat_logo_text_under">
            <?php echo(my_pass_through(@self::trace('hat/logo/under_text'))); ?>
        </div>
    </div>
    <div class="hat_menu">
        <div id="open_panel"><?php echo(my_htmlller_buttons(null, MY_DEVICE_DESCTOP_TYPE_CODE)); ?></div>
    </div>
    <div class="clear"></div>
</div>
