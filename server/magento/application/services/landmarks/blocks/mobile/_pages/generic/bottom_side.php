<div class="page_bottom_block">



    <div class="page_bottom_column_1">

        <div class="page_bottom_column_row_header">
            <?php echo my_pass_through(@self::trace('page_bottom/column_1/header/text')); ?>

        </div>
        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG); ?>"><?php echo my_pass_through(@self::trace('page_bottom/catalog/text')); ?></a>

        </div>
        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_MAP); ?>"><?php echo my_pass_through(@self::trace('page_bottom/map/text')); ?></a>

        </div>
        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_MODULE_NAME_SEARCH); ?>"><?php echo my_pass_through(@self::trace('page_bottom/search/text')); ?></a>

        </div>
        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_SITEMAP_COUNTRIES_NAME); ?>"><?php echo my_pass_through(@self::trace('page_bottom/sitemap_countries/text')); ?></a>
        </div>
        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_SITEMAP_CATEGORIES_NAME); ?>"><?php echo my_pass_through(@self::trace('page_bottom/sitemap_categories/text')); ?></a>
        </div>



        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_ARTICLE . '/' . MY_ACTION_NAME_ARTICLES_COUNTRIES_NAME); ?>"><?php echo my_pass_through(@self::trace('page_bottom/articles_countries/text')); ?></a>
        </div>

        <div class="page_bottom_column_row">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_ARTICLE . '/' . MY_ACTION_NAME_ARTICLES_CATEGORIES_NAME); ?>"><?php echo my_pass_through(@self::trace('page_bottom/articles_categories/text')); ?></a>
        </div>


    </div>






    <div class="page_bottom_liveinternet">



        <!--LiveInternet counter--><script type="text/javascript"><!--
        document.write("<a href='//www.liveinternet.ru/click' " +
                    "target=_blank><img src='//counter.yadro.ru/hit?t45.3;r" +
                    escape(document.referrer) + ((typeof (screen) == "undefined") ? "" :
                    ";s" + screen.width + "*" + screen.height + "*" + (screen.colorDepth ?
                            screen.colorDepth : screen.pixelDepth)) + ";u" + escape(document.URL) +
                    ";" + Math.random() +
                    "' alt='' title='LiveInternet' " +
                    "border='0' width='31' height='31'><\/a>")
            //--></script><!--/LiveInternet-->






    </div>





    <div class="clear"></div>









    <div class="page_bottom_rights">
        <?php echo my_pass_through(@self::trace('page_bottom/rights/text')); ?>

    </div>







</div>
