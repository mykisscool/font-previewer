<?php

define('__FONTS__', dirname(dirname(__FILE__)) . '/fonts/');

// Debug info:
// echo phpinfo(); // GD Installed?
// echo var_dump(gd_info()); // What version of GD is being used?

/* Size (Inches) = 72 points (1 inch)
 * Font Angle = 0 (default) */

// Apply letter-spacing to longest line
$longest_line = max(array_map('strlen', explode("\n", $_POST['text'])));
$new_length = $_POST['spacing'] * $longest_line * 72;

// Get dimensions
$box = imagettfbbox(72, 0, __FONTS__ . $_POST['font'] . '.ttf', $_POST['text']);

// Calculate dimensions based on letter-height and letter-spacing and return results to client
echo json_encode(
  array(
    'width' => ((abs($box[2] - $box[0]) + $new_length)* $_POST['height']) / 72,
    'height' => (abs($box[5] - $box[3]) * $_POST['height'] / 72)
  )
);
