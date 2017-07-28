/*
| -------------------------------------------------------------------
| ui.js
| Copyright 2013 Michael J Petruniak
| -------------------------------------------------------------------
| This script contains startup and functionality for widgets,
| event binding, and performs various calculations
|
| Do not not copy or distribute without my written consent.
| Do not use for commerical purposes.
|
*/

window.onload = function() {
  setTimeout(function() {
    new Image().src = './images/transparent-background.gif';
  }, 1000);
};

$(function () {

  // Test for compatibility
  if ((! Modernizr.fontface) || (! Modernizr.borderradius)) {
    $('#application').hide();
    $('#fallback').show();
    return false;
  }

  // Initialize the jQuery UI checkboxes and style them appropriately
  $('#italic').button();
  $('#reverse').button();
  $('#transparent_background').button();
  $('#format .ui-button-text:eq(0)').css('font-style', 'italic');

  // Initialize the jQuery Farbastic background-picker plugin
  var picker = $.farbtastic('#colorpicker');
  picker.linkTo(function callback (color) {
    $('#display').css('background', color);
    $('#transparent_background').removeAttr('checked');
    $('#transparent_background').button('refresh');
  }).setColor('#fdfdec');

  // Initialize the jQuery UI letter-spacing slider
  $('#slider').slider({
    min:0,
    max:5,
    step:0.25,
    slide:
      function (event, ui) {
        setLetterSpacing(ui.value);
        $('#letter_spacing p span').text(getLetterSpacing() + '"');
        $('#display').css('letter-spacing', inchesToPixels(getLetterSpacing()));
        calculateDimensions();
      }
  });

  // Initialize the jQuery UI dialog for order details
  $('#order_details').dialog({
    autoOpen:false,
    height:600,
    width:600,
    modal:true,
    draggable:false,
    resizable:false,
    buttons: {
      'Submit to PayPal':
        function() {
          $(this).dialog('close');
          $('#os0').val(messageForPayPal());
          $('#os1').val(getHeight() + '"');
          $('#os2').val(getWidth());
          $('#os3').val(getTotalHeight());
          $('#os4').val(getCharacters());
          $('#os5').val(getColor());
          $('#os6').val(getFont());
          $('#os7').val(getAlignment());
          $('#os8').val(getItalic());
          $('#os9').val(getLetterSpacing() + '"');
          $('#os10').val(getBorderColor());
          $('#os11').val(getMaterial());
          $('#os12').val(getWeight() + ' lbs');
          document.forder.submit();

        },
      Cancel:
        function() {
          $(this).dialog('close');
        }
    }
  });

  // Disable the PayPal button for demo purposes
  $(':button:contains(\'Submit to PayPal\')')
    .attr('disabled', 'disabled')
    .addClass('ui-state-disabled');

  // Initialize session variable closures
  initSessionVariables();

  // Each time text is changed in the typing area- update the appropriate session variables, display the updated message in the
  // display area, recalcuate the dimensions of the message box (and handle line breaks), and recalculate the dimensions
  // of the message box
  $('#text').keyup(
    function () {
      setMessage(((getReverse() == 'Yes') ? reverseText($(this).val()) : $(this).val()));
      setHTMLMessage(getMessage().replace(new RegExp('\\n', 'g'), '<br>'));
      $('#typed').html(getHTMLMessage());
      updateCharacterCount();
      calculateDimensions();
    }
  );

  // Each time a border color is clicked- update the appropriate session variable and apply it to the display area
  $('#borders .border_color').click(
    function () {
      setBorderColor($(this).attr('title'));

      // IE9 does not support the text-shadow property
      var ie = /*@cc_on!@*/false;
      if (ie) {
        var style = [
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=-1, OffY=-1, Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=-1, OffY=1, Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=-1, OffY=0, Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=1, OffY=-1, Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=1, OffY=1, Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=1, OffY=0, Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=0, OffY=-1,Color=' + rgbToHex($(this).css('background-color')) + ')',
          'progid:DXImageTransform.Microsoft.dropshadow(OffX=0, OffY=1, Color=' + rgbToHex($(this).css('background-color')) + ')'
        ].join("\n");
        document.getElementById('typed').style.filter = style;
      }
      else {
        $('#typed').css(
          'text-shadow',
            '1px 1px 0 ' + $(this).css('background-color') + ', ' +
            '-1px -1px 0 ' + $(this).css('background-color') + ', ' +
            '1px -1px 0 ' + $(this).css('background-color') + ', ' +
            '-1px 1px 0 ' + $(this).css('background-color'));

      }

      $('#borders .border_color')
        .removeClass('active_color')
        .addClass('inactive_color');
      $(this)
        .removeClass('inactive_color')
        .addClass('active_color');
    }
  );

  // When the material changes- the price changes
  $('#material').change(function () {
    setMaterial($(this).val());
    setMaterialPrice($('option:selected', this).data('price'));
    setWeightValue($('option:selected', this).data('weight'));
    calculatePrice();
  });

  // Each time a new height is selected- update the appropriate session variable and recalcuate the dimensions of the banner box
  $('#height').change(
    function () {
      setHeight($(this).val());
      setHeightPrice($('option:selected', this).attr('class'));
      calculateDimensions();
    }
  );

  // Each time a font color is clicked- update the appropriate session variable and apply it to the display area
  $('#fontcolors .color').click(
    function () {
      setColor($(this).attr('title'));
      $('#typed').css('color', $(this).css('background-color'));
      $('#fontcolors .color')
        .removeClass('active_color')
        .addClass('inactive_color');
      $(this)
        .removeClass('inactive_color')
        .addClass('active_color');
    }
  );

  // When the transparent background checkbox is checked- add a transparent background pattern to #display and ensure the background
  // selector is unusable in this state
  $('#transparent_background').change(function () {
    if ($(this).is(':checked')) {
      $('#display').css('background', 'url(./images/transparent-background.gif)')
    }
    else {
      picker.setColor('#fdfdec');
      $('#display').css('background', '#fdfdec');
    }
  })

  // When a new group is selected from the drop down menu- the fonts associated with that group will appear in the selectable area
  $('#font_group_select').change(function () {
    $val = $(this).val();
    $('.font_group:visible').fadeOut(200, function () {
      $('.font_group[data-group="' + $val + '"]').fadeIn(200);
    });
  });

  // Each time a new font is selected- update the appropriate session variables, display the new font in the display area, recalcuate
  // the dimensions of the message box, remove the active background, and apply the active background to the clicked font
  $('#fonts .font_container').click(
    function () {
      setFont($(this).attr('title'));
      setFontCode($('#font_group_select').val() + '/' + $(this).attr('id'));
      setFontFace($('span', this).text());
      changeFont();
      $('#fonts .font_container')
        .removeClass('active_font')
        .addClass('inactive_font');
      $(this)
        .removeClass('inactive_font')
        .addClass('active_font');
      $('#fonts_container h3 span').text(getFont());
    }
  );

  // When an alignment image is clicked- update the appropriate session variable, align the text in the display area, remove the active
  // background, and apply the active background to the clicked alignment
  $('#alignment img').click(
    function () {
      setAlignment($(this).attr('title'));
      alignText();
      $('#alignment img')
        .removeClass('active_alignment')
        .addClass('inactive_alignment');
      $(this)
        .removeClass('inactive_alignment')
        .addClass('active_alignment');
    }
  );

  // When the italic checkbox is clicked- toggle/italicize the message inputted
  $('#italic').change(italicizeText);

  // When the reverse checkbox is clicked- update the appropriate session variables and toggle/reverse the message inputted
  $('#reverse').change(
    function () {
      setReverse(((getReverse() == 'Yes') ? '-' : 'Yes'));
      setMessage(reverseText(getMessage()));
      setHTMLMessage(getMessage().replace(new RegExp('\\n', 'g'), '<br>'));
      $('#typed').fadeOut(200,
        function () {
          $(this)
            .html(getHTMLMessage())
            .fadeIn(200);
        }
      );
    }
  );

  // When the submit order button is clicked- populate the order details and pop open up a dialog with all of the user's selections
  $('#submit_order').click(
    function () {
      $('#details_height').text(getHeight() + '"');
      $('#details_width').text(getWidth() + ' *');
      $('#details_total_height').text(getTotalHeight() + ' *');
      $('#details_characters').text(getCharacters());
      $('#details_color').text(getColor());
      $('#details_font').text(getFont());
      $('#details_alignment').text(getAlignment());
      $('#details_italic').text(getItalic());
      $('#details_letter_spacing').text(getLetterSpacing() + '" *');
      $('#details_border_color').text(getBorderColor());
      $('#details_material').text(getMaterial());
      $('#details_message').text(messageForPayPal());
      $('#details_price').text('$' + getPrice());
      $('#details_weight').text(getWeight() + ' lbs *');
      $('#order_details').dialog('open');
    }
  );

  // Initialize font message, font-group, font, height, color, alignment, letter-spacing, and style
  setMessage('Type your message here');
  setHTMLMessage('Type your message here');
  $('#text').val(getMessage());
  $('#typed').html(getMessage());
  updateCharacterCount();
  $('#font_group_select option:eq(0)').attr('selected', true);
  $('#fonts .font_container:eq(0)').click();
  $('#height option:eq(2)').attr('selected', 'selected');
  setHeight($('#height option:eq(2)').val());
  setHeightPrice($('#height option:eq(2):selected').attr('class'));
  $('#fontcolors .color:eq(0)').click();
  $('#alignment img:eq(1)').click();
  setItalic('-');
  setReverse('-');
  setLetterSpacing($('#slider').slider('value'));
  $('#letter_spacing p span').text(getLetterSpacing() + '"');
  setBorderColor('-');
  $('#material option:eq(0)').attr('selected', 'selected');
  setMaterial($('#material option:eq(0)').val());
  setMaterialPrice($('#material option:eq(0):selected').data('price'));
  setWeightValue($('#material option:eq(0):selected').data('weight'));

  // Focus on message area
  $('#text').focus();
}); // End document.ready();

/**
 * This function will recalculate and update the height and width of the message box and update the appropriate session variables
 *
 * @return void
 */
function calculateDimensions () {
  var last_request;
   if (last_request) {
      last_request.abort();
      last_request = null;
   }
  last_request = $.ajax({
    url:'scripts/calculator.php',
    type:'post',
    dataType:'json',
    data:{
      'height':getHeight(),
      'font':getFontCode(),
      'spacing':getLetterSpacing(),
      'text':getMessage()
    },
    beforeSend:
      function () {
        $('#total_width, #total_height').html('<span>Calculating ...</span>');
        $('#submit_order span').html(' ...');
        $('#submit_order').attr('disabled', 'disabled');
      },
    success:
      function (response) {
        setWidthInches(response.width);
        setWidth(inchesToFeet(response.width));
        setTotalHeightInches(response.height);
        setTotalHeight(inchesToFeet(response.height));

        $('#total_width').fadeOut(200,
          function () {

            $(this)
              .html(getWidth())
              .fadeIn(200);
          }
        );
        $('#total_height').fadeOut(200,
          function () {

            $(this)
              .html(getTotalHeight())
              .fadeIn(200);
          }
        );
      },
    error:
      function (response) {
        $('#total_width, #total_height').html('<span>Error</span>');
      },
    complete:
      function () {
        calculatePrice();
      }
  });
}

/**
 * This function will convert an RGB-formatted color to a Hexadecimal-formatted color
 *
 * @param string
 * @return string
 */
function rgbToHex (rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

/**
 * This function will convert the lookups specified above to their respective Hexadecimal value
 *
 * @param number
 * @return string
 */
function hex (l) {
  var hexDigits = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
  return isNaN(l) ? '00' : hexDigits[(l - l % 16) / 16] + hexDigits[l % 16];
}

/**
 * This function will convert inches to pixels.
 *
 * @TODO Calculate and visually adjust the default message height variable (in pixels) based on the height drop down selection
 * @param number
 * @return string
 */
function inchesToPixels (i) {
  var default_message_height = 36; // Magic number- function optimized for this value
  var default_inch = 3; // Magic number- function optimized for this value
  return ((i * default_message_height) / default_inch) + 'px';
}

/**
 * This function will convert inches to feet
 *
 * @param number
 * @return number
 */
function inchesToFeet (i) {
  return ((i >= 12) ? parseInt(i / 12) + '\' ' : '') + ((i == 12) ? '' : Math.ceil((i % 12)) + '"');
}

/**
 * This function will convert ounces to pounds
 *
 * @param number
 * @return number
 */
function ouncesToPounds (o) {
  return Math.round(o * Math.pow(10, 2)) / Math.pow(10, 2);
}

/**
 * This function will update and display the amount of characters inputted and update the appropriate session variable
 *
 * @return void
 */
function updateCharacterCount () {
  setCharacters(getMessage().replace(new RegExp('\\s', 'g'), '').length);
  $('#total_characters')
    .hide()
    .html(getCharacters())
    .fadeIn(200);
}

/**
 * This function will calculate the price of the message inputted based on the number of characters and the height of the font
 * and update the appropriate session variable.  It will also calculate weight and shipping price (temporary).
 *
 * @TODO Replace or remove the static pricing
 * @return void
 */
function calculatePrice () {
  var price = (getWidthInches() * getTotalHeightInches()) * getMaterialPrice(),
    weight = ((getWidthInches() / 12) * (getTotalHeightInches() / 12)) * getWeightValue();
  setPrice(price.toFixed(2));
  setWeight(weight.toFixed(2));
  $('#submit_order span').html('$' + getPrice());
  $('#amount').val(getPrice());
  $('#submit_order').removeAttr('disabled');

  if (price <= 5) {
    $('input[name="shipping"]').val('2');
  }
  else if (price > 5 && price <= 10) {
    $('input[name="shipping"]').val('4');
  }
  else if (price > 10 && price <= 20) {
    $('input[name="shipping"]').val('6');
  }
  else if (price > 20 && price <= 40) {
    $('input[name="shipping"]').val('8');
  }
  else if (price > 40) {
    $('input[name="shipping"]').val('10');
  }
}

/**
 * This function will change the font visible in the display area
 *
 * @return void
 */
function changeFont () {
  $('#typed').fadeOut(200,
    function () {
      $(this)
        .css('font-family', '\'' + getFontFace() + '\'')
        .fadeIn(200);
      calculateDimensions();
    }
  );
}

/**
 * This function will left-justify, center-justify, or right-justify the message inputted
 *
 * @return void
 */
function alignText () {
  $('#typed').fadeOut(200,
    function () {
      $('#display').css('text-align', getAlignment());
      $(this).fadeIn(200);
    }
  );
}

/**
 * This function will italicize/unitalicize the message inputted and update the appropriate session variable
 *
 * @return void
 */
function italicizeText () {
  setItalic(((getItalic() == 'Yes') ? '-' : 'Yes'));
  $('#typed').fadeOut(200,
    function () {
      $(this)
        .css('font-style', ((getItalic() == 'Yes') ? 'italic' : 'normal'))
        .fadeIn(200);
    }
  );
}

/**
 * This function will reverse and return the message inputted
 *
 * @param string
 * @return string
 */
function reverseText (m) {
  var text = m.split('\n');
  var reversed_text = '';
  for (i=0; i<text.length; i++) {
     var line = text[i]
     reversed_text += line.split('').reverse().join('');
     reversed_text += (i == (text.length -1)) ? '' : '\n';
  }
  return reversed_text;
}

/**
 * This function will prepare a message (indicating new lines) for the pre-checkout modal window and PayPal form
 *
 * @return string
 */
function messageForPayPal () {
  var text = getMessage().split('\n');
  var new_text = '';
  for (i=0; i<text.length; i++) {
     new_text += '<line ' + (i +1) + ':>' + text[i];
  }
  return new_text;
}

/**
 * This function in responsible for initializing encapsulating closures that allow for easy access and mutation of session variables
 * (pre-checkout modal window and PayPal form)
 *
 * @return void
 */
function initSessionVariables () {
  var border_color, material, material_price, height, height_price, width_inches, width, total_height_inches, total_height, characters, color, font, font_code, font_face, alignment, italic, reverse, letter_spacing, message, html_message, weight_value, weight, price;

  setBorderColor = function (new_border_color) {
    border_color = new_border_color;
  }
  getBorderColor = function () {
    return border_color;
  }
  setMaterial = function (new_material) {
    material = new_material;
  }
  getMaterial = function () {
    return material;
  }
  setMaterialPrice = function (new_material_price) {
    material_price = new_material_price;
  }
  getMaterialPrice = function () {
    return material_price;
  }
  setHeight = function (new_height) {
    height = new_height;
  }
  getHeight = function () {
    return height;
  }
  setHeightPrice = function (new_height_price) {
    height_price = new_height_price;
  }
  getHeightPrice = function () {
    return height_price;
  }
  setWidthInches = function (new_width_inches) {
    width_inches = new_width_inches;
  }
  getWidthInches = function () {
    return width_inches;
  }
  setWidth = function (new_width) {
    width = new_width;
  }
  getWidth = function () {
    return width;
  }
  setTotalHeightInches = function (new_total_height_inches) {
    total_height_inches = new_total_height_inches;
  }
  getTotalHeightInches = function () {
    return total_height_inches;
  }
  setTotalHeight = function (new_total_height) {
    total_height = new_total_height;
  }
  getTotalHeight = function () {
    return total_height;
  }
  setCharacters = function (new_characters) {
    characters = new_characters;
  }
  getCharacters = function () {
    return characters;
  }
  setColor = function (new_color) {
    color = new_color;
  }
  getColor = function () {
    return color;
  }
  setFont = function (new_font) {
    font = new_font;
  }
  getFont = function () {
    return font;
  }
  setFontCode = function (new_font_code) {
    font_code = new_font_code;
  }
  getFontCode = function () {
    return font_code;
  }
  setFontFace = function (new_font_face) {
    font_face = new_font_face;
  }
  getFontFace = function () {
    return font_face;
  }
  setAlignment = function (new_alignment) {
    alignment = new_alignment;
  }
  getAlignment = function () {
    return alignment;
  }
  setItalic = function (new_italic) {
    italic = new_italic;
  }
  getItalic = function () {
    return italic;
  }
  setReverse = function (new_reverse) {
    reverse = new_reverse;
  }
  getReverse = function () {
    return reverse;
  }
  setLetterSpacing = function (new_letter_spacing) {
    letter_spacing = new_letter_spacing;
  }
  getLetterSpacing = function () {
    return letter_spacing;
  }
  setMessage = function (new_message) {
    message = new_message;
  }
  getMessage = function () {
    return message;
  }
  setHTMLMessage = function (new_html_message) {
    html_message = new_html_message;
  }
  getHTMLMessage = function () {
    return html_message;
  }
  setWeightValue = function (new_weight_value) {
    weight_value = new_weight_value;
  }
  getWeightValue = function () {
    return weight_value;
  }
  setWeight = function (new_weight) {
    weight = new_weight;
  }
  getWeight = function() {
    return weight;
  }
  setPrice = function (new_price) {
    price = new_price;
  }
  getPrice = function () {
    return price;
  }
}
