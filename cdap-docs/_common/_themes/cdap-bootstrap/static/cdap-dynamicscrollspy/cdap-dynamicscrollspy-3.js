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
        // Define options
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
            // Use affix by default
            affix: true,
            // Offset for affix: use if an integer else calculate
            affixOffset: 0,
            // Lowest-level header to be included (H2)
            tH: 2,
            // Highest-level header to be included (H6)
            bH: 6,
            // jQuery filter
            exclude: false,
            // Generate random IDs?
            genIDs: false,
            // Offset for scrollspy
            offset: 100,
            // Add these class names to the top-most UL
            ulClassNames: '',
            // If testing, show heading tagName and ID
            testing: false,
            // Starting object to build the list from
            startingID: ''
        }, this.options, opts);

        var self = this;

        // Store used random numbers
        this.rands = [];

        // Encode any text in header title to HTML entities

        function encodeHTML(value) {
            return $('<div></div>').text(value).html();
        }

        // Removes any elemsToClear HTML entities in an element before encoding ('a', 'span')
        // <h2 id="firstH2"><a class="headerlink" href="#firstH2" title="Permalink">P</a>Lorem <span>Extra</span></h2>

        function decodeHTML(elem) {
            var elemHTML = elem.html();
            var elemsToClear = ['a', 'span'];
            for (var i = 0; i < elemsToClear.length; i++) {
                var a = '<' + elemsToClear[i];
                var b = '</' + elemsToClear[i] + '>';
                var posA = elemHTML.indexOf(a);
                var posB = elemHTML.indexOf(b);
                if (posA != -1 && posB != -1) {
                    elemHTML = elemHTML.substring(0, posA) + elemHTML.substring(posB + b.length);;
                }
            }
            return $('<div></div>').text($.trim(elemHTML)).html();
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
                        msg = "DynamicScrollSpy: Error! Duplicate id " + $(this).prop('id');
                        throw new Error(msg);
                    }
                }
            });
            if (missing > 0) {
                msg = "DynamicScrollSpy: Not all headers have ids and genIDs: false.";
                throw new Error(msg);
            }
            return missing;
        }

        // Testing - show IDs and tag types

        function showTesting() {
            console.log('showTesting');
            selectAllH().append(function() {
                // Let's see the tag names (for testing)
                return ' (' + $(this).prop('tagName') + ', ' + $(this).prop('id') + ')';
            });
        }

        // Builds the list

        function makeList() {
            var currentLevel = self.options.tH;
            var inList = false;
            var ul = '<ul class="nav dynamic-scrollspy ' + self.options.ulClassNames + '">';
            ul += '<li class="nav dynamic-scrollspy-heading scrollspy-active"><a href="#">Contents</a></li>';
            selectAllH().each(function() {
                var k = $(this).prop('id');
                var dstext = decodeHTML($(this));
                var lvl = Number($(this).prop('tagName').replace('H', ''));
                var li = '<li id="dsli' + k + '" class="dynamic-scrollspy-title"><a href="#' + k + '">' + dstext + '</a>';
                if (lvl < currentLevel) { // End current(s) and start new
                    ul += '</li></ul>'.repeat(currentLevel - lvl) + li;
                } else if (lvl === currentLevel) {
                    if (inList) {
                        ul += '</li>' + li;
                    } else {
                        ul += li;
                        inList = true;
                    }
                } else { // lvl > currentLevel ; should always go up in increments
                    ul += '<ul class="nav child dynamic-scrollspy-list" >' + li;
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
                    if (typeof self.options.affixOffset == 'number') {
                        self.children('ul').affix({
                            offset: {
                                top: self.options.affixOffset
                            }
                        });
                    } else {
                        self.children('ul').affix({
                            offset: {
                                top: function() {
                                    var c = ul.offset().top,
                                        d = parseInt(ul.children(0).css("margin-top"), 10),
                                        e = $(self).height();
                                    return this.top = c - d - e;
                                },
                                bottom: function() {
                                    var a = parseInt(ul.children(0).css("margin-bottom"), 10);
                                    return this.bottom = a;
                                    return this.bottom = $(self).outerHeight(!0);
                                }
                            }
                        });
                    }
                }

                // Find the last active item set by the scrollspy and set our tag on it
                self.on('activate.bs.scrollspy', function(){
                    var a = $('.nav li.dynamic-scrollspy-title.active');
                    if (a) {
                        var tag = 'scrollspy-active';
                        $('.' + tag).removeClass(tag);
                        a.last().addClass(tag);
                    }
                })

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
