<html>
    <head>
        <title><?php echo($title); ?></title>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no, maximum-scale=1, width=device-width" />
        <link rel="stylesheet" href="/css/generic/bootstrap.css">

        <link rel="stylesheet" type="text/css" href="/css/desctop/generic.css"/>
        <script src="/javascript/generic/jQuery/jquery.min.js"></script>
    </head>
    <body>
        <script>
            function placemark_outer_photos_checking(sitename){
            $('.my_photos').change(function () {
                var that = this;
                $.ajax({
                    type: "POST",
                    url: 'http://'+sitename+'/generic_access/check_avialability_outer_photo_url',
                    data: {url: $(this).val()}

                }).done(function (msg) {
                    if (msg == 1) {
                        $(that).css('backgroundColor', '#afa');
                    }
                    else {
                        $(that).css('backgroundColor', '#faa');
                    }
                });
            });
            }
        </script>