<?php

namespace app\views\generic\blocks\placemarks\categories_viewer;

use \components\app as components;

$tags = require(MY_SERVICES_DIR . 'landmarks' . MY_DS . 'config' . MY_DS . 'config.php');
$tags = $tags['text_form']['tags'];
?>
<style>
    .text_redactor_tag{
        display: inline-block;
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        margin-right: 5px;
        border-radius: 2px;
        cursor:pointer;
    }
    .text_redactor_tag:hover{
        background-color: #517784;
        color: #fff;
    }
    .text_redactor_block{
        padding: 0px 0px 5px 10px;
    }
</style>
<script>
    (function ($) {
        $.fn.wrapSelected = function (open, close) {
            return this.each(function () {
                var textarea = $(this);
                var value = textarea.val();
                var start = textarea[0].selectionStart;
                var end = textarea[0].selectionEnd;
                textarea.val(
                        value.substr(0, start) +
                        open + value.substring(start, end) + close +
                        value.substring(end, value.length)
                        );
            });
        };
    })(jQuery);
</script>

<div class="text_redactor_block">
    <?php foreach ($tags as $tag): ?>
        <div
            class="text_redactor_tag"
            title="<?php echo($tag['code']); ?>"
            onclick='$("textarea#content").wrapSelected("<?php echo($tag['open_tag']); ?>", "<?php echo($tag['close_tag']); ?>");'>
            <?php echo($tag['code']); ?>
        </div>
    <?php endforeach; ?>
</div>


