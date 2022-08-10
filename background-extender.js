/*  -------background extender--------
  /
  / this function need to "jQuery" add position "relative" to selected element
  /
  / default setting and usage

    property    |  default    |        options
    ---------------------------------------------------
    display     |   true      |       true/false
    ---------------------------------------------------
    position    |  'left'     |  'left'/'right'/'both'
    ---------------------------------------------------
    responsive  | is an array of objects

    ** responsive  is an array of objects that each have breakpoint and settings property,breakpoint is a number and
    settings are an object contain property that  set or change extender property in below breakpoint.
    note: set breakpoint from ----top to down----

    Example:

    $('SELECTOR').backgroundExtender({
        position: 'both',
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    position:'right',
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    display: false,
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    display: true,
                    position:'both',
                }
            },
            {
                breakpoint: 600,
                settings: {
                    display: false,
                }
            },
        ]
    });


   */


$.fn.backgroundExtender = function (setting = {display: true, position: 'left'}) {

    // if user pass empty setting object add default property to prevent error
    if (!setting.hasOwnProperty('display')) {
        setting.display = true;
    }
    if (!setting.hasOwnProperty('position')) {
        setting.position = 'left';
    }

    // save default setting that user pass to function
    const defaultSetting = JSON.parse(JSON.stringify(setting));

    function responsiveChecker() {
        if (setting.hasOwnProperty('responsive')) {
            let maxBreakPoint = 0;
            for (let responsiveItem of setting.responsive) {
                if (responsiveItem.breakpoint > maxBreakPoint) {
                    maxBreakPoint = responsiveItem.breakpoint;
                }
            }
            for (let responsiveItem of setting.responsive) {
                if ($(window).width() <= responsiveItem.breakpoint) {
                    for (let settingItem in responsiveItem.settings) {
                        setting[settingItem] = responsiveItem.settings[settingItem];
                    }
                } else if ($(window).width() > maxBreakPoint) {
                    setting = JSON.parse(JSON.stringify(defaultSetting));
                }
            }
        }
    }

    function elementAppender(parentElement, newDiv) {
        if (setting.display) {
            parentElement.append(newDiv);
        } else {
            $(newDiv).remove();
        }
    }

    function elementModifire(parentElement, newDiv) {
        let bodyWidth = $(window).width();
        let containerWidth = parentElement.closest('[class^="container"]').width();
        let elWidth = (bodyWidth - containerWidth) / 2;

        if (setting.position === 'both') {
            newDiv.style.cssText = `background:${parentElement.css('background')}; width:${bodyWidth}px; height:100%; position:absolute; top:0; left:${-parentElement.offset().left}px; z-index: -1;`;
        } else {
            newDiv.style.cssText = `background:${parentElement.css('background')}; width:${elWidth}px; height:100%; position:absolute; top:0; ${setting.position}:${-elWidth}px;`;
        }
    }


    $(this).each(function () {
        const el = document.createElement('div');
        const parent = $(this);
        if (parent.css('position') === 'static') {
            parent.css({position: 'relative'});
        }

        // make element for first time
        responsiveChecker();
        elementAppender(parent, el);
        elementModifire(parent, el);


        // change element style when window resize
        $(window).resize(function () {
            responsiveChecker();
            elementAppender(parent, el);
            elementModifire(parent, el);
        });
    });
};