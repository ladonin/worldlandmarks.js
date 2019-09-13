<?php

namespace components\app;

use \vendor\component;

final class Visitors_Analyze extends Component
{


    static public function identify()
    {
        if (!is_ajax()) {
            self::get_module(MY_MODULE_NAME_ANALYZE)->identify();
        }
    }
}
