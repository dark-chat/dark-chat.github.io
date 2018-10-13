// flowtype
// !function(a){a.fn.flowtype=function(b){var c=a.extend({maximum:9999,minimum:1,maxFont:9999,minFont:1,fontRatio:35},b),d=function(b){var d=a(b),e=d.width(),f=e>c.maximum?c.maximum:e<c.minimum?c.minimum:e,g=f/c.fontRatio,h=g>c.maxFont?c.maxFont:g<c.minFont?c.minFont:g;d.css("font-size",h+"px")};return this.each(function(){var b=this;a(window).resize(function(){d(b)}),d(this)})}}(jQuery),$("body").flowtype({minimum:360,maximum:900,minFont:20,maxFont:40,fontRatio:25});
(function($) {
    $.fn.flowtype = function(options) {

// Establish default settings/variables
// ====================================
        var settings = $.extend({
                maximum   : 9999,
                minimum   : 1,
                maxFont   : 9999,
                minFont   : 1,
                fontRatio : 35
            }, options),

// Do the magic math
// =================
            changes = function(el) {
                var $el = $(el),
                    elw = $el.width(),
                    width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw,
                    fontBase = width / settings.fontRatio,
                    fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
                $el.css('font-size', fontSize + 'px');
            };

// Make the magic visible
// ======================
        return this.each(function() {
            // Context for resize callback
            var that = this;
            // Make changes upon resize
            $(window).resize(function(){changes(that);});
            // Set changes on load
            changes(this);
        });
    };
}(jQuery));

$("body").flowtype({minimum:360,maximum:900,minFont:20,maxFont:40,fontRatio:25});

$('body,html').css('opacity','1');