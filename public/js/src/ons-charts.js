/*
*
* jQuery Wrapper Plugin Prototype for ONS Lightweight Charting by Stefan Goodchild
* Triple Geek Ltd
*
*/

(function( $ ){
    
    $.fn.onsc = function() {
    
        var instance = {};
        var settings = {};
        
        settings.breakpoint = 640;
        settings.overBreakpoint = true;
        
        var supported = function() {
          return !! document.createElementNS &&
                 !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect
        }
        
        var overBreakpoint = function() {
          return $( window ).width() > settings.breakpoint;
        }
    
        var init = function(src) {
          $(window).resize(function(){
            checkBreakpoint();
          });
          settings.overBreakpoint = overBreakpoint();
          instance.wrap = $(src);
          instance.table = instance.wrap.find('table');
          create();
        }
        
        var create = function() {
          if (supported()) {
            if (instance.wrap.hasClass('ons-bar')) {
              instance.table.hide();
              if ( settings.overBreakpoint ) {
                barChartH();
              } else {
                barChartV();
              }
            }
          }
        }
        
        var destroy = function() {
          instance.chartWrap.remove();
        }
        
        var createSVG = function() {
          instance.rid = "ons-rid-"+(Math.random().toString(36)+'00000000000000000').slice(2, 5+2);
          instance.chartWrap = $('<div class="ons-chart-wrap"><svg viewBox="0 0 '+settings.base_size.x+' '+settings.base_size.y+'" preserveAspectRatio="xMinYMin meet" id="'+instance.rid+'"></svg></div>');
          instance.wrap.append(instance.chartWrap);
          instance.svg = Snap("#"+instance.rid);
        }
        
        var addWrapperPadding = function() {
          var padding = (settings.base_size.y / settings.base_size.x) * 100;
          instance.chartWrap.css({
            'padding-bottom': padding+"%"
          });
        }
        
        var barChartH = function() {
          settings.base_size = {
            'x': 1280,
            'y': 720,
          };

          settings.chart_size = {
            'x': 1280,
            'y': 620,
          };
          createSVG();
          addWrapperPadding();
          var count = instance.table.find('th').length;
          var spacer = settings.chart_size.x/100;
          var jump = (settings.chart_size.x+spacer)/count;
          // Lines
          instance.svg.line(
            0, 
            0, 
            settings.chart_size.x, 
            0).attr({
              stroke: "#999999",
              'stroke-dasharray': "3,3"
            });
            instance.svg.line(
              0, 
              settings.chart_size.y/2, 
              settings.chart_size.x, 
              settings.chart_size.y/2).attr({
                stroke: "#999999",
                'stroke-dasharray': "3,3"
            });
            instance.svg.line(
              0, 
              settings.chart_size.y+2, 
              settings.chart_size.x, 
              settings.chart_size.y+2).attr({
                stroke: "#999999",
                'stroke-width': "4"
            });
          
          // Bars
          var x = 0;  
          $.each(instance.table.find('td'), function(i, e){
            var height = parseFloat($(e).html()) / 100;
            var r = instance.svg.rect(x, settings.chart_size.y - (settings.chart_size.y * height), jump-spacer, settings.chart_size.y * height, 5);
            r.attr({ 
              fill: "#0088CE"
            });
            x+=jump;
          });
          
          // Labels
          x = 0;
          $.each(instance.table.find('th'), function(i, e){
            var t = instance.svg.text(
              x + (jump/2) - spacer, 
              settings.base_size.y - ((settings.base_size.y - settings.chart_size.y) / 1.7),
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
          $.each(instance.table.find('td'), function(i, e){
            var t = instance.svg.text(
              x + (jump/2) - spacer, 
              settings.base_size.y - ((settings.base_size.y - settings.chart_size.y) / 5),
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
        }
        
        var barChartV = function() {
          var count = instance.table.find('th').length;
          var jump = 90;

          settings.base_size = {
            'x': 640,
            'y': jump * count,
          };

          settings.chart_size = {
            'x': 640,
            'y': jump * count,
          };
          
          createSVG();
          addWrapperPadding();
          
          var maxwidth = 0;
          
          $.each(instance.table.find('td'), function(i, e){
            var newWidth = parseFloat($(e).html()) / 100;
            if ( newWidth > maxwidth) {
              maxwidth = newWidth;
            }
          });
          
          var widthMult = (100 / maxwidth) / 100;

          var y = 0;  
          $.each(instance.table.find('td'), function(i, e){
            var width = parseFloat($(e).html()) / 100;
            // Bars
            var b = instance.svg.rect(0, y, (settings.chart_size.x * width) * widthMult, 30, 5).attr({ 
              fill: "#0088CE"
            });
            // Labels
            var l = instance.svg.text(
              0,
              y+60,
              $(instance.table.find('th')[i]).text()
            ).attr({
                'font-size': '25px',
                'text-anchor': 'left',
                'fill': '#666'
            });
            
            var labelWidth = l.getBBox().width;
            var barWidth = (settings.chart_size.x * width) * widthMult;
            
            if (barWidth - labelWidth > 50) {
              instance.svg.text(
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
              instance.svg.text(
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

        var testPattern = function() {
          // Test Pattern
          instance.svg.circle(0, 0, 50);
          instance.svg.circle(settings.base_size.x, 0, 50);
          instance.svg.circle(settings.base_size.x/2, settings.base_size.y/2, 50);
          instance.svg.circle(settings.base_size.x, settings.base_size.y, 50);
          instance.svg.circle(0, settings.base_size.y, 50);
        }

        var checkBreakpoint = function() {
          if (settings.overBreakpoint != overBreakpoint()) {
            settings.overBreakpoint = overBreakpoint();
            destroy();
            create();
          }
        }
    
        return this.each(function() {
          init(this);
        });  
    
    };

})( jQuery );