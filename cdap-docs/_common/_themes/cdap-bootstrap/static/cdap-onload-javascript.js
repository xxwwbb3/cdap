(function ($) {
    // Determines if an element has scrolled into view
    function elementScrolled(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
    }

    // Disables the sidebar scrollbar on small screens
    function sidebar_scrollbar_adjust() {
        // Bootstrap break points
        if (window.matchMedia("(min-width: 992px)").matches) {
            $('#sidebar').mCustomScrollbar("update");
        } else {
            $('#sidebar').mCustomScrollbar("disable",true);
        }
    }

    // Adjustments for the sidebar scrollbar
    function elem_adjust() {
        var s_position = 'relative';
        var s_width = '100%';
        var s_margin_left = 'inherit';
        // Bootstrap break point
        if (window.matchMedia("(min-width: 992px)").matches) {
          s_position = 'fixed';
          s_margin_left = '-16px';
          s_width = parseInt($('div.main-container.container > .row').width() * 0.1666666667) + 'px';
        }
        $('#sidebar').css('margin-left', s_margin_left).css('width', s_width).css('position', s_position);
    }

    $(window).on('load scroll resize', function() {
        var winH = $(window).height();
        var winST = $(window).scrollTop();
        var footerOH = $('footer.footer').outerHeight(true);
        var maxSidebar = winH - $('#sidebar').offset().top + winST;
        if (elementScrolled('footer.footer')) {
            maxSidebar -= footerOH;
        } else {
            maxSidebar -= 20;
        }
        $('#sidebar').outerHeight(maxSidebar);
        sidebar_scrollbar_adjust();
        elem_adjust();
    });

    $('#sidebar').affix({
        offset: {
            top: 0
        }
    });

    $('#localtoc-scrollspy').DynamicScrollSpy({
      genIDs: true,
      startingID: '#main-content',
      testing: false,
      ulClassNames: 'hidden-print page-nav',
      offset: 140
    });

    $('.scrollable-x').mCustomScrollbar({
      axis: 'x',
      scrollInertia: 0,
      theme: 'minimal-dark',
      callbacks:{
          onUpdate:function(){
            $(this).mCustomScrollbar('scrollTo','top');
          }
      }
    });

    $('.scrollable-y').mCustomScrollbar({
      axis: 'y',
      scrollInertia: 0,
      theme: 'minimal-dark',
      callbacks:{
          onUpdate:function(){
            $(this).mCustomScrollbar('scrollTo','top');
          }
      }
    });

    $('pre').mCustomScrollbar({
      axis: 'x',
      scrollInertia: 0,
      theme: 'minimal-dark',
      callbacks:{
          onUpdate:function(){
            $(this).mCustomScrollbar('scrollTo','left');
          }
      }
    });

}(window.$jqTheme || window.jQuery));
