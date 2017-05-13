/**
*  CDAP DynamicScrollSpy
*  ---------------------
*
*  Based on AutoScrollspy v 0.1.0
*  https://github.com/psalmody/dynamic-scrollspy
*
*  Revised by Cask Data, Inc.
*
*/
(function($) {

  $.fn.DynamicScrollSpy = function(opts) {
    // Define optionss
    opts = (typeof(opts) == 'undefined') ? {} : opts;
    this.isinit = (typeof(this.isinit) == 'undefined') ? false : self.isinit;

    // Destroy scrollspy option
    if (opts == 'destroy') {
      this.isinit = false;
      this.empty();
      this.off('activate.bs.scrollspy');
      $('body').removeAttr('data-spy');
      return this;
    }

    // Extend options priorities: passed, existing, defaults
    this.options = $.extend({}, {
      affix: true, // use affix by default
      tH: 2, // lowest-level header to be included (H2)
      bH: 6, // highest-level header to be included (H6)
      exclude: false, // jquery filter
      genIDs: false, // generate random IDs?
      offset: 100, // offset for scrollspy
      ulClassNames: 'hidden-print', // add this class to top-most UL
      activeClass: '', // active class (besides .active) to add
      testing: false, // if testing, show heading tagName and ID
      startingID: '' // starting object to build the list from
    }, this.options, opts);

    var self = this;

    // Store used random numbers
    this.rands = [];

    // Encode any text in header title to HTML entities
    function encodeHTML(value) {
      return $('<div></div>').text(value).html();
    }

    // Removes any leading HTML entities in an element before encoding
    function decodeHTML(elem) {
      var elemHTML = elem.html();
      var pos = elemHTML.indexOf('</a>');
      if (pos != -1) {
        return $('<div></div>').text(elemHTML.substring(pos + 4)).html();
      } else {
        return $('<div></div>').text(elem.text()).html();
      }
    }

    // Returns jQuery object of all headers between tH and bH, optionally starting at startingID
    function selectAllH() {
      var st = [];
      for (var i = self.options.tH; i <= self.options.bH; i++) {
        st.push('H' + i);
      }
      if (self.options.startingID === '') {
        return $(st.join(',')).not(self.options.exclude);
      } else {
        return $(self.options.startingID).find(st.join(',')).not(self.options.exclude);
      }
    }

    // Generate random numbers; save and check saved to keep them unique
    function randID() {
      var r;
      function rand() {
        r = Math.floor(Math.random() * (1000 - 100)) + 100;
      }
      // Get first random number
      rand();
      while (self.rands.indexOf(r) >= 0) {
        // when that random is found, try again until it isn't
        rand();
      }
      // Save random for later
      self.rands.push(r);
      return r;
    }

    // Generate random IDs for elements if requested
    function genIDs() {
      selectAllH().prop('id', function() {
        // If no id prop for this header, return a random id
        return ($(this).prop('id') === '') ? $(this).prop('tagName') + (randID()) : $(this).prop('id');
      });
    }

    // Check that all have id attribute
    function checkIDs() {
      var missing = 0;
      var msg = '';
      // Check they exist first
      selectAllH().each(function() {
        if ($(this).prop('id') === '') {
          missing++;
        } else {
          if ($('[id="' + $(this).prop('id') + '"]').length > 1) {
            msg = "DynamicScrollspy: Error! Duplicate id " + $(this).prop('id');
            throw new Error(msg);
          }
        }
      });
      if (missing > 0) {
        msg = "DynamicScrollspy: Not all headers have ids and genIDs: false.";
        throw new Error(msg);
      }
      return missing;
    }

    // Testing - show IDs and tag types
    function showTesting() {
      console.log('showTesting');
      selectAllH().append(function() {
        // let's see the tag names (for testing)
        return ' (' + $(this).prop('tagName') + ', ' + $(this).prop('id') + ')';
      });
    }

    // Builds the list
    function makeList() {
      var currentLevel = self.options.tH;
      var inList = false;
      var ul = '<ul class="nav ' + self.options.ulClassNames + '">';
      selectAllH().each(function() {
        var k = $(this).prop('id');
        var dstext = decodeHTML($(this));
        var lvl = Number($(this).prop('tagName').replace('H', ''));
        if (lvl < currentLevel) { // end current start new
          ul += '</li></ul><li id="dsli' + k + '"><a href="#' + k + '">' + dstext + '</a>';
        } else if (lvl === currentLevel) {
          if (inList) {
            ul += '</li><li id="dsli' + k + '"><a href="#' + k + '">' + dstext + '</a>';
          } else {
            ul += '<li id="dsli' + k + '"><a href="#' + k + '">' + dstext + '</a>';
            inList = true;
          }
        } else { // lvl > currentLevel
          ul += '<ul class="nav child"><li id="dsli' + k + '"><a href="#' + k + '">' + dstext + '</a>';
        }
        currentLevel = lvl;
      });
      ul += '</li></ul>';
      self.append($(ul));
    }

    // Initialize plugin
    function init() {
      // First time (or after destroy)
      if (self.isinit === false) {
        // Generate IDs
        if (self.options.genIDs) {
          genIDs();
        } else {
          checkIDs();
        }
        // Show if testing
        if (self.options.testing) showTesting();

        makeList();

        if (self.options.affix) {
          var ul = self.children('ul');
          self.children('ul').affix({
            offset: {
              top: function() {
                var c = ul.offset().top,
                  d = parseInt(ul.children(0).css("margin-top"), 10),
                  e = $(self).height();
                return this.top = c - e - d;
              },
              bottom: function() {
                return this.bottom = $(self).outerHeight(!0);
              }
            }
          });
        }

        $('body').attr('data-spy', 'true').scrollspy({
          target: '#' + self.prop('id'),
          offset: self.options.offset
        });

        self.isinit = true;
      } else {
        makeList();
        $('[data-spy="scroll"]').each(function() {
          $(this).scrollspy('refresh');
        });
      }
      return self;
    }
    return init();
  };
}(window.$jqTheme || window.jQuery));
