<?php require_once('scripts/config.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
<?php echo $styles; ?>
  <link rel="stylesheet" href="dist/font-previewer.css" type="text/css" />
  <title>Font Previewer</title>
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
<div id="wrap">
  <div id="main">
    <header>
      <h1>Font Previewer</h1>
    </header>
    <p id="fallback">Your web browser cannot support the features required to run the Font Previewer.</p>
    <div id="application">
      <div id="row_one" class="clearfix">
        <div id="message_container">
          <h3>Enter your message here:</h3>
          <div id="message" class="border">
            <textarea id="text"></textarea>
          </div>
        </div>
        <div id="borders_container">
          <h3>Border color &amp; Material:</h3>
          <div id="borders" class="border">
            <div id="borders_scroll_container">
<?php
  // Two rows of colors, swatches assumed to be 20px by 20px with 3px of margin
  $row_one = ceil((count($border_colors) +1 /* offset the no-border selection */) / 2);
  $row_two = count($border_colors) - $row_one;
  $width = ($row_one * 20) + ($row_one * 3);
?>
              <div id="borders_scroll" class="clearfix" style="width:<?php echo $width; ?>px;">
                <a id="no_border" class="border_color" title="-" style="background:none;"></a>
<?php foreach($border_colors as $k => $v): ?>
                <a class="border_color" title="<?php echo $k; ?>" style="background:<?php echo $v; ?>"></a>
<?php endforeach; ?>
              </div>
            </div>
            <div id="materials_container">
              <table>
                <tr>
                  <td>Material:</td>
                  <td>
                    <select id="material">
<?php foreach($materials as $k => $v): ?>
                      <option value="<?php echo $k; ?>" data-weight="<?php echo $v['weight']; ?>" data-price="<?php echo $v['price']; ?>"><?php echo $k; ?></option>
<?php endforeach; ?>
                    </select>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div id="measurements_container">
          <h3>Measurements:</h3>
          <div id="measurements" class="border">
            <table>
              <tr>
                <td>Font Height:</td>
                <td>
                  <select id="height">
<?php foreach($pricing as $k => $v): ?>
                    <option value="<?php echo $k; ?>"><?php echo $k; ?>"</option>
<?php endforeach; ?>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Total Width:</td>
                <td id="total_width"></td>
              </tr>
              <tr>
                <td>Total Height:</td>
                <td id="total_height"></td>
              </tr>
              <tr>
                <td>Characters:</td>
                <td id="total_characters"></td>
              </tr>
            </table>
          </div> <!-- End measurements -->
        </div><!-- End measurements_container -->
      </div> <!-- End row_one -->
      <div id="row_two" class="clearfix">
        <div id="all_color_container">
          <h3>Font color &amp; background color:</h3>
          <div id="all_color" class="clearfix border">
            <div id="fontcolors">
<?php
  $i = 0;
  foreach($colors as $k => $v):
  $i++;
  if ($i == 1) :
?>
              <div class="color_row clearfix">
<?php endif; ?>
                <a class="color" title="<?php echo $k; ?>" style="background:<?php echo $v; ?>"></a>
<?php
  if ($i == 7) :
  $i = 0;
  echo <<<EOL
              </div>
EOL;
  echo PHP_EOL;
  endif;
  endforeach;
  if ($i !== 0) :
?>
              </div>
<?php endif; ?>
              <input type="checkbox" name="tranpsarent_background" id="transparent_background" /><label for="transparent_background">Transparent</label>
            </div> <!-- End fontcolors -->
            <div id="backgroundcolor">
              <div id="colorpicker"></div>
            </div>
          </div> <!-- End all_color -->
        </div> <!-- End all_color_container -->
        <div id="fonts_container" class="clearfix">
          <h3>Font:<span></span></h3>
          <select id="font_group_select" name="font_group">
<?php foreach($fonts as $group => $font): ?>
            <option value="<?php echo $group; ?>"><?php echo $group; ?></option>
<?php endforeach; ?>
          </select>
          <div id="fonts" class="border">
<?php foreach($fonts as $group => $font): ?>
            <div class="font_group" data-group="<?php echo $group; ?>">
<?php foreach($font as $key => $info): ?>
              <div id="<?php echo $info['short']; ?>" class="font_container" title="<?php echo $info['full']?>">
                <span><?php echo $info['fontface']; ?></span>
                <img src="./images/<?php echo $info['short']?>.png" alt="<?php echo $info['full']?>" />
              </div>
<?php endforeach; ?>
            </div>
<?php endforeach; ?>
          </div> <!-- End fonts -->
        </div> <!-- End fonts_container -->
        <div id="fontstyle_container">
          <h3>Alignment &amp; style:</h3>
          <div id="fontstyle" class="border">
            <div id="alignment">
              <table>
                <tr>
                  <td><img src="./images/align_left.png" width="27" height="27" alt="left" title="Left" /></td>
                  <td><img src="./images/align_center.png" width="27" height="27" alt="center" title="Center" /></td>
                  <td><img src="./images/align_right.png" width="27" height="27" alt="right" title="Right" /></td>
                </tr>
              </table>
            </div>
            <div id="format">
              <input type="checkbox" id="italic" /><label for="italic">Italic</label>
              <input type="checkbox" id="reverse" /><label for="reverse">Reverse</label>
            </div>
            <div id="letter_spacing">
              <p>Letter spacing: <span></span></p>
              <div id="slider"></div>
            </div>
          </div> <!-- End fontstyle -->
        </div> <!-- End fontstyle_container -->
      </div> <!-- End row_two -->
      <div id="display_container">
        <h3>Your Message:</h3>
        <div id="display" class="border"><span id="typed"></span></div>
      </div>
      <button id="submit_order">Purchase for <span>0.00</span></button>
    </div> <!-- End application -->
  </div> <!-- End main -->
</div> <!-- End wrap -->
<footer>
  <p>Font Previewer</p>
  <p>Michael Petruniak</p>
</footer>
<div id="order_details" title="Order Details">
  <p><span class="ui-icon ui-icon-info"></span><strong>Your order details:</strong></p>
  <table>
    <tr>
      <td>Font Height:</td>
      <td id="details_height"></td>
    </tr>
    <tr>
      <td>Total Width:</td>
      <td id="details_width"></td>
    </tr>
    <tr>
      <td>Total Height:</td>
      <td id="details_total_height"></td>
    </tr>
    <tr>
      <td>Characters:</td>
      <td id="details_characters"></td>
    </tr>
    <tr>
      <td>Font color:</td>
      <td id="details_color"></td>
    </tr>
    <tr>
      <td>Font:</td>
      <td id="details_font"></td>
    </tr>
    <tr>
      <td>Alignment:</td>
      <td id="details_alignment"></td>
    </tr>
    <tr>
      <td>Italic:</td>
      <td id="details_italic"></td>
    </tr>
    <tr>
      <td>Letter Spacing:</td>
      <td id="details_letter_spacing"></td>
    </tr>
    <tr>
      <td>Border Color:</td>
      <td id="details_border_color"></td>
    </tr>
    <tr>
      <td>Material:</td>
      <td id="details_material"></td>
    </tr>
    <tr>
      <td>Message:</td>
      <td id="details_message"></td>
    </tr>
    <tr>
      <td>Weight:</td>
      <td id="details_weight"></td>
    </tr>
    <tr>
      <td>Price:</td>
      <td id="details_price"></td>
    </tr>
  </table>
  <p id="order_notes">* Approximate measurements</p>
</div>
<form name="forder" method="post" action="https://www.paypal.com/cgi-bin/webscr" target="paypal">
<input type="hidden" name="on0" value="Message" />
<input type="hidden" name="os0" id="os0"  />
<input type="hidden" name="on1" value="Height" />
<input type="hidden" name="os1" id="os1"  />
<input type="hidden" name="on2" value="Width" />
<input type="hidden" name="os2" id="os2"  />
<input type="hidden" name="on3" value="Total Height" />
<input type="hidden" name="os3" id="os3"  />
<input type="hidden" name="on4" value="Characters" />
<input type="hidden" name="os4" id="os4"  />
<input type="hidden" name="on5" value="Color" />
<input type="hidden" name="os5" id="os5"  />
<input type="hidden" name="on6" value="Font" />
<input type="hidden" name="os6" id="os6"  />
<input type="hidden" name="on7" value="Alignment" />
<input type="hidden" name="os7" id="os7"  />
<input type="hidden" name="on8" value="Italic" />
<input type="hidden" name="os8" id="os8"  />
<input type="hidden" name="on9" value="Letter Spacing" />
<input type="hidden" name="os9" id="os9"  />
<input type="hidden" name="on10" value="Border Color" />
<input type="hidden" name="os10" id="os10"  />
<input type="hidden" name="on11" value="Material" />
<input type="hidden" name="os11" id="os11"  />
<input type="hidden" name="on12" value="Weight" />
<input type="hidden" name="os12" id="os12">
<input type="hidden" name="add" value="1" />
<input type="hidden" name="no_shipping" value="2" />
<input type="hidden" name="no_note" value="0" />
<input type="hidden" name="cmd" value="_cart" />
<input type="hidden" name="amount" id="amount"  />
<?php foreach($checkout as $k => $v): ?>
<input type="hidden" name="<?php echo $k;?>" value="<?php echo $v;?>" />
<?php endforeach; ?>
</form>
<script type="text/javascript" src="dist/font-previewer.js"></script>
</body>
</html>
