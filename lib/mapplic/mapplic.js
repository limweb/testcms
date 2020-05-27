/*
 * Mapplic - Custom Interactive Map Plugin by @sekler
 * Version 3.1
 * http://www.mapplic.com
 */

var self = {}

// Tooltip
class Tooltip {

    constructor(mapName) {
        this.el = null;
        this.shift = 6;
        this.drop = 0;
        this.location = null;
        this.mapName = mapName
    }

    init() {
        const tempMapName = this.mapName
        var s = this;

        // Construct
        this.el = $('<div></div>').addClass('mapplic-tooltip');
        this.close = $('<a></a>').addClass('mapplic-tooltip-close').attr('href', '#').appendTo(this.el);
        this.close.on('click touchend', function (e) {
            e.preventDefault();
            $('.mapplic-active', self[tempMapName].el).attr('class', 'mapplic-clickable');
            if (self[tempMapName].deeplinking) self[tempMapName].deeplinking.clear();
            if (!self[tempMapName].o.zoom) self[tempMapName].zoomTo(0.5, 0.5, 1, 600, 'easeInOutCubic');
            s.hide();
        })
        this.image = $('<img>').addClass('mapplic-tooltip-image').hide().appendTo(this.el);
        this.title = $('<h4></h4>').addClass('mapplic-tooltip-title').appendTo(this.el);
        this.content = $('<div></div>').addClass('mapplic-tooltip-content').appendTo(this.el);
        this.desc = $('<div></div>').addClass('mapplic-tooltip-description').appendTo(this.content);
        this.link = $('<a>More</a>').addClass('mapplic-tooltip-link').attr('href', '#').hide().appendTo(this.el);
        this.triangle = $('<div></div>').addClass('mapplic-tooltip-triangle').prependTo(this.el);

        // Append
        self[this.mapName].map.append(this.el);
    }

    set(location) {
        if (location) {
            var s = this;

            if (location.image) this.image.attr('src', location.image).show();
            else this.image.hide();

            if (location.link) this.link.attr('href', location.link).show();
            else this.link.hide();

            this.title.text(location.title);
            this.desc.html(location.description);
            if (location.thumbnail) {
                const logo = $('<img>').addClass('mapplic-list-thumbnail')
                logo.attr('src', location.thumbnail);
                logo.prependTo(this.title);
            }else{
                const logo = $('<img>').addClass('mapplic-list-thumbnail')
                logo.attr('src', self[this.mapName].o.defaultSidebarLogo);
                logo.prependTo(this.title);
            }

            this.content[0].scrollTop = 0;

            this.position(location);
        }
    }

    show(location) {
        if (location) {
            if (location.action == 'none') {
                this.el.stop().fadeOut(300);
                return;
            }

            var s = this;

            this.location = location;
            if (self[this.mapName].hovertip) {
                self[this.mapName].hovertip.hide();
            }

            if (location.image) this.image.attr('src', location.image).show();
            else this.image.hide();

            if (location.link) this.link.attr('href', location.link).show();
            else this.link.hide();

            this.title.text(location.title);
            this.desc.html(location.description);
            if (location.thumbnail) {
                const logo = $('<img>').addClass('mapplic-list-thumbnail')
                logo.attr('src', location.thumbnail);
                logo.prependTo(this.title);
            }else{
                const logo = $('<img>').addClass('mapplic-list-thumbnail')
                logo.attr('src', self[this.mapName].o.defaultSidebarLogo);
                logo.prependTo(this.title);
            }

            // Shift
            var pinselect = $('.mapplic-pin[data-location="' + location.id + '"]');
            if (pinselect.length == 0) {
                this.shift = 20;
            }
            else this.shift = pinselect.height() + 10;

            // Loading & positioning
            $('img', this.el).on('load', function () {
                s.position();
            });
            this.position();

            // Making it visible
            this.el.stop().show();
        }
    }

    position() {
        if (this.location) {
            var cx = self[this.mapName].map.offset().left + self[this.mapName].map.width() * this.location.x - self[this.mapName].container.offset().left,
                cy = self[this.mapName].map.offset().top + self[this.mapName].map.height() * this.location.y - self[this.mapName].container.offset().top;

            var x = this.location.x * 100,
                y = this.location.y * 100,
                mt = -this.el.outerHeight() - this.shift,
                ml = -this.el.outerWidth() / 2;

            if (self[this.mapName].o.smartip) {
                var verticalPos = 0.5;

                // Top check
                if (Math.abs(mt) > cy) {
                    mt = 8 + 2;
                    this.el.addClass('mapplic-bottom');
                }
                else this.el.removeClass('mapplic-bottom');

                // Left-right check
                if (this.el.outerWidth() / 2 > cx)
                    verticalPos = 0.5 - (this.el.outerWidth() / 2 - cx) / this.el.outerWidth();
                else if ((self[this.mapName].container.width() - cx - this.el.outerWidth() / 2) < 0)
                    verticalPos = 0.5 + (cx + this.el.outerWidth() / 2 - self[this.mapName].container.width()) / this.el.outerWidth();

                verticalPos = Math.max(0, Math.min(1, verticalPos));
                ml = -this.el.outerWidth() * verticalPos;
                this.triangle.css('left', Math.max(5, Math.min(95, verticalPos * 100)) + '%');
            }

            this.el.css({
                left: x + '%',
                top: y + '%',
                marginTop: mt,
                marginLeft: ml
            });
            this.drop = /*this.el.outerHeight()*/ 240 + this.shift;
        }
    }

    hide() {
        var s = this;

        this.location = null;

        this.el.stop().fadeOut(300, function () {
            s.desc.empty();
        });
    }
}

// HoverTooltip
class HoverTooltip {

    constructor(mapName) {
        this.el = null;
        this.shift = 6;
        this.mapName = mapName
    }

    init() {
        var s = this;
        const mapName = this.mapName

        // Construct
        this.el = $('<div></div>').addClass('mapplic-tooltip mapplic-hovertip');
        this.title = $('<h4></h4>').addClass('mapplic-tooltip-title').appendTo(this.el);
        this.triangle = $('<div></div>').addClass('mapplic-tooltip-triangle').appendTo(this.el);

        // Events 
        // pins + old svg

        $(self[this.mapName].map).on('mouseover', '.mapplic-layer a', function () {
            var id = '';
            if ($(this).hasClass('mapplic-pin')) {
                id = $(this).data('location');
                s.shift = $(this).height() + 10;
            }
            else {
                id = $(this).attr('xlink:href').slice(1);
                s.shift = 20;
            }

            var location = self[mapName].getLocationData(id);
            if (location) s.show(location);
        }).on('mouseout', function () {
            s.hide();
        });

        // new svg
        if (self[this.mapName].o.selector) {
            const map = $(self[this.mapName].map)
            $(map).on('mouseover', self[this.mapName].o.selector, function () {

                var location = self[mapName].getLocationData($(this).attr('id'));

                s.shift = 20;
                if (location) s.show(location);
            }).on('mouseout', function () {
                s.hide();
            });
        }

        self[this.mapName].map.append(this.el);
    }

    show(location) {
        if (self[this.mapName].tooltip.location != location) {
            this.title.text(location.title);

            this.position(location);

            this.el.stop().fadeIn(100);
        }
    }

    position(location) {
        var cx = self[this.mapName].map.offset().left + self[this.mapName].map.width() * location.x - self[this.mapName].container.offset().left,
            cy = self[this.mapName].map.offset().top + self[this.mapName].map.height() * location.y - self[this.mapName].container.offset().top;

        var x = location.x * 100,
            y = location.y * 100,
            mt = -this.el.outerHeight() - this.shift,
            ml = 0;

        var verticalPos = 0.5;

        // Top check
        if (Math.abs(mt) > cy) {
            mt = 8 + 2;
            this.el.addClass('mapplic-bottom');
        }
        else this.el.removeClass('mapplic-bottom');

        // Left-right check
        if (this.el.outerWidth() / 2 > cx)
            verticalPos = 0.5 - (this.el.outerWidth() / 2 - cx) / this.el.outerWidth();
        else if ((self[this.mapName].container.width() - cx - this.el.outerWidth() / 2) < 0)
            verticalPos = 0.5 + (cx + this.el.outerWidth() / 2 - self[this.mapName].container.width()) / this.el.outerWidth();

        ml = -this.el.outerWidth() * verticalPos;
        this.triangle.css('left', Math.max(10, Math.min(90, verticalPos * 100)) + '%');
        this.el.css({
            left: x + '%',
            top: y + '%',
            marginTop: mt,
            marginLeft: ml
        });
    }

    hide() {
        this.el.stop().fadeOut(200);
    }
}

// Deeplinking
class Deeplinking {

    constructor(mapName) {
        this.param = 'location';
        this.mapName = mapName
    }

    init() {
        var s = this;
        this.check(0);

        window.onpopstate = function (e) {
            if (e.state) {
                s.check(600);
            }
            return false;
        }
    }

    check(ease) {
        var id = this.getUrlParam(this.param);
        self[this.mapName].showLocation(id, ease, true);
    }

    getUrlParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    update(id) {
        var url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + this.param + '=' + id;
        window.history.pushState({ path: url }, '', url);
    }

    // Clear
    clear() {
        history.pushState('', document.title, window.location.pathname);
    }
}

// Old hash deeplinking method for old browsers
class DeeplinkingHash {

    constructor(mapName) {
        this.param = 'location';
        this.mapName = mapName
    }

    init() {
        var s = this;
        this.check(0);

        $(window).on('hashchange', function () {
            s.check(600);
        });
    }

    check(ease) {
        var id = location.hash.slice(this.param.length + 2);
        self[this.mapName].showLocation(id, ease, true);
    }

    update(id) {
        window.location.hash = this.param + '-' + id;
    }

    clear() {
        window.location.hash = this.param;
    }
}

// Minimap
class Minimap {

    constructor(mapName) {
        this.el = null;
        this.opacity = null;
        this.mapName = mapName
    }

    init() {
        const mapName = this.mapName
        this.el = $('<div></div>').addClass('mapplic-minimap').appendTo(self[this.mapName].container);
        this.el.css('height', this.el.width() * self[this.mapName].hw_ratio);
        this.el.click(function (e) {
            e.preventDefault();

            var x = (e.pageX - $(this).offset().left) / $(this).width(),
                y = (e.pageY - $(this).offset().top) / $(this).height();

            self[mapName].zoomTo(x, y, self[mapName].scale / self[mapName].fitscale, 100);
        });
    }

    addLayer(data) {
        var layer = $('<div></div>').addClass('mapplic-minimap-layer').addClass(data.id).appendTo(this.el);
        $('<img>').attr('src', data.minimap).addClass('mapplic-minimap-background').appendTo(layer);
        $('<div></div>').addClass('mapplic-minimap-overlay').appendTo(layer);
        $('<img>').attr('src', data.minimap).addClass('mapplic-minimap-active').appendTo(layer);
    }

    show(target) {
        $('.mapplic-minimap-layer', this.el).hide();
        $('.mapplic-minimap-layer.' + target, this.el).show();
    }

    update(x, y) {
        var active = $('.mapplic-minimap-active', this.el);

        if (x === undefined) x = self[this.mapName].x;
        if (y === undefined) y = self[this.mapName].y;

        var width = Math.round(self[this.mapName].container.width() / self[this.mapName].contentWidth / self[this.mapName].scale * this.el.width()),
            height = Math.round(self[this.mapName].container.height() / self[this.mapName].contentHeight / self[this.mapName].scale * this.el.height()),
            top = Math.round(-y / self[this.mapName].contentHeight / self[this.mapName].scale * this.el.height()),
            left = Math.round(-x / self[this.mapName].contentWidth / self[this.mapName].scale * this.el.width()),
            right = left + width,
            bottom = top + height;

        active.each(function () {
            $(this)[0].style.clip = 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)';
        });


        var s = this;
        this.el.show();
        this.el.css('opacity', 1.0);
        clearTimeout(this.opacity);
        this.opacity = setTimeout(function () {
            s.el.css('opacity', 0);
            setTimeout(function () { s.el.hide(); }, 600);
        }, 2000);
    }
}

// Sidebar 
class Sidebar {
    constructor(mapName) {
        this.el = null;
        this.list = null;
        this.mapName = mapName
    }

    init() {
        var s = this;

        this.el = $('<div></div>').addClass('mapplic-sidebar').appendTo(self[this.mapName].el);

        if (self[this.mapName].o.search) {
            var form = $('<form></form>').addClass('mapplic-search-form').submit(function () {
                return false;
            }).appendTo(this.el);
            self[this.mapName].clear = $('<button></button>').addClass('mapplic-search-clear').click(function () {
                input.val('');
                input.keyup();
            }).appendTo(form);
            var input = $('<input>').attr({ 'type': 'text', 'spellcheck': 'false', 'placeholder': 'Search...' }).addClass('mapplic-search-input').keyup(function () {
                var keyword = $(this).val();
                s.search(keyword);
            }).prependTo(form);
        }

        var listContainer = $('<div></div>').addClass('mapplic-list-container').appendTo(this.el);
        this.list = $('<ol></ol>').addClass('mapplic-list').appendTo(listContainer);
        this.notfound = $('<p></p>').addClass('mapplic-not-found').text('Nothing found. Please try a different search.').appendTo(listContainer);

        if (!self[this.mapName].o.search) listContainer.css('padding-top', '0');
    }

    addCategories(categories) {
        var list = this.list;

        if (categories) {
            $.each(categories, function (index, category) {
                var item = $('<li></li>').addClass('mapplic-list-category').attr('data-category', category.id);
                var ol = $('<ol></ol>').css('border-color', category.color).appendTo(item);
                if (category.show == 'false') ol.hide();
                else item.addClass('mapplic-opened');
                var link = $('<a></a>').attr('href', '#').attr('title', category.title).css('background-color', category.color).text(category.title).prependTo(item);
                link.on('click', function (e) {
                    e.preventDefault();
                    item.toggleClass('mapplic-opened');
                    ol.slideToggle(200);
                });
                if (category.icon) $('<img>').attr('src', category.icon).addClass('mapplic-list-thumbnail').prependTo(link);
                $('<span></span>').text('0').addClass('mapplic-list-count').prependTo(link);
                list.append(item);
            });
        }
    }

    addLocation(data) {
        const mapName = this.mapName

        data.category.forEach(cat => {
            let item = $('<li></li>').addClass('mapplic-list-location').addClass('mapplic-list-shown');
            let link = $('<a></a>').attr('href', '#').click(function (e) {
                e.preventDefault();
                self[mapName].showLocation(data.id, 600);

                // Scroll back to map on mobile
                if ($(window).width() < 668) {
                    $('html, body').animate({
                        scrollTop: self[mapName].container.offset().top
                    }, 400);
                }
            }).appendTo(item);

            if (data.thumbnail) {
                $('<img>').attr('src', data.thumbnail).addClass('mapplic-list-thumbnail').appendTo(link);
            } else if (self[mapName].o.defaultSidebarLogo) {
                $('<img>').attr('src', self[mapName].o.defaultSidebarLogo).addClass('mapplic-list-thumbnail').appendTo(link);
            }

            $('<h4></h4>').text(data.title).appendTo(link)
            // $('<span></span>').html(data.about).appendTo(link);
            let category = $('.mapplic-list-category[data-category="' + cat + '"]');

            if (category.length) $('ol', category).append(item);
            // else this.list.append(item);

            // Count
            $('.mapplic-list-count', category).text($('.mapplic-list-shown', category).length);
        })
    }

    search(keyword) {
        if (keyword) self[this.mapName].clear.fadeIn(100);
        else self[this.mapName].clear.fadeOut(100);

        $('.mapplic-list li', self[this.mapName].el).each(function () {
            if ($(this).text().search(new RegExp(keyword, "i")) < 0) {
                $(this).removeClass('mapplic-list-shown');
                $(this).slideUp(200);
            } else {
                $(this).addClass('mapplic-list-shown');
                $(this).show();
            }
        });

        $('.mapplic-list > li', self[this.mapName].el).each(function () {
            var count = $('.mapplic-list-shown', this).length;
            $('.mapplic-list-count', this).text(count);
        });

        // Show not-found text
        if ($('.mapplic-list > li.mapplic-list-shown').length > 0) this.notfound.fadeOut(200);
        else this.notfound.fadeIn(200);
    }
}

// Developer tools
class DevTools {

    constructor(mapName) {
        this.el = null;
        this.mapName = mapName
    }

    init() {
        const mapName = this.mapName
        this.el = $('<div></div>').addClass('mapplic-coordinates').appendTo(self[this.mapName].container);
        this.el.append('x: ');
        $('<code></code>').addClass('mapplic-coordinates-x').appendTo(this.el);
        this.el.append(' y: ');
        $('<code></code>').addClass('mapplic-coordinates-y').appendTo(this.el);

        $('.mapplic-layer', self[this.mapName].map).on('mousemove', function (e) {
            var x = (e.pageX - self[mapName].map.offset().left) / self[mapName].map.width(),
                y = (e.pageY - self[mapName].map.offset().top) / self[mapName].map.height();
            $('.mapplic-coordinates-x').text(parseFloat(x).toFixed(4));
            $('.mapplic-coordinates-y').text(parseFloat(y).toFixed(4));
        });
    }
}

// Clear Button
class ClearButton {

    constructor(mapName) {
        this.el = null;
        this.mapName = mapName
    }

    init() {
        const tempMapName = this.mapName
        this.el = $('<a></a>').attr('href', '#').addClass('mapplic-clear-button').appendTo(self[this.mapName].container);

        this.el.on('click touchstart', function (e) {
            e.preventDefault();
            if (self[tempMapName].deeplinking) self[tempMapName].deeplinking.clear();
            $('.mapplic-active', self[tempMapName].el).attr('class', 'mapplic-clickable');
            self[tempMapName].tooltip.hide();
            self[tempMapName].zoomTo(0.5, 0.5, 1, 400, 'easeInOutCubic');
        });
    }
}

// Zoom Buttons
class ZoomButtons {

    constructor(mapName) {
        this.el = null;
        this.mapName = mapName
    }

    init() {
        const tempMapName = this.mapName
        this.el = $('<div></div>').addClass('mapplic-zoom-buttons').appendTo(self[this.mapName].container);

        this.zoomin = $('<a></ha>').attr('href', '#').addClass('mapplic-zoomin-button').appendTo(this.el);

        this.zoomin.on('click touchstart', function (e) {
            e.preventDefault();

            var scale = self[tempMapName].scale;

            self[tempMapName].scale = self[tempMapName].normalizeScale(scale + scale * 0.8);

            self[tempMapName].x = self[tempMapName].normalizeX(self[tempMapName].x - (self[tempMapName].container.width() / 2 - self[tempMapName].x) * (self[tempMapName].scale / scale - 1));
            self[tempMapName].y = self[tempMapName].normalizeY(self[tempMapName].y - (self[tempMapName].container.height() / 2 - self[tempMapName].y) * (self[tempMapName].scale / scale - 1));

            self[tempMapName].moveTo(self[tempMapName].x, self[tempMapName].y, self[tempMapName].scale, 400, 'easeInOutCubic');
        });

        this.zoomout = $('<a></ha>').attr('href', '#').addClass('mapplic-zoomout-button').appendTo(this.el);

        this.zoomout.on('click touchstart', function (e) {
            e.preventDefault();

            var scale = self[tempMapName].scale;

            self[tempMapName].scale = self[tempMapName].normalizeScale(scale - scale * 0.4);

            self[tempMapName].x = self[tempMapName].normalizeX(self[tempMapName].x - (self[tempMapName].container.width() / 2 - self[tempMapName].x) * (self[tempMapName].scale / scale - 1));
            self[tempMapName].y = self[tempMapName].normalizeY(self[tempMapName].y - (self[tempMapName].container.height() / 2 - self[tempMapName].y) * (self[tempMapName].scale / scale - 1));

            self[tempMapName].moveTo(self[tempMapName].x, self[tempMapName].y, self[tempMapName].scale, 400, 'easeInOutCubic');
        });
    }

    update(scale) {
        this.zoomin.removeClass('mapplic-disabled');
        this.zoomout.removeClass('mapplic-disabled');
        if (scale == self[this.mapName].fitscale) this.zoomout.addClass('mapplic-disabled');
        else if (scale == self[this.mapName].o.maxscale) this.zoomin.addClass('mapplic-disabled');
    }
}

// Full Screen
class FullScreen {

    constructor(mapName) {
        this.el = null;
        this.mapName = mapName
    }

    init() {
        var s = this;
        this.element = self[this.mapName].el[0];

        $('<a></a>').attr('href', '#').attr('href', '#').addClass('mapplic-fullscreen-button').click(function (e) {
            e.preventDefault();

            if (s.isFull()) s.exitFull();
            else s.goFull();

        }).appendTo(self[this.mapName].container);
    }

    goFull() {
        if (this.element.requestFullscreen) this.element.requestFullscreen();
        else if (this.element.mozRequestFullScreen) this.element.mozRequestFullScreen();
        else if (this.element.webkitRequestFullscreen) this.element.webkitRequestFullscreen();
        else if (this.element.msRequestFullscreen) this.element.msRequestFullscreen();
    }

    exitFull() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }

    isFull() {
        if (window.innerHeight == screen.height) {
            return true;
        } else {
            return false;
        }
    }
}

class Mapplic {

    constructor(mapName) {

        this.mapName = mapName

        self[mapName] = this;

        self[mapName].o = {
            source: null,
            selector: `[id^=landmarks] > *`,
            landmark: null,
            mapfill: false,
            height: 420,
            markers: true,
            minimap: true,
            sidebar: true,
            search: true,
            deeplinking: true,
            clearbutton: true,
            zoombuttons: true,
            hovertip: true,
            smartip: true,
            fullscreen: true,
            developer: false,
            maxscale: 4,
            skin: '',
            zoom: true,
            onClickMap: () => { },
            onClickLocation: () => { }
        };


        self[mapName].init = function (el, params) {
            // Extend options
            self[mapName].o = { ...self[mapName].o, ...params, selector: `[id^=landmarks] > *` }

            self[mapName].x = 0;
            self[mapName].y = 0;
            self[mapName].scale = 1;
            self[mapName].id = el.attr('id')

            self[mapName].el = el.addClass('mapplic-element mapplic-loading').addClass(self[mapName].o.skin).height(self[mapName].o.height);

            // Disable modules when landmark mode is active
            if (self[mapName].o.landmark) {
                self[mapName].o.sidebar = false;
                self[mapName].o.zoombuttons = false;
                self[mapName].o.deeplinking = false;
            }

            if (typeof self[mapName].o.source === 'string') {
                // Loading .json file with AJAX
                $.getJSON(self[mapName].o.source, function (data) { // Success
                    self[mapName].processData(data);
                    self[mapName].el.removeClass('mapplic-loading');

                }).fail(function () { // Failure: couldn't load JSON file, or it is invalid.
                    console.error('Couldn\'t load map data. (Make sure you are running the script through a server and not just opening the html file with your browser)');
                    self[mapName].el.removeClass('mapplic-loading').addClass('mapplic-error');
                    alert('Data file missing or invalid!');
                });
            }
            else {
                // Inline json object
                self[mapName].processData(self[mapName].o.source);
                self[mapName].el.removeClass('mapplic-loading');
            }

            return self[mapName];
        }.bind(this)

    }




    // Functions
    processData(data) {
        const tempMapName = this.mapName

        self[this.mapName].data = data;
        var nrlevels = 0;
        var shownLevel;

        self[this.mapName].container = $('<div></div>').addClass('mapplic-container').appendTo(self[this.mapName].el);
        self[this.mapName].map = $('<div></div>').addClass('mapplic-map').appendTo(self[this.mapName].container);
        if (self[this.mapName].o.zoom) self[this.mapName].map.addClass('mapplic-zoomable');

        self[this.mapName].levelselect = $('<select></select>').addClass('mapplic-levels-select');

        if (!self[this.mapName].o.sidebar) self[this.mapName].container.css('width', '100%');

        self[this.mapName].contentWidth = parseInt(data.mapwidth);
        self[this.mapName].contentHeight = parseInt(data.mapheight);

        self[this.mapName].hw_ratio = data.mapheight / data.mapwidth;

        self[this.mapName].map.css({
            'width': data.mapwidth,
            'height': data.mapheight
        });

        // Create minimap
        if (self[this.mapName].o.minimap) {
            self[this.mapName].minimap = new Minimap(this.mapName);
            self[this.mapName].minimap.init();
        }

        // Create sidebar
        if (self[this.mapName].o.sidebar) {
            self[this.mapName].sidebar = new Sidebar(this.mapName);
            self[this.mapName].sidebar.init();
            self[this.mapName].sidebar.addCategories(data.categories);
        }


        // Iterate through levels
        if (data.levels) {
            $.each(data.levels, function (index, value) {
                var source = value.map;
                var extension = source.substr((source.lastIndexOf('.') + 1)).toLowerCase();

                var layer = $('<div></div>').addClass('mapplic-layer').addClass(value.id).hide().appendTo(self[tempMapName].map);
                switch (extension) {

                    // Image formats
                    case 'jpg': case 'jpeg': case 'png': case 'gif':
                        $('<img>').attr('src', source).addClass('mapplic-map-image').appendTo(layer);
                        break;

                    // Vector format
                    case 'svg':
                        $('<div></div>').addClass('mapplic-map-image').load(source + '?for=preview', function () {
                            // setting up the location on the map
                            $(self[tempMapName].o.selector, this).each(function (index) {
                                $(this).attr("id", value.id + '-' + index)
                                let location = self[tempMapName].getLocationData($(this).attr('id'));
                                if (location) {
                                    $(this).attr('class', 'mapplic-clickable');
                                    location.onmap = $(this);

                                    if (location.fill) {
                                        $(this).css('fill', location.fill);
                                        $('path', this).css('fill', location.fill);
                                    }

                                    $(this).on('click touchend', function () { // location click
                                        if (!self[tempMapName].dragging) {
                                            let id = $(this).attr('id');
                                            const handleLocationClick = self[tempMapName].o.onClickLocation
                                            if (handleLocationClick && typeof handleLocationClick === 'function') {
                                                handleLocationClick(undefined)
                                            }
                                            self[tempMapName].showLocation(id, 600);
                                        }
                                    });

                                    // Landmark mode
                                    if (self[tempMapName].o.landmark === location.id) $(this).attr('class', 'mapplic-active');
                                } else {
                                    data.editing ? $(this).attr('class', 'poly-hover') : null

                                    $(this).on('click touchend', function () { // empty location click
                                        const handleLocationClick = self[tempMapName].o.onClickLocation
                                        if (handleLocationClick && typeof handleLocationClick === 'function') {
                                            handleLocationClick($(this).attr('id'))
                                        }
                                    })
                                }
                            });

                            // Support for the old map format
                            $('svg a', this).each(function () {
                                var location = self[tempMapName].getLocationData($(this).attr('xlink:href').substr(1));
                                if (location) {
                                    $(this).attr('class', 'mapplic-clickable');
                                    location.onmap = $(this);
                                }
                            });

                            $('svg a', this).click(function (e) {
                                var id = $(this).attr('xlink:href').substr(1);
                                self[tempMapName].showLocation(id, 600);
                                e.preventDefault();
                            });
                        }).appendTo(layer);
                        break;
                    // Other 
                    default:
                        alert('File type ' + extension + ' is not supported!');
                }

                // Create new minimap layer
                if (self[tempMapName].minimap) self[tempMapName].minimap.addLayer(value);

                // Build layer control
                self[tempMapName].levelselect.prepend($('<option></option>').attr('value', value.id).text(value.title));

                if (!shownLevel || value.show) {
                    shownLevel = value.id;
                }

                // Iterate through locations
                $.each(value.locations, function (index, value) {
                    let top = value.y * 100;
                    let left = value.x * 100;

                    if (value.pin != 'hidden') {
                        if (self[tempMapName].o.markers) {
                            let target = '#';
                            if (value.action == 'redirect') target = value.link;

                            let pin = $('<a></a>').attr('href', target).addClass('mapplic-pin').css({ 'top': top + '%', 'left': left + '%' }).appendTo(layer);
                            pin.on('click touchend', function (e) {
                                e.preventDefault();
                                self[tempMapName].showLocation(value.id, 600);
                            });
                            if (value.fill) pin.css('background-color', value.fill);
                            pin.attr('data-location', value.id);
                            pin.addClass(value.pin);
                        }
                    }

                    if (self[tempMapName].sidebar) self[tempMapName].sidebar.addLocation(value);
                });

                nrlevels++;
            });
        }

        // COMPONENTS

        // Tooltip
        self[this.mapName].tooltip = new Tooltip(this.mapName);
        self[this.mapName].tooltip.init();

        // Hover Tooltip
        if (self[this.mapName].o.hovertip) {
            self[this.mapName].hovertip = new HoverTooltip(this.mapName);
            self[this.mapName].hovertip.init();
        }

        // Developer tools
        if (self[this.mapName].o.developer) self[this.mapName].devtools = new DevTools(this.mapName).init();

        // Clear button
        if (self[this.mapName].o.clearbutton) self[this.mapName].clearbutton = new ClearButton(this.mapName).init();

        // Zoom buttons
        if (self[this.mapName].o.zoombuttons) {
            // console.log('Zoom button');

            self[this.mapName].zoombuttons = new ZoomButtons(this.mapName);
            self[this.mapName].zoombuttons.init();
            if (!self[this.mapName].o.clearbutton) self[this.mapName].zoombuttons.el.css('bottom', '0');
        }

        // Fullscreen
        if (self[this.mapName].o.fullscreen) {
            // console.log('Full Screen');

            self[this.mapName].fullscreen = new FullScreen(this.mapName).init();
        }

        // Levels
        if (nrlevels > 1) {
            self[this.mapName].levels = $('<div></div>').addClass('mapplic-levels');
            var up = $('<a href="#"></a>').addClass('mapplic-levels-up').appendTo(self[this.mapName].levels);
            self[this.mapName].levelselect.appendTo(self[this.mapName].levels);
            var down = $('<a href="#"></a>').addClass('mapplic-levels-down').appendTo(self[this.mapName].levels);
            self[this.mapName].container.append(self[this.mapName].levels);

            self[this.mapName].levelselect.change(function () {
                var value = $(this).val();
                self[tempMapName].switchLevel(value);
            });

            up.click(function (e) {
                e.preventDefault();
                if (!$(this).hasClass('mapplic-disabled')) self[tempMapName].switchLevel('+');
            });

            down.click(function (e) {
                e.preventDefault();
                if (!$(this).hasClass('mapplic-disabled')) self[tempMapName].switchLevel('-');
            });
        }
        self[this.mapName].switchLevel(shownLevel);

        // Browser resize
        $(window).resize(function () {
            resizeCallback(tempMapName)
        }).resize();

        // Landmark mode
        if (self[this.mapName].o.landmark) {
            self[this.mapName].showLocation(self[this.mapName].o.landmark, 0);
        }
        else {
            self[this.mapName].zoomTo(0.5, 0.5, 1, 0);
        }

        // Deeplinking
        if (self[this.mapName].o.deeplinking) {
            if (history.pushState) self[this.mapName].deeplinking = new Deeplinking(this.mapName);
            else self[this.mapName].deeplinking = new DeeplinkingHash(this.mapName);

            self[this.mapName].deeplinking.init();
        }

        // Controls
        if (self[this.mapName].o.zoom) self[this.mapName].addControls();


    }

    addControls() {
        const tempMapName = this.mapName
        var map = self[this.mapName].map,
            mapbody = $('.mapplic-map-image', self[this.mapName].map);

        document.ondragstart = function () { return false; } // IE drag fix

        // Drag & drop
        mapbody.on('mousedown', function (event) {

            self[tempMapName].dragging = false;
            map.stop();

            map.data('mouseX', event.pageX);
            map.data('mouseY', event.pageY);
            map.data('lastX', self[tempMapName].x);
            map.data('lastY', self[tempMapName].y);

            map.addClass('mapplic-dragging');

            self[tempMapName].map.on('mousemove', function (event) {
                self[tempMapName].dragging = true;

                var x = event.pageX - map.data('mouseX') + self[tempMapName].x;
                var y = event.pageY - map.data('mouseY') + self[tempMapName].y;

                x = self[tempMapName].normalizeX(x);
                y = self[tempMapName].normalizeY(y);

                self[tempMapName].moveTo(x, y);
                map.data('lastX', x);
                map.data('lastY', y);
            });

            $(document).on('mouseup', function (event) {

                self[tempMapName].x = map.data('lastX');
                self[tempMapName].y = map.data('lastY');

                self[tempMapName].map.off('mousemove');
                $(document).off('mouseup');

                map.removeClass('mapplic-dragging');
            });
        });

        // Double click
        $(document).on('dblclick', `#${self[tempMapName].id} .mapplic-map-image`, function (event) {
            event.preventDefault();

            var scale = self[tempMapName].scale;
            self[tempMapName].scale = self[tempMapName].normalizeScale(scale * 2);

            self[tempMapName].x = self[tempMapName].normalizeX(self[tempMapName].x - (event.pageX - self[tempMapName].container.offset().left - self[tempMapName].x) * (self[tempMapName].scale / scale - 1));
            self[tempMapName].y = self[tempMapName].normalizeY(self[tempMapName].y - (event.pageY - self[tempMapName].container.offset().top - self[tempMapName].y) * (self[tempMapName].scale / scale - 1));

            self[tempMapName].moveTo(self[tempMapName].x, self[tempMapName].y, self[tempMapName].scale, 400, 'easeInOutCubic');

        });


        //get %x %y onClick
        $(document).on('click', `#${self[tempMapName].id} .mapplic-map-image`, function (event) {
            event.preventDefault();
            const thisImg = $(this)
            const offset = thisImg.offset();
            const currentMapImg = thisImg[0]
            const mapHeight = currentMapImg.offsetHeight
            const mapWidth = currentMapImg.offsetWidth
            const x = event.pageX - offset.left
            const y = event.pageY - offset.top
            const handleClick = self[tempMapName].o.onClickMap
            if (handleClick && typeof handleClick === "function") {
                handleClick(event, { x: x / mapWidth, y: y / mapHeight })
            }
        });

        // Mousewheel
        $(`#${self[tempMapName].id} .mapplic-layer`).on('mousewheel wheel', function (event) {
            event.preventDefault();

            var scale = self[tempMapName].scale;
            
            if (event.originalEvent.wheelDelta) {
                self[tempMapName].scale = self[tempMapName].normalizeScale(scale + scale * event.originalEvent.wheelDelta / 240);
            } else {
                self[tempMapName].scale = self[tempMapName].normalizeScale(scale + scale * event.originalEvent.deltaY / 120);
            }

            self[tempMapName].x = self[tempMapName].normalizeX(self[tempMapName].x - (event.pageX - self[tempMapName].container.offset().left - self[tempMapName].x) * (self[tempMapName].scale / scale - 1));
            self[tempMapName].y = self[tempMapName].normalizeY(self[tempMapName].y - (event.pageY - self[tempMapName].container.offset().top - self[tempMapName].y) * (self[tempMapName].scale / scale - 1));

            self[tempMapName].moveTo(self[tempMapName].x, self[tempMapName].y, self[tempMapName].scale, 250, 'easeOutCubic');
        });

        // Touch support
        if (!('ontouchstart' in window || 'onmsgesturechange' in window)) return true;
        mapbody.on('touchstart', function (e) {
            self[tempMapName].dragging = false;

            var orig = e.originalEvent,
                pos = map.position();

            map.data('touchY', orig.changedTouches[0].pageY - pos.top);
            map.data('touchX', orig.changedTouches[0].pageX - pos.left);

            mapbody.on('touchmove', function (e) {
                e.preventDefault();
                self[tempMapName].dragging = true;

                var orig = e.originalEvent;
                var touches = orig.touches.length;

                if (touches == 1) {
                    self[tempMapName].x = self[tempMapName].normalizeX(orig.changedTouches[0].pageX - map.data('touchX'));
                    self[tempMapName].y = self[tempMapName].normalizeY(orig.changedTouches[0].pageY - map.data('touchY'));

                    self[tempMapName].moveTo(self[tempMapName].x, self[tempMapName].y, self[tempMapName].scale, 50);
                }
                else {
                    mapbody.off('touchmove');
                }
            });

            mapbody.on('touchend', function (e) {
                mapbody.off('touchmove touchend');
            });
        });

        // Pinch zoom
        var hammer = new Hammer(self[this.mapName].map[0], {
            transform_always_block: true,
            drag_block_horizontal: true,
            drag_block_vertical: true
        });

        /* hammer fix */
        self[this.mapName].map.on('touchstart', function (e) {
            if (e.originalEvent.touches.length > 1) hammer.get('pinch').set({ enable: true });
        });

        self[this.mapName].map.on('touchend', function (e) {
            hammer.get('pinch').set({ enable: false });
        });
        /* hammer fix ends */

        var scale = 1, last_scale;
        hammer.on('pinchstart', function (e) {
            self[tempMapName].dragging = false;

            scale = self[tempMapName].scale / self[tempMapName].fitscale;
            last_scale = scale;
        });

        hammer.on('pinch', function (e) {
            // console.log('pinch');

            self[tempMapName].dragging = true;

            if (e.scale != 1) scale = Math.max(1, Math.min(last_scale * e.scale, 100));

            var oldscale = self[tempMapName].scale;
            self[tempMapName].scale = self[tempMapName].normalizeScale(scale * self[tempMapName].fitscale);

            self[tempMapName].x = self[tempMapName].normalizeX(self[tempMapName].x - (e.center.x - self[tempMapName].container.offset().left - self[tempMapName].x) * (self[tempMapName].scale / oldscale - 1));
            self[tempMapName].y = self[tempMapName].normalizeY(self[tempMapName].y - (e.center.y - self[tempMapName].y) * (self[tempMapName].scale / oldscale - 1)); // - self[tempMapName].container.offset().top

            self[tempMapName].moveTo(self[tempMapName].x, self[tempMapName].y, self[tempMapName].scale, 100);
        });
    }

    switchLevel(target, tooltip) {
        switch (target) {
            case '+':
                target = $('option:selected', self[this.mapName].levelselect).removeAttr('selected').prev().prop('selected', 'selected').val();
                break;
            case '-':
                target = $('option:selected', self[this.mapName].levelselect).removeAttr('selected').next().prop('selected', 'selected').val();
                break;
            default:
                $('option[value="' + target + '"]', self[this.mapName].levelselect).prop('selected', 'selected');
        }

        var layer = $('.mapplic-layer.' + target, self[this.mapName].map);

        // Target layer is active
        if (layer.is(':visible')) return;

        // Hide Tooltip
        if (!tooltip) self[this.mapName].tooltip.hide();

        // Show target layer
        $('.mapplic-layer:visible', self[this.mapName].map).hide();
        layer.show();

        // Show target minimap layer
        if (self[this.mapName].minimap) self[this.mapName].minimap.show(target);

        // Update control
        var index = self[this.mapName].levelselect.get(0).selectedIndex,
            up = $('.mapplic-levels-up', self[this.mapName].levels),
            down = $('.mapplic-levels-down', self[this.mapName].levels);

        up.removeClass('mapplic-disabled');
        down.removeClass('mapplic-disabled');
        if (index == 0) {
            up.addClass('mapplic-disabled');
        }
        else if (index == self[this.mapName].levelselect.get(0).length - 1) {
            down.addClass('mapplic-disabled');
        }
    }

    getLocationData(id) {
        let data = null;
        const mapName = this.mapName
        $.each(self[mapName].data.levels, function (index, layer) {
            $.each(layer.locations, function (index, value) {
                if (value.id == id) {
                    data = value;
                }
            });
        });
        return data;
    }

    showLocation(id, duration, check) {
        const tempMapName = this.mapName
        $.each(self[tempMapName].data.levels, function (index, layer) {

            if (layer.id == id) {
                self[tempMapName].switchLevel(layer.id, false);
                return false;
            }
            $.each(layer.locations, function (index, location) {
                if (location.id == id) {
                    let ry = 0.5;
                    if (!self[tempMapName].o.landmark) {
                        self[tempMapName].tooltip.set(location);
                        self[tempMapName].tooltip.show(location);
                        ry = ((self[tempMapName].container.height() - self[tempMapName].tooltip.drop) / 2 + self[tempMapName].tooltip.drop) / self[tempMapName].container.height();
                    }
                    let zoom = typeof location.zoom !== 'undefined' ? location.zoom : 4;

                    self[tempMapName].switchLevel(layer.id, true);

                    self[tempMapName].zoomTo(location.x, location.y, zoom, duration, 'easeInOutCubic', ry);

                    $('.mapplic-active', self[tempMapName].el).attr('class', 'mapplic-clickable');
                    if (location.onmap && location.onmap.length > 0) {
                        location.onmap.attr('class', 'mapplic-active');
                    }

                    if ((self[tempMapName].o.deeplinking) && (!check)) self[tempMapName].deeplinking.update(id);

                    return false;
                }
            });
        });
    };

    normalizeX(x) {
        var minX = self[this.mapName].container.width() - self[this.mapName].contentWidth * self[this.mapName].scale;

        if (minX < 0) {
            if (x > 0) x = 0;
            else if (x < minX) x = minX;
        }
        else x = minX / 2;

        return x;
    }

    normalizeY(y) {
        var minY = self[this.mapName].container.height() - self[this.mapName].contentHeight * self[this.mapName].scale;

        if (minY < 0) {
            if (y >= 0) y = 0;
            else if (y < minY) y = minY;
        }
        else y = minY / 2;

        return y;
    }

    normalizeScale(scale) {
        if (scale < self[this.mapName].fitscale) scale = self[this.mapName].fitscale;
        else if (scale > self[this.mapName].o.maxscale) scale = self[this.mapName].o.maxscale;

        if (self[this.mapName].zoombuttons) self[this.mapName].zoombuttons.update(scale);

        return scale;
    }

    zoomTo(x, y, s, duration, easing, ry) {
        duration = typeof duration !== 'undefined' ? duration : 400;
        ry = typeof ry !== 'undefined' ? ry : 0.5;

        self[this.mapName].scale = self[this.mapName].normalizeScale(self[this.mapName].fitscale * s);

        self[this.mapName].x = self[this.mapName].normalizeX(self[this.mapName].container.width() * 0.5 - self[this.mapName].scale * self[this.mapName].contentWidth * x);
        self[this.mapName].y = self[this.mapName].normalizeY(self[this.mapName].container.height() * ry - self[this.mapName].scale * self[this.mapName].contentHeight * y);

        self[this.mapName].moveTo(self[this.mapName].x, self[this.mapName].y, self[this.mapName].scale, duration, easing);
    }

    moveTo(x, y, scale, d, easing) {
        const tempMapName = this.mapName
        if (scale !== undefined) {

            self[this.mapName].map.stop().animate({
                'left': x,
                'top': y,
                'width': self[this.mapName].contentWidth * scale,
                'height': self[this.mapName].contentHeight * scale
            }, d, easing, function () {
                if (self[tempMapName].tooltip) self[tempMapName].tooltip.position();
            });
        }
        else {
            self[this.mapName].map.css({
                'left': x,
                'top': y
            });
        }
        if (self[this.mapName].tooltip) self[this.mapName].tooltip.position();
        if (self[this.mapName].minimap) self[this.mapName].minimap.update(x, y);
    }
};

//  Create a jQuery plugin
// $.fn.mapplic = function (params) {
//     var len = this.length;

//     return this.each(function (index) {
//         var me = $(this),
//             key = 'mapplic' + (len > 1 ? '-' + ++index : ''),
//             instance = (new Mapplic).init(me, params);
//     });
// };

export function toggleCategory(mapName, categoryID) {
    const foundElem = self[mapName].el.find(`.mapplic-list-category[data-category=${categoryID}]`)
    if (foundElem) {
        const ol = foundElem.find('ol')
        if (ol) {
            foundElem.toggleClass('mapplic-opened')
            ol.slideToggle(200)
        }
    }
}

export function resizeCallback(mapName) {

    // Mobile
    if ($(window).width() < 668) {
        self[mapName].container.height($(window).height() - 66);
    }
    else self[mapName].container.height('80%');

    var wr = self[mapName].container.width() / self[mapName].contentWidth,
        hr = self[mapName].container.height() / self[mapName].contentHeight;

    if (self[mapName].o.mapfill) {
        if (wr > hr) self[mapName].fitscale = wr;
        else self[mapName].fitscale = hr;
    }
    else {
        if (wr < hr) self[mapName].fitscale = wr;
        else self[mapName].fitscale = hr;
    }

    self[mapName].scale = self[mapName].normalizeScale(self[mapName].scale);
    self[mapName].x = self[mapName].normalizeX(self[mapName].x);
    self[mapName].y = self[mapName].normalizeY(self[mapName].y);

    self[mapName].moveTo(self[mapName].x, self[mapName].y, self[mapName].scale, 100);

}
export default Mapplic