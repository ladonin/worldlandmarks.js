    <h5 onclick="$('#categories-list').toggle()" style="cursor:pointer">Категории: </h5>
    <div style="background-color: #474c57;padding: 10px;color: #c2dbe6; <?php if(!isset($show_categories_list) || !$show_categories_list) {?>display:none;<?php } ?> " id="categories-list">
        <?php
        $categories = get_categories(MY_LANGUAGE_RU, false);


        function prepare_name_for_articles($category_code = null, $category_title)
        {
            if (get_service_name() === 'landmarks') {
                if ($category_code === 'other') {
                    return 'Общий обзор';
                }
            }
            return $category_title;
        }

        foreach ($categories as $category) { ?>
            <img src="<?php echo(MY_SERVICE_IMGS_URL_CATEGORIES . $category['code'] . '.png'); ?>">
            <?php echo ($category['id'] . ': ' . (!empty($prepare_name_for_articles) ? prepare_name_for_articles($category['code'], $category['name']) : $category['name']) . '<br>');?>
            <?php
        }
        ?>
    </div>