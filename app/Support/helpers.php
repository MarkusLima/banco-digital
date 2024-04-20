<?php

if (! function_exists('generatenumberRandom')) {

    function generatenumberRandom() {
        return sprintf("%04d", mt_rand(0, 9999));
    }

}