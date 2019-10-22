
$(document).ready(function ($) {


    function lightboxPhoto()
    {
        $("a[rel^='prettyPhoto']").prettyPhoto({
            animationSpeed: 'fast',
            slideshow: 5000,
            theme: 'light_rounded',
            show_title: false,
            overlay_gallery: false
        });
    }

    if ($().prettyPhoto) {
        lightboxPhoto();
    }


    if ($().quicksand) {
        // Clone applications to get a second collection
        var $data = $(".pretty_photo_portfolio-area").clone();

        //NOTE: Only filter on the main portfolio page, not on the subcategory pages
        $('.pretty_photo_portfolio-categ li').click(function (e) {
            $(".pretty_photo_filter li").removeClass("pretty_photo_active");
            // Use the last category class as the category to filter by. This means that multiple categories are not supported (yet)
            var filterClass = $(this).attr('class').split(' ').slice(-1)[0];

            if (filterClass == 'pretty_photo_all') {
                var $filteredData = $data.find('.pp_pi2');
            } else {
                var $filteredData = $data.find('.pp_pi2[data-type=' + filterClass + ']');
            }
            $(".pretty_photo_portfolio-area").quicksand($filteredData, {
                duration: 600,
                adjustHeight: 'auto'
            }, function () {

                lightboxPhoto();
            });
            $(this).addClass("pretty_photo_active");
            return false;
        });

    }//if quicksand
});