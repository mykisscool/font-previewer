<?php
  /*
   * create.images.php
   *
   * This file will loop over the fonts directory and get some misc filename information
   * and create .pngs for the font previewer application
   *
   */

  require_once('../vendor/autoload.php');
  use font_previewer\ttfInfo;
  error_reporting(E_ERROR | E_WARNING | E_PARSE);

  ob_start();

  define('__ROOT__', dirname(__FILE__) . '/');
  define('__FONTS__', __ROOT__ . 'dump-fonts/');
  define('__IMAGES__', dirname(__ROOT__ ) . '/images/');

  // Loop over the fonts directory
  if ($handle = opendir(__FONTS__)) {

    $format = new phMagickTextObject(); // Create instance of phMagickTextObject()
    $phMagick = new phMagick(); // Create instance of phMagick()

    // Comment-out the line below on Windows boxes.
    // If this doesn't work on nix machines- try "whereis convert" and use that path here.
    $phMagick->setImageMagickPath('/usr/bin');

    $phMagick->debug = true;

    while (false !== ($file = readdir($handle))) {
      if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) == 'ttf') {

        // Get some font information and format the file and name
        $font_file = __FONTS__ . $file;
        $formatted_font_file = preg_replace('/\s+/', '', $font_file);
        rename($font_file, $formatted_font_file);

        $font_obj = new ttfInfo;
        $font_obj->setFontFile($formatted_font_file);
        $font_info = $font_obj->getFontInfo();

        $full_font_name = preg_replace('/ webfont| regular|/i', '', $font_info[4]);
        $font_basename = pathinfo($file, PATHINFO_FILENAME);

        // Create the image with ImageMagick (imagick extension + phMagick wrapper)
        $format
          ->fontSize(30)
          ->font($formatted_font_file)
          ->color('#000')
          ->background('none'); // Transparency

        $phMagick
          ->setDestination(__IMAGES__ . $font_basename . '.png')
          ->fromString($full_font_name, $format); // Message

            echo 'Font \'' . $full_font_name . '\' saved as \'' . __IMAGES__ . $font_basename . '.png\'';
            echo str_pad('', 4096) . '<br />';

            ob_flush();
            flush();
            sleep(1);
      }
    }
    closedir($handle);
    echo 'Font creation complete.';
  }
