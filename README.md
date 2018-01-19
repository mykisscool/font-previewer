## Introduction

I developed this application way back in 2011 for users to create custom banners and wall decorations using a wide-array of fonts, font colors, background colors, etc. These users; presumably, had the hardware to produce these designs.

![User interface](/images/screen-1.png?raw=true "Screenshot")

When a user completes a design, the pertinent information is passed to PayPal by clicking the [payments button](https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/formbasics/).

![Submit to PayPal](/images/screen-2.png?raw=true "Screenshot")

There's plenty of room for improvement in terms of configuration, patterns, automation, testing, and overall refactoring.  I did the best I could committing this project in it's original condition; save for adding dependency management and adjusting some formatting.

With that being said- this project is dead.  I am no longer maintaining this repo.  I have since moved onto other things.

## Installation and Requirements

You need:

+ PHP5.3+?
+ [ImageMagick](https://www.imagemagick.org/script/index.php) for PHP

To get started:

> `git clone https://github.com/mykisscool/font-previewer`

> `composer install`

> `npm install`

### Adding fonts and configurations

I recall finding and downloading fonts from [Font Squirrel](https://www.fontsquirrel.com/) because they were free.  I also the recall the [licensing](https://www.fontsquirrel.com/faq#number_one_question) for fonts can be tricky.

Once you've downloaded them- place them in the ```./scripts/dump-fonts/``` directory and visit this script in your web browser:
> `https://[your website]/scripts/create.images.php`.

This will create sample images using the fonts from the ```dump-fonts``` directory and then move them to the `./images/` directory.

You'll also need to create the web fonts.  Generate them here at [Font Squirrel's Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator) using your `.ttf` files.  Place the newly generated `.eot`, `.svg`, `.ttf`, and `.css` files into the `./fonts/[custom category]` directory.

Lastly, I added configurations for the following options in ```./scripts/config.php```.

+ font size prices
+ materials
+ font colors and border colors
+ PayPal merchant information

Enjoy!
