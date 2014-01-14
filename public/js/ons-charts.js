/*
*
* jQuery Wrapper Plugin Prototype for ONS Lightweight Charting by Stefan Goodchild
* Triple Geek Ltd
*
*/(function(e){e.fn.onsc=function(){var t={},n={};n.breakpoint=640;n.overBreakpoint=!0;var r=function(){return!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect},i=function(){return e(window).width()>n.breakpoint},s=function(r){e(window).resize(function(){p()});n.overBreakpoint=i();t.wrap=e(r);t.table=t.wrap.find("table");o()},o=function(){if(r()&&t.wrap.hasClass("ons-bar")){t.table.hide();n.overBreakpoint?l():c()}},u=function(){t.chartWrap.remove()},a=function(){t.rid="ons-rid-"+(Math.random().toString(36)+"00000000000000000").slice(2,7);t.chartWrap=e('<div class="ons-chart-wrap"><svg viewBox="0 0 '+n.base_size.x+" "+n.base_size.y+'" preserveAspectRatio="xMinYMin meet" id="'+t.rid+'"></svg></div>');t.wrap.append(t.chartWrap);t.svg=Snap("#"+t.rid)},f=function(){var e=n.base_size.y/n.base_size.x*100;t.chartWrap.css({"padding-bottom":e+"%"})},l=function(){n.base_size={x:1280,y:720};n.chart_size={x:1280,y:620};a();f();var r=t.table.find("tr").first().find("th").length,i=n.chart_size.x/100,s=(n.chart_size.x+i)/r;t.svg.line(0,0,n.chart_size.x,0).attr({stroke:"#999999","stroke-dasharray":"3,3"});t.svg.line(0,n.chart_size.y/2,n.chart_size.x,n.chart_size.y/2).attr({stroke:"#999999","stroke-dasharray":"3,3"});t.svg.line(0,n.chart_size.y+2,n.chart_size.x,n.chart_size.y+2).attr({stroke:"#999999","stroke-width":"4"});var o=0;e.each(t.table.find("td"),function(r,u){var a=parseFloat(e(u).html())/100,f=t.svg.rect(o,n.chart_size.y-n.chart_size.y*a,s-i,n.chart_size.y*a,5);f.attr({fill:"#0088CE"});o+=s});o=0;e.each(t.table.find("th"),function(r,u){var a=t.svg.text(o+s/2-i,n.base_size.y-(n.base_size.y-n.chart_size.y)/1.7,e(u).text());a.attr({"font-size":"25px","text-anchor":"middle",fill:"#666"});o+=s});o=0;e.each(t.table.find("td"),function(r,u){var a=t.svg.text(o+s/2-i,n.base_size.y-(n.base_size.y-n.chart_size.y)/5,e(u).text());a.attr({"font-size":"35px","font-weight":"bold","text-anchor":"middle",fill:"#444"});o+=s})},c=function(){var r=t.table.find("tr").first().find("th").length,i=90;n.base_size={x:640,y:i*r};n.chart_size={x:640,y:i*r};a();f();var s=0;e.each(t.table.find("td"),function(t,n){var r=parseFloat(e(n).html())/100;r>s&&(s=r)});var o=100/s/100,u=0;e.each(t.table.find("td"),function(r,s){var a=parseFloat(e(s).html())/100,f=t.svg.rect(0,u,n.chart_size.x*a*o,30,5).attr({fill:"#0088CE"}),l=t.svg.text(0,u+60,e(t.table.find("th")[r]).text()).attr({"font-size":"25px","text-anchor":"left",fill:"#666"}),c=l.getBBox().width,h=n.chart_size.x*a*o;h-c>50?t.svg.text(h,u+60,e(s).text()).attr({"font-size":"25px","font-weight":"bold","text-anchor":"end",fill:"#444"}):t.svg.text(c+15,u+60,e(s).text()).attr({"font-size":"25px","font-weight":"bold","text-anchor":"start",fill:"#444"});u+=i})},h=function(){t.svg.circle(0,0,50);t.svg.circle(n.base_size.x,0,50);t.svg.circle(n.base_size.x/2,n.base_size.y/2,50);t.svg.circle(n.base_size.x,n.base_size.y,50);t.svg.circle(0,n.base_size.y,50)},p=function(){if(n.overBreakpoint!=i()){n.overBreakpoint=i();u();o()}};return this.each(function(){s(this)})}})(jQuery);