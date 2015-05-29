YUI.add("dd-drag",function(d){var e=d.DD.DDM,r="node",g="dragging",m="dragNode",c="offsetHeight",k="offsetWidth",h="drag:mouseDown",b="drag:afterMouseDown",f="drag:removeHandle",l="drag:addHandle",p="drag:removeInvalid",q="drag:addInvalid",j="drag:start",i="drag:end",n="drag:drag",o="drag:align",a=function(t){this._lazyAddAttrs=false;a.superclass.constructor.apply(this,arguments);var s=e._regDrag(this);if(!s){d.error("Failed to register node, already in use: "+t.node);}};a.NAME="drag";a.START_EVENT="mousedown";a.ATTRS={node:{setter:function(s){if(this._canDrag(s)){return s;}var t=d.one(s);if(!t){d.error("DD.Drag: Invalid Node Given: "+s);}return t;}},dragNode:{setter:function(s){if(this._canDrag(s)){return s;}var t=d.one(s);if(!t){d.error("DD.Drag: Invalid dragNode Given: "+s);}return t;}},offsetNode:{value:true},startCentered:{value:false},clickPixelThresh:{value:e.get("clickPixelThresh")},clickTimeThresh:{value:e.get("clickTimeThresh")},lock:{value:false,setter:function(s){if(s){this.get(r).addClass(e.CSS_PREFIX+"-locked");}else{this.get(r).removeClass(e.CSS_PREFIX+"-locked");}return s;}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,setter:function(s){this._handleTarget(s);return s;}},dragMode:{value:null,setter:function(s){return e._setDragMode(s);}},groups:{value:["default"],getter:function(){if(!this._groups){this._groups={};}var s=[];d.each(this._groups,function(u,t){s[s.length]=t;});return s;},setter:function(s){this._groups={};d.each(s,function(u,t){this._groups[u]=true;},this);return s;}},handles:{value:null,setter:function(s){if(s){this._handles={};d.each(s,function(u,t){var w=u;if(u instanceof d.Node||u instanceof d.NodeList){w=u._yuid;}this._handles[w]=u;},this);}else{this._handles=null;}return s;}},bubbles:{setter:function(s){this.addTarget(s);return s;}},haltDown:{value:true}};d.extend(a,d.Base,{_canDrag:function(s){if(s&&s.setXY&&s.getXY&&s.test&&s.contains){return true;}return false;},_bubbleTargets:d.DD.DDM,addToGroup:function(s){this._groups[s]=true;e._activateTargets();return this;},removeFromGroup:function(s){delete this._groups[s];e._activateTargets();return this;},target:null,_handleTarget:function(s){if(d.DD.Drop){if(s===false){if(this.target){e._unregTarget(this.target);this.target=null;}return false;}else{if(!d.Lang.isObject(s)){s={};}s.bubbleTargets=("bubbleTargets" in s)?s.bubbleTargets:d.Object.values(this._yuievt.targets);s.node=this.get(r);s.groups=s.groups||this.get("groups");this.target=new d.DD.Drop(s);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(h,{defaultFn:this._defMouseDownFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(o,{defaultFn:this._defAlignFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(n,{defaultFn:this._defDragFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(i,{defaultFn:this._defEndFn,preventedFn:this._prevEndFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});var s=[b,f,l,p,q,j,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];d.each(s,function(u,t){this.publish(u,{type:u,emitFacade:true,bubbles:true,preventable:false,queuable:false,prefix:"drag"});},this);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true,"select":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,actXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(s){this.fire("drag:mouseup");this._fixIEMouseUp();if(e.activeDrag){e._end();}},_fixDragStart:function(s){s.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(s){if(d.UA.ie){this._ieSelectBack=d.config.doc.body.onselectstart;d.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(d.UA.ie){d.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(s){this.fire(h,{ev:s});},_defMouseDownFn:function(t){var s=t.ev;this._dragThreshMet=false;this._ev_md=s;if(this.get("primaryButtonOnly")&&s.button>1){return false;}if(this.validClick(s)){this._fixIEMouseDown(s);if(this.get("haltDown")){s.halt();}else{s.preventDefault();}this._setStartPosition([s.pageX,s.pageY]);e.activeDrag=this;this._clickTimeout=d.later(this.get("clickTimeThresh"),this,this._timeoutCheck);}this.fire(b,{ev:s});},validClick:function(w){var v=false,z=false,s=w.target,u=null,t=null,x=null,y=false;if(this._handles){d.each(this._handles,function(A,B){if(A instanceof d.Node||A instanceof d.NodeList){if(!v){x=A;if(x instanceof d.Node){x=new d.NodeList(A._node);}x.each(function(C){if(C.contains(s)){v=true;}});}}else{if(d.Lang.isString(B)){if(s.test(B+", "+B+" *")&&!u){u=B;v=true;}}}});}else{z=this.get(r);if(z.contains(s)||z.compareTo(s)){v=true;}}if(v){if(this._invalids){d.each(this._invalids,function(A,B){if(d.Lang.isString(B)){if(s.test(B+", "+B+" *")){v=false;}}});}}if(v){if(u){t=w.currentTarget.all(u);y=false;t.each(function(B,A){if((B.contains(s)||B.compareTo(s))&&!y){y=true;this.set("activeHandle",B);}},this);}else{this.set("activeHandle",this.get(r));}}return v;},_setStartPosition:function(s){this.startXY=s;this.nodeXY=this.lastXY=this.realXY=this.get(r).getXY();if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")&&!this._dragThreshMet&&this._ev_md){this._fromTimeout=this._dragThreshMet=true;this.start();this._alignNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(t){var s=t;if(t instanceof d.Node||t instanceof d.NodeList){s=t._yuid;}if(this._handles[s]){delete this._handles[s];this.fire(f,{handle:t});}return this;},addHandle:function(t){if(!this._handles){this._handles={};}var s=t;
if(t instanceof d.Node||t instanceof d.NodeList){s=t._yuid;}this._handles[s]=t;this.fire(l,{handle:t});return this;},removeInvalid:function(s){if(this._invalids[s]){this._invalids[s]=null;delete this._invalids[s];this.fire(p,{handle:s});}return this;},addInvalid:function(s){if(d.Lang.isString(s)){this._invalids[s]=true;this.fire(q,{handle:s});}return this;},initializer:function(s){this.get(r).dd=this;if(!this.get(r).get("id")){var t=d.stamp(this.get(r));this.get(r).set("id",t);}this.actXY=[];this._invalids=d.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(m)){this.set(m,this.get(r));}this.on("initializedChange",d.bind(this._prep,this));this.set("groups",this.get("groups"));},_prep:function(){this._dragThreshMet=false;var s=this.get(r);s.addClass(e.CSS_PREFIX+"-draggable");s.on(a.START_EVENT,d.bind(this._handleMouseDownEvent,this));s.on("mouseup",d.bind(this._handleMouseUp,this));s.on("dragstart",d.bind(this._fixDragStart,this));},_unprep:function(){var s=this.get(r);s.removeClass(e.CSS_PREFIX+"-draggable");s.detachAll("mouseup");s.detachAll("dragstart");s.detachAll(a.START_EVENT);},start:function(){if(!this.get("lock")&&!this.get(g)){var t=this.get(r),s,u,v;this._startTime=(new Date()).getTime();e._start();t.addClass(e.CSS_PREFIX+"-dragging");this.fire(j,{pageX:this.nodeXY[0],pageY:this.nodeXY[1],startTime:this._startTime});t=this.get(m);v=this.nodeXY;s=t.get(k);u=t.get(c);if(this.get("startCentered")){this._setStartPosition([v[0]+(s/2),v[1]+(u/2)]);}this.region={"0":v[0],"1":v[1],area:0,top:v[1],right:v[0]+s,bottom:v[1]+u,left:v[0]};this.set(g,true);}return this;},end:function(){this._endTime=(new Date()).getTime();if(this._clickTimeout){this._clickTimeout.cancel();}this._dragThreshMet=this._fromTimeout=false;if(!this.get("lock")&&this.get(g)){this.fire(i,{pageX:this.lastXY[0],pageY:this.lastXY[1],startTime:this._startTime,endTime:this._endTime});}this.get(r).removeClass(e.CSS_PREFIX+"-dragging");this.set(g,false);this.deltaXY=[0,0];return this;},_defEndFn:function(s){this._fixIEMouseUp();this._ev_md=null;},_prevEndFn:function(s){this._fixIEMouseUp();this.get(m).setXY(this.nodeXY);this._ev_md=null;this.region=null;},_align:function(s){this.fire(o,{pageX:s[0],pageY:s[1]});},_defAlignFn:function(s){this.actXY=[s.pageX-this.deltaXY[0],s.pageY-this.deltaXY[1]];},_alignNode:function(s){this._align(s);this._moveNode();},_moveNode:function(s){var t=[],u=[],w=this.nodeXY,v=this.actXY;t[0]=(v[0]-this.lastXY[0]);t[1]=(v[1]-this.lastXY[1]);u[0]=(v[0]-this.nodeXY[0]);u[1]=(v[1]-this.nodeXY[1]);this.region={"0":v[0],"1":v[1],area:0,top:v[1],right:v[0]+this.get(m).get(k),bottom:v[1]+this.get(m).get(c),left:v[0]};this.fire(n,{pageX:v[0],pageY:v[1],scroll:s,info:{start:w,xy:v,delta:t,offset:u}});this.lastXY=v;},_defDragFn:function(s){if(this.get("move")){if(s.scroll){s.scroll.node.set("scrollTop",s.scroll.top);s.scroll.node.set("scrollLeft",s.scroll.left);}this.get(m).setXY([s.pageX,s.pageY]);this.realXY=[s.pageX,s.pageY];}},_move:function(u){if(this.get("lock")){return false;}else{this.mouseXY=[u.pageX,u.pageY];if(!this._dragThreshMet){var t=Math.abs(this.startXY[0]-u.pageX),s=Math.abs(this.startXY[1]-u.pageY);if(t>this.get("clickPixelThresh")||s>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._alignNode([u.pageX,u.pageY]);}}else{if(this._clickTimeout){this._clickTimeout.cancel();}this._alignNode([u.pageX,u.pageY]);}}},stopDrag:function(){if(this.get(g)){e._end();}return this;},destructor:function(){this._unprep();if(this.target){this.target.destroy();}e._unregDrag(this);}});d.namespace("DD");d.DD.Drag=a;},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});