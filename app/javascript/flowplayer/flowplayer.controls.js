/*
 * flowplayer.controls.js. Flowplayer JavaScript plugin.
 * 
 * This file is part of Flowplayer, http://flowplayer.org
 *
 * Author: Tero Piirainen, <support@flowplayer.org>
 * Copyright (c) 2008-2013 Flowplayer Ltd
 *
 * Released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
$f.addPlugin("controls",function(j,a){function q(w){if(typeof w=="undefined"){w=window.event}if(typeof w.layerX=="undefined"){w.layerX=w.offsetX}if(typeof w.layerY=="undefined"){w.layerY=w.offsetY}return w}function l(w){return w.clientWidth}function d(w){return w.offsetLeft}function h(w,D,G,C){var H=false;function F(){}w.onDragStart=w.onDragStart||F;w.onDragEnd=w.onDragEnd||F;w.onDrag=w.onDrag||F;function A(I){var J=true;if(I>G){I=G;J=false}if(I<D){I=D;J=false}w.style.left=I+"px";return J}function B(){document.onmousemove=w.ontouchmove=null;document.onmouseup=w.ontouchend=null;w.onDragEnd(parseInt(w.style.left,10));H=false}function E(J){J=J.touches?J.touches.item(0):J;J=q(J);var I=J.clientX-C;if(A(I)){H=true;w.onDrag(I)}return false}w.onmousedown=w.ontouchstart=function(I){I=q(I);w.onDragStart(parseInt(w.style.left,10));document.onmousemove=w.ontouchmove=E;document.onmouseup=w.ontouchend=B;return false};this.dragTo=function(I){if(A(I)){w.onDragEnd(I)}};this.setMax=function(I){G=I};this.isDragging=function(){return H};return this}function v(A,w){if(w){for(key in w){if(key){A[key]=w[key]}}}}function t(w){var B=j.getElementsByTagName("*");var C=new RegExp("(^|\\s)"+w+"(\\s|$)");for(var A=0;A<B.length;A++){if(C.test(B[A].className)){return B[A]}}}function x(w){w=parseInt(w,10);return w>=10?w:"0"+w}function f(B){var A=Math.floor(B/3600);var w=Math.floor(B/60);B=B-(w*60);if(A>=1){w-=A*60;return x(A)+":"+x(w)+":"+x(B)}return x(w)+":"+x(B)}function y(A,w){return"<span>"+f(A)+"</span> <strong>"+f(w)+"</strong>"}var n=this;var m={playHeadClass:"playhead",trackClass:"track",playClass:"play",pauseClass:"pause",bufferClass:"buffer",progressClass:"progress",timeClass:"time",muteClass:"mute",unmuteClass:"unmute",duration:0,template:'<div class="tv-button action-button"><a class="play">play</a></div><div class="track"><div class="buffer"></div><div class="progress"></div><div class="playhead"></div></div><div class="time"></div><div class="tv-button action-button"><a class="mute">mute</a></div>'};v(m,a);if(typeof j=="string"){j=document.getElementById(j)}if(!j){return}if(!j.innerHTML.replace(/\s/g,"")){j.innerHTML=m.template}var r=t(m.playHeadClass);var u=t(m.bufferClass);var o=t(m.progressClass);var p=t(m.trackClass);var g=t(m.timeClass);var e=t(m.muteClass);g.innerHTML=y(0,m.duration);var i=l(p);var s=l(r);var c=new h(r,0,0,d(j)+d(p)+(s/2));p.onclick=function(w){w=q(w);if(w.target==r){return false}c.dragTo(w.layerX-s/2)};var z=t(m.playClass);z.onclick=function(){if(n.isLoaded()){n.toggle()}else{n.play()}};e.onclick=function(){if(n.getStatus().muted){n.unmute()}else{n.mute()}};var k=null;function b(w,A){return parseInt(Math.min(w/A*i,i-s/2),10)}n.onStart(function(w){var A=w.duration||0;clearInterval(k);k=setInterval(function(){var C=n.getStatus();if(C.time===undefined){clearInterval(k);return}g.innerHTML=y(C.time,w.duration);var B=b(w.provider=="http"?C.bufferEnd:A,A);u.style.width=B+"px";c.setMax(B);if(!n.isPaused()&&!c.isDragging()){B=b(C.time,A);o.style.width=B+"px";r.style.left=(B-s/2)+"px"}},100)});n.onBegin(function(){z.className=m.pauseClass});n.onPause(function(){z.className=m.playClass});n.onResume(function(){z.className=m.pauseClass});n.onMute(function(){e.className=m.unmuteClass});n.onUnmute(function(){e.className=m.muteClass});n.onFinish(function(w){z.className=m.playClass;clearInterval(k)});n.onUnload(function(){g.innerHTML=y(0,m.duration)});r.onDragEnd=function(w){var A=parseInt(w/i*100,10)+"%";o.style.width=w+"px";if(n.isLoaded()){n.seek(A)}};r.onDrag=function(w){o.style.width=w+"px"};return n});
