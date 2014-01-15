/*
*
* jQuery Plugin Prototype for ONS Lightweight Charting by Stefan Goodchild
* Triple Geek Ltd
*
*/
;(function ( $, window, document, undefined ) {

		var pluginName = "onsc",
				defaults = {
				breakpoint: 640,
				overBreakpoint: true
		};

		function Plugin ( element, options ) {
				this.element = element;
				this.$el = $(element);
				this.settings = $.extend( {}, defaults, options );
				this.instance = {};
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {
				init: function () {
						this.settings.overBreakpoint = this.overBreakpoint();
						this.instance.table = this.$el.find('table');
						var that = this;
						$(window).resize(function(){
              that.checkBreakpoint();
            });
            this.create();
				},
        supported: function() {
          return !! document.createElementNS &&
                 !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect
        },
        overBreakpoint: function() {
          return $( window ).width() > this.settings.breakpoint;
        },
        checkBreakpoint: function() {
          if (this.settings.overBreakpoint != this.overBreakpoint()) {
            this.settings.overBreakpoint = this.overBreakpoint();
            this.destroy();
            this.create();
          }
        },
        createSVG: function() {
          this.instance.rid = "ons-rid-"+(Math.random().toString(36)+'00000000000000000').slice(2, 5+2);
          this.instance.chartWrap = $('<div class="ons-chart-wrap"><svg viewBox="0 0 '+this.settings.base_size.x+' '+this.settings.base_size.y+'" preserveAspectRatio="xMinYMin meet" id="'+this.instance.rid+'"></svg></div>');
          this.$el.append(this.instance.chartWrap);
          this.instance.svg = Snap("#"+this.instance.rid);
        },
        addWrapperPadding: function() {
          var padding = (this.settings.base_size.y / this.settings.base_size.x) * 100;
          this.instance.chartWrap.css({
            'padding-bottom': padding+"%"
          });
        },
        destroy: function() {
          this.instance.chartWrap.remove();
        },
        create: function() {
          if (this.supported()) {
            if (this.$el.hasClass('ons-bar')) {
              this.instance.table.hide();
              if ( this.settings.overBreakpoint ) {
                this.barChartH();
              } else {
                this.barChartV();
              }
            }
          }
        },
        barChartH: function() {
          this.settings.base_size = {
            'x': 1280,
            'y': 720,
          };

          this.settings.chart_size = {
            'x': 1280,
            'y': 620,
          };
          this.createSVG();
          this.addWrapperPadding();
          var count = this.instance.table.find('th').length;
          var spacer = this.settings.chart_size.x/100;
          var jump = (this.settings.chart_size.x+spacer)/count;
          // Lines
          this.instance.svg.line(
            0, 
            0, 
            this.settings.chart_size.x, 
            0).attr({
              stroke: "#999999",
              'stroke-dasharray': "3,3"
            });
            this.instance.svg.line(
              0, 
              this.settings.chart_size.y/2, 
              this.settings.chart_size.x, 
              this.settings.chart_size.y/2).attr({
                stroke: "#999999",
                'stroke-dasharray': "3,3"
            });
            this.instance.svg.line(
              0, 
              this.settings.chart_size.y+2, 
              this.settings.chart_size.x, 
              this.settings.chart_size.y+2).attr({
                stroke: "#999999",
                'stroke-width': "4"
            });
          
          // Bars
          var x = 0;
          var that = this;
          $.each(this.instance.table.find('td'), function(i, e){
            var height = parseFloat($(e).html()) / 100;
            var r = that.instance.svg.rect(x, that.settings.chart_size.y - (that.settings.chart_size.y * height), jump-spacer, that.settings.chart_size.y * height, 5);
            r.attr({ 
              fill: "#0088CE"
            });
            x+=jump;
          });
          
          // Labels
          x = 0;
          $.each(this.instance.table.find('th'), function(i, e){
            var t = that.instance.svg.text(
              x + (jump/2) - spacer, 
              that.settings.base_size.y - ((that.settings.base_size.y - that.settings.chart_size.y) / 1.7),
              $(e).text()
            );
            t.attr({
              'font-size': '25px',
              'text-anchor': 'middle',
              'fill': '#666'
            });
            x+=jump;
          });
          
          // Values
          x = 0;
          $.each(this.instance.table.find('td'), function(i, e){
            var t = that.instance.svg.text(
              x + (jump/2) - spacer, 
              that.settings.base_size.y - ((that.settings.base_size.y - that.settings.chart_size.y) / 5),
              $(e).text()
            );
            t.attr({
              'font-size': '35px',
              'font-weight': 'bold',
              'text-anchor': 'middle',
              'fill': '#444'
            });
            x+=jump;
          });
        },
        
        barChartV: function() {
          var count = this.instance.table.find('th').length;
          var jump = 90;

          this.settings.base_size = {
            'x': 640,
            'y': jump * count,
          };

          this.settings.chart_size = {
            'x': 640,
            'y': jump * count,
          };
          
          this.createSVG();
          this.addWrapperPadding();
          
          var maxwidth = 0;
          
          $.each(this.instance.table.find('td'), function(i, e){
            var newWidth = parseFloat($(e).html()) / 100;
            if ( newWidth > maxwidth) {
              maxwidth = newWidth;
            }
          });
          
          var widthMult = (100 / maxwidth) / 100;

          var y = 0;  
          var that = this;
          
          $.each(this.instance.table.find('td'), function(i, e){
            var width = parseFloat($(e).html()) / 100;
            // Bars
            var b = that.instance.svg.rect(0, y, (that.settings.chart_size.x * width) * widthMult, 30, 5).attr({ 
              fill: "#0088CE"
            });
            // Labels
            var l = that.instance.svg.text(
              0,
              y+60,
              $(that.instance.table.find('th')[i]).text()
            ).attr({
                'font-size': '25px',
                'text-anchor': 'left',
                'fill': '#666'
            });
            
            var labelWidth = l.getBBox().width;
            var barWidth = (that.settings.chart_size.x * width) * widthMult;
            
            if (barWidth - labelWidth > 50) {
              that.instance.svg.text(
                barWidth, 
                y+60,
                $(e).text()
              ).attr({
                'font-size': '25px',
                'font-weight': 'bold',
                'text-anchor': 'end',
                'fill': '#444'
              });
            } else {
              that.instance.svg.text(
                labelWidth + 15, 
                y+60,
                $(e).text()
              ).attr({
                'font-size': '25px',
                'font-weight': 'bold',
                'text-anchor': 'start',
                'fill': '#444'
              });
            }

            y+=jump;
          });
          
        }


		};

		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
