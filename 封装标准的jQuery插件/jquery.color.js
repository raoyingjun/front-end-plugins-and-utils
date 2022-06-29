; (function ($) {

    $.fn.color = function (options) {

        options = $.extend({
            bColor: 'white',
            fColor: 'black'
        }, options)

        return this.each(function () {

            $(this).css({
                backgroundColor: options.bColor,
                color: options.fColor
            })

        })

    }

})(jQuery)