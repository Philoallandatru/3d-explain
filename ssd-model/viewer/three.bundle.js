(()=>{var g6={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},p6={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};var L5=0;var D5=2;var w5=0;var N8=1000,C5=1001,_5=1002,R9=1003,P5=1004;var A5=1005;var z8=1006,T5=1007;var N9=1008;var I5=2300,z9=2301;var S5=0,B8=1,j7=2;var w6="srgb",e0="srgb-linear";class C6{addEventListener(J,$){if(this._listeners===void 0)this._listeners={};let Q=this._listeners;if(Q[J]===void 0)Q[J]=[];if(Q[J].indexOf($)===-1)Q[J].push($)}hasEventListener(J,$){if(this._listeners===void 0)return!1;let Q=this._listeners;return Q[J]!==void 0&&Q[J].indexOf($)!==-1}removeEventListener(J,$){if(this._listeners===void 0)return;let Z=this._listeners[J];if(Z!==void 0){let W=Z.indexOf($);if(W!==-1)Z.splice(W,1)}}dispatchEvent(J){if(this._listeners===void 0)return;let Q=this._listeners[J.type];if(Q!==void 0){J.target=this;let Z=Q.slice(0);for(let W=0,Y=Z.length;W<Y;W++)Z[W].call(this,J);J.target=null}}}var z0=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],U$=1234567,A7=Math.PI/180,U7=180/Math.PI;function c0(){let J=Math.random()*4294967295|0,$=Math.random()*4294967295|0,Q=Math.random()*4294967295|0,Z=Math.random()*4294967295|0;return(z0[J&255]+z0[J>>8&255]+z0[J>>16&255]+z0[J>>24&255]+"-"+z0[$&255]+z0[$>>8&255]+"-"+z0[$>>16&15|64]+z0[$>>24&255]+"-"+z0[Q&63|128]+z0[Q>>8&255]+"-"+z0[Q>>16&255]+z0[Q>>24&255]+z0[Z&255]+z0[Z>>8&255]+z0[Z>>16&255]+z0[Z>>24&255]).toLowerCase()}function N0(J,$,Q){return Math.max($,Math.min(Q,J))}function B9(J,$){return(J%$+$)%$}function oQ(J,$,Q,Z,W){return Z+(J-$)*(W-Z)/(Q-$)}function iQ(J,$,Q){if(J!==$)return(Q-J)/($-J);else return 0}function T7(J,$,Q){return(1-Q)*J+Q*$}function aQ(J,$,Q,Z){return T7(J,$,1-Math.exp(-Q*Z))}function rQ(J,$=1){return $-Math.abs(B9(J,$*2)-$)}function tQ(J,$,Q){if(J<=$)return 0;if(J>=Q)return 1;return J=(J-$)/(Q-$),J*J*(3-2*J)}function eQ(J,$,Q){if(J<=$)return 0;if(J>=Q)return 1;return J=(J-$)/(Q-$),J*J*J*(J*(J*6-15)+10)}function JZ(J,$){return J+Math.floor(Math.random()*($-J+1))}function $Z(J,$){return J+Math.random()*($-J)}function QZ(J){return J*(0.5-Math.random())}function ZZ(J){if(J!==void 0)U$=J;let $=U$+=1831565813;return $=Math.imul($^$>>>15,$|1),$^=$+Math.imul($^$>>>7,$|61),(($^$>>>14)>>>0)/4294967296}function WZ(J){return J*A7}function YZ(J){return J*U7}function XZ(J){return(J&J-1)===0&&J!==0}function HZ(J){return Math.pow(2,Math.ceil(Math.log(J)/Math.LN2))}function KZ(J){return Math.pow(2,Math.floor(Math.log(J)/Math.LN2))}function qZ(J,$,Q,Z,W){let{cos:Y,sin:X}=Math,H=Y(Q/2),K=X(Q/2),q=Y(($+Z)/2),G=X(($+Z)/2),U=Y(($-Z)/2),F=X(($-Z)/2),O=Y((Z-$)/2),z=X((Z-$)/2);switch(W){case"XYX":J.set(H*G,K*U,K*F,H*q);break;case"YZY":J.set(K*F,H*G,K*U,H*q);break;case"ZXZ":J.set(K*U,K*F,H*G,H*q);break;case"XZX":J.set(H*G,K*z,K*O,H*q);break;case"YXY":J.set(K*O,H*G,K*z,H*q);break;case"ZYZ":J.set(K*z,K*O,H*G,H*q);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+W)}}function u0(J,$){switch($.constructor){case Float32Array:return J;case Uint32Array:return J/4294967295;case Uint16Array:return J/65535;case Uint8Array:return J/255;case Int32Array:return Math.max(J/2147483647,-1);case Int16Array:return Math.max(J/32767,-1);case Int8Array:return Math.max(J/127,-1);default:throw Error("Invalid component type.")}}function iJ(J,$){switch($.constructor){case Float32Array:return J;case Uint32Array:return Math.round(J*4294967295);case Uint16Array:return Math.round(J*65535);case Uint8Array:return Math.round(J*255);case Int32Array:return Math.round(J*2147483647);case Int16Array:return Math.round(J*32767);case Int8Array:return Math.round(J*127);default:throw Error("Invalid component type.")}}var M8={DEG2RAD:A7,RAD2DEG:U7,generateUUID:c0,clamp:N0,euclideanModulo:B9,mapLinear:oQ,inverseLerp:iQ,lerp:T7,damp:aQ,pingpong:rQ,smoothstep:tQ,smootherstep:eQ,randInt:JZ,randFloat:$Z,randFloatSpread:QZ,seededRandom:ZZ,degToRad:WZ,radToDeg:YZ,isPowerOfTwo:XZ,ceilPowerOfTwo:HZ,floorPowerOfTwo:KZ,setQuaternionFromProperEuler:qZ,normalize:iJ,denormalize:u0};class LJ{constructor(J=0,$=0){LJ.prototype.isVector2=!0,this.x=J,this.y=$}get width(){return this.x}set width(J){this.x=J}get height(){return this.y}set height(J){this.y=J}set(J,$){return this.x=J,this.y=$,this}setScalar(J){return this.x=J,this.y=J,this}setX(J){return this.x=J,this}setY(J){return this.y=J,this}setComponent(J,$){switch(J){case 0:this.x=$;break;case 1:this.y=$;break;default:throw Error("index is out of range: "+J)}return this}getComponent(J){switch(J){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+J)}}clone(){return new this.constructor(this.x,this.y)}copy(J){return this.x=J.x,this.y=J.y,this}add(J){return this.x+=J.x,this.y+=J.y,this}addScalar(J){return this.x+=J,this.y+=J,this}addVectors(J,$){return this.x=J.x+$.x,this.y=J.y+$.y,this}addScaledVector(J,$){return this.x+=J.x*$,this.y+=J.y*$,this}sub(J){return this.x-=J.x,this.y-=J.y,this}subScalar(J){return this.x-=J,this.y-=J,this}subVectors(J,$){return this.x=J.x-$.x,this.y=J.y-$.y,this}multiply(J){return this.x*=J.x,this.y*=J.y,this}multiplyScalar(J){return this.x*=J,this.y*=J,this}divide(J){return this.x/=J.x,this.y/=J.y,this}divideScalar(J){return this.multiplyScalar(1/J)}applyMatrix3(J){let $=this.x,Q=this.y,Z=J.elements;return this.x=Z[0]*$+Z[3]*Q+Z[6],this.y=Z[1]*$+Z[4]*Q+Z[7],this}min(J){return this.x=Math.min(this.x,J.x),this.y=Math.min(this.y,J.y),this}max(J){return this.x=Math.max(this.x,J.x),this.y=Math.max(this.y,J.y),this}clamp(J,$){return this.x=Math.max(J.x,Math.min($.x,this.x)),this.y=Math.max(J.y,Math.min($.y,this.y)),this}clampScalar(J,$){return this.x=Math.max(J,Math.min($,this.x)),this.y=Math.max(J,Math.min($,this.y)),this}clampLength(J,$){let Q=this.length();return this.divideScalar(Q||1).multiplyScalar(Math.max(J,Math.min($,Q)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(J){return this.x*J.x+this.y*J.y}cross(J){return this.x*J.y-this.y*J.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(J){let $=Math.sqrt(this.lengthSq()*J.lengthSq());if($===0)return Math.PI/2;let Q=this.dot(J)/$;return Math.acos(N0(Q,-1,1))}distanceTo(J){return Math.sqrt(this.distanceToSquared(J))}distanceToSquared(J){let $=this.x-J.x,Q=this.y-J.y;return $*$+Q*Q}manhattanDistanceTo(J){return Math.abs(this.x-J.x)+Math.abs(this.y-J.y)}setLength(J){return this.normalize().multiplyScalar(J)}lerp(J,$){return this.x+=(J.x-this.x)*$,this.y+=(J.y-this.y)*$,this}lerpVectors(J,$,Q){return this.x=J.x+($.x-J.x)*Q,this.y=J.y+($.y-J.y)*Q,this}equals(J){return J.x===this.x&&J.y===this.y}fromArray(J,$=0){return this.x=J[$],this.y=J[$+1],this}toArray(J=[],$=0){return J[$]=this.x,J[$+1]=this.y,J}fromBufferAttribute(J,$){return this.x=J.getX($),this.y=J.getY($),this}rotateAround(J,$){let Q=Math.cos($),Z=Math.sin($),W=this.x-J.x,Y=this.y-J.y;return this.x=W*Q-Y*Z+J.x,this.y=W*Z+Y*Q+J.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class yJ{constructor(J,$,Q,Z,W,Y,X,H,K){if(yJ.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],J!==void 0)this.set(J,$,Q,Z,W,Y,X,H,K)}set(J,$,Q,Z,W,Y,X,H,K){let q=this.elements;return q[0]=J,q[1]=Z,q[2]=X,q[3]=$,q[4]=W,q[5]=H,q[6]=Q,q[7]=Y,q[8]=K,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(J){let $=this.elements,Q=J.elements;return $[0]=Q[0],$[1]=Q[1],$[2]=Q[2],$[3]=Q[3],$[4]=Q[4],$[5]=Q[5],$[6]=Q[6],$[7]=Q[7],$[8]=Q[8],this}extractBasis(J,$,Q){return J.setFromMatrix3Column(this,0),$.setFromMatrix3Column(this,1),Q.setFromMatrix3Column(this,2),this}setFromMatrix4(J){let $=J.elements;return this.set($[0],$[4],$[8],$[1],$[5],$[9],$[2],$[6],$[10]),this}multiply(J){return this.multiplyMatrices(this,J)}premultiply(J){return this.multiplyMatrices(J,this)}multiplyMatrices(J,$){let Q=J.elements,Z=$.elements,W=this.elements,Y=Q[0],X=Q[3],H=Q[6],K=Q[1],q=Q[4],G=Q[7],U=Q[2],F=Q[5],O=Q[8],z=Z[0],R=Z[3],V=Z[6],E=Z[1],D=Z[4],M=Z[7],_=Z[2],x=Z[5],C=Z[8];return W[0]=Y*z+X*E+H*_,W[3]=Y*R+X*D+H*x,W[6]=Y*V+X*M+H*C,W[1]=K*z+q*E+G*_,W[4]=K*R+q*D+G*x,W[7]=K*V+q*M+G*C,W[2]=U*z+F*E+O*_,W[5]=U*R+F*D+O*x,W[8]=U*V+F*M+O*C,this}multiplyScalar(J){let $=this.elements;return $[0]*=J,$[3]*=J,$[6]*=J,$[1]*=J,$[4]*=J,$[7]*=J,$[2]*=J,$[5]*=J,$[8]*=J,this}determinant(){let J=this.elements,$=J[0],Q=J[1],Z=J[2],W=J[3],Y=J[4],X=J[5],H=J[6],K=J[7],q=J[8];return $*Y*q-$*X*K-Q*W*q+Q*X*H+Z*W*K-Z*Y*H}invert(){let J=this.elements,$=J[0],Q=J[1],Z=J[2],W=J[3],Y=J[4],X=J[5],H=J[6],K=J[7],q=J[8],G=q*Y-X*K,U=X*H-q*W,F=K*W-Y*H,O=$*G+Q*U+Z*F;if(O===0)return this.set(0,0,0,0,0,0,0,0,0);let z=1/O;return J[0]=G*z,J[1]=(Z*K-q*Q)*z,J[2]=(X*Q-Z*Y)*z,J[3]=U*z,J[4]=(q*$-Z*H)*z,J[5]=(Z*W-X*$)*z,J[6]=F*z,J[7]=(Q*H-K*$)*z,J[8]=(Y*$-Q*W)*z,this}transpose(){let J,$=this.elements;return J=$[1],$[1]=$[3],$[3]=J,J=$[2],$[2]=$[6],$[6]=J,J=$[5],$[5]=$[7],$[7]=J,this}getNormalMatrix(J){return this.setFromMatrix4(J).invert().transpose()}transposeIntoArray(J){let $=this.elements;return J[0]=$[0],J[1]=$[3],J[2]=$[6],J[3]=$[1],J[4]=$[4],J[5]=$[7],J[6]=$[2],J[7]=$[5],J[8]=$[8],this}setUvTransform(J,$,Q,Z,W,Y,X){let H=Math.cos(W),K=Math.sin(W);return this.set(Q*H,Q*K,-Q*(H*Y+K*X)+Y+J,-Z*K,Z*H,-Z*(-K*Y+H*X)+X+$,0,0,1),this}scale(J,$){return this.premultiply(h8.makeScale(J,$)),this}rotate(J){return this.premultiply(h8.makeRotation(-J)),this}translate(J,$){return this.premultiply(h8.makeTranslation(J,$)),this}makeTranslation(J,$){if(J.isVector2)this.set(1,0,J.x,0,1,J.y,0,0,1);else this.set(1,0,J,0,1,$,0,0,1);return this}makeRotation(J){let $=Math.cos(J),Q=Math.sin(J);return this.set($,-Q,0,Q,$,0,0,0,1),this}makeScale(J,$){return this.set(J,0,0,0,$,0,0,0,1),this}equals(J){let $=this.elements,Q=J.elements;for(let Z=0;Z<9;Z++)if($[Z]!==Q[Z])return!1;return!0}fromArray(J,$=0){for(let Q=0;Q<9;Q++)this.elements[Q]=J[Q+$];return this}toArray(J=[],$=0){let Q=this.elements;return J[$]=Q[0],J[$+1]=Q[1],J[$+2]=Q[2],J[$+3]=Q[3],J[$+4]=Q[4],J[$+5]=Q[5],J[$+6]=Q[6],J[$+7]=Q[7],J[$+8]=Q[8],J}clone(){return new this.constructor().fromArray(this.elements)}}var h8=new yJ;function j5(J){for(let $=J.length-1;$>=0;--$)if(J[$]>=65535)return!0;return!1}function S7(J){return document.createElementNS("http://www.w3.org/1999/xhtml",J)}function GZ(){let J=S7("canvas");return J.style.display="block",J}var F$={};function _7(J){if(J in F$)return;F$[J]=!0,console.warn(J)}function UZ(J,$,Q){return new Promise(function(Z,W){function Y(){switch(J.clientWaitSync($,J.SYNC_FLUSH_COMMANDS_BIT,0)){case J.WAIT_FAILED:W();break;case J.TIMEOUT_EXPIRED:setTimeout(Y,Q);break;default:Z()}}setTimeout(Y,Q)})}function FZ(J){let $=J.elements;$[2]=0.5*$[2]+0.5*$[3],$[6]=0.5*$[6]+0.5*$[7],$[10]=0.5*$[10]+0.5*$[11],$[14]=0.5*$[14]+0.5*$[15]}function VZ(J){let $=J.elements;if($[11]===-1)$[10]=-$[10]-1,$[14]=-$[14];else $[10]=-$[10],$[14]=-$[14]+1}var pJ={enabled:!0,workingColorSpace:"srgb-linear",spaces:{},convert:function(J,$,Q){if(this.enabled===!1||$===Q||!$||!Q)return J;if(this.spaces[$].transfer==="srgb")J.r=K6(J.r),J.g=K6(J.g),J.b=K6(J.b);if(this.spaces[$].primaries!==this.spaces[Q].primaries)J.applyMatrix3(this.spaces[$].toXYZ),J.applyMatrix3(this.spaces[Q].fromXYZ);if(this.spaces[Q].transfer==="srgb")J.r=G7(J.r),J.g=G7(J.g),J.b=G7(J.b);return J},fromWorkingColorSpace:function(J,$){return this.convert(J,this.workingColorSpace,$)},toWorkingColorSpace:function(J,$){return this.convert(J,$,this.workingColorSpace)},getPrimaries:function(J){return this.spaces[J].primaries},getTransfer:function(J){if(J==="")return"linear";return this.spaces[J].transfer},getLuminanceCoefficients:function(J,$=this.workingColorSpace){return J.fromArray(this.spaces[$].luminanceCoefficients)},define:function(J){Object.assign(this.spaces,J)},_getMatrix:function(J,$,Q){return J.copy(this.spaces[$].toXYZ).multiply(this.spaces[Q].fromXYZ)},_getDrawingBufferColorSpace:function(J){return this.spaces[J].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(J=this.workingColorSpace){return this.spaces[J].workingColorSpaceConfig.unpackColorSpace}};function K6(J){return J<0.04045?J*0.0773993808:Math.pow(J*0.9478672986+0.0521327014,2.4)}function G7(J){return J<0.0031308?J*12.92:1.055*Math.pow(J,0.41666)-0.055}var V$=[0.64,0.33,0.3,0.6,0.15,0.06],E$=[0.2126,0.7152,0.0722],O$=[0.3127,0.329],R$=new yJ().set(0.4123908,0.3575843,0.1804808,0.212639,0.7151687,0.0721923,0.0193308,0.1191948,0.9505322),N$=new yJ().set(3.2409699,-1.5373832,-0.4986108,-0.9692436,1.8759675,0.0415551,0.0556301,-0.203977,1.0569715);pJ.define({["srgb-linear"]:{primaries:V$,whitePoint:O$,transfer:"linear",toXYZ:R$,fromXYZ:N$,luminanceCoefficients:E$,workingColorSpaceConfig:{unpackColorSpace:"srgb"},outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}},["srgb"]:{primaries:V$,whitePoint:O$,transfer:"srgb",toXYZ:R$,fromXYZ:N$,luminanceCoefficients:E$,outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}}});var i6;class y5{static getDataURL(J){if(/^data:/i.test(J.src))return J.src;if(typeof HTMLCanvasElement>"u")return J.src;let $;if(J instanceof HTMLCanvasElement)$=J;else{if(i6===void 0)i6=S7("canvas");i6.width=J.width,i6.height=J.height;let Q=i6.getContext("2d");if(J instanceof ImageData)Q.putImageData(J,0,0);else Q.drawImage(J,0,0,J.width,J.height);$=i6}if($.width>2048||$.height>2048)return console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",J),$.toDataURL("image/jpeg",0.6);else return $.toDataURL("image/png")}static sRGBToLinear(J){if(typeof HTMLImageElement<"u"&&J instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&J instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&J instanceof ImageBitmap){let $=S7("canvas");$.width=J.width,$.height=J.height;let Q=$.getContext("2d");Q.drawImage(J,0,0,J.width,J.height);let Z=Q.getImageData(0,0,J.width,J.height),W=Z.data;for(let Y=0;Y<W.length;Y++)W[Y]=K6(W[Y]/255)*255;return Q.putImageData(Z,0,0),$}else if(J.data){let $=J.data.slice(0);for(let Q=0;Q<$.length;Q++)if($ instanceof Uint8Array||$ instanceof Uint8ClampedArray)$[Q]=Math.floor(K6($[Q]/255)*255);else $[Q]=K6($[Q]);return{data:$,width:J.width,height:J.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),J}}var EZ=0;class M9{constructor(J=null){this.isSource=!0,Object.defineProperty(this,"id",{value:EZ++}),this.uuid=c0(),this.data=J,this.dataReady=!0,this.version=0}set needsUpdate(J){if(J===!0)this.version++}toJSON(J){let $=J===void 0||typeof J==="string";if(!$&&J.images[this.uuid]!==void 0)return J.images[this.uuid];let Q={uuid:this.uuid,url:""},Z=this.data;if(Z!==null){let W;if(Array.isArray(Z)){W=[];for(let Y=0,X=Z.length;Y<X;Y++)if(Z[Y].isDataTexture)W.push(f8(Z[Y].image));else W.push(f8(Z[Y]))}else W=f8(Z);Q.url=W}if(!$)J.images[this.uuid]=Q;return Q}}function f8(J){if(typeof HTMLImageElement<"u"&&J instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&J instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&J instanceof ImageBitmap)return y5.getDataURL(J);else if(J.data)return{data:Array.from(J.data),width:J.width,height:J.height,type:J.data.constructor.name};else return console.warn("THREE.Texture: Unable to serialize Texture."),{}}var OZ=0;class K0 extends C6{constructor(J=K0.DEFAULT_IMAGE,$=K0.DEFAULT_MAPPING,Q=1001,Z=1001,W=1006,Y=1008,X=1023,H=1009,K=K0.DEFAULT_ANISOTROPY,q=""){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:OZ++}),this.uuid=c0(),this.name="",this.source=new M9(J),this.mipmaps=[],this.mapping=$,this.channel=0,this.wrapS=Q,this.wrapT=Z,this.magFilter=W,this.minFilter=Y,this.anisotropy=K,this.format=X,this.internalFormat=null,this.type=H,this.offset=new LJ(0,0),this.repeat=new LJ(1,1),this.center=new LJ(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yJ,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=q,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(J=null){this.source.data=J}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(J){return this.name=J.name,this.source=J.source,this.mipmaps=J.mipmaps.slice(0),this.mapping=J.mapping,this.channel=J.channel,this.wrapS=J.wrapS,this.wrapT=J.wrapT,this.magFilter=J.magFilter,this.minFilter=J.minFilter,this.anisotropy=J.anisotropy,this.format=J.format,this.internalFormat=J.internalFormat,this.type=J.type,this.offset.copy(J.offset),this.repeat.copy(J.repeat),this.center.copy(J.center),this.rotation=J.rotation,this.matrixAutoUpdate=J.matrixAutoUpdate,this.matrix.copy(J.matrix),this.generateMipmaps=J.generateMipmaps,this.premultiplyAlpha=J.premultiplyAlpha,this.flipY=J.flipY,this.unpackAlignment=J.unpackAlignment,this.colorSpace=J.colorSpace,this.userData=JSON.parse(JSON.stringify(J.userData)),this.needsUpdate=!0,this}toJSON(J){let $=J===void 0||typeof J==="string";if(!$&&J.textures[this.uuid]!==void 0)return J.textures[this.uuid];let Q={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(J).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(Object.keys(this.userData).length>0)Q.userData=this.userData;if(!$)J.textures[this.uuid]=Q;return Q}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(J){if(this.mapping!==300)return J;if(J.applyMatrix3(this.matrix),J.x<0||J.x>1)switch(this.wrapS){case 1000:J.x=J.x-Math.floor(J.x);break;case 1001:J.x=J.x<0?0:1;break;case 1002:if(Math.abs(Math.floor(J.x)%2)===1)J.x=Math.ceil(J.x)-J.x;else J.x=J.x-Math.floor(J.x);break}if(J.y<0||J.y>1)switch(this.wrapT){case 1000:J.y=J.y-Math.floor(J.y);break;case 1001:J.y=J.y<0?0:1;break;case 1002:if(Math.abs(Math.floor(J.y)%2)===1)J.y=Math.ceil(J.y)-J.y;else J.y=J.y-Math.floor(J.y);break}if(this.flipY)J.y=1-J.y;return J}set needsUpdate(J){if(J===!0)this.version++,this.source.needsUpdate=!0}set needsPMREMUpdate(J){if(J===!0)this.pmremVersion++}}K0.DEFAULT_IMAGE=null;K0.DEFAULT_MAPPING=300;K0.DEFAULT_ANISOTROPY=1;class dJ{constructor(J=0,$=0,Q=0,Z=1){dJ.prototype.isVector4=!0,this.x=J,this.y=$,this.z=Q,this.w=Z}get width(){return this.z}set width(J){this.z=J}get height(){return this.w}set height(J){this.w=J}set(J,$,Q,Z){return this.x=J,this.y=$,this.z=Q,this.w=Z,this}setScalar(J){return this.x=J,this.y=J,this.z=J,this.w=J,this}setX(J){return this.x=J,this}setY(J){return this.y=J,this}setZ(J){return this.z=J,this}setW(J){return this.w=J,this}setComponent(J,$){switch(J){case 0:this.x=$;break;case 1:this.y=$;break;case 2:this.z=$;break;case 3:this.w=$;break;default:throw Error("index is out of range: "+J)}return this}getComponent(J){switch(J){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+J)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(J){return this.x=J.x,this.y=J.y,this.z=J.z,this.w=J.w!==void 0?J.w:1,this}add(J){return this.x+=J.x,this.y+=J.y,this.z+=J.z,this.w+=J.w,this}addScalar(J){return this.x+=J,this.y+=J,this.z+=J,this.w+=J,this}addVectors(J,$){return this.x=J.x+$.x,this.y=J.y+$.y,this.z=J.z+$.z,this.w=J.w+$.w,this}addScaledVector(J,$){return this.x+=J.x*$,this.y+=J.y*$,this.z+=J.z*$,this.w+=J.w*$,this}sub(J){return this.x-=J.x,this.y-=J.y,this.z-=J.z,this.w-=J.w,this}subScalar(J){return this.x-=J,this.y-=J,this.z-=J,this.w-=J,this}subVectors(J,$){return this.x=J.x-$.x,this.y=J.y-$.y,this.z=J.z-$.z,this.w=J.w-$.w,this}multiply(J){return this.x*=J.x,this.y*=J.y,this.z*=J.z,this.w*=J.w,this}multiplyScalar(J){return this.x*=J,this.y*=J,this.z*=J,this.w*=J,this}applyMatrix4(J){let $=this.x,Q=this.y,Z=this.z,W=this.w,Y=J.elements;return this.x=Y[0]*$+Y[4]*Q+Y[8]*Z+Y[12]*W,this.y=Y[1]*$+Y[5]*Q+Y[9]*Z+Y[13]*W,this.z=Y[2]*$+Y[6]*Q+Y[10]*Z+Y[14]*W,this.w=Y[3]*$+Y[7]*Q+Y[11]*Z+Y[15]*W,this}divide(J){return this.x/=J.x,this.y/=J.y,this.z/=J.z,this.w/=J.w,this}divideScalar(J){return this.multiplyScalar(1/J)}setAxisAngleFromQuaternion(J){this.w=2*Math.acos(J.w);let $=Math.sqrt(1-J.w*J.w);if($<0.0001)this.x=1,this.y=0,this.z=0;else this.x=J.x/$,this.y=J.y/$,this.z=J.z/$;return this}setAxisAngleFromRotationMatrix(J){let $,Q,Z,W,Y=0.01,X=0.1,H=J.elements,K=H[0],q=H[4],G=H[8],U=H[1],F=H[5],O=H[9],z=H[2],R=H[6],V=H[10];if(Math.abs(q-U)<0.01&&Math.abs(G-z)<0.01&&Math.abs(O-R)<0.01){if(Math.abs(q+U)<0.1&&Math.abs(G+z)<0.1&&Math.abs(O+R)<0.1&&Math.abs(K+F+V-3)<0.1)return this.set(1,0,0,0),this;$=Math.PI;let D=(K+1)/2,M=(F+1)/2,_=(V+1)/2,x=(q+U)/4,C=(G+z)/4,P=(O+R)/4;if(D>M&&D>_)if(D<0.01)Q=0,Z=0.707106781,W=0.707106781;else Q=Math.sqrt(D),Z=x/Q,W=C/Q;else if(M>_)if(M<0.01)Q=0.707106781,Z=0,W=0.707106781;else Z=Math.sqrt(M),Q=x/Z,W=P/Z;else if(_<0.01)Q=0.707106781,Z=0.707106781,W=0;else W=Math.sqrt(_),Q=C/W,Z=P/W;return this.set(Q,Z,W,$),this}let E=Math.sqrt((R-O)*(R-O)+(G-z)*(G-z)+(U-q)*(U-q));if(Math.abs(E)<0.001)E=1;return this.x=(R-O)/E,this.y=(G-z)/E,this.z=(U-q)/E,this.w=Math.acos((K+F+V-1)/2),this}setFromMatrixPosition(J){let $=J.elements;return this.x=$[12],this.y=$[13],this.z=$[14],this.w=$[15],this}min(J){return this.x=Math.min(this.x,J.x),this.y=Math.min(this.y,J.y),this.z=Math.min(this.z,J.z),this.w=Math.min(this.w,J.w),this}max(J){return this.x=Math.max(this.x,J.x),this.y=Math.max(this.y,J.y),this.z=Math.max(this.z,J.z),this.w=Math.max(this.w,J.w),this}clamp(J,$){return this.x=Math.max(J.x,Math.min($.x,this.x)),this.y=Math.max(J.y,Math.min($.y,this.y)),this.z=Math.max(J.z,Math.min($.z,this.z)),this.w=Math.max(J.w,Math.min($.w,this.w)),this}clampScalar(J,$){return this.x=Math.max(J,Math.min($,this.x)),this.y=Math.max(J,Math.min($,this.y)),this.z=Math.max(J,Math.min($,this.z)),this.w=Math.max(J,Math.min($,this.w)),this}clampLength(J,$){let Q=this.length();return this.divideScalar(Q||1).multiplyScalar(Math.max(J,Math.min($,Q)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(J){return this.x*J.x+this.y*J.y+this.z*J.z+this.w*J.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(J){return this.normalize().multiplyScalar(J)}lerp(J,$){return this.x+=(J.x-this.x)*$,this.y+=(J.y-this.y)*$,this.z+=(J.z-this.z)*$,this.w+=(J.w-this.w)*$,this}lerpVectors(J,$,Q){return this.x=J.x+($.x-J.x)*Q,this.y=J.y+($.y-J.y)*Q,this.z=J.z+($.z-J.z)*Q,this.w=J.w+($.w-J.w)*Q,this}equals(J){return J.x===this.x&&J.y===this.y&&J.z===this.z&&J.w===this.w}fromArray(J,$=0){return this.x=J[$],this.y=J[$+1],this.z=J[$+2],this.w=J[$+3],this}toArray(J=[],$=0){return J[$]=this.x,J[$+1]=this.y,J[$+2]=this.z,J[$+3]=this.w,J}fromBufferAttribute(J,$){return this.x=J.getX($),this.y=J.getY($),this.z=J.getZ($),this.w=J.getW($),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class v5 extends C6{constructor(J=1,$=1,Q={}){super();this.isRenderTarget=!0,this.width=J,this.height=$,this.depth=1,this.scissor=new dJ(0,0,J,$),this.scissorTest=!1,this.viewport=new dJ(0,0,J,$);let Z={width:J,height:$,depth:1};Q=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},Q);let W=new K0(Z,Q.mapping,Q.wrapS,Q.wrapT,Q.magFilter,Q.minFilter,Q.format,Q.type,Q.anisotropy,Q.colorSpace);W.flipY=!1,W.generateMipmaps=Q.generateMipmaps,W.internalFormat=Q.internalFormat,this.textures=[];let Y=Q.count;for(let X=0;X<Y;X++)this.textures[X]=W.clone(),this.textures[X].isRenderTargetTexture=!0;this.depthBuffer=Q.depthBuffer,this.stencilBuffer=Q.stencilBuffer,this.resolveDepthBuffer=Q.resolveDepthBuffer,this.resolveStencilBuffer=Q.resolveStencilBuffer,this.depthTexture=Q.depthTexture,this.samples=Q.samples}get texture(){return this.textures[0]}set texture(J){this.textures[0]=J}setSize(J,$,Q=1){if(this.width!==J||this.height!==$||this.depth!==Q){this.width=J,this.height=$,this.depth=Q;for(let Z=0,W=this.textures.length;Z<W;Z++)this.textures[Z].image.width=J,this.textures[Z].image.height=$,this.textures[Z].image.depth=Q;this.dispose()}this.viewport.set(0,0,J,$),this.scissor.set(0,0,J,$)}clone(){return new this.constructor().copy(this)}copy(J){this.width=J.width,this.height=J.height,this.depth=J.depth,this.scissor.copy(J.scissor),this.scissorTest=J.scissorTest,this.viewport.copy(J.viewport),this.textures.length=0;for(let Q=0,Z=J.textures.length;Q<Z;Q++)this.textures[Q]=J.textures[Q].clone(),this.textures[Q].isRenderTargetTexture=!0;let $=Object.assign({},J.texture.image);if(this.texture.source=new M9($),this.depthBuffer=J.depthBuffer,this.stencilBuffer=J.stencilBuffer,this.resolveDepthBuffer=J.resolveDepthBuffer,this.resolveStencilBuffer=J.resolveStencilBuffer,J.depthTexture!==null)this.depthTexture=J.depthTexture.clone();return this.samples=J.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class k6 extends v5{constructor(J=1,$=1,Q={}){super(J,$,Q);this.isWebGLRenderTarget=!0}}class k9 extends K0{constructor(J=null,$=1,Q=1,Z=1){super(null);this.isDataArrayTexture=!0,this.image={data:J,width:$,height:Q,depth:Z},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(J){this.layerUpdates.add(J)}clearLayerUpdates(){this.layerUpdates.clear()}}class h5 extends K0{constructor(J=null,$=1,Q=1,Z=1){super(null);this.isData3DTexture=!0,this.image={data:J,width:$,height:Q,depth:Z},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class I0{constructor(J=0,$=0,Q=0,Z=1){this.isQuaternion=!0,this._x=J,this._y=$,this._z=Q,this._w=Z}static slerpFlat(J,$,Q,Z,W,Y,X){let H=Q[Z+0],K=Q[Z+1],q=Q[Z+2],G=Q[Z+3],U=W[Y+0],F=W[Y+1],O=W[Y+2],z=W[Y+3];if(X===0){J[$+0]=H,J[$+1]=K,J[$+2]=q,J[$+3]=G;return}if(X===1){J[$+0]=U,J[$+1]=F,J[$+2]=O,J[$+3]=z;return}if(G!==z||H!==U||K!==F||q!==O){let R=1-X,V=H*U+K*F+q*O+G*z,E=V>=0?1:-1,D=1-V*V;if(D>Number.EPSILON){let _=Math.sqrt(D),x=Math.atan2(_,V*E);R=Math.sin(R*x)/_,X=Math.sin(X*x)/_}let M=X*E;if(H=H*R+U*M,K=K*R+F*M,q=q*R+O*M,G=G*R+z*M,R===1-X){let _=1/Math.sqrt(H*H+K*K+q*q+G*G);H*=_,K*=_,q*=_,G*=_}}J[$]=H,J[$+1]=K,J[$+2]=q,J[$+3]=G}static multiplyQuaternionsFlat(J,$,Q,Z,W,Y){let X=Q[Z],H=Q[Z+1],K=Q[Z+2],q=Q[Z+3],G=W[Y],U=W[Y+1],F=W[Y+2],O=W[Y+3];return J[$]=X*O+q*G+H*F-K*U,J[$+1]=H*O+q*U+K*G-X*F,J[$+2]=K*O+q*F+X*U-H*G,J[$+3]=q*O-X*G-H*U-K*F,J}get x(){return this._x}set x(J){this._x=J,this._onChangeCallback()}get y(){return this._y}set y(J){this._y=J,this._onChangeCallback()}get z(){return this._z}set z(J){this._z=J,this._onChangeCallback()}get w(){return this._w}set w(J){this._w=J,this._onChangeCallback()}set(J,$,Q,Z){return this._x=J,this._y=$,this._z=Q,this._w=Z,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(J){return this._x=J.x,this._y=J.y,this._z=J.z,this._w=J.w,this._onChangeCallback(),this}setFromEuler(J,$=!0){let{_x:Q,_y:Z,_z:W,_order:Y}=J,X=Math.cos,H=Math.sin,K=X(Q/2),q=X(Z/2),G=X(W/2),U=H(Q/2),F=H(Z/2),O=H(W/2);switch(Y){case"XYZ":this._x=U*q*G+K*F*O,this._y=K*F*G-U*q*O,this._z=K*q*O+U*F*G,this._w=K*q*G-U*F*O;break;case"YXZ":this._x=U*q*G+K*F*O,this._y=K*F*G-U*q*O,this._z=K*q*O-U*F*G,this._w=K*q*G+U*F*O;break;case"ZXY":this._x=U*q*G-K*F*O,this._y=K*F*G+U*q*O,this._z=K*q*O+U*F*G,this._w=K*q*G-U*F*O;break;case"ZYX":this._x=U*q*G-K*F*O,this._y=K*F*G+U*q*O,this._z=K*q*O-U*F*G,this._w=K*q*G+U*F*O;break;case"YZX":this._x=U*q*G+K*F*O,this._y=K*F*G+U*q*O,this._z=K*q*O-U*F*G,this._w=K*q*G-U*F*O;break;case"XZY":this._x=U*q*G-K*F*O,this._y=K*F*G-U*q*O,this._z=K*q*O+U*F*G,this._w=K*q*G+U*F*O;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+Y)}if($===!0)this._onChangeCallback();return this}setFromAxisAngle(J,$){let Q=$/2,Z=Math.sin(Q);return this._x=J.x*Z,this._y=J.y*Z,this._z=J.z*Z,this._w=Math.cos(Q),this._onChangeCallback(),this}setFromRotationMatrix(J){let $=J.elements,Q=$[0],Z=$[4],W=$[8],Y=$[1],X=$[5],H=$[9],K=$[2],q=$[6],G=$[10],U=Q+X+G;if(U>0){let F=0.5/Math.sqrt(U+1);this._w=0.25/F,this._x=(q-H)*F,this._y=(W-K)*F,this._z=(Y-Z)*F}else if(Q>X&&Q>G){let F=2*Math.sqrt(1+Q-X-G);this._w=(q-H)/F,this._x=0.25*F,this._y=(Z+Y)/F,this._z=(W+K)/F}else if(X>G){let F=2*Math.sqrt(1+X-Q-G);this._w=(W-K)/F,this._x=(Z+Y)/F,this._y=0.25*F,this._z=(H+q)/F}else{let F=2*Math.sqrt(1+G-Q-X);this._w=(Y-Z)/F,this._x=(W+K)/F,this._y=(H+q)/F,this._z=0.25*F}return this._onChangeCallback(),this}setFromUnitVectors(J,$){let Q=J.dot($)+1;if(Q<Number.EPSILON)if(Q=0,Math.abs(J.x)>Math.abs(J.z))this._x=-J.y,this._y=J.x,this._z=0,this._w=Q;else this._x=0,this._y=-J.z,this._z=J.y,this._w=Q;else this._x=J.y*$.z-J.z*$.y,this._y=J.z*$.x-J.x*$.z,this._z=J.x*$.y-J.y*$.x,this._w=Q;return this.normalize()}angleTo(J){return 2*Math.acos(Math.abs(N0(this.dot(J),-1,1)))}rotateTowards(J,$){let Q=this.angleTo(J);if(Q===0)return this;let Z=Math.min(1,$/Q);return this.slerp(J,Z),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(J){return this._x*J._x+this._y*J._y+this._z*J._z+this._w*J._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let J=this.length();if(J===0)this._x=0,this._y=0,this._z=0,this._w=1;else J=1/J,this._x=this._x*J,this._y=this._y*J,this._z=this._z*J,this._w=this._w*J;return this._onChangeCallback(),this}multiply(J){return this.multiplyQuaternions(this,J)}premultiply(J){return this.multiplyQuaternions(J,this)}multiplyQuaternions(J,$){let{_x:Q,_y:Z,_z:W,_w:Y}=J,X=$._x,H=$._y,K=$._z,q=$._w;return this._x=Q*q+Y*X+Z*K-W*H,this._y=Z*q+Y*H+W*X-Q*K,this._z=W*q+Y*K+Q*H-Z*X,this._w=Y*q-Q*X-Z*H-W*K,this._onChangeCallback(),this}slerp(J,$){if($===0)return this;if($===1)return this.copy(J);let Q=this._x,Z=this._y,W=this._z,Y=this._w,X=Y*J._w+Q*J._x+Z*J._y+W*J._z;if(X<0)this._w=-J._w,this._x=-J._x,this._y=-J._y,this._z=-J._z,X=-X;else this.copy(J);if(X>=1)return this._w=Y,this._x=Q,this._y=Z,this._z=W,this;let H=1-X*X;if(H<=Number.EPSILON){let F=1-$;return this._w=F*Y+$*this._w,this._x=F*Q+$*this._x,this._y=F*Z+$*this._y,this._z=F*W+$*this._z,this.normalize(),this}let K=Math.sqrt(H),q=Math.atan2(K,X),G=Math.sin((1-$)*q)/K,U=Math.sin($*q)/K;return this._w=Y*G+this._w*U,this._x=Q*G+this._x*U,this._y=Z*G+this._y*U,this._z=W*G+this._z*U,this._onChangeCallback(),this}slerpQuaternions(J,$,Q){return this.copy(J).slerp($,Q)}random(){let J=2*Math.PI*Math.random(),$=2*Math.PI*Math.random(),Q=Math.random(),Z=Math.sqrt(1-Q),W=Math.sqrt(Q);return this.set(Z*Math.sin(J),Z*Math.cos(J),W*Math.sin($),W*Math.cos($))}equals(J){return J._x===this._x&&J._y===this._y&&J._z===this._z&&J._w===this._w}fromArray(J,$=0){return this._x=J[$],this._y=J[$+1],this._z=J[$+2],this._w=J[$+3],this._onChangeCallback(),this}toArray(J=[],$=0){return J[$]=this._x,J[$+1]=this._y,J[$+2]=this._z,J[$+3]=this._w,J}fromBufferAttribute(J,$){return this._x=J.getX($),this._y=J.getY($),this._z=J.getZ($),this._w=J.getW($),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(J){return this._onChangeCallback=J,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(J=0,$=0,Q=0){A.prototype.isVector3=!0,this.x=J,this.y=$,this.z=Q}set(J,$,Q){if(Q===void 0)Q=this.z;return this.x=J,this.y=$,this.z=Q,this}setScalar(J){return this.x=J,this.y=J,this.z=J,this}setX(J){return this.x=J,this}setY(J){return this.y=J,this}setZ(J){return this.z=J,this}setComponent(J,$){switch(J){case 0:this.x=$;break;case 1:this.y=$;break;case 2:this.z=$;break;default:throw Error("index is out of range: "+J)}return this}getComponent(J){switch(J){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+J)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(J){return this.x=J.x,this.y=J.y,this.z=J.z,this}add(J){return this.x+=J.x,this.y+=J.y,this.z+=J.z,this}addScalar(J){return this.x+=J,this.y+=J,this.z+=J,this}addVectors(J,$){return this.x=J.x+$.x,this.y=J.y+$.y,this.z=J.z+$.z,this}addScaledVector(J,$){return this.x+=J.x*$,this.y+=J.y*$,this.z+=J.z*$,this}sub(J){return this.x-=J.x,this.y-=J.y,this.z-=J.z,this}subScalar(J){return this.x-=J,this.y-=J,this.z-=J,this}subVectors(J,$){return this.x=J.x-$.x,this.y=J.y-$.y,this.z=J.z-$.z,this}multiply(J){return this.x*=J.x,this.y*=J.y,this.z*=J.z,this}multiplyScalar(J){return this.x*=J,this.y*=J,this.z*=J,this}multiplyVectors(J,$){return this.x=J.x*$.x,this.y=J.y*$.y,this.z=J.z*$.z,this}applyEuler(J){return this.applyQuaternion(z$.setFromEuler(J))}applyAxisAngle(J,$){return this.applyQuaternion(z$.setFromAxisAngle(J,$))}applyMatrix3(J){let $=this.x,Q=this.y,Z=this.z,W=J.elements;return this.x=W[0]*$+W[3]*Q+W[6]*Z,this.y=W[1]*$+W[4]*Q+W[7]*Z,this.z=W[2]*$+W[5]*Q+W[8]*Z,this}applyNormalMatrix(J){return this.applyMatrix3(J).normalize()}applyMatrix4(J){let $=this.x,Q=this.y,Z=this.z,W=J.elements,Y=1/(W[3]*$+W[7]*Q+W[11]*Z+W[15]);return this.x=(W[0]*$+W[4]*Q+W[8]*Z+W[12])*Y,this.y=(W[1]*$+W[5]*Q+W[9]*Z+W[13])*Y,this.z=(W[2]*$+W[6]*Q+W[10]*Z+W[14])*Y,this}applyQuaternion(J){let $=this.x,Q=this.y,Z=this.z,W=J.x,Y=J.y,X=J.z,H=J.w,K=2*(Y*Z-X*Q),q=2*(X*$-W*Z),G=2*(W*Q-Y*$);return this.x=$+H*K+Y*G-X*q,this.y=Q+H*q+X*K-W*G,this.z=Z+H*G+W*q-Y*K,this}project(J){return this.applyMatrix4(J.matrixWorldInverse).applyMatrix4(J.projectionMatrix)}unproject(J){return this.applyMatrix4(J.projectionMatrixInverse).applyMatrix4(J.matrixWorld)}transformDirection(J){let $=this.x,Q=this.y,Z=this.z,W=J.elements;return this.x=W[0]*$+W[4]*Q+W[8]*Z,this.y=W[1]*$+W[5]*Q+W[9]*Z,this.z=W[2]*$+W[6]*Q+W[10]*Z,this.normalize()}divide(J){return this.x/=J.x,this.y/=J.y,this.z/=J.z,this}divideScalar(J){return this.multiplyScalar(1/J)}min(J){return this.x=Math.min(this.x,J.x),this.y=Math.min(this.y,J.y),this.z=Math.min(this.z,J.z),this}max(J){return this.x=Math.max(this.x,J.x),this.y=Math.max(this.y,J.y),this.z=Math.max(this.z,J.z),this}clamp(J,$){return this.x=Math.max(J.x,Math.min($.x,this.x)),this.y=Math.max(J.y,Math.min($.y,this.y)),this.z=Math.max(J.z,Math.min($.z,this.z)),this}clampScalar(J,$){return this.x=Math.max(J,Math.min($,this.x)),this.y=Math.max(J,Math.min($,this.y)),this.z=Math.max(J,Math.min($,this.z)),this}clampLength(J,$){let Q=this.length();return this.divideScalar(Q||1).multiplyScalar(Math.max(J,Math.min($,Q)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(J){return this.x*J.x+this.y*J.y+this.z*J.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(J){return this.normalize().multiplyScalar(J)}lerp(J,$){return this.x+=(J.x-this.x)*$,this.y+=(J.y-this.y)*$,this.z+=(J.z-this.z)*$,this}lerpVectors(J,$,Q){return this.x=J.x+($.x-J.x)*Q,this.y=J.y+($.y-J.y)*Q,this.z=J.z+($.z-J.z)*Q,this}cross(J){return this.crossVectors(this,J)}crossVectors(J,$){let{x:Q,y:Z,z:W}=J,Y=$.x,X=$.y,H=$.z;return this.x=Z*H-W*X,this.y=W*Y-Q*H,this.z=Q*X-Z*Y,this}projectOnVector(J){let $=J.lengthSq();if($===0)return this.set(0,0,0);let Q=J.dot(this)/$;return this.copy(J).multiplyScalar(Q)}projectOnPlane(J){return x8.copy(this).projectOnVector(J),this.sub(x8)}reflect(J){return this.sub(x8.copy(J).multiplyScalar(2*this.dot(J)))}angleTo(J){let $=Math.sqrt(this.lengthSq()*J.lengthSq());if($===0)return Math.PI/2;let Q=this.dot(J)/$;return Math.acos(N0(Q,-1,1))}distanceTo(J){return Math.sqrt(this.distanceToSquared(J))}distanceToSquared(J){let $=this.x-J.x,Q=this.y-J.y,Z=this.z-J.z;return $*$+Q*Q+Z*Z}manhattanDistanceTo(J){return Math.abs(this.x-J.x)+Math.abs(this.y-J.y)+Math.abs(this.z-J.z)}setFromSpherical(J){return this.setFromSphericalCoords(J.radius,J.phi,J.theta)}setFromSphericalCoords(J,$,Q){let Z=Math.sin($)*J;return this.x=Z*Math.sin(Q),this.y=Math.cos($)*J,this.z=Z*Math.cos(Q),this}setFromCylindrical(J){return this.setFromCylindricalCoords(J.radius,J.theta,J.y)}setFromCylindricalCoords(J,$,Q){return this.x=J*Math.sin($),this.y=Q,this.z=J*Math.cos($),this}setFromMatrixPosition(J){let $=J.elements;return this.x=$[12],this.y=$[13],this.z=$[14],this}setFromMatrixScale(J){let $=this.setFromMatrixColumn(J,0).length(),Q=this.setFromMatrixColumn(J,1).length(),Z=this.setFromMatrixColumn(J,2).length();return this.x=$,this.y=Q,this.z=Z,this}setFromMatrixColumn(J,$){return this.fromArray(J.elements,$*4)}setFromMatrix3Column(J,$){return this.fromArray(J.elements,$*3)}setFromEuler(J){return this.x=J._x,this.y=J._y,this.z=J._z,this}setFromColor(J){return this.x=J.r,this.y=J.g,this.z=J.b,this}equals(J){return J.x===this.x&&J.y===this.y&&J.z===this.z}fromArray(J,$=0){return this.x=J[$],this.y=J[$+1],this.z=J[$+2],this}toArray(J=[],$=0){return J[$]=this.x,J[$+1]=this.y,J[$+2]=this.z,J}fromBufferAttribute(J,$){return this.x=J.getX($),this.y=J.getY($),this.z=J.getZ($),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let J=Math.random()*Math.PI*2,$=Math.random()*2-1,Q=Math.sqrt(1-$*$);return this.x=Q*Math.cos(J),this.y=$,this.z=Q*Math.sin(J),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}var x8=new A,z$=new I0;class S0{constructor(J=new A(1/0,1/0,1/0),$=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=J,this.max=$}set(J,$){return this.min.copy(J),this.max.copy($),this}setFromArray(J){this.makeEmpty();for(let $=0,Q=J.length;$<Q;$+=3)this.expandByPoint(g0.fromArray(J,$));return this}setFromBufferAttribute(J){this.makeEmpty();for(let $=0,Q=J.count;$<Q;$++)this.expandByPoint(g0.fromBufferAttribute(J,$));return this}setFromPoints(J){this.makeEmpty();for(let $=0,Q=J.length;$<Q;$++)this.expandByPoint(J[$]);return this}setFromCenterAndSize(J,$){let Q=g0.copy($).multiplyScalar(0.5);return this.min.copy(J).sub(Q),this.max.copy(J).add(Q),this}setFromObject(J,$=!1){return this.makeEmpty(),this.expandByObject(J,$)}clone(){return new this.constructor().copy(this)}copy(J){return this.min.copy(J.min),this.max.copy(J.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(J){return this.isEmpty()?J.set(0,0,0):J.addVectors(this.min,this.max).multiplyScalar(0.5)}getSize(J){return this.isEmpty()?J.set(0,0,0):J.subVectors(this.max,this.min)}expandByPoint(J){return this.min.min(J),this.max.max(J),this}expandByVector(J){return this.min.sub(J),this.max.add(J),this}expandByScalar(J){return this.min.addScalar(-J),this.max.addScalar(J),this}expandByObject(J,$=!1){J.updateWorldMatrix(!1,!1);let Q=J.geometry;if(Q!==void 0){let W=Q.getAttribute("position");if($===!0&&W!==void 0&&J.isInstancedMesh!==!0)for(let Y=0,X=W.count;Y<X;Y++){if(J.isMesh===!0)J.getVertexPosition(Y,g0);else g0.fromBufferAttribute(W,Y);g0.applyMatrix4(J.matrixWorld),this.expandByPoint(g0)}else{if(J.boundingBox!==void 0){if(J.boundingBox===null)J.computeBoundingBox();l7.copy(J.boundingBox)}else{if(Q.boundingBox===null)Q.computeBoundingBox();l7.copy(Q.boundingBox)}l7.applyMatrix4(J.matrixWorld),this.union(l7)}}let Z=J.children;for(let W=0,Y=Z.length;W<Y;W++)this.expandByObject(Z[W],$);return this}containsPoint(J){return J.x>=this.min.x&&J.x<=this.max.x&&J.y>=this.min.y&&J.y<=this.max.y&&J.z>=this.min.z&&J.z<=this.max.z}containsBox(J){return this.min.x<=J.min.x&&J.max.x<=this.max.x&&this.min.y<=J.min.y&&J.max.y<=this.max.y&&this.min.z<=J.min.z&&J.max.z<=this.max.z}getParameter(J,$){return $.set((J.x-this.min.x)/(this.max.x-this.min.x),(J.y-this.min.y)/(this.max.y-this.min.y),(J.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(J){return J.max.x>=this.min.x&&J.min.x<=this.max.x&&J.max.y>=this.min.y&&J.min.y<=this.max.y&&J.max.z>=this.min.z&&J.min.z<=this.max.z}intersectsSphere(J){return this.clampPoint(J.center,g0),g0.distanceToSquared(J.center)<=J.radius*J.radius}intersectsPlane(J){let $,Q;if(J.normal.x>0)$=J.normal.x*this.min.x,Q=J.normal.x*this.max.x;else $=J.normal.x*this.max.x,Q=J.normal.x*this.min.x;if(J.normal.y>0)$+=J.normal.y*this.min.y,Q+=J.normal.y*this.max.y;else $+=J.normal.y*this.max.y,Q+=J.normal.y*this.min.y;if(J.normal.z>0)$+=J.normal.z*this.min.z,Q+=J.normal.z*this.max.z;else $+=J.normal.z*this.max.z,Q+=J.normal.z*this.min.z;return $<=-J.constant&&Q>=-J.constant}intersectsTriangle(J){if(this.isEmpty())return!1;this.getCenter(z7),u7.subVectors(this.max,z7),a6.subVectors(J.a,z7),r6.subVectors(J.b,z7),t6.subVectors(J.c,z7),E6.subVectors(r6,a6),O6.subVectors(t6,r6),S6.subVectors(a6,t6);let $=[0,-E6.z,E6.y,0,-O6.z,O6.y,0,-S6.z,S6.y,E6.z,0,-E6.x,O6.z,0,-O6.x,S6.z,0,-S6.x,-E6.y,E6.x,0,-O6.y,O6.x,0,-S6.y,S6.x,0];if(!b8($,a6,r6,t6,u7))return!1;if($=[1,0,0,0,1,0,0,0,1],!b8($,a6,r6,t6,u7))return!1;return m7.crossVectors(E6,O6),$=[m7.x,m7.y,m7.z],b8($,a6,r6,t6,u7)}clampPoint(J,$){return $.copy(J).clamp(this.min,this.max)}distanceToPoint(J){return this.clampPoint(J,g0).distanceTo(J)}getBoundingSphere(J){if(this.isEmpty())J.makeEmpty();else this.getCenter(J.center),J.radius=this.getSize(g0).length()*0.5;return J}intersect(J){if(this.min.max(J.min),this.max.min(J.max),this.isEmpty())this.makeEmpty();return this}union(J){return this.min.min(J.min),this.max.max(J.max),this}applyMatrix4(J){if(this.isEmpty())return this;return Q6[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(J),Q6[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(J),Q6[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(J),Q6[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(J),Q6[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(J),Q6[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(J),Q6[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(J),Q6[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(J),this.setFromPoints(Q6),this}translate(J){return this.min.add(J),this.max.add(J),this}equals(J){return J.min.equals(this.min)&&J.max.equals(this.max)}}var Q6=[new A,new A,new A,new A,new A,new A,new A,new A],g0=new A,l7=new S0,a6=new A,r6=new A,t6=new A,E6=new A,O6=new A,S6=new A,z7=new A,u7=new A,m7=new A,j6=new A;function b8(J,$,Q,Z,W){for(let Y=0,X=J.length-3;Y<=X;Y+=3){j6.fromArray(J,Y);let H=W.x*Math.abs(j6.x)+W.y*Math.abs(j6.y)+W.z*Math.abs(j6.z),K=$.dot(j6),q=Q.dot(j6),G=Z.dot(j6);if(Math.max(-Math.max(K,q,G),Math.min(K,q,G))>H)return!1}return!0}var RZ=new S0,B7=new A,g8=new A;class C0{constructor(J=new A,$=-1){this.isSphere=!0,this.center=J,this.radius=$}set(J,$){return this.center.copy(J),this.radius=$,this}setFromPoints(J,$){let Q=this.center;if($!==void 0)Q.copy($);else RZ.setFromPoints(J).getCenter(Q);let Z=0;for(let W=0,Y=J.length;W<Y;W++)Z=Math.max(Z,Q.distanceToSquared(J[W]));return this.radius=Math.sqrt(Z),this}copy(J){return this.center.copy(J.center),this.radius=J.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(J){return J.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(J){return J.distanceTo(this.center)-this.radius}intersectsSphere(J){let $=this.radius+J.radius;return J.center.distanceToSquared(this.center)<=$*$}intersectsBox(J){return J.intersectsSphere(this)}intersectsPlane(J){return Math.abs(J.distanceToPoint(this.center))<=this.radius}clampPoint(J,$){let Q=this.center.distanceToSquared(J);if($.copy(J),Q>this.radius*this.radius)$.sub(this.center).normalize(),$.multiplyScalar(this.radius).add(this.center);return $}getBoundingBox(J){if(this.isEmpty())return J.makeEmpty(),J;return J.set(this.center,this.center),J.expandByScalar(this.radius),J}applyMatrix4(J){return this.center.applyMatrix4(J),this.radius=this.radius*J.getMaxScaleOnAxis(),this}translate(J){return this.center.add(J),this}expandByPoint(J){if(this.isEmpty())return this.center.copy(J),this.radius=0,this;B7.subVectors(J,this.center);let $=B7.lengthSq();if($>this.radius*this.radius){let Q=Math.sqrt($),Z=(Q-this.radius)*0.5;this.center.addScaledVector(B7,Z/Q),this.radius+=Z}return this}union(J){if(J.isEmpty())return this;if(this.isEmpty())return this.copy(J),this;if(this.center.equals(J.center)===!0)this.radius=Math.max(this.radius,J.radius);else g8.subVectors(J.center,this.center).setLength(J.radius),this.expandByPoint(B7.copy(J.center).add(g8)),this.expandByPoint(B7.copy(J.center).sub(g8));return this}equals(J){return J.center.equals(this.center)&&J.radius===this.radius}clone(){return new this.constructor().copy(this)}}var Z6=new A,p8=new A,d7=new A,R6=new A,l8=new A,c7=new A,u8=new A;class _6{constructor(J=new A,$=new A(0,0,-1)){this.origin=J,this.direction=$}set(J,$){return this.origin.copy(J),this.direction.copy($),this}copy(J){return this.origin.copy(J.origin),this.direction.copy(J.direction),this}at(J,$){return $.copy(this.origin).addScaledVector(this.direction,J)}lookAt(J){return this.direction.copy(J).sub(this.origin).normalize(),this}recast(J){return this.origin.copy(this.at(J,Z6)),this}closestPointToPoint(J,$){$.subVectors(J,this.origin);let Q=$.dot(this.direction);if(Q<0)return $.copy(this.origin);return $.copy(this.origin).addScaledVector(this.direction,Q)}distanceToPoint(J){return Math.sqrt(this.distanceSqToPoint(J))}distanceSqToPoint(J){let $=Z6.subVectors(J,this.origin).dot(this.direction);if($<0)return this.origin.distanceToSquared(J);return Z6.copy(this.origin).addScaledVector(this.direction,$),Z6.distanceToSquared(J)}distanceSqToSegment(J,$,Q,Z){p8.copy(J).add($).multiplyScalar(0.5),d7.copy($).sub(J).normalize(),R6.copy(this.origin).sub(p8);let W=J.distanceTo($)*0.5,Y=-this.direction.dot(d7),X=R6.dot(this.direction),H=-R6.dot(d7),K=R6.lengthSq(),q=Math.abs(1-Y*Y),G,U,F,O;if(q>0)if(G=Y*H-X,U=Y*X-H,O=W*q,G>=0)if(U>=-O)if(U<=O){let z=1/q;G*=z,U*=z,F=G*(G+Y*U+2*X)+U*(Y*G+U+2*H)+K}else U=W,G=Math.max(0,-(Y*U+X)),F=-G*G+U*(U+2*H)+K;else U=-W,G=Math.max(0,-(Y*U+X)),F=-G*G+U*(U+2*H)+K;else if(U<=-O)G=Math.max(0,-(-Y*W+X)),U=G>0?-W:Math.min(Math.max(-W,-H),W),F=-G*G+U*(U+2*H)+K;else if(U<=O)G=0,U=Math.min(Math.max(-W,-H),W),F=U*(U+2*H)+K;else G=Math.max(0,-(Y*W+X)),U=G>0?W:Math.min(Math.max(-W,-H),W),F=-G*G+U*(U+2*H)+K;else U=Y>0?-W:W,G=Math.max(0,-(Y*U+X)),F=-G*G+U*(U+2*H)+K;if(Q)Q.copy(this.origin).addScaledVector(this.direction,G);if(Z)Z.copy(p8).addScaledVector(d7,U);return F}intersectSphere(J,$){Z6.subVectors(J.center,this.origin);let Q=Z6.dot(this.direction),Z=Z6.dot(Z6)-Q*Q,W=J.radius*J.radius;if(Z>W)return null;let Y=Math.sqrt(W-Z),X=Q-Y,H=Q+Y;if(H<0)return null;if(X<0)return this.at(H,$);return this.at(X,$)}intersectsSphere(J){return this.distanceSqToPoint(J.center)<=J.radius*J.radius}distanceToPlane(J){let $=J.normal.dot(this.direction);if($===0){if(J.distanceToPoint(this.origin)===0)return 0;return null}let Q=-(this.origin.dot(J.normal)+J.constant)/$;return Q>=0?Q:null}intersectPlane(J,$){let Q=this.distanceToPlane(J);if(Q===null)return null;return this.at(Q,$)}intersectsPlane(J){let $=J.distanceToPoint(this.origin);if($===0)return!0;if(J.normal.dot(this.direction)*$<0)return!0;return!1}intersectBox(J,$){let Q,Z,W,Y,X,H,K=1/this.direction.x,q=1/this.direction.y,G=1/this.direction.z,U=this.origin;if(K>=0)Q=(J.min.x-U.x)*K,Z=(J.max.x-U.x)*K;else Q=(J.max.x-U.x)*K,Z=(J.min.x-U.x)*K;if(q>=0)W=(J.min.y-U.y)*q,Y=(J.max.y-U.y)*q;else W=(J.max.y-U.y)*q,Y=(J.min.y-U.y)*q;if(Q>Y||W>Z)return null;if(W>Q||isNaN(Q))Q=W;if(Y<Z||isNaN(Z))Z=Y;if(G>=0)X=(J.min.z-U.z)*G,H=(J.max.z-U.z)*G;else X=(J.max.z-U.z)*G,H=(J.min.z-U.z)*G;if(Q>H||X>Z)return null;if(X>Q||Q!==Q)Q=X;if(H<Z||Z!==Z)Z=H;if(Z<0)return null;return this.at(Q>=0?Q:Z,$)}intersectsBox(J){return this.intersectBox(J,Z6)!==null}intersectTriangle(J,$,Q,Z,W){l8.subVectors($,J),c7.subVectors(Q,J),u8.crossVectors(l8,c7);let Y=this.direction.dot(u8),X;if(Y>0){if(Z)return null;X=1}else if(Y<0)X=-1,Y=-Y;else return null;R6.subVectors(this.origin,J);let H=X*this.direction.dot(c7.crossVectors(R6,c7));if(H<0)return null;let K=X*this.direction.dot(l8.cross(R6));if(K<0)return null;if(H+K>Y)return null;let q=-X*R6.dot(u8);if(q<0)return null;return this.at(q/Y,W)}applyMatrix4(J){return this.origin.applyMatrix4(J),this.direction.transformDirection(J),this}equals(J){return J.origin.equals(this.origin)&&J.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _J{constructor(J,$,Q,Z,W,Y,X,H,K,q,G,U,F,O,z,R){if(_J.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],J!==void 0)this.set(J,$,Q,Z,W,Y,X,H,K,q,G,U,F,O,z,R)}set(J,$,Q,Z,W,Y,X,H,K,q,G,U,F,O,z,R){let V=this.elements;return V[0]=J,V[4]=$,V[8]=Q,V[12]=Z,V[1]=W,V[5]=Y,V[9]=X,V[13]=H,V[2]=K,V[6]=q,V[10]=G,V[14]=U,V[3]=F,V[7]=O,V[11]=z,V[15]=R,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _J().fromArray(this.elements)}copy(J){let $=this.elements,Q=J.elements;return $[0]=Q[0],$[1]=Q[1],$[2]=Q[2],$[3]=Q[3],$[4]=Q[4],$[5]=Q[5],$[6]=Q[6],$[7]=Q[7],$[8]=Q[8],$[9]=Q[9],$[10]=Q[10],$[11]=Q[11],$[12]=Q[12],$[13]=Q[13],$[14]=Q[14],$[15]=Q[15],this}copyPosition(J){let $=this.elements,Q=J.elements;return $[12]=Q[12],$[13]=Q[13],$[14]=Q[14],this}setFromMatrix3(J){let $=J.elements;return this.set($[0],$[3],$[6],0,$[1],$[4],$[7],0,$[2],$[5],$[8],0,0,0,0,1),this}extractBasis(J,$,Q){return J.setFromMatrixColumn(this,0),$.setFromMatrixColumn(this,1),Q.setFromMatrixColumn(this,2),this}makeBasis(J,$,Q){return this.set(J.x,$.x,Q.x,0,J.y,$.y,Q.y,0,J.z,$.z,Q.z,0,0,0,0,1),this}extractRotation(J){let $=this.elements,Q=J.elements,Z=1/e6.setFromMatrixColumn(J,0).length(),W=1/e6.setFromMatrixColumn(J,1).length(),Y=1/e6.setFromMatrixColumn(J,2).length();return $[0]=Q[0]*Z,$[1]=Q[1]*Z,$[2]=Q[2]*Z,$[3]=0,$[4]=Q[4]*W,$[5]=Q[5]*W,$[6]=Q[6]*W,$[7]=0,$[8]=Q[8]*Y,$[9]=Q[9]*Y,$[10]=Q[10]*Y,$[11]=0,$[12]=0,$[13]=0,$[14]=0,$[15]=1,this}makeRotationFromEuler(J){let $=this.elements,Q=J.x,Z=J.y,W=J.z,Y=Math.cos(Q),X=Math.sin(Q),H=Math.cos(Z),K=Math.sin(Z),q=Math.cos(W),G=Math.sin(W);if(J.order==="XYZ"){let U=Y*q,F=Y*G,O=X*q,z=X*G;$[0]=H*q,$[4]=-H*G,$[8]=K,$[1]=F+O*K,$[5]=U-z*K,$[9]=-X*H,$[2]=z-U*K,$[6]=O+F*K,$[10]=Y*H}else if(J.order==="YXZ"){let U=H*q,F=H*G,O=K*q,z=K*G;$[0]=U+z*X,$[4]=O*X-F,$[8]=Y*K,$[1]=Y*G,$[5]=Y*q,$[9]=-X,$[2]=F*X-O,$[6]=z+U*X,$[10]=Y*H}else if(J.order==="ZXY"){let U=H*q,F=H*G,O=K*q,z=K*G;$[0]=U-z*X,$[4]=-Y*G,$[8]=O+F*X,$[1]=F+O*X,$[5]=Y*q,$[9]=z-U*X,$[2]=-Y*K,$[6]=X,$[10]=Y*H}else if(J.order==="ZYX"){let U=Y*q,F=Y*G,O=X*q,z=X*G;$[0]=H*q,$[4]=O*K-F,$[8]=U*K+z,$[1]=H*G,$[5]=z*K+U,$[9]=F*K-O,$[2]=-K,$[6]=X*H,$[10]=Y*H}else if(J.order==="YZX"){let U=Y*H,F=Y*K,O=X*H,z=X*K;$[0]=H*q,$[4]=z-U*G,$[8]=O*G+F,$[1]=G,$[5]=Y*q,$[9]=-X*q,$[2]=-K*q,$[6]=F*G+O,$[10]=U-z*G}else if(J.order==="XZY"){let U=Y*H,F=Y*K,O=X*H,z=X*K;$[0]=H*q,$[4]=-G,$[8]=K*q,$[1]=U*G+z,$[5]=Y*q,$[9]=F*G-O,$[2]=O*G-F,$[6]=X*q,$[10]=z*G+U}return $[3]=0,$[7]=0,$[11]=0,$[12]=0,$[13]=0,$[14]=0,$[15]=1,this}makeRotationFromQuaternion(J){return this.compose(NZ,J,zZ)}lookAt(J,$,Q){let Z=this.elements;if(A0.subVectors(J,$),A0.lengthSq()===0)A0.z=1;if(A0.normalize(),N6.crossVectors(Q,A0),N6.lengthSq()===0){if(Math.abs(Q.z)===1)A0.x+=0.0001;else A0.z+=0.0001;A0.normalize(),N6.crossVectors(Q,A0)}return N6.normalize(),n7.crossVectors(A0,N6),Z[0]=N6.x,Z[4]=n7.x,Z[8]=A0.x,Z[1]=N6.y,Z[5]=n7.y,Z[9]=A0.y,Z[2]=N6.z,Z[6]=n7.z,Z[10]=A0.z,this}multiply(J){return this.multiplyMatrices(this,J)}premultiply(J){return this.multiplyMatrices(J,this)}multiplyMatrices(J,$){let Q=J.elements,Z=$.elements,W=this.elements,Y=Q[0],X=Q[4],H=Q[8],K=Q[12],q=Q[1],G=Q[5],U=Q[9],F=Q[13],O=Q[2],z=Q[6],R=Q[10],V=Q[14],E=Q[3],D=Q[7],M=Q[11],_=Q[15],x=Z[0],C=Z[4],P=Z[8],p=Z[12],k=Z[1],L=Z[5],y=Z[9],b=Z[13],d=Z[2],m=Z[6],a=Z[10],l=Z[14],r=Z[3],g=Z[7],HJ=Z[11],qJ=Z[15];return W[0]=Y*x+X*k+H*d+K*r,W[4]=Y*C+X*L+H*m+K*g,W[8]=Y*P+X*y+H*a+K*HJ,W[12]=Y*p+X*b+H*l+K*qJ,W[1]=q*x+G*k+U*d+F*r,W[5]=q*C+G*L+U*m+F*g,W[9]=q*P+G*y+U*a+F*HJ,W[13]=q*p+G*b+U*l+F*qJ,W[2]=O*x+z*k+R*d+V*r,W[6]=O*C+z*L+R*m+V*g,W[10]=O*P+z*y+R*a+V*HJ,W[14]=O*p+z*b+R*l+V*qJ,W[3]=E*x+D*k+M*d+_*r,W[7]=E*C+D*L+M*m+_*g,W[11]=E*P+D*y+M*a+_*HJ,W[15]=E*p+D*b+M*l+_*qJ,this}multiplyScalar(J){let $=this.elements;return $[0]*=J,$[4]*=J,$[8]*=J,$[12]*=J,$[1]*=J,$[5]*=J,$[9]*=J,$[13]*=J,$[2]*=J,$[6]*=J,$[10]*=J,$[14]*=J,$[3]*=J,$[7]*=J,$[11]*=J,$[15]*=J,this}determinant(){let J=this.elements,$=J[0],Q=J[4],Z=J[8],W=J[12],Y=J[1],X=J[5],H=J[9],K=J[13],q=J[2],G=J[6],U=J[10],F=J[14],O=J[3],z=J[7],R=J[11],V=J[15];return O*(+W*H*G-Z*K*G-W*X*U+Q*K*U+Z*X*F-Q*H*F)+z*(+$*H*F-$*K*U+W*Y*U-Z*Y*F+Z*K*q-W*H*q)+R*(+$*K*G-$*X*F-W*Y*G+Q*Y*F+W*X*q-Q*K*q)+V*(-Z*X*q-$*H*G+$*X*U+Z*Y*G-Q*Y*U+Q*H*q)}transpose(){let J=this.elements,$;return $=J[1],J[1]=J[4],J[4]=$,$=J[2],J[2]=J[8],J[8]=$,$=J[6],J[6]=J[9],J[9]=$,$=J[3],J[3]=J[12],J[12]=$,$=J[7],J[7]=J[13],J[13]=$,$=J[11],J[11]=J[14],J[14]=$,this}setPosition(J,$,Q){let Z=this.elements;if(J.isVector3)Z[12]=J.x,Z[13]=J.y,Z[14]=J.z;else Z[12]=J,Z[13]=$,Z[14]=Q;return this}invert(){let J=this.elements,$=J[0],Q=J[1],Z=J[2],W=J[3],Y=J[4],X=J[5],H=J[6],K=J[7],q=J[8],G=J[9],U=J[10],F=J[11],O=J[12],z=J[13],R=J[14],V=J[15],E=G*R*K-z*U*K+z*H*F-X*R*F-G*H*V+X*U*V,D=O*U*K-q*R*K-O*H*F+Y*R*F+q*H*V-Y*U*V,M=q*z*K-O*G*K+O*X*F-Y*z*F-q*X*V+Y*G*V,_=O*G*H-q*z*H-O*X*U+Y*z*U+q*X*R-Y*G*R,x=$*E+Q*D+Z*M+W*_;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/x;return J[0]=E*C,J[1]=(z*U*W-G*R*W-z*Z*F+Q*R*F+G*Z*V-Q*U*V)*C,J[2]=(X*R*W-z*H*W+z*Z*K-Q*R*K-X*Z*V+Q*H*V)*C,J[3]=(G*H*W-X*U*W-G*Z*K+Q*U*K+X*Z*F-Q*H*F)*C,J[4]=D*C,J[5]=(q*R*W-O*U*W+O*Z*F-$*R*F-q*Z*V+$*U*V)*C,J[6]=(O*H*W-Y*R*W-O*Z*K+$*R*K+Y*Z*V-$*H*V)*C,J[7]=(Y*U*W-q*H*W+q*Z*K-$*U*K-Y*Z*F+$*H*F)*C,J[8]=M*C,J[9]=(O*G*W-q*z*W-O*Q*F+$*z*F+q*Q*V-$*G*V)*C,J[10]=(Y*z*W-O*X*W+O*Q*K-$*z*K-Y*Q*V+$*X*V)*C,J[11]=(q*X*W-Y*G*W-q*Q*K+$*G*K+Y*Q*F-$*X*F)*C,J[12]=_*C,J[13]=(q*z*Z-O*G*Z+O*Q*U-$*z*U-q*Q*R+$*G*R)*C,J[14]=(O*X*Z-Y*z*Z-O*Q*H+$*z*H+Y*Q*R-$*X*R)*C,J[15]=(Y*G*Z-q*X*Z+q*Q*H-$*G*H-Y*Q*U+$*X*U)*C,this}scale(J){let $=this.elements,Q=J.x,Z=J.y,W=J.z;return $[0]*=Q,$[4]*=Z,$[8]*=W,$[1]*=Q,$[5]*=Z,$[9]*=W,$[2]*=Q,$[6]*=Z,$[10]*=W,$[3]*=Q,$[7]*=Z,$[11]*=W,this}getMaxScaleOnAxis(){let J=this.elements,$=J[0]*J[0]+J[1]*J[1]+J[2]*J[2],Q=J[4]*J[4]+J[5]*J[5]+J[6]*J[6],Z=J[8]*J[8]+J[9]*J[9]+J[10]*J[10];return Math.sqrt(Math.max($,Q,Z))}makeTranslation(J,$,Q){if(J.isVector3)this.set(1,0,0,J.x,0,1,0,J.y,0,0,1,J.z,0,0,0,1);else this.set(1,0,0,J,0,1,0,$,0,0,1,Q,0,0,0,1);return this}makeRotationX(J){let $=Math.cos(J),Q=Math.sin(J);return this.set(1,0,0,0,0,$,-Q,0,0,Q,$,0,0,0,0,1),this}makeRotationY(J){let $=Math.cos(J),Q=Math.sin(J);return this.set($,0,Q,0,0,1,0,0,-Q,0,$,0,0,0,0,1),this}makeRotationZ(J){let $=Math.cos(J),Q=Math.sin(J);return this.set($,-Q,0,0,Q,$,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(J,$){let Q=Math.cos($),Z=Math.sin($),W=1-Q,Y=J.x,X=J.y,H=J.z,K=W*Y,q=W*X;return this.set(K*Y+Q,K*X-Z*H,K*H+Z*X,0,K*X+Z*H,q*X+Q,q*H-Z*Y,0,K*H-Z*X,q*H+Z*Y,W*H*H+Q,0,0,0,0,1),this}makeScale(J,$,Q){return this.set(J,0,0,0,0,$,0,0,0,0,Q,0,0,0,0,1),this}makeShear(J,$,Q,Z,W,Y){return this.set(1,Q,W,0,J,1,Y,0,$,Z,1,0,0,0,0,1),this}compose(J,$,Q){let Z=this.elements,W=$._x,Y=$._y,X=$._z,H=$._w,K=W+W,q=Y+Y,G=X+X,U=W*K,F=W*q,O=W*G,z=Y*q,R=Y*G,V=X*G,E=H*K,D=H*q,M=H*G,_=Q.x,x=Q.y,C=Q.z;return Z[0]=(1-(z+V))*_,Z[1]=(F+M)*_,Z[2]=(O-D)*_,Z[3]=0,Z[4]=(F-M)*x,Z[5]=(1-(U+V))*x,Z[6]=(R+E)*x,Z[7]=0,Z[8]=(O+D)*C,Z[9]=(R-E)*C,Z[10]=(1-(U+z))*C,Z[11]=0,Z[12]=J.x,Z[13]=J.y,Z[14]=J.z,Z[15]=1,this}decompose(J,$,Q){let Z=this.elements,W=e6.set(Z[0],Z[1],Z[2]).length(),Y=e6.set(Z[4],Z[5],Z[6]).length(),X=e6.set(Z[8],Z[9],Z[10]).length();if(this.determinant()<0)W=-W;J.x=Z[12],J.y=Z[13],J.z=Z[14],p0.copy(this);let K=1/W,q=1/Y,G=1/X;return p0.elements[0]*=K,p0.elements[1]*=K,p0.elements[2]*=K,p0.elements[4]*=q,p0.elements[5]*=q,p0.elements[6]*=q,p0.elements[8]*=G,p0.elements[9]*=G,p0.elements[10]*=G,$.setFromRotationMatrix(p0),Q.x=W,Q.y=Y,Q.z=X,this}makePerspective(J,$,Q,Z,W,Y,X=2000){let H=this.elements,K=2*W/($-J),q=2*W/(Q-Z),G=($+J)/($-J),U=(Q+Z)/(Q-Z),F,O;if(X===2000)F=-(Y+W)/(Y-W),O=-2*Y*W/(Y-W);else if(X===2001)F=-Y/(Y-W),O=-Y*W/(Y-W);else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+X);return H[0]=K,H[4]=0,H[8]=G,H[12]=0,H[1]=0,H[5]=q,H[9]=U,H[13]=0,H[2]=0,H[6]=0,H[10]=F,H[14]=O,H[3]=0,H[7]=0,H[11]=-1,H[15]=0,this}makeOrthographic(J,$,Q,Z,W,Y,X=2000){let H=this.elements,K=1/($-J),q=1/(Q-Z),G=1/(Y-W),U=($+J)*K,F=(Q+Z)*q,O,z;if(X===2000)O=(Y+W)*G,z=-2*G;else if(X===2001)O=W*G,z=-1*G;else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+X);return H[0]=2*K,H[4]=0,H[8]=0,H[12]=-U,H[1]=0,H[5]=2*q,H[9]=0,H[13]=-F,H[2]=0,H[6]=0,H[10]=z,H[14]=-O,H[3]=0,H[7]=0,H[11]=0,H[15]=1,this}equals(J){let $=this.elements,Q=J.elements;for(let Z=0;Z<16;Z++)if($[Z]!==Q[Z])return!1;return!0}fromArray(J,$=0){for(let Q=0;Q<16;Q++)this.elements[Q]=J[Q+$];return this}toArray(J=[],$=0){let Q=this.elements;return J[$]=Q[0],J[$+1]=Q[1],J[$+2]=Q[2],J[$+3]=Q[3],J[$+4]=Q[4],J[$+5]=Q[5],J[$+6]=Q[6],J[$+7]=Q[7],J[$+8]=Q[8],J[$+9]=Q[9],J[$+10]=Q[10],J[$+11]=Q[11],J[$+12]=Q[12],J[$+13]=Q[13],J[$+14]=Q[14],J[$+15]=Q[15],J}}var e6=new A,p0=new _J,NZ=new A(0,0,0),zZ=new A(1,1,1),N6=new A,n7=new A,A0=new A,B$=new _J,M$=new I0;class t0{constructor(J=0,$=0,Q=0,Z=t0.DEFAULT_ORDER){this.isEuler=!0,this._x=J,this._y=$,this._z=Q,this._order=Z}get x(){return this._x}set x(J){this._x=J,this._onChangeCallback()}get y(){return this._y}set y(J){this._y=J,this._onChangeCallback()}get z(){return this._z}set z(J){this._z=J,this._onChangeCallback()}get order(){return this._order}set order(J){this._order=J,this._onChangeCallback()}set(J,$,Q,Z=this._order){return this._x=J,this._y=$,this._z=Q,this._order=Z,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(J){return this._x=J._x,this._y=J._y,this._z=J._z,this._order=J._order,this._onChangeCallback(),this}setFromRotationMatrix(J,$=this._order,Q=!0){let Z=J.elements,W=Z[0],Y=Z[4],X=Z[8],H=Z[1],K=Z[5],q=Z[9],G=Z[2],U=Z[6],F=Z[10];switch($){case"XYZ":if(this._y=Math.asin(N0(X,-1,1)),Math.abs(X)<0.9999999)this._x=Math.atan2(-q,F),this._z=Math.atan2(-Y,W);else this._x=Math.atan2(U,K),this._z=0;break;case"YXZ":if(this._x=Math.asin(-N0(q,-1,1)),Math.abs(q)<0.9999999)this._y=Math.atan2(X,F),this._z=Math.atan2(H,K);else this._y=Math.atan2(-G,W),this._z=0;break;case"ZXY":if(this._x=Math.asin(N0(U,-1,1)),Math.abs(U)<0.9999999)this._y=Math.atan2(-G,F),this._z=Math.atan2(-Y,K);else this._y=0,this._z=Math.atan2(H,W);break;case"ZYX":if(this._y=Math.asin(-N0(G,-1,1)),Math.abs(G)<0.9999999)this._x=Math.atan2(U,F),this._z=Math.atan2(H,W);else this._x=0,this._z=Math.atan2(-Y,K);break;case"YZX":if(this._z=Math.asin(N0(H,-1,1)),Math.abs(H)<0.9999999)this._x=Math.atan2(-q,K),this._y=Math.atan2(-G,W);else this._x=0,this._y=Math.atan2(X,F);break;case"XZY":if(this._z=Math.asin(-N0(Y,-1,1)),Math.abs(Y)<0.9999999)this._x=Math.atan2(U,K),this._y=Math.atan2(X,W);else this._x=Math.atan2(-q,F),this._y=0;break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+$)}if(this._order=$,Q===!0)this._onChangeCallback();return this}setFromQuaternion(J,$,Q){return B$.makeRotationFromQuaternion(J),this.setFromRotationMatrix(B$,$,Q)}setFromVector3(J,$=this._order){return this.set(J.x,J.y,J.z,$)}reorder(J){return M$.setFromEuler(this),this.setFromQuaternion(M$,J)}equals(J){return J._x===this._x&&J._y===this._y&&J._z===this._z&&J._order===this._order}fromArray(J){if(this._x=J[0],this._y=J[1],this._z=J[2],J[3]!==void 0)this._order=J[3];return this._onChangeCallback(),this}toArray(J=[],$=0){return J[$]=this._x,J[$+1]=this._y,J[$+2]=this._z,J[$+3]=this._order,J}_onChange(J){return this._onChangeCallback=J,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}t0.DEFAULT_ORDER="XYZ";class k8{constructor(){this.mask=1}set(J){this.mask=(1<<J|0)>>>0}enable(J){this.mask|=1<<J|0}enableAll(){this.mask=-1}toggle(J){this.mask^=1<<J|0}disable(J){this.mask&=~(1<<J|0)}disableAll(){this.mask=0}test(J){return(this.mask&J.mask)!==0}isEnabled(J){return(this.mask&(1<<J|0))!==0}}var BZ=0,k$=new A,J7=new I0,W6=new _J,s7=new A,M7=new A,MZ=new A,kZ=new I0,L$=new A(1,0,0),D$=new A(0,1,0),w$=new A(0,0,1),C$={type:"added"},LZ={type:"removed"},$7={type:"childadded",child:null},m8={type:"childremoved",child:null};class Z0 extends C6{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:BZ++}),this.uuid=c0(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Z0.DEFAULT_UP.clone();let J=new A,$=new t0,Q=new I0,Z=new A(1,1,1);function W(){Q.setFromEuler($,!1)}function Y(){$.setFromQuaternion(Q,void 0,!1)}$._onChange(W),Q._onChange(Y),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:J},rotation:{configurable:!0,enumerable:!0,value:$},quaternion:{configurable:!0,enumerable:!0,value:Q},scale:{configurable:!0,enumerable:!0,value:Z},modelViewMatrix:{value:new _J},normalMatrix:{value:new yJ}}),this.matrix=new _J,this.matrixWorld=new _J,this.matrixAutoUpdate=Z0.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Z0.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new k8,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(J){if(this.matrixAutoUpdate)this.updateMatrix();this.matrix.premultiply(J),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(J){return this.quaternion.premultiply(J),this}setRotationFromAxisAngle(J,$){this.quaternion.setFromAxisAngle(J,$)}setRotationFromEuler(J){this.quaternion.setFromEuler(J,!0)}setRotationFromMatrix(J){this.quaternion.setFromRotationMatrix(J)}setRotationFromQuaternion(J){this.quaternion.copy(J)}rotateOnAxis(J,$){return J7.setFromAxisAngle(J,$),this.quaternion.multiply(J7),this}rotateOnWorldAxis(J,$){return J7.setFromAxisAngle(J,$),this.quaternion.premultiply(J7),this}rotateX(J){return this.rotateOnAxis(L$,J)}rotateY(J){return this.rotateOnAxis(D$,J)}rotateZ(J){return this.rotateOnAxis(w$,J)}translateOnAxis(J,$){return k$.copy(J).applyQuaternion(this.quaternion),this.position.add(k$.multiplyScalar($)),this}translateX(J){return this.translateOnAxis(L$,J)}translateY(J){return this.translateOnAxis(D$,J)}translateZ(J){return this.translateOnAxis(w$,J)}localToWorld(J){return this.updateWorldMatrix(!0,!1),J.applyMatrix4(this.matrixWorld)}worldToLocal(J){return this.updateWorldMatrix(!0,!1),J.applyMatrix4(W6.copy(this.matrixWorld).invert())}lookAt(J,$,Q){if(J.isVector3)s7.copy(J);else s7.set(J,$,Q);let Z=this.parent;if(this.updateWorldMatrix(!0,!1),M7.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight)W6.lookAt(M7,s7,this.up);else W6.lookAt(s7,M7,this.up);if(this.quaternion.setFromRotationMatrix(W6),Z)W6.extractRotation(Z.matrixWorld),J7.setFromRotationMatrix(W6),this.quaternion.premultiply(J7.invert())}add(J){if(arguments.length>1){for(let $=0;$<arguments.length;$++)this.add(arguments[$]);return this}if(J===this)return console.error("THREE.Object3D.add: object can't be added as a child of itself.",J),this;if(J&&J.isObject3D)J.removeFromParent(),J.parent=this,this.children.push(J),J.dispatchEvent(C$),$7.child=J,this.dispatchEvent($7),$7.child=null;else console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",J);return this}remove(J){if(arguments.length>1){for(let Q=0;Q<arguments.length;Q++)this.remove(arguments[Q]);return this}let $=this.children.indexOf(J);if($!==-1)J.parent=null,this.children.splice($,1),J.dispatchEvent(LZ),m8.child=J,this.dispatchEvent(m8),m8.child=null;return this}removeFromParent(){let J=this.parent;if(J!==null)J.remove(this);return this}clear(){return this.remove(...this.children)}attach(J){if(this.updateWorldMatrix(!0,!1),W6.copy(this.matrixWorld).invert(),J.parent!==null)J.parent.updateWorldMatrix(!0,!1),W6.multiply(J.parent.matrixWorld);return J.applyMatrix4(W6),J.removeFromParent(),J.parent=this,this.children.push(J),J.updateWorldMatrix(!1,!0),J.dispatchEvent(C$),$7.child=J,this.dispatchEvent($7),$7.child=null,this}getObjectById(J){return this.getObjectByProperty("id",J)}getObjectByName(J){return this.getObjectByProperty("name",J)}getObjectByProperty(J,$){if(this[J]===$)return this;for(let Q=0,Z=this.children.length;Q<Z;Q++){let Y=this.children[Q].getObjectByProperty(J,$);if(Y!==void 0)return Y}return}getObjectsByProperty(J,$,Q=[]){if(this[J]===$)Q.push(this);let Z=this.children;for(let W=0,Y=Z.length;W<Y;W++)Z[W].getObjectsByProperty(J,$,Q);return Q}getWorldPosition(J){return this.updateWorldMatrix(!0,!1),J.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(J){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(M7,J,MZ),J}getWorldScale(J){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(M7,kZ,J),J}getWorldDirection(J){this.updateWorldMatrix(!0,!1);let $=this.matrixWorld.elements;return J.set($[8],$[9],$[10]).normalize()}raycast(){}traverse(J){J(this);let $=this.children;for(let Q=0,Z=$.length;Q<Z;Q++)$[Q].traverse(J)}traverseVisible(J){if(this.visible===!1)return;J(this);let $=this.children;for(let Q=0,Z=$.length;Q<Z;Q++)$[Q].traverseVisible(J)}traverseAncestors(J){let $=this.parent;if($!==null)J($),$.traverseAncestors(J)}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(J){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||J){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,J=!0}let $=this.children;for(let Q=0,Z=$.length;Q<Z;Q++)$[Q].updateMatrixWorld(J)}updateWorldMatrix(J,$){let Q=this.parent;if(J===!0&&Q!==null)Q.updateWorldMatrix(!0,!1);if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);if($===!0){let Z=this.children;for(let W=0,Y=Z.length;W<Y;W++)Z[W].updateWorldMatrix(!1,!0)}}toJSON(J){let $=J===void 0||typeof J==="string",Q={};if($)J={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},Q.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"};let Z={};if(Z.uuid=this.uuid,Z.type=this.type,this.name!=="")Z.name=this.name;if(this.castShadow===!0)Z.castShadow=!0;if(this.receiveShadow===!0)Z.receiveShadow=!0;if(this.visible===!1)Z.visible=!1;if(this.frustumCulled===!1)Z.frustumCulled=!1;if(this.renderOrder!==0)Z.renderOrder=this.renderOrder;if(Object.keys(this.userData).length>0)Z.userData=this.userData;if(Z.layers=this.layers.mask,Z.matrix=this.matrix.toArray(),Z.up=this.up.toArray(),this.matrixAutoUpdate===!1)Z.matrixAutoUpdate=!1;if(this.isInstancedMesh){if(Z.type="InstancedMesh",Z.count=this.count,Z.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null)Z.instanceColor=this.instanceColor.toJSON()}if(this.isBatchedMesh){if(Z.type="BatchedMesh",Z.perObjectFrustumCulled=this.perObjectFrustumCulled,Z.sortObjects=this.sortObjects,Z.drawRanges=this._drawRanges,Z.reservedRanges=this._reservedRanges,Z.visibility=this._visibility,Z.active=this._active,Z.bounds=this._bounds.map((X)=>({boxInitialized:X.boxInitialized,boxMin:X.box.min.toArray(),boxMax:X.box.max.toArray(),sphereInitialized:X.sphereInitialized,sphereRadius:X.sphere.radius,sphereCenter:X.sphere.center.toArray()})),Z.maxInstanceCount=this._maxInstanceCount,Z.maxVertexCount=this._maxVertexCount,Z.maxIndexCount=this._maxIndexCount,Z.geometryInitialized=this._geometryInitialized,Z.geometryCount=this._geometryCount,Z.matricesTexture=this._matricesTexture.toJSON(J),this._colorsTexture!==null)Z.colorsTexture=this._colorsTexture.toJSON(J);if(this.boundingSphere!==null)Z.boundingSphere={center:Z.boundingSphere.center.toArray(),radius:Z.boundingSphere.radius};if(this.boundingBox!==null)Z.boundingBox={min:Z.boundingBox.min.toArray(),max:Z.boundingBox.max.toArray()}}function W(X,H){if(X[H.uuid]===void 0)X[H.uuid]=H.toJSON(J);return H.uuid}if(this.isScene){if(this.background){if(this.background.isColor)Z.background=this.background.toJSON();else if(this.background.isTexture)Z.background=this.background.toJSON(J).uuid}if(this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0)Z.environment=this.environment.toJSON(J).uuid}else if(this.isMesh||this.isLine||this.isPoints){Z.geometry=W(J.geometries,this.geometry);let X=this.geometry.parameters;if(X!==void 0&&X.shapes!==void 0){let H=X.shapes;if(Array.isArray(H))for(let K=0,q=H.length;K<q;K++){let G=H[K];W(J.shapes,G)}else W(J.shapes,H)}}if(this.isSkinnedMesh){if(Z.bindMode=this.bindMode,Z.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0)W(J.skeletons,this.skeleton),Z.skeleton=this.skeleton.uuid}if(this.material!==void 0)if(Array.isArray(this.material)){let X=[];for(let H=0,K=this.material.length;H<K;H++)X.push(W(J.materials,this.material[H]));Z.material=X}else Z.material=W(J.materials,this.material);if(this.children.length>0){Z.children=[];for(let X=0;X<this.children.length;X++)Z.children.push(this.children[X].toJSON(J).object)}if(this.animations.length>0){Z.animations=[];for(let X=0;X<this.animations.length;X++){let H=this.animations[X];Z.animations.push(W(J.animations,H))}}if($){let X=Y(J.geometries),H=Y(J.materials),K=Y(J.textures),q=Y(J.images),G=Y(J.shapes),U=Y(J.skeletons),F=Y(J.animations),O=Y(J.nodes);if(X.length>0)Q.geometries=X;if(H.length>0)Q.materials=H;if(K.length>0)Q.textures=K;if(q.length>0)Q.images=q;if(G.length>0)Q.shapes=G;if(U.length>0)Q.skeletons=U;if(F.length>0)Q.animations=F;if(O.length>0)Q.nodes=O}return Q.object=Z,Q;function Y(X){let H=[];for(let K in X){let q=X[K];delete q.metadata,H.push(q)}return H}}clone(J){return new this.constructor().copy(this,J)}copy(J,$=!0){if(this.name=J.name,this.up.copy(J.up),this.position.copy(J.position),this.rotation.order=J.rotation.order,this.quaternion.copy(J.quaternion),this.scale.copy(J.scale),this.matrix.copy(J.matrix),this.matrixWorld.copy(J.matrixWorld),this.matrixAutoUpdate=J.matrixAutoUpdate,this.matrixWorldAutoUpdate=J.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=J.matrixWorldNeedsUpdate,this.layers.mask=J.layers.mask,this.visible=J.visible,this.castShadow=J.castShadow,this.receiveShadow=J.receiveShadow,this.frustumCulled=J.frustumCulled,this.renderOrder=J.renderOrder,this.animations=J.animations.slice(),this.userData=JSON.parse(JSON.stringify(J.userData)),$===!0)for(let Q=0;Q<J.children.length;Q++){let Z=J.children[Q];this.add(Z.clone())}return this}}Z0.DEFAULT_UP=new A(0,1,0);Z0.DEFAULT_MATRIX_AUTO_UPDATE=!0;Z0.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var l0=new A,Y6=new A,d8=new A,X6=new A,Q7=new A,Z7=new A,_$=new A,c8=new A,n8=new A,s8=new A,o8=new dJ,i8=new dJ,a8=new dJ;class m0{constructor(J=new A,$=new A,Q=new A){this.a=J,this.b=$,this.c=Q}static getNormal(J,$,Q,Z){Z.subVectors(Q,$),l0.subVectors(J,$),Z.cross(l0);let W=Z.lengthSq();if(W>0)return Z.multiplyScalar(1/Math.sqrt(W));return Z.set(0,0,0)}static getBarycoord(J,$,Q,Z,W){l0.subVectors(Z,$),Y6.subVectors(Q,$),d8.subVectors(J,$);let Y=l0.dot(l0),X=l0.dot(Y6),H=l0.dot(d8),K=Y6.dot(Y6),q=Y6.dot(d8),G=Y*K-X*X;if(G===0)return W.set(0,0,0),null;let U=1/G,F=(K*H-X*q)*U,O=(Y*q-X*H)*U;return W.set(1-F-O,O,F)}static containsPoint(J,$,Q,Z){if(this.getBarycoord(J,$,Q,Z,X6)===null)return!1;return X6.x>=0&&X6.y>=0&&X6.x+X6.y<=1}static getInterpolation(J,$,Q,Z,W,Y,X,H){if(this.getBarycoord(J,$,Q,Z,X6)===null){if(H.x=0,H.y=0,"z"in H)H.z=0;if("w"in H)H.w=0;return null}return H.setScalar(0),H.addScaledVector(W,X6.x),H.addScaledVector(Y,X6.y),H.addScaledVector(X,X6.z),H}static getInterpolatedAttribute(J,$,Q,Z,W,Y){return o8.setScalar(0),i8.setScalar(0),a8.setScalar(0),o8.fromBufferAttribute(J,$),i8.fromBufferAttribute(J,Q),a8.fromBufferAttribute(J,Z),Y.setScalar(0),Y.addScaledVector(o8,W.x),Y.addScaledVector(i8,W.y),Y.addScaledVector(a8,W.z),Y}static isFrontFacing(J,$,Q,Z){return l0.subVectors(Q,$),Y6.subVectors(J,$),l0.cross(Y6).dot(Z)<0?!0:!1}set(J,$,Q){return this.a.copy(J),this.b.copy($),this.c.copy(Q),this}setFromPointsAndIndices(J,$,Q,Z){return this.a.copy(J[$]),this.b.copy(J[Q]),this.c.copy(J[Z]),this}setFromAttributeAndIndices(J,$,Q,Z){return this.a.fromBufferAttribute(J,$),this.b.fromBufferAttribute(J,Q),this.c.fromBufferAttribute(J,Z),this}clone(){return new this.constructor().copy(this)}copy(J){return this.a.copy(J.a),this.b.copy(J.b),this.c.copy(J.c),this}getArea(){return l0.subVectors(this.c,this.b),Y6.subVectors(this.a,this.b),l0.cross(Y6).length()*0.5}getMidpoint(J){return J.addVectors(this.a,this.b).add(this.c).multiplyScalar(0.3333333333333333)}getNormal(J){return m0.getNormal(this.a,this.b,this.c,J)}getPlane(J){return J.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(J,$){return m0.getBarycoord(J,this.a,this.b,this.c,$)}getInterpolation(J,$,Q,Z,W){return m0.getInterpolation(J,this.a,this.b,this.c,$,Q,Z,W)}containsPoint(J){return m0.containsPoint(J,this.a,this.b,this.c)}isFrontFacing(J){return m0.isFrontFacing(this.a,this.b,this.c,J)}intersectsBox(J){return J.intersectsTriangle(this)}closestPointToPoint(J,$){let Q=this.a,Z=this.b,W=this.c,Y,X;Q7.subVectors(Z,Q),Z7.subVectors(W,Q),c8.subVectors(J,Q);let H=Q7.dot(c8),K=Z7.dot(c8);if(H<=0&&K<=0)return $.copy(Q);n8.subVectors(J,Z);let q=Q7.dot(n8),G=Z7.dot(n8);if(q>=0&&G<=q)return $.copy(Z);let U=H*G-q*K;if(U<=0&&H>=0&&q<=0)return Y=H/(H-q),$.copy(Q).addScaledVector(Q7,Y);s8.subVectors(J,W);let F=Q7.dot(s8),O=Z7.dot(s8);if(O>=0&&F<=O)return $.copy(W);let z=F*K-H*O;if(z<=0&&K>=0&&O<=0)return X=K/(K-O),$.copy(Q).addScaledVector(Z7,X);let R=q*O-F*G;if(R<=0&&G-q>=0&&F-O>=0)return _$.subVectors(W,Z),X=(G-q)/(G-q+(F-O)),$.copy(Z).addScaledVector(_$,X);let V=1/(R+z+U);return Y=z*V,X=U*V,$.copy(Q).addScaledVector(Q7,Y).addScaledVector(Z7,X)}equals(J){return J.a.equals(this.a)&&J.b.equals(this.b)&&J.c.equals(this.c)}}var f5={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},z6={h:0,s:0,l:0},o7={h:0,s:0,l:0};function r8(J,$,Q){if(Q<0)Q+=1;if(Q>1)Q-=1;if(Q<0.16666666666666666)return J+($-J)*6*Q;if(Q<0.5)return $;if(Q<0.6666666666666666)return J+($-J)*6*(0.6666666666666666-Q);return J}class DJ{constructor(J,$,Q){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(J,$,Q)}set(J,$,Q){if($===void 0&&Q===void 0){let Z=J;if(Z&&Z.isColor)this.copy(Z);else if(typeof Z==="number")this.setHex(Z);else if(typeof Z==="string")this.setStyle(Z)}else this.setRGB(J,$,Q);return this}setScalar(J){return this.r=J,this.g=J,this.b=J,this}setHex(J,$="srgb"){return J=Math.floor(J),this.r=(J>>16&255)/255,this.g=(J>>8&255)/255,this.b=(J&255)/255,pJ.toWorkingColorSpace(this,$),this}setRGB(J,$,Q,Z=pJ.workingColorSpace){return this.r=J,this.g=$,this.b=Q,pJ.toWorkingColorSpace(this,Z),this}setHSL(J,$,Q,Z=pJ.workingColorSpace){if(J=B9(J,1),$=N0($,0,1),Q=N0(Q,0,1),$===0)this.r=this.g=this.b=Q;else{let W=Q<=0.5?Q*(1+$):Q+$-Q*$,Y=2*Q-W;this.r=r8(Y,W,J+0.3333333333333333),this.g=r8(Y,W,J),this.b=r8(Y,W,J-0.3333333333333333)}return pJ.toWorkingColorSpace(this,Z),this}setStyle(J,$="srgb"){function Q(W){if(W===void 0)return;if(parseFloat(W)<1)console.warn("THREE.Color: Alpha component of "+J+" will be ignored.")}let Z;if(Z=/^(\w+)\(([^\)]*)\)/.exec(J)){let W,Y=Z[1],X=Z[2];switch(Y){case"rgb":case"rgba":if(W=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(X))return Q(W[4]),this.setRGB(Math.min(255,parseInt(W[1],10))/255,Math.min(255,parseInt(W[2],10))/255,Math.min(255,parseInt(W[3],10))/255,$);if(W=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(X))return Q(W[4]),this.setRGB(Math.min(100,parseInt(W[1],10))/100,Math.min(100,parseInt(W[2],10))/100,Math.min(100,parseInt(W[3],10))/100,$);break;case"hsl":case"hsla":if(W=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(X))return Q(W[4]),this.setHSL(parseFloat(W[1])/360,parseFloat(W[2])/100,parseFloat(W[3])/100,$);break;default:console.warn("THREE.Color: Unknown color model "+J)}}else if(Z=/^\#([A-Fa-f\d]+)$/.exec(J)){let W=Z[1],Y=W.length;if(Y===3)return this.setRGB(parseInt(W.charAt(0),16)/15,parseInt(W.charAt(1),16)/15,parseInt(W.charAt(2),16)/15,$);else if(Y===6)return this.setHex(parseInt(W,16),$);else console.warn("THREE.Color: Invalid hex color "+J)}else if(J&&J.length>0)return this.setColorName(J,$);return this}setColorName(J,$="srgb"){let Q=f5[J.toLowerCase()];if(Q!==void 0)this.setHex(Q,$);else console.warn("THREE.Color: Unknown color "+J);return this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(J){return this.r=J.r,this.g=J.g,this.b=J.b,this}copySRGBToLinear(J){return this.r=K6(J.r),this.g=K6(J.g),this.b=K6(J.b),this}copyLinearToSRGB(J){return this.r=G7(J.r),this.g=G7(J.g),this.b=G7(J.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(J="srgb"){return pJ.fromWorkingColorSpace(B0.copy(this),J),Math.round(N0(B0.r*255,0,255))*65536+Math.round(N0(B0.g*255,0,255))*256+Math.round(N0(B0.b*255,0,255))}getHexString(J="srgb"){return("000000"+this.getHex(J).toString(16)).slice(-6)}getHSL(J,$=pJ.workingColorSpace){pJ.fromWorkingColorSpace(B0.copy(this),$);let{r:Q,g:Z,b:W}=B0,Y=Math.max(Q,Z,W),X=Math.min(Q,Z,W),H,K,q=(X+Y)/2;if(X===Y)H=0,K=0;else{let G=Y-X;switch(K=q<=0.5?G/(Y+X):G/(2-Y-X),Y){case Q:H=(Z-W)/G+(Z<W?6:0);break;case Z:H=(W-Q)/G+2;break;case W:H=(Q-Z)/G+4;break}H/=6}return J.h=H,J.s=K,J.l=q,J}getRGB(J,$=pJ.workingColorSpace){return pJ.fromWorkingColorSpace(B0.copy(this),$),J.r=B0.r,J.g=B0.g,J.b=B0.b,J}getStyle(J="srgb"){pJ.fromWorkingColorSpace(B0.copy(this),J);let{r:$,g:Q,b:Z}=B0;if(J!=="srgb")return`color(${J} ${$.toFixed(3)} ${Q.toFixed(3)} ${Z.toFixed(3)})`;return`rgb(${Math.round($*255)},${Math.round(Q*255)},${Math.round(Z*255)})`}offsetHSL(J,$,Q){return this.getHSL(z6),this.setHSL(z6.h+J,z6.s+$,z6.l+Q)}add(J){return this.r+=J.r,this.g+=J.g,this.b+=J.b,this}addColors(J,$){return this.r=J.r+$.r,this.g=J.g+$.g,this.b=J.b+$.b,this}addScalar(J){return this.r+=J,this.g+=J,this.b+=J,this}sub(J){return this.r=Math.max(0,this.r-J.r),this.g=Math.max(0,this.g-J.g),this.b=Math.max(0,this.b-J.b),this}multiply(J){return this.r*=J.r,this.g*=J.g,this.b*=J.b,this}multiplyScalar(J){return this.r*=J,this.g*=J,this.b*=J,this}lerp(J,$){return this.r+=(J.r-this.r)*$,this.g+=(J.g-this.g)*$,this.b+=(J.b-this.b)*$,this}lerpColors(J,$,Q){return this.r=J.r+($.r-J.r)*Q,this.g=J.g+($.g-J.g)*Q,this.b=J.b+($.b-J.b)*Q,this}lerpHSL(J,$){this.getHSL(z6),J.getHSL(o7);let Q=T7(z6.h,o7.h,$),Z=T7(z6.s,o7.s,$),W=T7(z6.l,o7.l,$);return this.setHSL(Q,Z,W),this}setFromVector3(J){return this.r=J.x,this.g=J.y,this.b=J.z,this}applyMatrix3(J){let $=this.r,Q=this.g,Z=this.b,W=J.elements;return this.r=W[0]*$+W[3]*Q+W[6]*Z,this.g=W[1]*$+W[4]*Q+W[7]*Z,this.b=W[2]*$+W[5]*Q+W[8]*Z,this}equals(J){return J.r===this.r&&J.g===this.g&&J.b===this.b}fromArray(J,$=0){return this.r=J[$],this.g=J[$+1],this.b=J[$+2],this}toArray(J=[],$=0){return J[$]=this.r,J[$+1]=this.g,J[$+2]=this.b,J}fromBufferAttribute(J,$){return this.r=J.getX($),this.g=J.getY($),this.b=J.getZ($),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}var B0=new DJ;DJ.NAMES=f5;var DZ=0;class v0 extends C6{static get type(){return"Material"}get type(){return this.constructor.type}set type(J){}constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:DZ++}),this.uuid=c0(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new DJ(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(J){if(this._alphaTest>0!==J>0)this.version++;this._alphaTest=J}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(J){if(J===void 0)return;for(let $ in J){let Q=J[$];if(Q===void 0){console.warn(`THREE.Material: parameter '${$}' has value of undefined.`);continue}let Z=this[$];if(Z===void 0){console.warn(`THREE.Material: '${$}' is not a property of THREE.${this.type}.`);continue}if(Z&&Z.isColor)Z.set(Q);else if(Z&&Z.isVector3&&(Q&&Q.isVector3))Z.copy(Q);else this[$]=Q}}toJSON(J){let $=J===void 0||typeof J==="string";if($)J={textures:{},images:{}};let Q={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};if(Q.uuid=this.uuid,Q.type=this.type,this.name!=="")Q.name=this.name;if(this.color&&this.color.isColor)Q.color=this.color.getHex();if(this.roughness!==void 0)Q.roughness=this.roughness;if(this.metalness!==void 0)Q.metalness=this.metalness;if(this.sheen!==void 0)Q.sheen=this.sheen;if(this.sheenColor&&this.sheenColor.isColor)Q.sheenColor=this.sheenColor.getHex();if(this.sheenRoughness!==void 0)Q.sheenRoughness=this.sheenRoughness;if(this.emissive&&this.emissive.isColor)Q.emissive=this.emissive.getHex();if(this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1)Q.emissiveIntensity=this.emissiveIntensity;if(this.specular&&this.specular.isColor)Q.specular=this.specular.getHex();if(this.specularIntensity!==void 0)Q.specularIntensity=this.specularIntensity;if(this.specularColor&&this.specularColor.isColor)Q.specularColor=this.specularColor.getHex();if(this.shininess!==void 0)Q.shininess=this.shininess;if(this.clearcoat!==void 0)Q.clearcoat=this.clearcoat;if(this.clearcoatRoughness!==void 0)Q.clearcoatRoughness=this.clearcoatRoughness;if(this.clearcoatMap&&this.clearcoatMap.isTexture)Q.clearcoatMap=this.clearcoatMap.toJSON(J).uuid;if(this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture)Q.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(J).uuid;if(this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture)Q.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(J).uuid,Q.clearcoatNormalScale=this.clearcoatNormalScale.toArray();if(this.dispersion!==void 0)Q.dispersion=this.dispersion;if(this.iridescence!==void 0)Q.iridescence=this.iridescence;if(this.iridescenceIOR!==void 0)Q.iridescenceIOR=this.iridescenceIOR;if(this.iridescenceThicknessRange!==void 0)Q.iridescenceThicknessRange=this.iridescenceThicknessRange;if(this.iridescenceMap&&this.iridescenceMap.isTexture)Q.iridescenceMap=this.iridescenceMap.toJSON(J).uuid;if(this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture)Q.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(J).uuid;if(this.anisotropy!==void 0)Q.anisotropy=this.anisotropy;if(this.anisotropyRotation!==void 0)Q.anisotropyRotation=this.anisotropyRotation;if(this.anisotropyMap&&this.anisotropyMap.isTexture)Q.anisotropyMap=this.anisotropyMap.toJSON(J).uuid;if(this.map&&this.map.isTexture)Q.map=this.map.toJSON(J).uuid;if(this.matcap&&this.matcap.isTexture)Q.matcap=this.matcap.toJSON(J).uuid;if(this.alphaMap&&this.alphaMap.isTexture)Q.alphaMap=this.alphaMap.toJSON(J).uuid;if(this.lightMap&&this.lightMap.isTexture)Q.lightMap=this.lightMap.toJSON(J).uuid,Q.lightMapIntensity=this.lightMapIntensity;if(this.aoMap&&this.aoMap.isTexture)Q.aoMap=this.aoMap.toJSON(J).uuid,Q.aoMapIntensity=this.aoMapIntensity;if(this.bumpMap&&this.bumpMap.isTexture)Q.bumpMap=this.bumpMap.toJSON(J).uuid,Q.bumpScale=this.bumpScale;if(this.normalMap&&this.normalMap.isTexture)Q.normalMap=this.normalMap.toJSON(J).uuid,Q.normalMapType=this.normalMapType,Q.normalScale=this.normalScale.toArray();if(this.displacementMap&&this.displacementMap.isTexture)Q.displacementMap=this.displacementMap.toJSON(J).uuid,Q.displacementScale=this.displacementScale,Q.displacementBias=this.displacementBias;if(this.roughnessMap&&this.roughnessMap.isTexture)Q.roughnessMap=this.roughnessMap.toJSON(J).uuid;if(this.metalnessMap&&this.metalnessMap.isTexture)Q.metalnessMap=this.metalnessMap.toJSON(J).uuid;if(this.emissiveMap&&this.emissiveMap.isTexture)Q.emissiveMap=this.emissiveMap.toJSON(J).uuid;if(this.specularMap&&this.specularMap.isTexture)Q.specularMap=this.specularMap.toJSON(J).uuid;if(this.specularIntensityMap&&this.specularIntensityMap.isTexture)Q.specularIntensityMap=this.specularIntensityMap.toJSON(J).uuid;if(this.specularColorMap&&this.specularColorMap.isTexture)Q.specularColorMap=this.specularColorMap.toJSON(J).uuid;if(this.envMap&&this.envMap.isTexture){if(Q.envMap=this.envMap.toJSON(J).uuid,this.combine!==void 0)Q.combine=this.combine}if(this.envMapRotation!==void 0)Q.envMapRotation=this.envMapRotation.toArray();if(this.envMapIntensity!==void 0)Q.envMapIntensity=this.envMapIntensity;if(this.reflectivity!==void 0)Q.reflectivity=this.reflectivity;if(this.refractionRatio!==void 0)Q.refractionRatio=this.refractionRatio;if(this.gradientMap&&this.gradientMap.isTexture)Q.gradientMap=this.gradientMap.toJSON(J).uuid;if(this.transmission!==void 0)Q.transmission=this.transmission;if(this.transmissionMap&&this.transmissionMap.isTexture)Q.transmissionMap=this.transmissionMap.toJSON(J).uuid;if(this.thickness!==void 0)Q.thickness=this.thickness;if(this.thicknessMap&&this.thicknessMap.isTexture)Q.thicknessMap=this.thicknessMap.toJSON(J).uuid;if(this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0)Q.attenuationDistance=this.attenuationDistance;if(this.attenuationColor!==void 0)Q.attenuationColor=this.attenuationColor.getHex();if(this.size!==void 0)Q.size=this.size;if(this.shadowSide!==null)Q.shadowSide=this.shadowSide;if(this.sizeAttenuation!==void 0)Q.sizeAttenuation=this.sizeAttenuation;if(this.blending!==1)Q.blending=this.blending;if(this.side!==0)Q.side=this.side;if(this.vertexColors===!0)Q.vertexColors=!0;if(this.opacity<1)Q.opacity=this.opacity;if(this.transparent===!0)Q.transparent=!0;if(this.blendSrc!==204)Q.blendSrc=this.blendSrc;if(this.blendDst!==205)Q.blendDst=this.blendDst;if(this.blendEquation!==100)Q.blendEquation=this.blendEquation;if(this.blendSrcAlpha!==null)Q.blendSrcAlpha=this.blendSrcAlpha;if(this.blendDstAlpha!==null)Q.blendDstAlpha=this.blendDstAlpha;if(this.blendEquationAlpha!==null)Q.blendEquationAlpha=this.blendEquationAlpha;if(this.blendColor&&this.blendColor.isColor)Q.blendColor=this.blendColor.getHex();if(this.blendAlpha!==0)Q.blendAlpha=this.blendAlpha;if(this.depthFunc!==3)Q.depthFunc=this.depthFunc;if(this.depthTest===!1)Q.depthTest=this.depthTest;if(this.depthWrite===!1)Q.depthWrite=this.depthWrite;if(this.colorWrite===!1)Q.colorWrite=this.colorWrite;if(this.stencilWriteMask!==255)Q.stencilWriteMask=this.stencilWriteMask;if(this.stencilFunc!==519)Q.stencilFunc=this.stencilFunc;if(this.stencilRef!==0)Q.stencilRef=this.stencilRef;if(this.stencilFuncMask!==255)Q.stencilFuncMask=this.stencilFuncMask;if(this.stencilFail!==7680)Q.stencilFail=this.stencilFail;if(this.stencilZFail!==7680)Q.stencilZFail=this.stencilZFail;if(this.stencilZPass!==7680)Q.stencilZPass=this.stencilZPass;if(this.stencilWrite===!0)Q.stencilWrite=this.stencilWrite;if(this.rotation!==void 0&&this.rotation!==0)Q.rotation=this.rotation;if(this.polygonOffset===!0)Q.polygonOffset=!0;if(this.polygonOffsetFactor!==0)Q.polygonOffsetFactor=this.polygonOffsetFactor;if(this.polygonOffsetUnits!==0)Q.polygonOffsetUnits=this.polygonOffsetUnits;if(this.linewidth!==void 0&&this.linewidth!==1)Q.linewidth=this.linewidth;if(this.dashSize!==void 0)Q.dashSize=this.dashSize;if(this.gapSize!==void 0)Q.gapSize=this.gapSize;if(this.scale!==void 0)Q.scale=this.scale;if(this.dithering===!0)Q.dithering=!0;if(this.alphaTest>0)Q.alphaTest=this.alphaTest;if(this.alphaHash===!0)Q.alphaHash=!0;if(this.alphaToCoverage===!0)Q.alphaToCoverage=!0;if(this.premultipliedAlpha===!0)Q.premultipliedAlpha=!0;if(this.forceSinglePass===!0)Q.forceSinglePass=!0;if(this.wireframe===!0)Q.wireframe=!0;if(this.wireframeLinewidth>1)Q.wireframeLinewidth=this.wireframeLinewidth;if(this.wireframeLinecap!=="round")Q.wireframeLinecap=this.wireframeLinecap;if(this.wireframeLinejoin!=="round")Q.wireframeLinejoin=this.wireframeLinejoin;if(this.flatShading===!0)Q.flatShading=!0;if(this.visible===!1)Q.visible=!1;if(this.toneMapped===!1)Q.toneMapped=!1;if(this.fog===!1)Q.fog=!1;if(Object.keys(this.userData).length>0)Q.userData=this.userData;function Z(W){let Y=[];for(let X in W){let H=W[X];delete H.metadata,Y.push(H)}return Y}if($){let W=Z(J.textures),Y=Z(J.images);if(W.length>0)Q.textures=W;if(Y.length>0)Q.images=Y}return Q}clone(){return new this.constructor().copy(this)}copy(J){this.name=J.name,this.blending=J.blending,this.side=J.side,this.vertexColors=J.vertexColors,this.opacity=J.opacity,this.transparent=J.transparent,this.blendSrc=J.blendSrc,this.blendDst=J.blendDst,this.blendEquation=J.blendEquation,this.blendSrcAlpha=J.blendSrcAlpha,this.blendDstAlpha=J.blendDstAlpha,this.blendEquationAlpha=J.blendEquationAlpha,this.blendColor.copy(J.blendColor),this.blendAlpha=J.blendAlpha,this.depthFunc=J.depthFunc,this.depthTest=J.depthTest,this.depthWrite=J.depthWrite,this.stencilWriteMask=J.stencilWriteMask,this.stencilFunc=J.stencilFunc,this.stencilRef=J.stencilRef,this.stencilFuncMask=J.stencilFuncMask,this.stencilFail=J.stencilFail,this.stencilZFail=J.stencilZFail,this.stencilZPass=J.stencilZPass,this.stencilWrite=J.stencilWrite;let $=J.clippingPlanes,Q=null;if($!==null){let Z=$.length;Q=Array(Z);for(let W=0;W!==Z;++W)Q[W]=$[W].clone()}return this.clippingPlanes=Q,this.clipIntersection=J.clipIntersection,this.clipShadows=J.clipShadows,this.shadowSide=J.shadowSide,this.colorWrite=J.colorWrite,this.precision=J.precision,this.polygonOffset=J.polygonOffset,this.polygonOffsetFactor=J.polygonOffsetFactor,this.polygonOffsetUnits=J.polygonOffsetUnits,this.dithering=J.dithering,this.alphaTest=J.alphaTest,this.alphaHash=J.alphaHash,this.alphaToCoverage=J.alphaToCoverage,this.premultipliedAlpha=J.premultipliedAlpha,this.forceSinglePass=J.forceSinglePass,this.visible=J.visible,this.toneMapped=J.toneMapped,this.userData=JSON.parse(JSON.stringify(J.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(J){if(J===!0)this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class G6 extends v0{static get type(){return"MeshBasicMaterial"}constructor(J){super();this.isMeshBasicMaterial=!0,this.color=new DJ(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new t0,this.combine=0,this.reflectivity=1,this.refractionRatio=0.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(J)}copy(J){return super.copy(J),this.color.copy(J.color),this.map=J.map,this.lightMap=J.lightMap,this.lightMapIntensity=J.lightMapIntensity,this.aoMap=J.aoMap,this.aoMapIntensity=J.aoMapIntensity,this.specularMap=J.specularMap,this.alphaMap=J.alphaMap,this.envMap=J.envMap,this.envMapRotation.copy(J.envMapRotation),this.combine=J.combine,this.reflectivity=J.reflectivity,this.refractionRatio=J.refractionRatio,this.wireframe=J.wireframe,this.wireframeLinewidth=J.wireframeLinewidth,this.wireframeLinecap=J.wireframeLinecap,this.wireframeLinejoin=J.wireframeLinejoin,this.fog=J.fog,this}}var H0=new A,i7=new LJ;class V0{constructor(J,$,Q=!1){if(Array.isArray(J))throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=J,this.itemSize=$,this.count=J!==void 0?J.length/$:0,this.normalized=Q,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(J){if(J===!0)this.version++}setUsage(J){return this.usage=J,this}addUpdateRange(J,$){this.updateRanges.push({start:J,count:$})}clearUpdateRanges(){this.updateRanges.length=0}copy(J){return this.name=J.name,this.array=new J.array.constructor(J.array),this.itemSize=J.itemSize,this.count=J.count,this.normalized=J.normalized,this.usage=J.usage,this.gpuType=J.gpuType,this}copyAt(J,$,Q){J*=this.itemSize,Q*=$.itemSize;for(let Z=0,W=this.itemSize;Z<W;Z++)this.array[J+Z]=$.array[Q+Z];return this}copyArray(J){return this.array.set(J),this}applyMatrix3(J){if(this.itemSize===2)for(let $=0,Q=this.count;$<Q;$++)i7.fromBufferAttribute(this,$),i7.applyMatrix3(J),this.setXY($,i7.x,i7.y);else if(this.itemSize===3)for(let $=0,Q=this.count;$<Q;$++)H0.fromBufferAttribute(this,$),H0.applyMatrix3(J),this.setXYZ($,H0.x,H0.y,H0.z);return this}applyMatrix4(J){for(let $=0,Q=this.count;$<Q;$++)H0.fromBufferAttribute(this,$),H0.applyMatrix4(J),this.setXYZ($,H0.x,H0.y,H0.z);return this}applyNormalMatrix(J){for(let $=0,Q=this.count;$<Q;$++)H0.fromBufferAttribute(this,$),H0.applyNormalMatrix(J),this.setXYZ($,H0.x,H0.y,H0.z);return this}transformDirection(J){for(let $=0,Q=this.count;$<Q;$++)H0.fromBufferAttribute(this,$),H0.transformDirection(J),this.setXYZ($,H0.x,H0.y,H0.z);return this}set(J,$=0){return this.array.set(J,$),this}getComponent(J,$){let Q=this.array[J*this.itemSize+$];if(this.normalized)Q=u0(Q,this.array);return Q}setComponent(J,$,Q){if(this.normalized)Q=iJ(Q,this.array);return this.array[J*this.itemSize+$]=Q,this}getX(J){let $=this.array[J*this.itemSize];if(this.normalized)$=u0($,this.array);return $}setX(J,$){if(this.normalized)$=iJ($,this.array);return this.array[J*this.itemSize]=$,this}getY(J){let $=this.array[J*this.itemSize+1];if(this.normalized)$=u0($,this.array);return $}setY(J,$){if(this.normalized)$=iJ($,this.array);return this.array[J*this.itemSize+1]=$,this}getZ(J){let $=this.array[J*this.itemSize+2];if(this.normalized)$=u0($,this.array);return $}setZ(J,$){if(this.normalized)$=iJ($,this.array);return this.array[J*this.itemSize+2]=$,this}getW(J){let $=this.array[J*this.itemSize+3];if(this.normalized)$=u0($,this.array);return $}setW(J,$){if(this.normalized)$=iJ($,this.array);return this.array[J*this.itemSize+3]=$,this}setXY(J,$,Q){if(J*=this.itemSize,this.normalized)$=iJ($,this.array),Q=iJ(Q,this.array);return this.array[J+0]=$,this.array[J+1]=Q,this}setXYZ(J,$,Q,Z){if(J*=this.itemSize,this.normalized)$=iJ($,this.array),Q=iJ(Q,this.array),Z=iJ(Z,this.array);return this.array[J+0]=$,this.array[J+1]=Q,this.array[J+2]=Z,this}setXYZW(J,$,Q,Z,W){if(J*=this.itemSize,this.normalized)$=iJ($,this.array),Q=iJ(Q,this.array),Z=iJ(Z,this.array),W=iJ(W,this.array);return this.array[J+0]=$,this.array[J+1]=Q,this.array[J+2]=Z,this.array[J+3]=W,this}onUpload(J){return this.onUploadCallback=J,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let J={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};if(this.name!=="")J.name=this.name;if(this.usage!==35044)J.usage=this.usage;return J}}class L9 extends V0{constructor(J,$,Q){super(new Uint16Array(J),$,Q)}}class D9 extends V0{constructor(J,$,Q){super(new Uint32Array(J),$,Q)}}class n0 extends V0{constructor(J,$,Q){super(new Float32Array(J),$,Q)}}var wZ=0,y0=new _J,t8=new Z0,W7=new A,T0=new S0,k7=new S0,F0=new A;class h0 extends C6{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wZ++}),this.uuid=c0(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(J){if(Array.isArray(J))this.index=new((j5(J))?D9:L9)(J,1);else this.index=J;return this}setIndirect(J){return this.indirect=J,this}getIndirect(){return this.indirect}getAttribute(J){return this.attributes[J]}setAttribute(J,$){return this.attributes[J]=$,this}deleteAttribute(J){return delete this.attributes[J],this}hasAttribute(J){return this.attributes[J]!==void 0}addGroup(J,$,Q=0){this.groups.push({start:J,count:$,materialIndex:Q})}clearGroups(){this.groups=[]}setDrawRange(J,$){this.drawRange.start=J,this.drawRange.count=$}applyMatrix4(J){let $=this.attributes.position;if($!==void 0)$.applyMatrix4(J),$.needsUpdate=!0;let Q=this.attributes.normal;if(Q!==void 0){let W=new yJ().getNormalMatrix(J);Q.applyNormalMatrix(W),Q.needsUpdate=!0}let Z=this.attributes.tangent;if(Z!==void 0)Z.transformDirection(J),Z.needsUpdate=!0;if(this.boundingBox!==null)this.computeBoundingBox();if(this.boundingSphere!==null)this.computeBoundingSphere();return this}applyQuaternion(J){return y0.makeRotationFromQuaternion(J),this.applyMatrix4(y0),this}rotateX(J){return y0.makeRotationX(J),this.applyMatrix4(y0),this}rotateY(J){return y0.makeRotationY(J),this.applyMatrix4(y0),this}rotateZ(J){return y0.makeRotationZ(J),this.applyMatrix4(y0),this}translate(J,$,Q){return y0.makeTranslation(J,$,Q),this.applyMatrix4(y0),this}scale(J,$,Q){return y0.makeScale(J,$,Q),this.applyMatrix4(y0),this}lookAt(J){return t8.lookAt(J),t8.updateMatrix(),this.applyMatrix4(t8.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(W7).negate(),this.translate(W7.x,W7.y,W7.z),this}setFromPoints(J){let $=this.getAttribute("position");if($===void 0){let Q=[];for(let Z=0,W=J.length;Z<W;Z++){let Y=J[Z];Q.push(Y.x,Y.y,Y.z||0)}this.setAttribute("position",new n0(Q,3))}else{for(let Q=0,Z=$.count;Q<Z;Q++){let W=J[Q];$.setXYZ(Q,W.x,W.y,W.z||0)}if(J.length>$.count)console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.");$.needsUpdate=!0}return this}computeBoundingBox(){if(this.boundingBox===null)this.boundingBox=new S0;let J=this.attributes.position,$=this.morphAttributes.position;if(J&&J.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(J!==void 0){if(this.boundingBox.setFromBufferAttribute(J),$)for(let Q=0,Z=$.length;Q<Z;Q++){let W=$[Q];if(T0.setFromBufferAttribute(W),this.morphTargetsRelative)F0.addVectors(this.boundingBox.min,T0.min),this.boundingBox.expandByPoint(F0),F0.addVectors(this.boundingBox.max,T0.max),this.boundingBox.expandByPoint(F0);else this.boundingBox.expandByPoint(T0.min),this.boundingBox.expandByPoint(T0.max)}}else this.boundingBox.makeEmpty();if(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){if(this.boundingSphere===null)this.boundingSphere=new C0;let J=this.attributes.position,$=this.morphAttributes.position;if(J&&J.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(J){let Q=this.boundingSphere.center;if(T0.setFromBufferAttribute(J),$)for(let W=0,Y=$.length;W<Y;W++){let X=$[W];if(k7.setFromBufferAttribute(X),this.morphTargetsRelative)F0.addVectors(T0.min,k7.min),T0.expandByPoint(F0),F0.addVectors(T0.max,k7.max),T0.expandByPoint(F0);else T0.expandByPoint(k7.min),T0.expandByPoint(k7.max)}T0.getCenter(Q);let Z=0;for(let W=0,Y=J.count;W<Y;W++)F0.fromBufferAttribute(J,W),Z=Math.max(Z,Q.distanceToSquared(F0));if($)for(let W=0,Y=$.length;W<Y;W++){let X=$[W],H=this.morphTargetsRelative;for(let K=0,q=X.count;K<q;K++){if(F0.fromBufferAttribute(X,K),H)W7.fromBufferAttribute(J,K),F0.add(W7);Z=Math.max(Z,Q.distanceToSquared(F0))}}if(this.boundingSphere.radius=Math.sqrt(Z),isNaN(this.boundingSphere.radius))console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let J=this.index,$=this.attributes;if(J===null||$.position===void 0||$.normal===void 0||$.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let{position:Q,normal:Z,uv:W}=$;if(this.hasAttribute("tangent")===!1)this.setAttribute("tangent",new V0(new Float32Array(4*Q.count),4));let Y=this.getAttribute("tangent"),X=[],H=[];for(let P=0;P<Q.count;P++)X[P]=new A,H[P]=new A;let K=new A,q=new A,G=new A,U=new LJ,F=new LJ,O=new LJ,z=new A,R=new A;function V(P,p,k){K.fromBufferAttribute(Q,P),q.fromBufferAttribute(Q,p),G.fromBufferAttribute(Q,k),U.fromBufferAttribute(W,P),F.fromBufferAttribute(W,p),O.fromBufferAttribute(W,k),q.sub(K),G.sub(K),F.sub(U),O.sub(U);let L=1/(F.x*O.y-O.x*F.y);if(!isFinite(L))return;z.copy(q).multiplyScalar(O.y).addScaledVector(G,-F.y).multiplyScalar(L),R.copy(G).multiplyScalar(F.x).addScaledVector(q,-O.x).multiplyScalar(L),X[P].add(z),X[p].add(z),X[k].add(z),H[P].add(R),H[p].add(R),H[k].add(R)}let E=this.groups;if(E.length===0)E=[{start:0,count:J.count}];for(let P=0,p=E.length;P<p;++P){let k=E[P],L=k.start,y=k.count;for(let b=L,d=L+y;b<d;b+=3)V(J.getX(b+0),J.getX(b+1),J.getX(b+2))}let D=new A,M=new A,_=new A,x=new A;function C(P){_.fromBufferAttribute(Z,P),x.copy(_);let p=X[P];D.copy(p),D.sub(_.multiplyScalar(_.dot(p))).normalize(),M.crossVectors(x,p);let L=M.dot(H[P])<0?-1:1;Y.setXYZW(P,D.x,D.y,D.z,L)}for(let P=0,p=E.length;P<p;++P){let k=E[P],L=k.start,y=k.count;for(let b=L,d=L+y;b<d;b+=3)C(J.getX(b+0)),C(J.getX(b+1)),C(J.getX(b+2))}}computeVertexNormals(){let J=this.index,$=this.getAttribute("position");if($!==void 0){let Q=this.getAttribute("normal");if(Q===void 0)Q=new V0(new Float32Array($.count*3),3),this.setAttribute("normal",Q);else for(let U=0,F=Q.count;U<F;U++)Q.setXYZ(U,0,0,0);let Z=new A,W=new A,Y=new A,X=new A,H=new A,K=new A,q=new A,G=new A;if(J)for(let U=0,F=J.count;U<F;U+=3){let O=J.getX(U+0),z=J.getX(U+1),R=J.getX(U+2);Z.fromBufferAttribute($,O),W.fromBufferAttribute($,z),Y.fromBufferAttribute($,R),q.subVectors(Y,W),G.subVectors(Z,W),q.cross(G),X.fromBufferAttribute(Q,O),H.fromBufferAttribute(Q,z),K.fromBufferAttribute(Q,R),X.add(q),H.add(q),K.add(q),Q.setXYZ(O,X.x,X.y,X.z),Q.setXYZ(z,H.x,H.y,H.z),Q.setXYZ(R,K.x,K.y,K.z)}else for(let U=0,F=$.count;U<F;U+=3)Z.fromBufferAttribute($,U+0),W.fromBufferAttribute($,U+1),Y.fromBufferAttribute($,U+2),q.subVectors(Y,W),G.subVectors(Z,W),q.cross(G),Q.setXYZ(U+0,q.x,q.y,q.z),Q.setXYZ(U+1,q.x,q.y,q.z),Q.setXYZ(U+2,q.x,q.y,q.z);this.normalizeNormals(),Q.needsUpdate=!0}}normalizeNormals(){let J=this.attributes.normal;for(let $=0,Q=J.count;$<Q;$++)F0.fromBufferAttribute(J,$),F0.normalize(),J.setXYZ($,F0.x,F0.y,F0.z)}toNonIndexed(){function J(X,H){let{array:K,itemSize:q,normalized:G}=X,U=new K.constructor(H.length*q),F=0,O=0;for(let z=0,R=H.length;z<R;z++){if(X.isInterleavedBufferAttribute)F=H[z]*X.data.stride+X.offset;else F=H[z]*q;for(let V=0;V<q;V++)U[O++]=K[F++]}return new V0(U,q,G)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let $=new h0,Q=this.index.array,Z=this.attributes;for(let X in Z){let H=Z[X],K=J(H,Q);$.setAttribute(X,K)}let W=this.morphAttributes;for(let X in W){let H=[],K=W[X];for(let q=0,G=K.length;q<G;q++){let U=K[q],F=J(U,Q);H.push(F)}$.morphAttributes[X]=H}$.morphTargetsRelative=this.morphTargetsRelative;let Y=this.groups;for(let X=0,H=Y.length;X<H;X++){let K=Y[X];$.addGroup(K.start,K.count,K.materialIndex)}return $}toJSON(){let J={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(J.uuid=this.uuid,J.type=this.type,this.name!=="")J.name=this.name;if(Object.keys(this.userData).length>0)J.userData=this.userData;if(this.parameters!==void 0){let H=this.parameters;for(let K in H)if(H[K]!==void 0)J[K]=H[K];return J}J.data={attributes:{}};let $=this.index;if($!==null)J.data.index={type:$.array.constructor.name,array:Array.prototype.slice.call($.array)};let Q=this.attributes;for(let H in Q){let K=Q[H];J.data.attributes[H]=K.toJSON(J.data)}let Z={},W=!1;for(let H in this.morphAttributes){let K=this.morphAttributes[H],q=[];for(let G=0,U=K.length;G<U;G++){let F=K[G];q.push(F.toJSON(J.data))}if(q.length>0)Z[H]=q,W=!0}if(W)J.data.morphAttributes=Z,J.data.morphTargetsRelative=this.morphTargetsRelative;let Y=this.groups;if(Y.length>0)J.data.groups=JSON.parse(JSON.stringify(Y));let X=this.boundingSphere;if(X!==null)J.data.boundingSphere={center:X.center.toArray(),radius:X.radius};return J}clone(){return new this.constructor().copy(this)}copy(J){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let $={};this.name=J.name;let Q=J.index;if(Q!==null)this.setIndex(Q.clone($));let Z=J.attributes;for(let K in Z){let q=Z[K];this.setAttribute(K,q.clone($))}let W=J.morphAttributes;for(let K in W){let q=[],G=W[K];for(let U=0,F=G.length;U<F;U++)q.push(G[U].clone($));this.morphAttributes[K]=q}this.morphTargetsRelative=J.morphTargetsRelative;let Y=J.groups;for(let K=0,q=Y.length;K<q;K++){let G=Y[K];this.addGroup(G.start,G.count,G.materialIndex)}let X=J.boundingBox;if(X!==null)this.boundingBox=X.clone();let H=J.boundingSphere;if(H!==null)this.boundingSphere=H.clone();return this.drawRange.start=J.drawRange.start,this.drawRange.count=J.drawRange.count,this.userData=J.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}var P$=new _J,y6=new _6,a7=new C0,A$=new A,r7=new A,t7=new A,e7=new A,e8=new A,J8=new A,T$=new A,$8=new A;class D0 extends Z0{constructor(J=new h0,$=new G6){super();this.isMesh=!0,this.type="Mesh",this.geometry=J,this.material=$,this.updateMorphTargets()}copy(J,$){if(super.copy(J,$),J.morphTargetInfluences!==void 0)this.morphTargetInfluences=J.morphTargetInfluences.slice();if(J.morphTargetDictionary!==void 0)this.morphTargetDictionary=Object.assign({},J.morphTargetDictionary);return this.material=Array.isArray(J.material)?J.material.slice():J.material,this.geometry=J.geometry,this}updateMorphTargets(){let $=this.geometry.morphAttributes,Q=Object.keys($);if(Q.length>0){let Z=$[Q[0]];if(Z!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let W=0,Y=Z.length;W<Y;W++){let X=Z[W].name||String(W);this.morphTargetInfluences.push(0),this.morphTargetDictionary[X]=W}}}}getVertexPosition(J,$){let Q=this.geometry,Z=Q.attributes.position,W=Q.morphAttributes.position,Y=Q.morphTargetsRelative;$.fromBufferAttribute(Z,J);let X=this.morphTargetInfluences;if(W&&X){J8.set(0,0,0);for(let H=0,K=W.length;H<K;H++){let q=X[H],G=W[H];if(q===0)continue;if(e8.fromBufferAttribute(G,J),Y)J8.addScaledVector(e8,q);else J8.addScaledVector(e8.sub($),q)}$.add(J8)}return $}raycast(J,$){let Q=this.geometry,Z=this.material,W=this.matrixWorld;if(Z===void 0)return;if(Q.boundingSphere===null)Q.computeBoundingSphere();if(a7.copy(Q.boundingSphere),a7.applyMatrix4(W),y6.copy(J.ray).recast(J.near),a7.containsPoint(y6.origin)===!1){if(y6.intersectSphere(a7,A$)===null)return;if(y6.origin.distanceToSquared(A$)>(J.far-J.near)**2)return}if(P$.copy(W).invert(),y6.copy(J.ray).applyMatrix4(P$),Q.boundingBox!==null){if(y6.intersectsBox(Q.boundingBox)===!1)return}this._computeIntersections(J,$,y6)}_computeIntersections(J,$,Q){let Z,W=this.geometry,Y=this.material,X=W.index,H=W.attributes.position,K=W.attributes.uv,q=W.attributes.uv1,G=W.attributes.normal,U=W.groups,F=W.drawRange;if(X!==null)if(Array.isArray(Y))for(let O=0,z=U.length;O<z;O++){let R=U[O],V=Y[R.materialIndex],E=Math.max(R.start,F.start),D=Math.min(X.count,Math.min(R.start+R.count,F.start+F.count));for(let M=E,_=D;M<_;M+=3){let x=X.getX(M),C=X.getX(M+1),P=X.getX(M+2);if(Z=Q8(this,V,J,Q,K,q,G,x,C,P),Z)Z.faceIndex=Math.floor(M/3),Z.face.materialIndex=R.materialIndex,$.push(Z)}}else{let O=Math.max(0,F.start),z=Math.min(X.count,F.start+F.count);for(let R=O,V=z;R<V;R+=3){let E=X.getX(R),D=X.getX(R+1),M=X.getX(R+2);if(Z=Q8(this,Y,J,Q,K,q,G,E,D,M),Z)Z.faceIndex=Math.floor(R/3),$.push(Z)}}else if(H!==void 0)if(Array.isArray(Y))for(let O=0,z=U.length;O<z;O++){let R=U[O],V=Y[R.materialIndex],E=Math.max(R.start,F.start),D=Math.min(H.count,Math.min(R.start+R.count,F.start+F.count));for(let M=E,_=D;M<_;M+=3){let x=M,C=M+1,P=M+2;if(Z=Q8(this,V,J,Q,K,q,G,x,C,P),Z)Z.faceIndex=Math.floor(M/3),Z.face.materialIndex=R.materialIndex,$.push(Z)}}else{let O=Math.max(0,F.start),z=Math.min(H.count,F.start+F.count);for(let R=O,V=z;R<V;R+=3){let E=R,D=R+1,M=R+2;if(Z=Q8(this,Y,J,Q,K,q,G,E,D,M),Z)Z.faceIndex=Math.floor(R/3),$.push(Z)}}}}function CZ(J,$,Q,Z,W,Y,X,H){let K;if($.side===1)K=Z.intersectTriangle(X,Y,W,!0,H);else K=Z.intersectTriangle(W,Y,X,$.side===0,H);if(K===null)return null;$8.copy(H),$8.applyMatrix4(J.matrixWorld);let q=Q.ray.origin.distanceTo($8);if(q<Q.near||q>Q.far)return null;return{distance:q,point:$8.clone(),object:J}}function Q8(J,$,Q,Z,W,Y,X,H,K,q){J.getVertexPosition(H,r7),J.getVertexPosition(K,t7),J.getVertexPosition(q,e7);let G=CZ(J,$,Q,Z,r7,t7,e7,T$);if(G){let U=new A;if(m0.getBarycoord(T$,r7,t7,e7,U),W)G.uv=m0.getInterpolatedAttribute(W,H,K,q,U,new LJ);if(Y)G.uv1=m0.getInterpolatedAttribute(Y,H,K,q,U,new LJ);if(X){if(G.normal=m0.getInterpolatedAttribute(X,H,K,q,U,new A),G.normal.dot(Z.direction)>0)G.normal.multiplyScalar(-1)}let F={a:H,b:K,c:q,normal:new A,materialIndex:0};m0.getNormal(r7,t7,e7,F.normal),G.face=F,G.barycoord=U}return G}class y7 extends h0{constructor(J=1,$=1,Q=1,Z=1,W=1,Y=1){super();this.type="BoxGeometry",this.parameters={width:J,height:$,depth:Q,widthSegments:Z,heightSegments:W,depthSegments:Y};let X=this;Z=Math.floor(Z),W=Math.floor(W),Y=Math.floor(Y);let H=[],K=[],q=[],G=[],U=0,F=0;O("z","y","x",-1,-1,Q,$,J,Y,W,0),O("z","y","x",1,-1,Q,$,-J,Y,W,1),O("x","z","y",1,1,J,Q,$,Z,Y,2),O("x","z","y",1,-1,J,Q,-$,Z,Y,3),O("x","y","z",1,-1,J,$,Q,Z,W,4),O("x","y","z",-1,-1,J,$,-Q,Z,W,5),this.setIndex(H),this.setAttribute("position",new n0(K,3)),this.setAttribute("normal",new n0(q,3)),this.setAttribute("uv",new n0(G,2));function O(z,R,V,E,D,M,_,x,C,P,p){let k=M/C,L=_/P,y=M/2,b=_/2,d=x/2,m=C+1,a=P+1,l=0,r=0,g=new A;for(let HJ=0;HJ<a;HJ++){let qJ=HJ*L-b;for(let PJ=0;PJ<m;PJ++){let gJ=PJ*k-y;g[z]=gJ*E,g[R]=qJ*D,g[V]=d,K.push(g.x,g.y,g.z),g[z]=0,g[R]=0,g[V]=x>0?1:-1,q.push(g.x,g.y,g.z),G.push(PJ/C),G.push(1-HJ/P),l+=1}}for(let HJ=0;HJ<P;HJ++)for(let qJ=0;qJ<C;qJ++){let PJ=U+qJ+m*HJ,gJ=U+qJ+m*(HJ+1),n=U+(qJ+1)+m*(HJ+1),e=U+(qJ+1)+m*HJ;H.push(PJ,gJ,e),H.push(gJ,n,e),r+=6}X.addGroup(F,r,p),F+=r,U+=l}}copy(J){return super.copy(J),this.parameters=Object.assign({},J.parameters),this}static fromJSON(J){return new y7(J.width,J.height,J.depth,J.widthSegments,J.heightSegments,J.depthSegments)}}function F7(J){let $={};for(let Q in J){$[Q]={};for(let Z in J[Q]){let W=J[Q][Z];if(W&&(W.isColor||W.isMatrix3||W.isMatrix4||W.isVector2||W.isVector3||W.isVector4||W.isTexture||W.isQuaternion))if(W.isRenderTargetTexture)console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),$[Q][Z]=null;else $[Q][Z]=W.clone();else if(Array.isArray(W))$[Q][Z]=W.slice();else $[Q][Z]=W}}return $}function L0(J){let $={};for(let Q=0;Q<J.length;Q++){let Z=F7(J[Q]);for(let W in Z)$[W]=Z[W]}return $}function _Z(J){let $=[];for(let Q=0;Q<J.length;Q++)$.push(J[Q].clone());return $}function x5(J){let $=J.getRenderTarget();if($===null)return J.outputColorSpace;if($.isXRRenderTarget===!0)return $.texture.colorSpace;return pJ.workingColorSpace}var PZ={clone:F7,merge:L0},AZ=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,TZ=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class q6 extends v0{static get type(){return"ShaderMaterial"}constructor(J){super();if(this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=AZ,this.fragmentShader=TZ,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,J!==void 0)this.setValues(J)}copy(J){return super.copy(J),this.fragmentShader=J.fragmentShader,this.vertexShader=J.vertexShader,this.uniforms=F7(J.uniforms),this.uniformsGroups=_Z(J.uniformsGroups),this.defines=Object.assign({},J.defines),this.wireframe=J.wireframe,this.wireframeLinewidth=J.wireframeLinewidth,this.fog=J.fog,this.lights=J.lights,this.clipping=J.clipping,this.extensions=Object.assign({},J.extensions),this.glslVersion=J.glslVersion,this}toJSON(J){let $=super.toJSON(J);$.glslVersion=this.glslVersion,$.uniforms={};for(let Z in this.uniforms){let Y=this.uniforms[Z].value;if(Y&&Y.isTexture)$.uniforms[Z]={type:"t",value:Y.toJSON(J).uuid};else if(Y&&Y.isColor)$.uniforms[Z]={type:"c",value:Y.getHex()};else if(Y&&Y.isVector2)$.uniforms[Z]={type:"v2",value:Y.toArray()};else if(Y&&Y.isVector3)$.uniforms[Z]={type:"v3",value:Y.toArray()};else if(Y&&Y.isVector4)$.uniforms[Z]={type:"v4",value:Y.toArray()};else if(Y&&Y.isMatrix3)$.uniforms[Z]={type:"m3",value:Y.toArray()};else if(Y&&Y.isMatrix4)$.uniforms[Z]={type:"m4",value:Y.toArray()};else $.uniforms[Z]={value:Y}}if(Object.keys(this.defines).length>0)$.defines=this.defines;$.vertexShader=this.vertexShader,$.fragmentShader=this.fragmentShader,$.lights=this.lights,$.clipping=this.clipping;let Q={};for(let Z in this.extensions)if(this.extensions[Z]===!0)Q[Z]=!0;if(Object.keys(Q).length>0)$.extensions=Q;return $}}class w9 extends Z0{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _J,this.projectionMatrix=new _J,this.projectionMatrixInverse=new _J,this.coordinateSystem=2000}copy(J,$){return super.copy(J,$),this.matrixWorldInverse.copy(J.matrixWorldInverse),this.projectionMatrix.copy(J.projectionMatrix),this.projectionMatrixInverse.copy(J.projectionMatrixInverse),this.coordinateSystem=J.coordinateSystem,this}getWorldDirection(J){return super.getWorldDirection(J).negate()}updateMatrixWorld(J){super.updateMatrixWorld(J),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(J,$){super.updateWorldMatrix(J,$),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}var B6=new A,I$=new LJ,S$=new LJ;class M0 extends w9{constructor(J=50,$=1,Q=0.1,Z=2000){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=J,this.zoom=1,this.near=Q,this.far=Z,this.focus=10,this.aspect=$,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(J,$){return super.copy(J,$),this.fov=J.fov,this.zoom=J.zoom,this.near=J.near,this.far=J.far,this.focus=J.focus,this.aspect=J.aspect,this.view=J.view===null?null:Object.assign({},J.view),this.filmGauge=J.filmGauge,this.filmOffset=J.filmOffset,this}setFocalLength(J){let $=0.5*this.getFilmHeight()/J;this.fov=U7*2*Math.atan($),this.updateProjectionMatrix()}getFocalLength(){let J=Math.tan(A7*0.5*this.fov);return 0.5*this.getFilmHeight()/J}getEffectiveFOV(){return U7*2*Math.atan(Math.tan(A7*0.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(J,$,Q){B6.set(-1,-1,0.5).applyMatrix4(this.projectionMatrixInverse),$.set(B6.x,B6.y).multiplyScalar(-J/B6.z),B6.set(1,1,0.5).applyMatrix4(this.projectionMatrixInverse),Q.set(B6.x,B6.y).multiplyScalar(-J/B6.z)}getViewSize(J,$){return this.getViewBounds(J,I$,S$),$.subVectors(S$,I$)}setViewOffset(J,$,Q,Z,W,Y){if(this.aspect=J/$,this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=J,this.view.fullHeight=$,this.view.offsetX=Q,this.view.offsetY=Z,this.view.width=W,this.view.height=Y,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let J=this.near,$=J*Math.tan(A7*0.5*this.fov)/this.zoom,Q=2*$,Z=this.aspect*Q,W=-0.5*Z,Y=this.view;if(this.view!==null&&this.view.enabled){let{fullWidth:H,fullHeight:K}=Y;W+=Y.offsetX*Z/H,$-=Y.offsetY*Q/K,Z*=Y.width/H,Q*=Y.height/K}let X=this.filmOffset;if(X!==0)W+=J*X/this.getFilmWidth();this.projectionMatrix.makePerspective(W,W+Z,$,$-Q,J,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(J){let $=super.toJSON(J);if($.object.fov=this.fov,$.object.zoom=this.zoom,$.object.near=this.near,$.object.far=this.far,$.object.focus=this.focus,$.object.aspect=this.aspect,this.view!==null)$.object.view=Object.assign({},this.view);return $.object.filmGauge=this.filmGauge,$.object.filmOffset=this.filmOffset,$}}var Y7=-90,X7=1;class b5 extends Z0{constructor(J,$,Q){super();this.type="CubeCamera",this.renderTarget=Q,this.coordinateSystem=null,this.activeMipmapLevel=0;let Z=new M0(Y7,X7,J,$);Z.layers=this.layers,this.add(Z);let W=new M0(Y7,X7,J,$);W.layers=this.layers,this.add(W);let Y=new M0(Y7,X7,J,$);Y.layers=this.layers,this.add(Y);let X=new M0(Y7,X7,J,$);X.layers=this.layers,this.add(X);let H=new M0(Y7,X7,J,$);H.layers=this.layers,this.add(H);let K=new M0(Y7,X7,J,$);K.layers=this.layers,this.add(K)}updateCoordinateSystem(){let J=this.coordinateSystem,$=this.children.concat(),[Q,Z,W,Y,X,H]=$;for(let K of $)this.remove(K);if(J===2000)Q.up.set(0,1,0),Q.lookAt(1,0,0),Z.up.set(0,1,0),Z.lookAt(-1,0,0),W.up.set(0,0,-1),W.lookAt(0,1,0),Y.up.set(0,0,1),Y.lookAt(0,-1,0),X.up.set(0,1,0),X.lookAt(0,0,1),H.up.set(0,1,0),H.lookAt(0,0,-1);else if(J===2001)Q.up.set(0,-1,0),Q.lookAt(-1,0,0),Z.up.set(0,-1,0),Z.lookAt(1,0,0),W.up.set(0,0,1),W.lookAt(0,1,0),Y.up.set(0,0,-1),Y.lookAt(0,-1,0),X.up.set(0,-1,0),X.lookAt(0,0,1),H.up.set(0,-1,0),H.lookAt(0,0,-1);else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+J);for(let K of $)this.add(K),K.updateMatrixWorld()}update(J,$){if(this.parent===null)this.updateMatrixWorld();let{renderTarget:Q,activeMipmapLevel:Z}=this;if(this.coordinateSystem!==J.coordinateSystem)this.coordinateSystem=J.coordinateSystem,this.updateCoordinateSystem();let[W,Y,X,H,K,q]=this.children,G=J.getRenderTarget(),U=J.getActiveCubeFace(),F=J.getActiveMipmapLevel(),O=J.xr.enabled;J.xr.enabled=!1;let z=Q.texture.generateMipmaps;Q.texture.generateMipmaps=!1,J.setRenderTarget(Q,0,Z),J.render($,W),J.setRenderTarget(Q,1,Z),J.render($,Y),J.setRenderTarget(Q,2,Z),J.render($,X),J.setRenderTarget(Q,3,Z),J.render($,H),J.setRenderTarget(Q,4,Z),J.render($,K),Q.texture.generateMipmaps=z,J.setRenderTarget(Q,5,Z),J.render($,q),J.setRenderTarget(G,U,F),J.xr.enabled=O,Q.texture.needsPMREMUpdate=!0}}class C9 extends K0{constructor(J,$,Q,Z,W,Y,X,H,K,q){J=J!==void 0?J:[],$=$!==void 0?$:301;super(J,$,Q,Z,W,Y,X,H,K,q);this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(J){this.image=J}}class g5 extends k6{constructor(J=1,$={}){super(J,J,$);this.isWebGLCubeRenderTarget=!0;let Q={width:J,height:J,depth:1},Z=[Q,Q,Q,Q,Q,Q];this.texture=new C9(Z,$.mapping,$.wrapS,$.wrapT,$.magFilter,$.minFilter,$.format,$.type,$.anisotropy,$.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=$.generateMipmaps!==void 0?$.generateMipmaps:!1,this.texture.minFilter=$.minFilter!==void 0?$.minFilter:1006}fromEquirectangularTexture(J,$){this.texture.type=$.type,this.texture.colorSpace=$.colorSpace,this.texture.generateMipmaps=$.generateMipmaps,this.texture.minFilter=$.minFilter,this.texture.magFilter=$.magFilter;let Q={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},Z=new y7(5,5,5),W=new q6({name:"CubemapFromEquirect",uniforms:F7(Q.uniforms),vertexShader:Q.vertexShader,fragmentShader:Q.fragmentShader,side:1,blending:0});W.uniforms.tEquirect.value=$;let Y=new D0(Z,W),X=$.minFilter;if($.minFilter===1008)$.minFilter=1006;return new b5(1,10,this).update(J,Y),$.minFilter=X,Y.geometry.dispose(),Y.material.dispose(),this}clear(J,$,Q,Z){let W=J.getRenderTarget();for(let Y=0;Y<6;Y++)J.setRenderTarget(this,Y),J.clear($,Q,Z);J.setRenderTarget(W)}}var J9=new A,IZ=new A,SZ=new yJ;class a0{constructor(J=new A(1,0,0),$=0){this.isPlane=!0,this.normal=J,this.constant=$}set(J,$){return this.normal.copy(J),this.constant=$,this}setComponents(J,$,Q,Z){return this.normal.set(J,$,Q),this.constant=Z,this}setFromNormalAndCoplanarPoint(J,$){return this.normal.copy(J),this.constant=-$.dot(this.normal),this}setFromCoplanarPoints(J,$,Q){let Z=J9.subVectors(Q,$).cross(IZ.subVectors(J,$)).normalize();return this.setFromNormalAndCoplanarPoint(Z,J),this}copy(J){return this.normal.copy(J.normal),this.constant=J.constant,this}normalize(){let J=1/this.normal.length();return this.normal.multiplyScalar(J),this.constant*=J,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(J){return this.normal.dot(J)+this.constant}distanceToSphere(J){return this.distanceToPoint(J.center)-J.radius}projectPoint(J,$){return $.copy(J).addScaledVector(this.normal,-this.distanceToPoint(J))}intersectLine(J,$){let Q=J.delta(J9),Z=this.normal.dot(Q);if(Z===0){if(this.distanceToPoint(J.start)===0)return $.copy(J.start);return null}let W=-(J.start.dot(this.normal)+this.constant)/Z;if(W<0||W>1)return null;return $.copy(J.start).addScaledVector(Q,W)}intersectsLine(J){let $=this.distanceToPoint(J.start),Q=this.distanceToPoint(J.end);return $<0&&Q>0||Q<0&&$>0}intersectsBox(J){return J.intersectsPlane(this)}intersectsSphere(J){return J.intersectsPlane(this)}coplanarPoint(J){return J.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(J,$){let Q=$||SZ.getNormalMatrix(J),Z=this.coplanarPoint(J9).applyMatrix4(J),W=this.normal.applyMatrix3(Q).normalize();return this.constant=-Z.dot(W),this}translate(J){return this.constant-=J.dot(this.normal),this}equals(J){return J.normal.equals(this.normal)&&J.constant===this.constant}clone(){return new this.constructor().copy(this)}}var v6=new C0,Z8=new A;class L8{constructor(J=new a0,$=new a0,Q=new a0,Z=new a0,W=new a0,Y=new a0){this.planes=[J,$,Q,Z,W,Y]}set(J,$,Q,Z,W,Y){let X=this.planes;return X[0].copy(J),X[1].copy($),X[2].copy(Q),X[3].copy(Z),X[4].copy(W),X[5].copy(Y),this}copy(J){let $=this.planes;for(let Q=0;Q<6;Q++)$[Q].copy(J.planes[Q]);return this}setFromProjectionMatrix(J,$=2000){let Q=this.planes,Z=J.elements,W=Z[0],Y=Z[1],X=Z[2],H=Z[3],K=Z[4],q=Z[5],G=Z[6],U=Z[7],F=Z[8],O=Z[9],z=Z[10],R=Z[11],V=Z[12],E=Z[13],D=Z[14],M=Z[15];if(Q[0].setComponents(H-W,U-K,R-F,M-V).normalize(),Q[1].setComponents(H+W,U+K,R+F,M+V).normalize(),Q[2].setComponents(H+Y,U+q,R+O,M+E).normalize(),Q[3].setComponents(H-Y,U-q,R-O,M-E).normalize(),Q[4].setComponents(H-X,U-G,R-z,M-D).normalize(),$===2000)Q[5].setComponents(H+X,U+G,R+z,M+D).normalize();else if($===2001)Q[5].setComponents(X,G,z,D).normalize();else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+$);return this}intersectsObject(J){if(J.boundingSphere!==void 0){if(J.boundingSphere===null)J.computeBoundingSphere();v6.copy(J.boundingSphere).applyMatrix4(J.matrixWorld)}else{let $=J.geometry;if($.boundingSphere===null)$.computeBoundingSphere();v6.copy($.boundingSphere).applyMatrix4(J.matrixWorld)}return this.intersectsSphere(v6)}intersectsSprite(J){return v6.center.set(0,0,0),v6.radius=0.7071067811865476,v6.applyMatrix4(J.matrixWorld),this.intersectsSphere(v6)}intersectsSphere(J){let $=this.planes,Q=J.center,Z=-J.radius;for(let W=0;W<6;W++)if($[W].distanceToPoint(Q)<Z)return!1;return!0}intersectsBox(J){let $=this.planes;for(let Q=0;Q<6;Q++){let Z=$[Q];if(Z8.x=Z.normal.x>0?J.max.x:J.min.x,Z8.y=Z.normal.y>0?J.max.y:J.min.y,Z8.z=Z.normal.z>0?J.max.z:J.min.z,Z.distanceToPoint(Z8)<0)return!1}return!0}containsPoint(J){let $=this.planes;for(let Q=0;Q<6;Q++)if($[Q].distanceToPoint(J)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function p5(){let J=null,$=!1,Q=null,Z=null;function W(Y,X){Q(Y,X),Z=J.requestAnimationFrame(W)}return{start:function(){if($===!0)return;if(Q===null)return;Z=J.requestAnimationFrame(W),$=!0},stop:function(){J.cancelAnimationFrame(Z),$=!1},setAnimationLoop:function(Y){Q=Y},setContext:function(Y){J=Y}}}function jZ(J){let $=new WeakMap;function Q(H,K){let{array:q,usage:G}=H,U=q.byteLength,F=J.createBuffer();J.bindBuffer(K,F),J.bufferData(K,q,G),H.onUploadCallback();let O;if(q instanceof Float32Array)O=J.FLOAT;else if(q instanceof Uint16Array)if(H.isFloat16BufferAttribute)O=J.HALF_FLOAT;else O=J.UNSIGNED_SHORT;else if(q instanceof Int16Array)O=J.SHORT;else if(q instanceof Uint32Array)O=J.UNSIGNED_INT;else if(q instanceof Int32Array)O=J.INT;else if(q instanceof Int8Array)O=J.BYTE;else if(q instanceof Uint8Array)O=J.UNSIGNED_BYTE;else if(q instanceof Uint8ClampedArray)O=J.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+q);return{buffer:F,type:O,bytesPerElement:q.BYTES_PER_ELEMENT,version:H.version,size:U}}function Z(H,K,q){let{array:G,updateRanges:U}=K;if(J.bindBuffer(q,H),U.length===0)J.bufferSubData(q,0,G);else{U.sort((O,z)=>O.start-z.start);let F=0;for(let O=1;O<U.length;O++){let z=U[F],R=U[O];if(R.start<=z.start+z.count+1)z.count=Math.max(z.count,R.start+R.count-z.start);else++F,U[F]=R}U.length=F+1;for(let O=0,z=U.length;O<z;O++){let R=U[O];J.bufferSubData(q,R.start*G.BYTES_PER_ELEMENT,G,R.start,R.count)}K.clearUpdateRanges()}K.onUploadCallback()}function W(H){if(H.isInterleavedBufferAttribute)H=H.data;return $.get(H)}function Y(H){if(H.isInterleavedBufferAttribute)H=H.data;let K=$.get(H);if(K)J.deleteBuffer(K.buffer),$.delete(H)}function X(H,K){if(H.isInterleavedBufferAttribute)H=H.data;if(H.isGLBufferAttribute){let G=$.get(H);if(!G||G.version<H.version)$.set(H,{buffer:H.buffer,type:H.type,bytesPerElement:H.elementSize,version:H.version});return}let q=$.get(H);if(q===void 0)$.set(H,Q(H,K));else if(q.version<H.version){if(q.size!==H.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");Z(q.buffer,H,K),q.version=H.version}}return{get:W,remove:Y,update:X}}class D8 extends h0{constructor(J=1,$=1,Q=1,Z=1){super();this.type="PlaneGeometry",this.parameters={width:J,height:$,widthSegments:Q,heightSegments:Z};let W=J/2,Y=$/2,X=Math.floor(Q),H=Math.floor(Z),K=X+1,q=H+1,G=J/X,U=$/H,F=[],O=[],z=[],R=[];for(let V=0;V<q;V++){let E=V*U-Y;for(let D=0;D<K;D++){let M=D*G-W;O.push(M,-E,0),z.push(0,0,1),R.push(D/X),R.push(1-V/H)}}for(let V=0;V<H;V++)for(let E=0;E<X;E++){let D=E+K*V,M=E+K*(V+1),_=E+1+K*(V+1),x=E+1+K*V;F.push(D,M,x),F.push(M,_,x)}this.setIndex(F),this.setAttribute("position",new n0(O,3)),this.setAttribute("normal",new n0(z,3)),this.setAttribute("uv",new n0(R,2))}copy(J){return super.copy(J),this.parameters=Object.assign({},J.parameters),this}static fromJSON(J){return new D8(J.width,J.height,J.widthSegments,J.heightSegments)}}var yZ=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vZ=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hZ=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fZ=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xZ=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bZ=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gZ=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,pZ=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lZ=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,uZ=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mZ=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dZ=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cZ=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nZ=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sZ=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,oZ=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,iZ=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,aZ=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,rZ=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tZ=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,eZ=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,JW=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$W=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,QW=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ZW=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,WW=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,YW=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,XW=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,HW=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,KW=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qW="gl_FragColor = linearToOutputTexel( gl_FragColor );",GW=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,UW=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,FW=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,VW=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,EW=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,OW=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,RW=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,NW=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zW=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,BW=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,MW=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,kW=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,LW=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,DW=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wW=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,CW=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_W=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,PW=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,AW=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,TW=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,IW=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,SW=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,jW=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,yW=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vW=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hW=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fW=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xW=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bW=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gW=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pW=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lW=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,uW=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mW=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dW=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cW=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nW=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sW=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,oW=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,iW=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,aW=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,rW=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,tW=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eW=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JY=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$Y=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,QY=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ZY=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,WY=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,YY=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,XY=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,HY=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,KY=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qY=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,GY=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,UY=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,FY=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,VY=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,EY=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,OY=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,RY=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,NY=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,zY=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,BY=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,MY=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,kY=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,LY=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,DY=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wY=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,CY=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_Y=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,PY=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,AY=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,TY=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,IY=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,SY=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,jY=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yY=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vY=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hY=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fY=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xY=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bY=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gY=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,pY=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,lY=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,uY=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mY=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dY=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cY=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nY=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sY=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oY=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,iY=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aY=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,rY=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tY=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,eY=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,JX=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$X=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,QX=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ZX=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WX=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,YX=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XX=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,HX=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,KX=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qX=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,GX=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,UX=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,hJ={alphahash_fragment:yZ,alphahash_pars_fragment:vZ,alphamap_fragment:hZ,alphamap_pars_fragment:fZ,alphatest_fragment:xZ,alphatest_pars_fragment:bZ,aomap_fragment:gZ,aomap_pars_fragment:pZ,batching_pars_vertex:lZ,batching_vertex:uZ,begin_vertex:mZ,beginnormal_vertex:dZ,bsdfs:cZ,iridescence_fragment:nZ,bumpmap_pars_fragment:sZ,clipping_planes_fragment:oZ,clipping_planes_pars_fragment:iZ,clipping_planes_pars_vertex:aZ,clipping_planes_vertex:rZ,color_fragment:tZ,color_pars_fragment:eZ,color_pars_vertex:JW,color_vertex:$W,common:QW,cube_uv_reflection_fragment:ZW,defaultnormal_vertex:WW,displacementmap_pars_vertex:YW,displacementmap_vertex:XW,emissivemap_fragment:HW,emissivemap_pars_fragment:KW,colorspace_fragment:qW,colorspace_pars_fragment:GW,envmap_fragment:UW,envmap_common_pars_fragment:FW,envmap_pars_fragment:VW,envmap_pars_vertex:EW,envmap_physical_pars_fragment:CW,envmap_vertex:OW,fog_vertex:RW,fog_pars_vertex:NW,fog_fragment:zW,fog_pars_fragment:BW,gradientmap_pars_fragment:MW,lightmap_pars_fragment:kW,lights_lambert_fragment:LW,lights_lambert_pars_fragment:DW,lights_pars_begin:wW,lights_toon_fragment:_W,lights_toon_pars_fragment:PW,lights_phong_fragment:AW,lights_phong_pars_fragment:TW,lights_physical_fragment:IW,lights_physical_pars_fragment:SW,lights_fragment_begin:jW,lights_fragment_maps:yW,lights_fragment_end:vW,logdepthbuf_fragment:hW,logdepthbuf_pars_fragment:fW,logdepthbuf_pars_vertex:xW,logdepthbuf_vertex:bW,map_fragment:gW,map_pars_fragment:pW,map_particle_fragment:lW,map_particle_pars_fragment:uW,metalnessmap_fragment:mW,metalnessmap_pars_fragment:dW,morphinstance_vertex:cW,morphcolor_vertex:nW,morphnormal_vertex:sW,morphtarget_pars_vertex:oW,morphtarget_vertex:iW,normal_fragment_begin:aW,normal_fragment_maps:rW,normal_pars_fragment:tW,normal_pars_vertex:eW,normal_vertex:JY,normalmap_pars_fragment:$Y,clearcoat_normal_fragment_begin:QY,clearcoat_normal_fragment_maps:ZY,clearcoat_pars_fragment:WY,iridescence_pars_fragment:YY,opaque_fragment:XY,packing:HY,premultiplied_alpha_fragment:KY,project_vertex:qY,dithering_fragment:GY,dithering_pars_fragment:UY,roughnessmap_fragment:FY,roughnessmap_pars_fragment:VY,shadowmap_pars_fragment:EY,shadowmap_pars_vertex:OY,shadowmap_vertex:RY,shadowmask_pars_fragment:NY,skinbase_vertex:zY,skinning_pars_vertex:BY,skinning_vertex:MY,skinnormal_vertex:kY,specularmap_fragment:LY,specularmap_pars_fragment:DY,tonemapping_fragment:wY,tonemapping_pars_fragment:CY,transmission_fragment:_Y,transmission_pars_fragment:PY,uv_pars_fragment:AY,uv_pars_vertex:TY,uv_vertex:IY,worldpos_vertex:SY,background_vert:jY,background_frag:yY,backgroundCube_vert:vY,backgroundCube_frag:hY,cube_vert:fY,cube_frag:xY,depth_vert:bY,depth_frag:gY,distanceRGBA_vert:pY,distanceRGBA_frag:lY,equirect_vert:uY,equirect_frag:mY,linedashed_vert:dY,linedashed_frag:cY,meshbasic_vert:nY,meshbasic_frag:sY,meshlambert_vert:oY,meshlambert_frag:iY,meshmatcap_vert:aY,meshmatcap_frag:rY,meshnormal_vert:tY,meshnormal_frag:eY,meshphong_vert:JX,meshphong_frag:$X,meshphysical_vert:QX,meshphysical_frag:ZX,meshtoon_vert:WX,meshtoon_frag:YX,points_vert:XX,points_frag:HX,shadow_vert:KX,shadow_frag:qX,sprite_vert:GX,sprite_frag:UX},QJ={common:{diffuse:{value:new DJ(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new yJ},alphaMap:{value:null},alphaMapTransform:{value:new yJ},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new yJ}},envmap:{envMap:{value:null},envMapRotation:{value:new yJ},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:0.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new yJ}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new yJ}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new yJ},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new yJ},normalScale:{value:new LJ(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new yJ},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new yJ}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new yJ}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new yJ}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:0.00025},fogNear:{value:1},fogFar:{value:2000},fogColor:{value:new DJ(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new DJ(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new yJ},alphaTest:{value:0},uvTransform:{value:new yJ}},sprite:{diffuse:{value:new DJ(16777215)},opacity:{value:1},center:{value:new LJ(0.5,0.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new yJ},alphaMap:{value:null},alphaMapTransform:{value:new yJ},alphaTest:{value:0}}},r0={basic:{uniforms:L0([QJ.common,QJ.specularmap,QJ.envmap,QJ.aomap,QJ.lightmap,QJ.fog]),vertexShader:hJ.meshbasic_vert,fragmentShader:hJ.meshbasic_frag},lambert:{uniforms:L0([QJ.common,QJ.specularmap,QJ.envmap,QJ.aomap,QJ.lightmap,QJ.emissivemap,QJ.bumpmap,QJ.normalmap,QJ.displacementmap,QJ.fog,QJ.lights,{emissive:{value:new DJ(0)}}]),vertexShader:hJ.meshlambert_vert,fragmentShader:hJ.meshlambert_frag},phong:{uniforms:L0([QJ.common,QJ.specularmap,QJ.envmap,QJ.aomap,QJ.lightmap,QJ.emissivemap,QJ.bumpmap,QJ.normalmap,QJ.displacementmap,QJ.fog,QJ.lights,{emissive:{value:new DJ(0)},specular:{value:new DJ(1118481)},shininess:{value:30}}]),vertexShader:hJ.meshphong_vert,fragmentShader:hJ.meshphong_frag},standard:{uniforms:L0([QJ.common,QJ.envmap,QJ.aomap,QJ.lightmap,QJ.emissivemap,QJ.bumpmap,QJ.normalmap,QJ.displacementmap,QJ.roughnessmap,QJ.metalnessmap,QJ.fog,QJ.lights,{emissive:{value:new DJ(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:hJ.meshphysical_vert,fragmentShader:hJ.meshphysical_frag},toon:{uniforms:L0([QJ.common,QJ.aomap,QJ.lightmap,QJ.emissivemap,QJ.bumpmap,QJ.normalmap,QJ.displacementmap,QJ.gradientmap,QJ.fog,QJ.lights,{emissive:{value:new DJ(0)}}]),vertexShader:hJ.meshtoon_vert,fragmentShader:hJ.meshtoon_frag},matcap:{uniforms:L0([QJ.common,QJ.bumpmap,QJ.normalmap,QJ.displacementmap,QJ.fog,{matcap:{value:null}}]),vertexShader:hJ.meshmatcap_vert,fragmentShader:hJ.meshmatcap_frag},points:{uniforms:L0([QJ.points,QJ.fog]),vertexShader:hJ.points_vert,fragmentShader:hJ.points_frag},dashed:{uniforms:L0([QJ.common,QJ.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:hJ.linedashed_vert,fragmentShader:hJ.linedashed_frag},depth:{uniforms:L0([QJ.common,QJ.displacementmap]),vertexShader:hJ.depth_vert,fragmentShader:hJ.depth_frag},normal:{uniforms:L0([QJ.common,QJ.bumpmap,QJ.normalmap,QJ.displacementmap,{opacity:{value:1}}]),vertexShader:hJ.meshnormal_vert,fragmentShader:hJ.meshnormal_frag},sprite:{uniforms:L0([QJ.sprite,QJ.fog]),vertexShader:hJ.sprite_vert,fragmentShader:hJ.sprite_frag},background:{uniforms:{uvTransform:{value:new yJ},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:hJ.background_vert,fragmentShader:hJ.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new yJ}},vertexShader:hJ.backgroundCube_vert,fragmentShader:hJ.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:hJ.cube_vert,fragmentShader:hJ.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:hJ.equirect_vert,fragmentShader:hJ.equirect_frag},distanceRGBA:{uniforms:L0([QJ.common,QJ.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1000}}]),vertexShader:hJ.distanceRGBA_vert,fragmentShader:hJ.distanceRGBA_frag},shadow:{uniforms:L0([QJ.lights,QJ.fog,{color:{value:new DJ(0)},opacity:{value:1}}]),vertexShader:hJ.shadow_vert,fragmentShader:hJ.shadow_frag}};r0.physical={uniforms:L0([r0.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new yJ},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new yJ},clearcoatNormalScale:{value:new LJ(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new yJ},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new yJ},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new yJ},sheen:{value:0},sheenColor:{value:new DJ(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new yJ},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new yJ},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new yJ},transmissionSamplerSize:{value:new LJ},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new yJ},attenuationDistance:{value:0},attenuationColor:{value:new DJ(0)},specularColor:{value:new DJ(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new yJ},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new yJ},anisotropyVector:{value:new LJ},anisotropyMap:{value:null},anisotropyMapTransform:{value:new yJ}}]),vertexShader:hJ.meshphysical_vert,fragmentShader:hJ.meshphysical_frag};var W8={r:0,b:0,g:0},h6=new t0,FX=new _J;function VX(J,$,Q,Z,W,Y,X){let H=new DJ(0),K=Y===!0?0:1,q,G,U=null,F=0,O=null;function z(D){let M=D.isScene===!0?D.background:null;if(M&&M.isTexture)M=(D.backgroundBlurriness>0?Q:$).get(M);return M}function R(D){let M=!1,_=z(D);if(_===null)E(H,K);else if(_&&_.isColor)E(_,1),M=!0;let x=J.xr.getEnvironmentBlendMode();if(x==="additive")Z.buffers.color.setClear(0,0,0,1,X);else if(x==="alpha-blend")Z.buffers.color.setClear(0,0,0,0,X);if(J.autoClear||M)Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),J.clear(J.autoClearColor,J.autoClearDepth,J.autoClearStencil)}function V(D,M){let _=z(M);if(_&&(_.isCubeTexture||_.mapping===306)){if(G===void 0)G=new D0(new y7(1,1,1),new q6({name:"BackgroundCubeMaterial",uniforms:F7(r0.backgroundCube.uniforms),vertexShader:r0.backgroundCube.vertexShader,fragmentShader:r0.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),G.geometry.deleteAttribute("normal"),G.geometry.deleteAttribute("uv"),G.onBeforeRender=function(x,C,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(G.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),W.update(G);if(h6.copy(M.backgroundRotation),h6.x*=-1,h6.y*=-1,h6.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1)h6.y*=-1,h6.z*=-1;if(G.material.uniforms.envMap.value=_,G.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,G.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,G.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,G.material.uniforms.backgroundRotation.value.setFromMatrix4(FX.makeRotationFromEuler(h6)),G.material.toneMapped=pJ.getTransfer(_.colorSpace)!=="srgb",U!==_||F!==_.version||O!==J.toneMapping)G.material.needsUpdate=!0,U=_,F=_.version,O=J.toneMapping;G.layers.enableAll(),D.unshift(G,G.geometry,G.material,0,0,null)}else if(_&&_.isTexture){if(q===void 0)q=new D0(new D8(2,2),new q6({name:"BackgroundMaterial",uniforms:F7(r0.background.uniforms),vertexShader:r0.background.vertexShader,fragmentShader:r0.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),q.geometry.deleteAttribute("normal"),Object.defineProperty(q.material,"map",{get:function(){return this.uniforms.t2D.value}}),W.update(q);if(q.material.uniforms.t2D.value=_,q.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,q.material.toneMapped=pJ.getTransfer(_.colorSpace)!=="srgb",_.matrixAutoUpdate===!0)_.updateMatrix();if(q.material.uniforms.uvTransform.value.copy(_.matrix),U!==_||F!==_.version||O!==J.toneMapping)q.material.needsUpdate=!0,U=_,F=_.version,O=J.toneMapping;q.layers.enableAll(),D.unshift(q,q.geometry,q.material,0,0,null)}}function E(D,M){D.getRGB(W8,x5(J)),Z.buffers.color.setClear(W8.r,W8.g,W8.b,M,X)}return{getClearColor:function(){return H},setClearColor:function(D,M=1){H.set(D),K=M,E(H,K)},getClearAlpha:function(){return K},setClearAlpha:function(D){K=D,E(H,K)},render:R,addToRenderList:V}}function EX(J,$){let Q=J.getParameter(J.MAX_VERTEX_ATTRIBS),Z={},W=F(null),Y=W,X=!1;function H(L,y,b,d,m){let a=!1,l=U(d,b,y);if(Y!==l)Y=l,q(Y.object);if(a=O(L,d,b,m),a)z(L,d,b,m);if(m!==null)$.update(m,J.ELEMENT_ARRAY_BUFFER);if(a||X){if(X=!1,_(L,y,b,d),m!==null)J.bindBuffer(J.ELEMENT_ARRAY_BUFFER,$.get(m).buffer)}}function K(){return J.createVertexArray()}function q(L){return J.bindVertexArray(L)}function G(L){return J.deleteVertexArray(L)}function U(L,y,b){let d=b.wireframe===!0,m=Z[L.id];if(m===void 0)m={},Z[L.id]=m;let a=m[y.id];if(a===void 0)a={},m[y.id]=a;let l=a[d];if(l===void 0)l=F(K()),a[d]=l;return l}function F(L){let y=[],b=[],d=[];for(let m=0;m<Q;m++)y[m]=0,b[m]=0,d[m]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:y,enabledAttributes:b,attributeDivisors:d,object:L,attributes:{},index:null}}function O(L,y,b,d){let m=Y.attributes,a=y.attributes,l=0,r=b.getAttributes();for(let g in r)if(r[g].location>=0){let qJ=m[g],PJ=a[g];if(PJ===void 0){if(g==="instanceMatrix"&&L.instanceMatrix)PJ=L.instanceMatrix;if(g==="instanceColor"&&L.instanceColor)PJ=L.instanceColor}if(qJ===void 0)return!0;if(qJ.attribute!==PJ)return!0;if(PJ&&qJ.data!==PJ.data)return!0;l++}if(Y.attributesNum!==l)return!0;if(Y.index!==d)return!0;return!1}function z(L,y,b,d){let m={},a=y.attributes,l=0,r=b.getAttributes();for(let g in r)if(r[g].location>=0){let qJ=a[g];if(qJ===void 0){if(g==="instanceMatrix"&&L.instanceMatrix)qJ=L.instanceMatrix;if(g==="instanceColor"&&L.instanceColor)qJ=L.instanceColor}let PJ={};if(PJ.attribute=qJ,qJ&&qJ.data)PJ.data=qJ.data;m[g]=PJ,l++}Y.attributes=m,Y.attributesNum=l,Y.index=d}function R(){let L=Y.newAttributes;for(let y=0,b=L.length;y<b;y++)L[y]=0}function V(L){E(L,0)}function E(L,y){let{newAttributes:b,enabledAttributes:d,attributeDivisors:m}=Y;if(b[L]=1,d[L]===0)J.enableVertexAttribArray(L),d[L]=1;if(m[L]!==y)J.vertexAttribDivisor(L,y),m[L]=y}function D(){let{newAttributes:L,enabledAttributes:y}=Y;for(let b=0,d=y.length;b<d;b++)if(y[b]!==L[b])J.disableVertexAttribArray(b),y[b]=0}function M(L,y,b,d,m,a,l){if(l===!0)J.vertexAttribIPointer(L,y,b,m,a);else J.vertexAttribPointer(L,y,b,d,m,a)}function _(L,y,b,d){R();let m=d.attributes,a=b.getAttributes(),l=y.defaultAttributeValues;for(let r in a){let g=a[r];if(g.location>=0){let HJ=m[r];if(HJ===void 0){if(r==="instanceMatrix"&&L.instanceMatrix)HJ=L.instanceMatrix;if(r==="instanceColor"&&L.instanceColor)HJ=L.instanceColor}if(HJ!==void 0){let{normalized:qJ,itemSize:PJ}=HJ,gJ=$.get(HJ);if(gJ===void 0)continue;let{buffer:n,type:e,bytesPerElement:zJ}=gJ,BJ=e===J.INT||e===J.UNSIGNED_INT||HJ.gpuType===1013;if(HJ.isInterleavedBufferAttribute){let ZJ=HJ.data,wJ=ZJ.stride,aJ=HJ.offset;if(ZJ.isInstancedInterleavedBuffer){for(let lJ=0;lJ<g.locationSize;lJ++)E(g.location+lJ,ZJ.meshPerAttribute);if(L.isInstancedMesh!==!0&&d._maxInstanceCount===void 0)d._maxInstanceCount=ZJ.meshPerAttribute*ZJ.count}else for(let lJ=0;lJ<g.locationSize;lJ++)V(g.location+lJ);J.bindBuffer(J.ARRAY_BUFFER,n);for(let lJ=0;lJ<g.locationSize;lJ++)M(g.location+lJ,PJ/g.locationSize,e,qJ,wJ*zJ,(aJ+PJ/g.locationSize*lJ)*zJ,BJ)}else{if(HJ.isInstancedBufferAttribute){for(let ZJ=0;ZJ<g.locationSize;ZJ++)E(g.location+ZJ,HJ.meshPerAttribute);if(L.isInstancedMesh!==!0&&d._maxInstanceCount===void 0)d._maxInstanceCount=HJ.meshPerAttribute*HJ.count}else for(let ZJ=0;ZJ<g.locationSize;ZJ++)V(g.location+ZJ);J.bindBuffer(J.ARRAY_BUFFER,n);for(let ZJ=0;ZJ<g.locationSize;ZJ++)M(g.location+ZJ,PJ/g.locationSize,e,qJ,PJ*zJ,PJ/g.locationSize*ZJ*zJ,BJ)}}else if(l!==void 0){let qJ=l[r];if(qJ!==void 0)switch(qJ.length){case 2:J.vertexAttrib2fv(g.location,qJ);break;case 3:J.vertexAttrib3fv(g.location,qJ);break;case 4:J.vertexAttrib4fv(g.location,qJ);break;default:J.vertexAttrib1fv(g.location,qJ)}}}}D()}function x(){p();for(let L in Z){let y=Z[L];for(let b in y){let d=y[b];for(let m in d)G(d[m].object),delete d[m];delete y[b]}delete Z[L]}}function C(L){if(Z[L.id]===void 0)return;let y=Z[L.id];for(let b in y){let d=y[b];for(let m in d)G(d[m].object),delete d[m];delete y[b]}delete Z[L.id]}function P(L){for(let y in Z){let b=Z[y];if(b[L.id]===void 0)continue;let d=b[L.id];for(let m in d)G(d[m].object),delete d[m];delete b[L.id]}}function p(){if(k(),X=!0,Y===W)return;Y=W,q(Y.object)}function k(){W.geometry=null,W.program=null,W.wireframe=!1}return{setup:H,reset:p,resetDefaultState:k,dispose:x,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:R,enableAttribute:V,disableUnusedAttributes:D}}function OX(J,$,Q){let Z;function W(q){Z=q}function Y(q,G){J.drawArrays(Z,q,G),Q.update(G,Z,1)}function X(q,G,U){if(U===0)return;J.drawArraysInstanced(Z,q,G,U),Q.update(G,Z,U)}function H(q,G,U){if(U===0)return;$.get("WEBGL_multi_draw").multiDrawArraysWEBGL(Z,q,0,G,0,U);let O=0;for(let z=0;z<U;z++)O+=G[z];Q.update(O,Z,1)}function K(q,G,U,F){if(U===0)return;let O=$.get("WEBGL_multi_draw");if(O===null)for(let z=0;z<q.length;z++)X(q[z],G[z],F[z]);else{O.multiDrawArraysInstancedWEBGL(Z,q,0,G,0,F,0,U);let z=0;for(let R=0;R<U;R++)z+=G[R]*F[R];Q.update(z,Z,1)}}this.setMode=W,this.render=Y,this.renderInstances=X,this.renderMultiDraw=H,this.renderMultiDrawInstances=K}function RX(J,$,Q,Z){let W;function Y(){if(W!==void 0)return W;if($.has("EXT_texture_filter_anisotropic")===!0){let P=$.get("EXT_texture_filter_anisotropic");W=J.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else W=0;return W}function X(P){if(P!==1023&&Z.convert(P)!==J.getParameter(J.IMPLEMENTATION_COLOR_READ_FORMAT))return!1;return!0}function H(P){let p=P===1016&&($.has("EXT_color_buffer_half_float")||$.has("EXT_color_buffer_float"));if(P!==1009&&Z.convert(P)!==J.getParameter(J.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==1015&&!p)return!1;return!0}function K(P){if(P==="highp"){if(J.getShaderPrecisionFormat(J.VERTEX_SHADER,J.HIGH_FLOAT).precision>0&&J.getShaderPrecisionFormat(J.FRAGMENT_SHADER,J.HIGH_FLOAT).precision>0)return"highp";P="mediump"}if(P==="mediump"){if(J.getShaderPrecisionFormat(J.VERTEX_SHADER,J.MEDIUM_FLOAT).precision>0&&J.getShaderPrecisionFormat(J.FRAGMENT_SHADER,J.MEDIUM_FLOAT).precision>0)return"mediump"}return"lowp"}let q=Q.precision!==void 0?Q.precision:"highp",G=K(q);if(G!==q)console.warn("THREE.WebGLRenderer:",q,"not supported, using",G,"instead."),q=G;let U=Q.logarithmicDepthBuffer===!0,F=Q.reverseDepthBuffer===!0&&$.has("EXT_clip_control"),O=J.getParameter(J.MAX_TEXTURE_IMAGE_UNITS),z=J.getParameter(J.MAX_VERTEX_TEXTURE_IMAGE_UNITS),R=J.getParameter(J.MAX_TEXTURE_SIZE),V=J.getParameter(J.MAX_CUBE_MAP_TEXTURE_SIZE),E=J.getParameter(J.MAX_VERTEX_ATTRIBS),D=J.getParameter(J.MAX_VERTEX_UNIFORM_VECTORS),M=J.getParameter(J.MAX_VARYING_VECTORS),_=J.getParameter(J.MAX_FRAGMENT_UNIFORM_VECTORS),x=z>0,C=J.getParameter(J.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:Y,getMaxPrecision:K,textureFormatReadable:X,textureTypeReadable:H,precision:q,logarithmicDepthBuffer:U,reverseDepthBuffer:F,maxTextures:O,maxVertexTextures:z,maxTextureSize:R,maxCubemapSize:V,maxAttributes:E,maxVertexUniforms:D,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:x,maxSamples:C}}function NX(J){let $=this,Q=null,Z=0,W=!1,Y=!1,X=new a0,H=new yJ,K={value:null,needsUpdate:!1};this.uniform=K,this.numPlanes=0,this.numIntersection=0,this.init=function(U,F){let O=U.length!==0||F||Z!==0||W;return W=F,Z=U.length,O},this.beginShadows=function(){Y=!0,G(null)},this.endShadows=function(){Y=!1},this.setGlobalState=function(U,F){Q=G(U,F,0)},this.setState=function(U,F,O){let{clippingPlanes:z,clipIntersection:R,clipShadows:V}=U,E=J.get(U);if(!W||z===null||z.length===0||Y&&!V)if(Y)G(null);else q();else{let D=Y?0:Z,M=D*4,_=E.clippingState||null;K.value=_,_=G(z,F,M,O);for(let x=0;x!==M;++x)_[x]=Q[x];E.clippingState=_,this.numIntersection=R?this.numPlanes:0,this.numPlanes+=D}};function q(){if(K.value!==Q)K.value=Q,K.needsUpdate=Z>0;$.numPlanes=Z,$.numIntersection=0}function G(U,F,O,z){let R=U!==null?U.length:0,V=null;if(R!==0){if(V=K.value,z!==!0||V===null){let E=O+R*4,D=F.matrixWorldInverse;if(H.getNormalMatrix(D),V===null||V.length<E)V=new Float32Array(E);for(let M=0,_=O;M!==R;++M,_+=4)X.copy(U[M]).applyMatrix4(D,H),X.normal.toArray(V,_),V[_+3]=X.constant}K.value=V,K.needsUpdate=!0}return $.numPlanes=R,$.numIntersection=0,V}}function zX(J){let $=new WeakMap;function Q(X,H){if(H===303)X.mapping=301;else if(H===304)X.mapping=302;return X}function Z(X){if(X&&X.isTexture){let H=X.mapping;if(H===303||H===304)if($.has(X)){let K=$.get(X).texture;return Q(K,X.mapping)}else{let K=X.image;if(K&&K.height>0){let q=new g5(K.height);return q.fromEquirectangularTexture(J,X),$.set(X,q),X.addEventListener("dispose",W),Q(q.texture,X.mapping)}else return null}}return X}function W(X){let H=X.target;H.removeEventListener("dispose",W);let K=$.get(H);if(K!==void 0)$.delete(H),K.dispose()}function Y(){$=new WeakMap}return{get:Z,dispose:Y}}class l6 extends w9{constructor(J=-1,$=1,Q=1,Z=-1,W=0.1,Y=2000){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=J,this.right=$,this.top=Q,this.bottom=Z,this.near=W,this.far=Y,this.updateProjectionMatrix()}copy(J,$){return super.copy(J,$),this.left=J.left,this.right=J.right,this.top=J.top,this.bottom=J.bottom,this.near=J.near,this.far=J.far,this.zoom=J.zoom,this.view=J.view===null?null:Object.assign({},J.view),this}setViewOffset(J,$,Q,Z,W,Y){if(this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=J,this.view.fullHeight=$,this.view.offsetX=Q,this.view.offsetY=Z,this.view.width=W,this.view.height=Y,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let J=(this.right-this.left)/(2*this.zoom),$=(this.top-this.bottom)/(2*this.zoom),Q=(this.right+this.left)/2,Z=(this.top+this.bottom)/2,W=Q-J,Y=Q+J,X=Z+$,H=Z-$;if(this.view!==null&&this.view.enabled){let K=(this.right-this.left)/this.view.fullWidth/this.zoom,q=(this.top-this.bottom)/this.view.fullHeight/this.zoom;W+=K*this.view.offsetX,Y=W+K*this.view.width,X-=q*this.view.offsetY,H=X-q*this.view.height}this.projectionMatrix.makeOrthographic(W,Y,X,H,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(J){let $=super.toJSON(J);if($.object.zoom=this.zoom,$.object.left=this.left,$.object.right=this.right,$.object.top=this.top,$.object.bottom=this.bottom,$.object.near=this.near,$.object.far=this.far,this.view!==null)$.object.view=Object.assign({},this.view);return $}}var q7=4,j$=[0.125,0.215,0.35,0.446,0.526,0.582],b6=20,$9=new l6,y$=new DJ,Q9=null,Z9=0,W9=0,Y9=!1,x6=(1+Math.sqrt(5))/2,H7=1/x6,v$=[new A(-x6,H7,0),new A(x6,H7,0),new A(-H7,0,x6),new A(H7,0,x6),new A(0,x6,-H7),new A(0,x6,H7),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)];class F9{constructor(J){this._renderer=J,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(J,$=0,Q=0.1,Z=100){Q9=this._renderer.getRenderTarget(),Z9=this._renderer.getActiveCubeFace(),W9=this._renderer.getActiveMipmapLevel(),Y9=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let W=this._allocateTargets();if(W.depthBuffer=!0,this._sceneToCubeUV(J,Q,Z,W),$>0)this._blur(W,0,0,$);return this._applyPMREM(W),this._cleanup(W),W}fromEquirectangular(J,$=null){return this._fromTexture(J,$)}fromCubemap(J,$=null){return this._fromTexture(J,$)}compileCubemapShader(){if(this._cubemapMaterial===null)this._cubemapMaterial=x$(),this._compileMaterial(this._cubemapMaterial)}compileEquirectangularShader(){if(this._equirectMaterial===null)this._equirectMaterial=f$(),this._compileMaterial(this._equirectMaterial)}dispose(){if(this._dispose(),this._cubemapMaterial!==null)this._cubemapMaterial.dispose();if(this._equirectMaterial!==null)this._equirectMaterial.dispose()}_setSize(J){this._lodMax=Math.floor(Math.log2(J)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){if(this._blurMaterial!==null)this._blurMaterial.dispose();if(this._pingPongRenderTarget!==null)this._pingPongRenderTarget.dispose();for(let J=0;J<this._lodPlanes.length;J++)this._lodPlanes[J].dispose()}_cleanup(J){this._renderer.setRenderTarget(Q9,Z9,W9),this._renderer.xr.enabled=Y9,J.scissorTest=!1,Y8(J,0,0,J.width,J.height)}_fromTexture(J,$){if(J.mapping===301||J.mapping===302)this._setSize(J.image.length===0?16:J.image[0].width||J.image[0].image.width);else this._setSize(J.image.width/4);Q9=this._renderer.getRenderTarget(),Z9=this._renderer.getActiveCubeFace(),W9=this._renderer.getActiveMipmapLevel(),Y9=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let Q=$||this._allocateTargets();return this._textureToCubeUV(J,Q),this._applyPMREM(Q),this._cleanup(Q),Q}_allocateTargets(){let J=3*Math.max(this._cubeSize,112),$=4*this._cubeSize,Q={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:"srgb-linear",depthBuffer:!1},Z=h$(J,$,Q);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==J||this._pingPongRenderTarget.height!==$){if(this._pingPongRenderTarget!==null)this._dispose();this._pingPongRenderTarget=h$(J,$,Q);let{_lodMax:W}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BX(W)),this._blurMaterial=MX(W,J,$)}return Z}_compileMaterial(J){let $=new D0(this._lodPlanes[0],J);this._renderer.compile($,$9)}_sceneToCubeUV(J,$,Q,Z){let X=new M0(90,1,$,Q),H=[1,-1,1,1,1,1],K=[1,1,1,-1,-1,-1],q=this._renderer,G=q.autoClear,U=q.toneMapping;q.getClearColor(y$),q.toneMapping=0,q.autoClear=!1;let F=new G6({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),O=new D0(new y7,F),z=!1,R=J.background;if(R){if(R.isColor)F.color.copy(R),J.background=null,z=!0}else F.color.copy(y$),z=!0;for(let V=0;V<6;V++){let E=V%3;if(E===0)X.up.set(0,H[V],0),X.lookAt(K[V],0,0);else if(E===1)X.up.set(0,0,H[V]),X.lookAt(0,K[V],0);else X.up.set(0,H[V],0),X.lookAt(0,0,K[V]);let D=this._cubeSize;if(Y8(Z,E*D,V>2?D:0,D,D),q.setRenderTarget(Z),z)q.render(O,X);q.render(J,X)}O.geometry.dispose(),O.material.dispose(),q.toneMapping=U,q.autoClear=G,J.background=R}_textureToCubeUV(J,$){let Q=this._renderer,Z=J.mapping===301||J.mapping===302;if(Z){if(this._cubemapMaterial===null)this._cubemapMaterial=x$();this._cubemapMaterial.uniforms.flipEnvMap.value=J.isRenderTargetTexture===!1?-1:1}else if(this._equirectMaterial===null)this._equirectMaterial=f$();let W=Z?this._cubemapMaterial:this._equirectMaterial,Y=new D0(this._lodPlanes[0],W),X=W.uniforms;X.envMap.value=J;let H=this._cubeSize;Y8($,0,0,3*H,2*H),Q.setRenderTarget($),Q.render(Y,$9)}_applyPMREM(J){let $=this._renderer,Q=$.autoClear;$.autoClear=!1;let Z=this._lodPlanes.length;for(let W=1;W<Z;W++){let Y=Math.sqrt(this._sigmas[W]*this._sigmas[W]-this._sigmas[W-1]*this._sigmas[W-1]),X=v$[(Z-W-1)%v$.length];this._blur(J,W-1,W,Y,X)}$.autoClear=Q}_blur(J,$,Q,Z,W){let Y=this._pingPongRenderTarget;this._halfBlur(J,Y,$,Q,Z,"latitudinal",W),this._halfBlur(Y,J,Q,Q,Z,"longitudinal",W)}_halfBlur(J,$,Q,Z,W,Y,X){let H=this._renderer,K=this._blurMaterial;if(Y!=="latitudinal"&&Y!=="longitudinal")console.error("blur direction must be either latitudinal or longitudinal!");let q=3,G=new D0(this._lodPlanes[Z],K),U=K.uniforms,F=this._sizeLods[Q]-1,O=isFinite(W)?Math.PI/(2*F):2*Math.PI/(2*b6-1),z=W/O,R=isFinite(W)?1+Math.floor(q*z):b6;if(R>b6)console.warn(`sigmaRadians, ${W}, is too large and will clip, as it requested ${R} samples when the maximum is set to ${b6}`);let V=[],E=0;for(let C=0;C<b6;++C){let P=C/z,p=Math.exp(-P*P/2);if(V.push(p),C===0)E+=p;else if(C<R)E+=2*p}for(let C=0;C<V.length;C++)V[C]=V[C]/E;if(U.envMap.value=J.texture,U.samples.value=R,U.weights.value=V,U.latitudinal.value=Y==="latitudinal",X)U.poleAxis.value=X;let{_lodMax:D}=this;U.dTheta.value=O,U.mipInt.value=D-Q;let M=this._sizeLods[Z],_=3*M*(Z>D-q7?Z-D+q7:0),x=4*(this._cubeSize-M);Y8($,_,x,3*M,2*M),H.setRenderTarget($),H.render(G,$9)}}function BX(J){let $=[],Q=[],Z=[],W=J,Y=J-q7+1+j$.length;for(let X=0;X<Y;X++){let H=Math.pow(2,W);Q.push(H);let K=1/H;if(X>J-q7)K=j$[X-J+q7-1];else if(X===0)K=0;Z.push(K);let q=1/(H-2),G=-q,U=1+q,F=[G,G,U,G,U,U,G,G,U,U,G,U],O=6,z=6,R=3,V=2,E=1,D=new Float32Array(R*z*O),M=new Float32Array(V*z*O),_=new Float32Array(E*z*O);for(let C=0;C<O;C++){let P=C%3*2/3-1,p=C>2?0:-1,k=[P,p,0,P+0.6666666666666666,p,0,P+0.6666666666666666,p+1,0,P,p,0,P+0.6666666666666666,p+1,0,P,p+1,0];D.set(k,R*z*C),M.set(F,V*z*C);let L=[C,C,C,C,C,C];_.set(L,E*z*C)}let x=new h0;if(x.setAttribute("position",new V0(D,R)),x.setAttribute("uv",new V0(M,V)),x.setAttribute("faceIndex",new V0(_,E)),$.push(x),W>q7)W--}return{lodPlanes:$,sizeLods:Q,sigmas:Z}}function h$(J,$,Q){let Z=new k6(J,$,Q);return Z.texture.mapping=306,Z.texture.name="PMREM.cubeUv",Z.scissorTest=!0,Z}function Y8(J,$,Q,Z,W){J.viewport.set($,Q,Z,W),J.scissor.set($,Q,Z,W)}function MX(J,$,Q){let Z=new Float32Array(b6),W=new A(0,1,0);return new q6({name:"SphericalGaussianBlur",defines:{n:b6,CUBEUV_TEXEL_WIDTH:1/$,CUBEUV_TEXEL_HEIGHT:1/Q,CUBEUV_MAX_MIP:`${J}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:Z},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:W}},vertexShader:_9(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function f$(){return new q6({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_9(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function x$(){return new q6({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_9(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function _9(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function kX(J){let $=new WeakMap,Q=null;function Z(H){if(H&&H.isTexture){let K=H.mapping,q=K===303||K===304,G=K===301||K===302;if(q||G){let U=$.get(H),F=U!==void 0?U.texture.pmremVersion:0;if(H.isRenderTargetTexture&&H.pmremVersion!==F){if(Q===null)Q=new F9(J);return U=q?Q.fromEquirectangular(H,U):Q.fromCubemap(H,U),U.texture.pmremVersion=H.pmremVersion,$.set(H,U),U.texture}else if(U!==void 0)return U.texture;else{let O=H.image;if(q&&O&&O.height>0||G&&O&&W(O)){if(Q===null)Q=new F9(J);return U=q?Q.fromEquirectangular(H):Q.fromCubemap(H),U.texture.pmremVersion=H.pmremVersion,$.set(H,U),H.addEventListener("dispose",Y),U.texture}else return null}}}return H}function W(H){let K=0,q=6;for(let G=0;G<q;G++)if(H[G]!==void 0)K++;return K===q}function Y(H){let K=H.target;K.removeEventListener("dispose",Y);let q=$.get(K);if(q!==void 0)$.delete(K),q.dispose()}function X(){if($=new WeakMap,Q!==null)Q.dispose(),Q=null}return{get:Z,dispose:X}}function LX(J){let $={};function Q(Z){if($[Z]!==void 0)return $[Z];let W;switch(Z){case"WEBGL_depth_texture":W=J.getExtension("WEBGL_depth_texture")||J.getExtension("MOZ_WEBGL_depth_texture")||J.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":W=J.getExtension("EXT_texture_filter_anisotropic")||J.getExtension("MOZ_EXT_texture_filter_anisotropic")||J.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":W=J.getExtension("WEBGL_compressed_texture_s3tc")||J.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||J.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":W=J.getExtension("WEBGL_compressed_texture_pvrtc")||J.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:W=J.getExtension(Z)}return $[Z]=W,W}return{has:function(Z){return Q(Z)!==null},init:function(){Q("EXT_color_buffer_float"),Q("WEBGL_clip_cull_distance"),Q("OES_texture_float_linear"),Q("EXT_color_buffer_half_float"),Q("WEBGL_multisampled_render_to_texture"),Q("WEBGL_render_shared_exponent")},get:function(Z){let W=Q(Z);if(W===null)_7("THREE.WebGLRenderer: "+Z+" extension not supported.");return W}}}function DX(J,$,Q,Z){let W={},Y=new WeakMap;function X(U){let F=U.target;if(F.index!==null)$.remove(F.index);for(let z in F.attributes)$.remove(F.attributes[z]);for(let z in F.morphAttributes){let R=F.morphAttributes[z];for(let V=0,E=R.length;V<E;V++)$.remove(R[V])}F.removeEventListener("dispose",X),delete W[F.id];let O=Y.get(F);if(O)$.remove(O),Y.delete(F);if(Z.releaseStatesOfGeometry(F),F.isInstancedBufferGeometry===!0)delete F._maxInstanceCount;Q.memory.geometries--}function H(U,F){if(W[F.id]===!0)return F;return F.addEventListener("dispose",X),W[F.id]=!0,Q.memory.geometries++,F}function K(U){let F=U.attributes;for(let z in F)$.update(F[z],J.ARRAY_BUFFER);let O=U.morphAttributes;for(let z in O){let R=O[z];for(let V=0,E=R.length;V<E;V++)$.update(R[V],J.ARRAY_BUFFER)}}function q(U){let F=[],O=U.index,z=U.attributes.position,R=0;if(O!==null){let D=O.array;R=O.version;for(let M=0,_=D.length;M<_;M+=3){let x=D[M+0],C=D[M+1],P=D[M+2];F.push(x,C,C,P,P,x)}}else if(z!==void 0){let D=z.array;R=z.version;for(let M=0,_=D.length/3-1;M<_;M+=3){let x=M+0,C=M+1,P=M+2;F.push(x,C,C,P,P,x)}}else return;let V=new((j5(F))?D9:L9)(F,1);V.version=R;let E=Y.get(U);if(E)$.remove(E);Y.set(U,V)}function G(U){let F=Y.get(U);if(F){let O=U.index;if(O!==null){if(F.version<O.version)q(U)}}else q(U);return Y.get(U)}return{get:H,update:K,getWireframeAttribute:G}}function wX(J,$,Q){let Z;function W(F){Z=F}let Y,X;function H(F){Y=F.type,X=F.bytesPerElement}function K(F,O){J.drawElements(Z,O,Y,F*X),Q.update(O,Z,1)}function q(F,O,z){if(z===0)return;J.drawElementsInstanced(Z,O,Y,F*X,z),Q.update(O,Z,z)}function G(F,O,z){if(z===0)return;$.get("WEBGL_multi_draw").multiDrawElementsWEBGL(Z,O,0,Y,F,0,z);let V=0;for(let E=0;E<z;E++)V+=O[E];Q.update(V,Z,1)}function U(F,O,z,R){if(z===0)return;let V=$.get("WEBGL_multi_draw");if(V===null)for(let E=0;E<F.length;E++)q(F[E]/X,O[E],R[E]);else{V.multiDrawElementsInstancedWEBGL(Z,O,0,Y,F,0,R,0,z);let E=0;for(let D=0;D<z;D++)E+=O[D]*R[D];Q.update(E,Z,1)}}this.setMode=W,this.setIndex=H,this.render=K,this.renderInstances=q,this.renderMultiDraw=G,this.renderMultiDrawInstances=U}function CX(J){let $={geometries:0,textures:0},Q={frame:0,calls:0,triangles:0,points:0,lines:0};function Z(Y,X,H){switch(Q.calls++,X){case J.TRIANGLES:Q.triangles+=H*(Y/3);break;case J.LINES:Q.lines+=H*(Y/2);break;case J.LINE_STRIP:Q.lines+=H*(Y-1);break;case J.LINE_LOOP:Q.lines+=H*Y;break;case J.POINTS:Q.points+=H*Y;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",X);break}}function W(){Q.calls=0,Q.triangles=0,Q.points=0,Q.lines=0}return{memory:$,render:Q,programs:null,autoReset:!0,reset:W,update:Z}}function _X(J,$,Q){let Z=new WeakMap,W=new dJ;function Y(X,H,K){let q=X.morphTargetInfluences,G=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,U=G!==void 0?G.length:0,F=Z.get(H);if(F===void 0||F.count!==U){let k=function(){P.dispose(),Z.delete(H),H.removeEventListener("dispose",k)};if(F!==void 0)F.texture.dispose();let O=H.morphAttributes.position!==void 0,z=H.morphAttributes.normal!==void 0,R=H.morphAttributes.color!==void 0,V=H.morphAttributes.position||[],E=H.morphAttributes.normal||[],D=H.morphAttributes.color||[],M=0;if(O===!0)M=1;if(z===!0)M=2;if(R===!0)M=3;let _=H.attributes.position.count*M,x=1;if(_>$.maxTextureSize)x=Math.ceil(_/$.maxTextureSize),_=$.maxTextureSize;let C=new Float32Array(_*x*4*U),P=new k9(C,_,x,U);P.type=1015,P.needsUpdate=!0;let p=M*4;for(let L=0;L<U;L++){let y=V[L],b=E[L],d=D[L],m=_*x*4*L;for(let a=0;a<y.count;a++){let l=a*p;if(O===!0)W.fromBufferAttribute(y,a),C[m+l+0]=W.x,C[m+l+1]=W.y,C[m+l+2]=W.z,C[m+l+3]=0;if(z===!0)W.fromBufferAttribute(b,a),C[m+l+4]=W.x,C[m+l+5]=W.y,C[m+l+6]=W.z,C[m+l+7]=0;if(R===!0)W.fromBufferAttribute(d,a),C[m+l+8]=W.x,C[m+l+9]=W.y,C[m+l+10]=W.z,C[m+l+11]=d.itemSize===4?W.w:1}}F={count:U,texture:P,size:new LJ(_,x)},Z.set(H,F),H.addEventListener("dispose",k)}if(X.isInstancedMesh===!0&&X.morphTexture!==null)K.getUniforms().setValue(J,"morphTexture",X.morphTexture,Q);else{let O=0;for(let R=0;R<q.length;R++)O+=q[R];let z=H.morphTargetsRelative?1:1-O;K.getUniforms().setValue(J,"morphTargetBaseInfluence",z),K.getUniforms().setValue(J,"morphTargetInfluences",q)}K.getUniforms().setValue(J,"morphTargetsTexture",F.texture,Q),K.getUniforms().setValue(J,"morphTargetsTextureSize",F.size)}return{update:Y}}function PX(J,$,Q,Z){let W=new WeakMap;function Y(K){let q=Z.render.frame,G=K.geometry,U=$.get(K,G);if(W.get(U)!==q)$.update(U),W.set(U,q);if(K.isInstancedMesh){if(K.hasEventListener("dispose",H)===!1)K.addEventListener("dispose",H);if(W.get(K)!==q){if(Q.update(K.instanceMatrix,J.ARRAY_BUFFER),K.instanceColor!==null)Q.update(K.instanceColor,J.ARRAY_BUFFER);W.set(K,q)}}if(K.isSkinnedMesh){let F=K.skeleton;if(W.get(F)!==q)F.update(),W.set(F,q)}return U}function X(){W=new WeakMap}function H(K){let q=K.target;if(q.removeEventListener("dispose",H),Q.remove(q.instanceMatrix),q.instanceColor!==null)Q.remove(q.instanceColor)}return{update:Y,dispose:X}}class P9 extends K0{constructor(J,$,Q,Z,W,Y,X,H,K,q=1026){if(q!==1026&&q!==1027)throw Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");if(Q===void 0&&q===1026)Q=1014;if(Q===void 0&&q===1027)Q=1020;super(null,Z,W,Y,X,H,q,Q,K);this.isDepthTexture=!0,this.image={width:J,height:$},this.magFilter=X!==void 0?X:1003,this.minFilter=H!==void 0?H:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(J){return super.copy(J),this.compareFunction=J.compareFunction,this}toJSON(J){let $=super.toJSON(J);if(this.compareFunction!==null)$.compareFunction=this.compareFunction;return $}}var l5=new K0,b$=new P9(1,1),u5=new k9,m5=new h5,d5=new C9,g$=[],p$=[],l$=new Float32Array(16),u$=new Float32Array(9),m$=new Float32Array(4);function E7(J,$,Q){let Z=J[0];if(Z<=0||Z>0)return J;let W=$*Q,Y=g$[W];if(Y===void 0)Y=new Float32Array(W),g$[W]=Y;if($!==0){Z.toArray(Y,0);for(let X=1,H=0;X!==$;++X)H+=Q,J[X].toArray(Y,H)}return Y}function q0(J,$){if(J.length!==$.length)return!1;for(let Q=0,Z=J.length;Q<Z;Q++)if(J[Q]!==$[Q])return!1;return!0}function G0(J,$){for(let Q=0,Z=$.length;Q<Z;Q++)J[Q]=$[Q]}function w8(J,$){let Q=p$[$];if(Q===void 0)Q=new Int32Array($),p$[$]=Q;for(let Z=0;Z!==$;++Z)Q[Z]=J.allocateTextureUnit();return Q}function AX(J,$){let Q=this.cache;if(Q[0]===$)return;J.uniform1f(this.addr,$),Q[0]=$}function TX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y)J.uniform2f(this.addr,$.x,$.y),Q[0]=$.x,Q[1]=$.y}else{if(q0(Q,$))return;J.uniform2fv(this.addr,$),G0(Q,$)}}function IX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y||Q[2]!==$.z)J.uniform3f(this.addr,$.x,$.y,$.z),Q[0]=$.x,Q[1]=$.y,Q[2]=$.z}else if($.r!==void 0){if(Q[0]!==$.r||Q[1]!==$.g||Q[2]!==$.b)J.uniform3f(this.addr,$.r,$.g,$.b),Q[0]=$.r,Q[1]=$.g,Q[2]=$.b}else{if(q0(Q,$))return;J.uniform3fv(this.addr,$),G0(Q,$)}}function SX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y||Q[2]!==$.z||Q[3]!==$.w)J.uniform4f(this.addr,$.x,$.y,$.z,$.w),Q[0]=$.x,Q[1]=$.y,Q[2]=$.z,Q[3]=$.w}else{if(q0(Q,$))return;J.uniform4fv(this.addr,$),G0(Q,$)}}function jX(J,$){let Q=this.cache,Z=$.elements;if(Z===void 0){if(q0(Q,$))return;J.uniformMatrix2fv(this.addr,!1,$),G0(Q,$)}else{if(q0(Q,Z))return;m$.set(Z),J.uniformMatrix2fv(this.addr,!1,m$),G0(Q,Z)}}function yX(J,$){let Q=this.cache,Z=$.elements;if(Z===void 0){if(q0(Q,$))return;J.uniformMatrix3fv(this.addr,!1,$),G0(Q,$)}else{if(q0(Q,Z))return;u$.set(Z),J.uniformMatrix3fv(this.addr,!1,u$),G0(Q,Z)}}function vX(J,$){let Q=this.cache,Z=$.elements;if(Z===void 0){if(q0(Q,$))return;J.uniformMatrix4fv(this.addr,!1,$),G0(Q,$)}else{if(q0(Q,Z))return;l$.set(Z),J.uniformMatrix4fv(this.addr,!1,l$),G0(Q,Z)}}function hX(J,$){let Q=this.cache;if(Q[0]===$)return;J.uniform1i(this.addr,$),Q[0]=$}function fX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y)J.uniform2i(this.addr,$.x,$.y),Q[0]=$.x,Q[1]=$.y}else{if(q0(Q,$))return;J.uniform2iv(this.addr,$),G0(Q,$)}}function xX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y||Q[2]!==$.z)J.uniform3i(this.addr,$.x,$.y,$.z),Q[0]=$.x,Q[1]=$.y,Q[2]=$.z}else{if(q0(Q,$))return;J.uniform3iv(this.addr,$),G0(Q,$)}}function bX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y||Q[2]!==$.z||Q[3]!==$.w)J.uniform4i(this.addr,$.x,$.y,$.z,$.w),Q[0]=$.x,Q[1]=$.y,Q[2]=$.z,Q[3]=$.w}else{if(q0(Q,$))return;J.uniform4iv(this.addr,$),G0(Q,$)}}function gX(J,$){let Q=this.cache;if(Q[0]===$)return;J.uniform1ui(this.addr,$),Q[0]=$}function pX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y)J.uniform2ui(this.addr,$.x,$.y),Q[0]=$.x,Q[1]=$.y}else{if(q0(Q,$))return;J.uniform2uiv(this.addr,$),G0(Q,$)}}function lX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y||Q[2]!==$.z)J.uniform3ui(this.addr,$.x,$.y,$.z),Q[0]=$.x,Q[1]=$.y,Q[2]=$.z}else{if(q0(Q,$))return;J.uniform3uiv(this.addr,$),G0(Q,$)}}function uX(J,$){let Q=this.cache;if($.x!==void 0){if(Q[0]!==$.x||Q[1]!==$.y||Q[2]!==$.z||Q[3]!==$.w)J.uniform4ui(this.addr,$.x,$.y,$.z,$.w),Q[0]=$.x,Q[1]=$.y,Q[2]=$.z,Q[3]=$.w}else{if(q0(Q,$))return;J.uniform4uiv(this.addr,$),G0(Q,$)}}function mX(J,$,Q){let Z=this.cache,W=Q.allocateTextureUnit();if(Z[0]!==W)J.uniform1i(this.addr,W),Z[0]=W;let Y;if(this.type===J.SAMPLER_2D_SHADOW)b$.compareFunction=515,Y=b$;else Y=l5;Q.setTexture2D($||Y,W)}function dX(J,$,Q){let Z=this.cache,W=Q.allocateTextureUnit();if(Z[0]!==W)J.uniform1i(this.addr,W),Z[0]=W;Q.setTexture3D($||m5,W)}function cX(J,$,Q){let Z=this.cache,W=Q.allocateTextureUnit();if(Z[0]!==W)J.uniform1i(this.addr,W),Z[0]=W;Q.setTextureCube($||d5,W)}function nX(J,$,Q){let Z=this.cache,W=Q.allocateTextureUnit();if(Z[0]!==W)J.uniform1i(this.addr,W),Z[0]=W;Q.setTexture2DArray($||u5,W)}function sX(J){switch(J){case 5126:return AX;case 35664:return TX;case 35665:return IX;case 35666:return SX;case 35674:return jX;case 35675:return yX;case 35676:return vX;case 5124:case 35670:return hX;case 35667:case 35671:return fX;case 35668:case 35672:return xX;case 35669:case 35673:return bX;case 5125:return gX;case 36294:return pX;case 36295:return lX;case 36296:return uX;case 35678:case 36198:case 36298:case 36306:case 35682:return mX;case 35679:case 36299:case 36307:return dX;case 35680:case 36300:case 36308:case 36293:return cX;case 36289:case 36303:case 36311:case 36292:return nX}}function oX(J,$){J.uniform1fv(this.addr,$)}function iX(J,$){let Q=E7($,this.size,2);J.uniform2fv(this.addr,Q)}function aX(J,$){let Q=E7($,this.size,3);J.uniform3fv(this.addr,Q)}function rX(J,$){let Q=E7($,this.size,4);J.uniform4fv(this.addr,Q)}function tX(J,$){let Q=E7($,this.size,4);J.uniformMatrix2fv(this.addr,!1,Q)}function eX(J,$){let Q=E7($,this.size,9);J.uniformMatrix3fv(this.addr,!1,Q)}function JH(J,$){let Q=E7($,this.size,16);J.uniformMatrix4fv(this.addr,!1,Q)}function $H(J,$){J.uniform1iv(this.addr,$)}function QH(J,$){J.uniform2iv(this.addr,$)}function ZH(J,$){J.uniform3iv(this.addr,$)}function WH(J,$){J.uniform4iv(this.addr,$)}function YH(J,$){J.uniform1uiv(this.addr,$)}function XH(J,$){J.uniform2uiv(this.addr,$)}function HH(J,$){J.uniform3uiv(this.addr,$)}function KH(J,$){J.uniform4uiv(this.addr,$)}function qH(J,$,Q){let Z=this.cache,W=$.length,Y=w8(Q,W);if(!q0(Z,Y))J.uniform1iv(this.addr,Y),G0(Z,Y);for(let X=0;X!==W;++X)Q.setTexture2D($[X]||l5,Y[X])}function GH(J,$,Q){let Z=this.cache,W=$.length,Y=w8(Q,W);if(!q0(Z,Y))J.uniform1iv(this.addr,Y),G0(Z,Y);for(let X=0;X!==W;++X)Q.setTexture3D($[X]||m5,Y[X])}function UH(J,$,Q){let Z=this.cache,W=$.length,Y=w8(Q,W);if(!q0(Z,Y))J.uniform1iv(this.addr,Y),G0(Z,Y);for(let X=0;X!==W;++X)Q.setTextureCube($[X]||d5,Y[X])}function FH(J,$,Q){let Z=this.cache,W=$.length,Y=w8(Q,W);if(!q0(Z,Y))J.uniform1iv(this.addr,Y),G0(Z,Y);for(let X=0;X!==W;++X)Q.setTexture2DArray($[X]||u5,Y[X])}function VH(J){switch(J){case 5126:return oX;case 35664:return iX;case 35665:return aX;case 35666:return rX;case 35674:return tX;case 35675:return eX;case 35676:return JH;case 5124:case 35670:return $H;case 35667:case 35671:return QH;case 35668:case 35672:return ZH;case 35669:case 35673:return WH;case 5125:return YH;case 36294:return XH;case 36295:return HH;case 36296:return KH;case 35678:case 36198:case 36298:case 36306:case 35682:return qH;case 35679:case 36299:case 36307:return GH;case 35680:case 36300:case 36308:case 36293:return UH;case 36289:case 36303:case 36311:case 36292:return FH}}class c5{constructor(J,$,Q){this.id=J,this.addr=Q,this.cache=[],this.type=$.type,this.setValue=sX($.type)}}class n5{constructor(J,$,Q){this.id=J,this.addr=Q,this.cache=[],this.type=$.type,this.size=$.size,this.setValue=VH($.type)}}class s5{constructor(J){this.id=J,this.seq=[],this.map={}}setValue(J,$,Q){let Z=this.seq;for(let W=0,Y=Z.length;W!==Y;++W){let X=Z[W];X.setValue(J,$[X.id],Q)}}}var X9=/(\w+)(\])?(\[|\.)?/g;function d$(J,$){J.seq.push($),J.map[$.id]=$}function EH(J,$,Q){let Z=J.name,W=Z.length;X9.lastIndex=0;while(!0){let Y=X9.exec(Z),X=X9.lastIndex,H=Y[1],K=Y[2]==="]",q=Y[3];if(K)H=H|0;if(q===void 0||q==="["&&X+2===W){d$(Q,q===void 0?new c5(H,J,$):new n5(H,J,$));break}else{let U=Q.map[H];if(U===void 0)U=new s5(H),d$(Q,U);Q=U}}}class I7{constructor(J,$){this.seq=[],this.map={};let Q=J.getProgramParameter($,J.ACTIVE_UNIFORMS);for(let Z=0;Z<Q;++Z){let W=J.getActiveUniform($,Z),Y=J.getUniformLocation($,W.name);EH(W,Y,this)}}setValue(J,$,Q,Z){let W=this.map[$];if(W!==void 0)W.setValue(J,Q,Z)}setOptional(J,$,Q){let Z=$[Q];if(Z!==void 0)this.setValue(J,Q,Z)}static upload(J,$,Q,Z){for(let W=0,Y=$.length;W!==Y;++W){let X=$[W],H=Q[X.id];if(H.needsUpdate!==!1)X.setValue(J,H.value,Z)}}static seqWithValue(J,$){let Q=[];for(let Z=0,W=J.length;Z!==W;++Z){let Y=J[Z];if(Y.id in $)Q.push(Y)}return Q}}function c$(J,$,Q){let Z=J.createShader($);return J.shaderSource(Z,Q),J.compileShader(Z),Z}var OH=37297,RH=0;function NH(J,$){let Q=J.split(`
`),Z=[],W=Math.max($-6,0),Y=Math.min($+6,Q.length);for(let X=W;X<Y;X++){let H=X+1;Z.push(`${H===$?">":" "} ${H}: ${Q[X]}`)}return Z.join(`
`)}var n$=new yJ;function zH(J){pJ._getMatrix(n$,pJ.workingColorSpace,J);let $=`mat3( ${n$.elements.map((Q)=>Q.toFixed(4))} )`;switch(pJ.getTransfer(J)){case"linear":return[$,"LinearTransferOETF"];case"srgb":return[$,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",J),[$,"LinearTransferOETF"]}}function s$(J,$,Q){let Z=J.getShaderParameter($,J.COMPILE_STATUS),W=J.getShaderInfoLog($).trim();if(Z&&W==="")return"";let Y=/ERROR: 0:(\d+)/.exec(W);if(Y){let X=parseInt(Y[1]);return Q.toUpperCase()+`

`+W+`

`+NH(J.getShaderSource($),X)}else return W}function BH(J,$){let Q=zH($);return[`vec4 ${J}( vec4 value ) {`,`	return ${Q[1]}( vec4( value.rgb * ${Q[0]}, value.a ) );`,"}"].join(`
`)}function MH(J,$){let Q;switch($){case 1:Q="Linear";break;case 2:Q="Reinhard";break;case 3:Q="Cineon";break;case 4:Q="ACESFilmic";break;case 6:Q="AgX";break;case 7:Q="Neutral";break;case 5:Q="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",$),Q="Linear"}return"vec3 "+J+"( vec3 color ) { return "+Q+"ToneMapping( color ); }"}var X8=new A;function kH(){pJ.getLuminanceCoefficients(X8);let J=X8.x.toFixed(4),$=X8.y.toFixed(4),Q=X8.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${J}, ${$}, ${Q} );`,"\treturn dot( weights, rgb );","}"].join(`
`)}function LH(J){return[J.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",J.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(P7).join(`
`)}function DH(J){let $=[];for(let Q in J){let Z=J[Q];if(Z===!1)continue;$.push("#define "+Q+" "+Z)}return $.join(`
`)}function wH(J,$){let Q={},Z=J.getProgramParameter($,J.ACTIVE_ATTRIBUTES);for(let W=0;W<Z;W++){let Y=J.getActiveAttrib($,W),X=Y.name,H=1;if(Y.type===J.FLOAT_MAT2)H=2;if(Y.type===J.FLOAT_MAT3)H=3;if(Y.type===J.FLOAT_MAT4)H=4;Q[X]={type:Y.type,location:J.getAttribLocation($,X),locationSize:H}}return Q}function P7(J){return J!==""}function o$(J,$){let Q=$.numSpotLightShadows+$.numSpotLightMaps-$.numSpotLightShadowsWithMaps;return J.replace(/NUM_DIR_LIGHTS/g,$.numDirLights).replace(/NUM_SPOT_LIGHTS/g,$.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,$.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,Q).replace(/NUM_RECT_AREA_LIGHTS/g,$.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,$.numPointLights).replace(/NUM_HEMI_LIGHTS/g,$.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,$.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,$.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,$.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,$.numPointLightShadows)}function i$(J,$){return J.replace(/NUM_CLIPPING_PLANES/g,$.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,$.numClippingPlanes-$.numClipIntersection)}var CH=/^[ \t]*#include +<([\w\d./]+)>/gm;function V9(J){return J.replace(CH,PH)}var _H=new Map;function PH(J,$){let Q=hJ[$];if(Q===void 0){let Z=_H.get($);if(Z!==void 0)Q=hJ[Z],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',$,Z);else throw Error("Can not resolve #include <"+$+">")}return V9(Q)}var AH=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function a$(J){return J.replace(AH,TH)}function TH(J,$,Q,Z){let W="";for(let Y=parseInt($);Y<parseInt(Q);Y++)W+=Z.replace(/\[\s*i\s*\]/g,"[ "+Y+" ]").replace(/UNROLLED_LOOP_INDEX/g,Y);return W}function r$(J){let $=`precision ${J.precision} float;
	precision ${J.precision} int;
	precision ${J.precision} sampler2D;
	precision ${J.precision} samplerCube;
	precision ${J.precision} sampler3D;
	precision ${J.precision} sampler2DArray;
	precision ${J.precision} sampler2DShadow;
	precision ${J.precision} samplerCubeShadow;
	precision ${J.precision} sampler2DArrayShadow;
	precision ${J.precision} isampler2D;
	precision ${J.precision} isampler3D;
	precision ${J.precision} isamplerCube;
	precision ${J.precision} isampler2DArray;
	precision ${J.precision} usampler2D;
	precision ${J.precision} usampler3D;
	precision ${J.precision} usamplerCube;
	precision ${J.precision} usampler2DArray;
	`;if(J.precision==="highp")$+=`
#define HIGH_PRECISION`;else if(J.precision==="mediump")$+=`
#define MEDIUM_PRECISION`;else if(J.precision==="lowp")$+=`
#define LOW_PRECISION`;return $}function IH(J){let $="SHADOWMAP_TYPE_BASIC";if(J.shadowMapType===1)$="SHADOWMAP_TYPE_PCF";else if(J.shadowMapType===2)$="SHADOWMAP_TYPE_PCF_SOFT";else if(J.shadowMapType===3)$="SHADOWMAP_TYPE_VSM";return $}function SH(J){let $="ENVMAP_TYPE_CUBE";if(J.envMap)switch(J.envMapMode){case 301:case 302:$="ENVMAP_TYPE_CUBE";break;case 306:$="ENVMAP_TYPE_CUBE_UV";break}return $}function jH(J){let $="ENVMAP_MODE_REFLECTION";if(J.envMap)switch(J.envMapMode){case 302:$="ENVMAP_MODE_REFRACTION";break}return $}function yH(J){let $="ENVMAP_BLENDING_NONE";if(J.envMap)switch(J.combine){case 0:$="ENVMAP_BLENDING_MULTIPLY";break;case 1:$="ENVMAP_BLENDING_MIX";break;case 2:$="ENVMAP_BLENDING_ADD";break}return $}function vH(J){let $=J.envMapCubeUVHeight;if($===null)return null;let Q=Math.log2($)-2,Z=1/$;return{texelWidth:1/(3*Math.max(Math.pow(2,Q),112)),texelHeight:Z,maxMip:Q}}function hH(J,$,Q,Z){let W=J.getContext(),Y=Q.defines,X=Q.vertexShader,H=Q.fragmentShader,K=IH(Q),q=SH(Q),G=jH(Q),U=yH(Q),F=vH(Q),O=LH(Q),z=DH(Y),R=W.createProgram(),V,E,D=Q.glslVersion?"#version "+Q.glslVersion+`
`:"";if(Q.isRawShaderMaterial){if(V=["#define SHADER_TYPE "+Q.shaderType,"#define SHADER_NAME "+Q.shaderName,z].filter(P7).join(`
`),V.length>0)V+=`
`;if(E=["#define SHADER_TYPE "+Q.shaderType,"#define SHADER_NAME "+Q.shaderName,z].filter(P7).join(`
`),E.length>0)E+=`
`}else V=[r$(Q),"#define SHADER_TYPE "+Q.shaderType,"#define SHADER_NAME "+Q.shaderName,z,Q.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",Q.batching?"#define USE_BATCHING":"",Q.batchingColor?"#define USE_BATCHING_COLOR":"",Q.instancing?"#define USE_INSTANCING":"",Q.instancingColor?"#define USE_INSTANCING_COLOR":"",Q.instancingMorph?"#define USE_INSTANCING_MORPH":"",Q.useFog&&Q.fog?"#define USE_FOG":"",Q.useFog&&Q.fogExp2?"#define FOG_EXP2":"",Q.map?"#define USE_MAP":"",Q.envMap?"#define USE_ENVMAP":"",Q.envMap?"#define "+G:"",Q.lightMap?"#define USE_LIGHTMAP":"",Q.aoMap?"#define USE_AOMAP":"",Q.bumpMap?"#define USE_BUMPMAP":"",Q.normalMap?"#define USE_NORMALMAP":"",Q.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",Q.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",Q.displacementMap?"#define USE_DISPLACEMENTMAP":"",Q.emissiveMap?"#define USE_EMISSIVEMAP":"",Q.anisotropy?"#define USE_ANISOTROPY":"",Q.anisotropyMap?"#define USE_ANISOTROPYMAP":"",Q.clearcoatMap?"#define USE_CLEARCOATMAP":"",Q.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",Q.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",Q.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",Q.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",Q.specularMap?"#define USE_SPECULARMAP":"",Q.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",Q.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",Q.roughnessMap?"#define USE_ROUGHNESSMAP":"",Q.metalnessMap?"#define USE_METALNESSMAP":"",Q.alphaMap?"#define USE_ALPHAMAP":"",Q.alphaHash?"#define USE_ALPHAHASH":"",Q.transmission?"#define USE_TRANSMISSION":"",Q.transmissionMap?"#define USE_TRANSMISSIONMAP":"",Q.thicknessMap?"#define USE_THICKNESSMAP":"",Q.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",Q.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",Q.mapUv?"#define MAP_UV "+Q.mapUv:"",Q.alphaMapUv?"#define ALPHAMAP_UV "+Q.alphaMapUv:"",Q.lightMapUv?"#define LIGHTMAP_UV "+Q.lightMapUv:"",Q.aoMapUv?"#define AOMAP_UV "+Q.aoMapUv:"",Q.emissiveMapUv?"#define EMISSIVEMAP_UV "+Q.emissiveMapUv:"",Q.bumpMapUv?"#define BUMPMAP_UV "+Q.bumpMapUv:"",Q.normalMapUv?"#define NORMALMAP_UV "+Q.normalMapUv:"",Q.displacementMapUv?"#define DISPLACEMENTMAP_UV "+Q.displacementMapUv:"",Q.metalnessMapUv?"#define METALNESSMAP_UV "+Q.metalnessMapUv:"",Q.roughnessMapUv?"#define ROUGHNESSMAP_UV "+Q.roughnessMapUv:"",Q.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+Q.anisotropyMapUv:"",Q.clearcoatMapUv?"#define CLEARCOATMAP_UV "+Q.clearcoatMapUv:"",Q.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+Q.clearcoatNormalMapUv:"",Q.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+Q.clearcoatRoughnessMapUv:"",Q.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+Q.iridescenceMapUv:"",Q.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+Q.iridescenceThicknessMapUv:"",Q.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+Q.sheenColorMapUv:"",Q.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+Q.sheenRoughnessMapUv:"",Q.specularMapUv?"#define SPECULARMAP_UV "+Q.specularMapUv:"",Q.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+Q.specularColorMapUv:"",Q.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+Q.specularIntensityMapUv:"",Q.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+Q.transmissionMapUv:"",Q.thicknessMapUv?"#define THICKNESSMAP_UV "+Q.thicknessMapUv:"",Q.vertexTangents&&Q.flatShading===!1?"#define USE_TANGENT":"",Q.vertexColors?"#define USE_COLOR":"",Q.vertexAlphas?"#define USE_COLOR_ALPHA":"",Q.vertexUv1s?"#define USE_UV1":"",Q.vertexUv2s?"#define USE_UV2":"",Q.vertexUv3s?"#define USE_UV3":"",Q.pointsUvs?"#define USE_POINTS_UV":"",Q.flatShading?"#define FLAT_SHADED":"",Q.skinning?"#define USE_SKINNING":"",Q.morphTargets?"#define USE_MORPHTARGETS":"",Q.morphNormals&&Q.flatShading===!1?"#define USE_MORPHNORMALS":"",Q.morphColors?"#define USE_MORPHCOLORS":"",Q.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+Q.morphTextureStride:"",Q.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+Q.morphTargetsCount:"",Q.doubleSided?"#define DOUBLE_SIDED":"",Q.flipSided?"#define FLIP_SIDED":"",Q.shadowMapEnabled?"#define USE_SHADOWMAP":"",Q.shadowMapEnabled?"#define "+K:"",Q.sizeAttenuation?"#define USE_SIZEATTENUATION":"",Q.numLightProbes>0?"#define USE_LIGHT_PROBES":"",Q.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",Q.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","\tattribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","\tattribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","\tuniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","\tattribute vec2 uv1;","#endif","#ifdef USE_UV2","\tattribute vec2 uv2;","#endif","#ifdef USE_UV3","\tattribute vec2 uv3;","#endif","#ifdef USE_TANGENT","\tattribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","\tattribute vec4 color;","#elif defined( USE_COLOR )","\tattribute vec3 color;","#endif","#ifdef USE_SKINNING","\tattribute vec4 skinIndex;","\tattribute vec4 skinWeight;","#endif",`
`].filter(P7).join(`
`),E=[r$(Q),"#define SHADER_TYPE "+Q.shaderType,"#define SHADER_NAME "+Q.shaderName,z,Q.useFog&&Q.fog?"#define USE_FOG":"",Q.useFog&&Q.fogExp2?"#define FOG_EXP2":"",Q.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",Q.map?"#define USE_MAP":"",Q.matcap?"#define USE_MATCAP":"",Q.envMap?"#define USE_ENVMAP":"",Q.envMap?"#define "+q:"",Q.envMap?"#define "+G:"",Q.envMap?"#define "+U:"",F?"#define CUBEUV_TEXEL_WIDTH "+F.texelWidth:"",F?"#define CUBEUV_TEXEL_HEIGHT "+F.texelHeight:"",F?"#define CUBEUV_MAX_MIP "+F.maxMip+".0":"",Q.lightMap?"#define USE_LIGHTMAP":"",Q.aoMap?"#define USE_AOMAP":"",Q.bumpMap?"#define USE_BUMPMAP":"",Q.normalMap?"#define USE_NORMALMAP":"",Q.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",Q.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",Q.emissiveMap?"#define USE_EMISSIVEMAP":"",Q.anisotropy?"#define USE_ANISOTROPY":"",Q.anisotropyMap?"#define USE_ANISOTROPYMAP":"",Q.clearcoat?"#define USE_CLEARCOAT":"",Q.clearcoatMap?"#define USE_CLEARCOATMAP":"",Q.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",Q.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",Q.dispersion?"#define USE_DISPERSION":"",Q.iridescence?"#define USE_IRIDESCENCE":"",Q.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",Q.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",Q.specularMap?"#define USE_SPECULARMAP":"",Q.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",Q.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",Q.roughnessMap?"#define USE_ROUGHNESSMAP":"",Q.metalnessMap?"#define USE_METALNESSMAP":"",Q.alphaMap?"#define USE_ALPHAMAP":"",Q.alphaTest?"#define USE_ALPHATEST":"",Q.alphaHash?"#define USE_ALPHAHASH":"",Q.sheen?"#define USE_SHEEN":"",Q.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",Q.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",Q.transmission?"#define USE_TRANSMISSION":"",Q.transmissionMap?"#define USE_TRANSMISSIONMAP":"",Q.thicknessMap?"#define USE_THICKNESSMAP":"",Q.vertexTangents&&Q.flatShading===!1?"#define USE_TANGENT":"",Q.vertexColors||Q.instancingColor||Q.batchingColor?"#define USE_COLOR":"",Q.vertexAlphas?"#define USE_COLOR_ALPHA":"",Q.vertexUv1s?"#define USE_UV1":"",Q.vertexUv2s?"#define USE_UV2":"",Q.vertexUv3s?"#define USE_UV3":"",Q.pointsUvs?"#define USE_POINTS_UV":"",Q.gradientMap?"#define USE_GRADIENTMAP":"",Q.flatShading?"#define FLAT_SHADED":"",Q.doubleSided?"#define DOUBLE_SIDED":"",Q.flipSided?"#define FLIP_SIDED":"",Q.shadowMapEnabled?"#define USE_SHADOWMAP":"",Q.shadowMapEnabled?"#define "+K:"",Q.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",Q.numLightProbes>0?"#define USE_LIGHT_PROBES":"",Q.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",Q.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",Q.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",Q.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",Q.toneMapping!==0?"#define TONE_MAPPING":"",Q.toneMapping!==0?hJ.tonemapping_pars_fragment:"",Q.toneMapping!==0?MH("toneMapping",Q.toneMapping):"",Q.dithering?"#define DITHERING":"",Q.opaque?"#define OPAQUE":"",hJ.colorspace_pars_fragment,BH("linearToOutputTexel",Q.outputColorSpace),kH(),Q.useDepthPacking?"#define DEPTH_PACKING "+Q.depthPacking:"",`
`].filter(P7).join(`
`);if(X=V9(X),X=o$(X,Q),X=i$(X,Q),H=V9(H),H=o$(H,Q),H=i$(H,Q),X=a$(X),H=a$(H),Q.isRawShaderMaterial!==!0)D=`#version 300 es
`,V=[O,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+V,E=["#define varying in",Q.glslVersion==="300 es"?"":"layout(location = 0) out highp vec4 pc_fragColor;",Q.glslVersion==="300 es"?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+E;let M=D+V+X,_=D+E+H,x=c$(W,W.VERTEX_SHADER,M),C=c$(W,W.FRAGMENT_SHADER,_);if(W.attachShader(R,x),W.attachShader(R,C),Q.index0AttributeName!==void 0)W.bindAttribLocation(R,0,Q.index0AttributeName);else if(Q.morphTargets===!0)W.bindAttribLocation(R,0,"position");W.linkProgram(R);function P(y){if(J.debug.checkShaderErrors){let b=W.getProgramInfoLog(R).trim(),d=W.getShaderInfoLog(x).trim(),m=W.getShaderInfoLog(C).trim(),a=!0,l=!0;if(W.getProgramParameter(R,W.LINK_STATUS)===!1)if(a=!1,typeof J.debug.onShaderError==="function")J.debug.onShaderError(W,R,x,C);else{let r=s$(W,x,"vertex"),g=s$(W,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+W.getError()+" - VALIDATE_STATUS "+W.getProgramParameter(R,W.VALIDATE_STATUS)+`

Material Name: `+y.name+`
Material Type: `+y.type+`

Program Info Log: `+b+`
`+r+`
`+g)}else if(b!=="")console.warn("THREE.WebGLProgram: Program Info Log:",b);else if(d===""||m==="")l=!1;if(l)y.diagnostics={runnable:a,programLog:b,vertexShader:{log:d,prefix:V},fragmentShader:{log:m,prefix:E}}}W.deleteShader(x),W.deleteShader(C),p=new I7(W,R),k=wH(W,R)}let p;this.getUniforms=function(){if(p===void 0)P(this);return p};let k;this.getAttributes=function(){if(k===void 0)P(this);return k};let L=Q.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){if(L===!1)L=W.getProgramParameter(R,OH);return L},this.destroy=function(){Z.releaseStatesOfProgram(this),W.deleteProgram(R),this.program=void 0},this.type=Q.shaderType,this.name=Q.shaderName,this.id=RH++,this.cacheKey=$,this.usedTimes=1,this.program=R,this.vertexShader=x,this.fragmentShader=C,this}var fH=0;class o5{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(J){let{vertexShader:$,fragmentShader:Q}=J,Z=this._getShaderStage($),W=this._getShaderStage(Q),Y=this._getShaderCacheForMaterial(J);if(Y.has(Z)===!1)Y.add(Z),Z.usedTimes++;if(Y.has(W)===!1)Y.add(W),W.usedTimes++;return this}remove(J){let $=this.materialCache.get(J);for(let Q of $)if(Q.usedTimes--,Q.usedTimes===0)this.shaderCache.delete(Q.code);return this.materialCache.delete(J),this}getVertexShaderID(J){return this._getShaderStage(J.vertexShader).id}getFragmentShaderID(J){return this._getShaderStage(J.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(J){let $=this.materialCache,Q=$.get(J);if(Q===void 0)Q=new Set,$.set(J,Q);return Q}_getShaderStage(J){let $=this.shaderCache,Q=$.get(J);if(Q===void 0)Q=new i5(J),$.set(J,Q);return Q}}class i5{constructor(J){this.id=fH++,this.code=J,this.usedTimes=0}}function xH(J,$,Q,Z,W,Y,X){let H=new k8,K=new o5,q=new Set,G=[],U=W.logarithmicDepthBuffer,F=W.vertexTextures,O=W.precision,z={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function R(k){if(q.add(k),k===0)return"uv";return`uv${k}`}function V(k,L,y,b,d){let m=b.fog,a=d.geometry,l=k.isMeshStandardMaterial?b.environment:null,r=(k.isMeshStandardMaterial?Q:$).get(k.envMap||l),g=!!r&&r.mapping===306?r.image.height:null,HJ=z[k.type];if(k.precision!==null){if(O=W.getMaxPrecision(k.precision),O!==k.precision)console.warn("THREE.WebGLProgram.getParameters:",k.precision,"not supported, using",O,"instead.")}let qJ=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,PJ=qJ!==void 0?qJ.length:0,gJ=0;if(a.morphAttributes.position!==void 0)gJ=1;if(a.morphAttributes.normal!==void 0)gJ=2;if(a.morphAttributes.color!==void 0)gJ=3;let n,e,zJ,BJ;if(HJ){let cJ=r0[HJ];n=cJ.vertexShader,e=cJ.fragmentShader}else n=k.vertexShader,e=k.fragmentShader,K.update(k),zJ=K.getVertexShaderID(k),BJ=K.getFragmentShaderID(k);let ZJ=J.getRenderTarget(),wJ=J.state.buffers.depth.getReversed(),aJ=d.isInstancedMesh===!0,lJ=d.isBatchedMesh===!0,uJ=!!k.map,E0=!!k.matcap,j=!!r,O0=!!k.aoMap,rJ=!!k.lightMap,tJ=!!k.bumpMap,VJ=!!k.normalMap,Y0=!!k.displacementMap,MJ=!!k.emissiveMap,TJ=!!k.metalnessMap,w=!!k.roughnessMap,N=k.anisotropy>0,v=k.clearcoat>0,o=k.dispersion>0,i=k.iridescence>0,u=k.sheen>0,kJ=k.transmission>0,WJ=N&&!!k.anisotropyMap,UJ=v&&!!k.clearcoatMap,IJ=v&&!!k.clearcoatNormalMap,JJ=v&&!!k.clearcoatRoughnessMap,GJ=i&&!!k.iridescenceMap,xJ=i&&!!k.iridescenceThicknessMap,CJ=u&&!!k.sheenColorMap,FJ=u&&!!k.sheenRoughnessMap,SJ=!!k.specularMap,fJ=!!k.specularColorMap,W0=!!k.specularIntensityMap,T=kJ&&!!k.transmissionMap,t=kJ&&!!k.thicknessMap,c=!!k.gradientMap,s=!!k.alphaMap,KJ=k.alphaTest>0,YJ=!!k.alphaHash,vJ=!!k.extensions,X0=0;if(k.toneMapped){if(ZJ===null||ZJ.isXRRenderTarget===!0)X0=J.toneMapping}let R0={shaderID:HJ,shaderType:k.type,shaderName:k.name,vertexShader:n,fragmentShader:e,defines:k.defines,customVertexShaderID:zJ,customFragmentShaderID:BJ,isRawShaderMaterial:k.isRawShaderMaterial===!0,glslVersion:k.glslVersion,precision:O,batching:lJ,batchingColor:lJ&&d._colorsTexture!==null,instancing:aJ,instancingColor:aJ&&d.instanceColor!==null,instancingMorph:aJ&&d.morphTexture!==null,supportsVertexTextures:F,outputColorSpace:ZJ===null?J.outputColorSpace:ZJ.isXRRenderTarget===!0?ZJ.texture.colorSpace:"srgb-linear",alphaToCoverage:!!k.alphaToCoverage,map:uJ,matcap:E0,envMap:j,envMapMode:j&&r.mapping,envMapCubeUVHeight:g,aoMap:O0,lightMap:rJ,bumpMap:tJ,normalMap:VJ,displacementMap:F&&Y0,emissiveMap:MJ,normalMapObjectSpace:VJ&&k.normalMapType===1,normalMapTangentSpace:VJ&&k.normalMapType===0,metalnessMap:TJ,roughnessMap:w,anisotropy:N,anisotropyMap:WJ,clearcoat:v,clearcoatMap:UJ,clearcoatNormalMap:IJ,clearcoatRoughnessMap:JJ,dispersion:o,iridescence:i,iridescenceMap:GJ,iridescenceThicknessMap:xJ,sheen:u,sheenColorMap:CJ,sheenRoughnessMap:FJ,specularMap:SJ,specularColorMap:fJ,specularIntensityMap:W0,transmission:kJ,transmissionMap:T,thicknessMap:t,gradientMap:c,opaque:k.transparent===!1&&k.blending===1&&k.alphaToCoverage===!1,alphaMap:s,alphaTest:KJ,alphaHash:YJ,combine:k.combine,mapUv:uJ&&R(k.map.channel),aoMapUv:O0&&R(k.aoMap.channel),lightMapUv:rJ&&R(k.lightMap.channel),bumpMapUv:tJ&&R(k.bumpMap.channel),normalMapUv:VJ&&R(k.normalMap.channel),displacementMapUv:Y0&&R(k.displacementMap.channel),emissiveMapUv:MJ&&R(k.emissiveMap.channel),metalnessMapUv:TJ&&R(k.metalnessMap.channel),roughnessMapUv:w&&R(k.roughnessMap.channel),anisotropyMapUv:WJ&&R(k.anisotropyMap.channel),clearcoatMapUv:UJ&&R(k.clearcoatMap.channel),clearcoatNormalMapUv:IJ&&R(k.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:JJ&&R(k.clearcoatRoughnessMap.channel),iridescenceMapUv:GJ&&R(k.iridescenceMap.channel),iridescenceThicknessMapUv:xJ&&R(k.iridescenceThicknessMap.channel),sheenColorMapUv:CJ&&R(k.sheenColorMap.channel),sheenRoughnessMapUv:FJ&&R(k.sheenRoughnessMap.channel),specularMapUv:SJ&&R(k.specularMap.channel),specularColorMapUv:fJ&&R(k.specularColorMap.channel),specularIntensityMapUv:W0&&R(k.specularIntensityMap.channel),transmissionMapUv:T&&R(k.transmissionMap.channel),thicknessMapUv:t&&R(k.thicknessMap.channel),alphaMapUv:s&&R(k.alphaMap.channel),vertexTangents:!!a.attributes.tangent&&(VJ||N),vertexColors:k.vertexColors,vertexAlphas:k.vertexColors===!0&&!!a.attributes.color&&a.attributes.color.itemSize===4,pointsUvs:d.isPoints===!0&&!!a.attributes.uv&&(uJ||s),fog:!!m,useFog:k.fog===!0,fogExp2:!!m&&m.isFogExp2,flatShading:k.flatShading===!0,sizeAttenuation:k.sizeAttenuation===!0,logarithmicDepthBuffer:U,reverseDepthBuffer:wJ,skinning:d.isSkinnedMesh===!0,morphTargets:a.morphAttributes.position!==void 0,morphNormals:a.morphAttributes.normal!==void 0,morphColors:a.morphAttributes.color!==void 0,morphTargetsCount:PJ,morphTextureStride:gJ,numDirLights:L.directional.length,numPointLights:L.point.length,numSpotLights:L.spot.length,numSpotLightMaps:L.spotLightMap.length,numRectAreaLights:L.rectArea.length,numHemiLights:L.hemi.length,numDirLightShadows:L.directionalShadowMap.length,numPointLightShadows:L.pointShadowMap.length,numSpotLightShadows:L.spotShadowMap.length,numSpotLightShadowsWithMaps:L.numSpotLightShadowsWithMaps,numLightProbes:L.numLightProbes,numClippingPlanes:X.numPlanes,numClipIntersection:X.numIntersection,dithering:k.dithering,shadowMapEnabled:J.shadowMap.enabled&&y.length>0,shadowMapType:J.shadowMap.type,toneMapping:X0,decodeVideoTexture:uJ&&k.map.isVideoTexture===!0&&pJ.getTransfer(k.map.colorSpace)==="srgb",decodeVideoTextureEmissive:MJ&&k.emissiveMap.isVideoTexture===!0&&pJ.getTransfer(k.emissiveMap.colorSpace)==="srgb",premultipliedAlpha:k.premultipliedAlpha,doubleSided:k.side===2,flipSided:k.side===1,useDepthPacking:k.depthPacking>=0,depthPacking:k.depthPacking||0,index0AttributeName:k.index0AttributeName,extensionClipCullDistance:vJ&&k.extensions.clipCullDistance===!0&&Z.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vJ&&k.extensions.multiDraw===!0||lJ)&&Z.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:Z.has("KHR_parallel_shader_compile"),customProgramCacheKey:k.customProgramCacheKey()};return R0.vertexUv1s=q.has(1),R0.vertexUv2s=q.has(2),R0.vertexUv3s=q.has(3),q.clear(),R0}function E(k){let L=[];if(k.shaderID)L.push(k.shaderID);else L.push(k.customVertexShaderID),L.push(k.customFragmentShaderID);if(k.defines!==void 0)for(let y in k.defines)L.push(y),L.push(k.defines[y]);if(k.isRawShaderMaterial===!1)D(L,k),M(L,k),L.push(J.outputColorSpace);return L.push(k.customProgramCacheKey),L.join()}function D(k,L){k.push(L.precision),k.push(L.outputColorSpace),k.push(L.envMapMode),k.push(L.envMapCubeUVHeight),k.push(L.mapUv),k.push(L.alphaMapUv),k.push(L.lightMapUv),k.push(L.aoMapUv),k.push(L.bumpMapUv),k.push(L.normalMapUv),k.push(L.displacementMapUv),k.push(L.emissiveMapUv),k.push(L.metalnessMapUv),k.push(L.roughnessMapUv),k.push(L.anisotropyMapUv),k.push(L.clearcoatMapUv),k.push(L.clearcoatNormalMapUv),k.push(L.clearcoatRoughnessMapUv),k.push(L.iridescenceMapUv),k.push(L.iridescenceThicknessMapUv),k.push(L.sheenColorMapUv),k.push(L.sheenRoughnessMapUv),k.push(L.specularMapUv),k.push(L.specularColorMapUv),k.push(L.specularIntensityMapUv),k.push(L.transmissionMapUv),k.push(L.thicknessMapUv),k.push(L.combine),k.push(L.fogExp2),k.push(L.sizeAttenuation),k.push(L.morphTargetsCount),k.push(L.morphAttributeCount),k.push(L.numDirLights),k.push(L.numPointLights),k.push(L.numSpotLights),k.push(L.numSpotLightMaps),k.push(L.numHemiLights),k.push(L.numRectAreaLights),k.push(L.numDirLightShadows),k.push(L.numPointLightShadows),k.push(L.numSpotLightShadows),k.push(L.numSpotLightShadowsWithMaps),k.push(L.numLightProbes),k.push(L.shadowMapType),k.push(L.toneMapping),k.push(L.numClippingPlanes),k.push(L.numClipIntersection),k.push(L.depthPacking)}function M(k,L){if(H.disableAll(),L.supportsVertexTextures)H.enable(0);if(L.instancing)H.enable(1);if(L.instancingColor)H.enable(2);if(L.instancingMorph)H.enable(3);if(L.matcap)H.enable(4);if(L.envMap)H.enable(5);if(L.normalMapObjectSpace)H.enable(6);if(L.normalMapTangentSpace)H.enable(7);if(L.clearcoat)H.enable(8);if(L.iridescence)H.enable(9);if(L.alphaTest)H.enable(10);if(L.vertexColors)H.enable(11);if(L.vertexAlphas)H.enable(12);if(L.vertexUv1s)H.enable(13);if(L.vertexUv2s)H.enable(14);if(L.vertexUv3s)H.enable(15);if(L.vertexTangents)H.enable(16);if(L.anisotropy)H.enable(17);if(L.alphaHash)H.enable(18);if(L.batching)H.enable(19);if(L.dispersion)H.enable(20);if(L.batchingColor)H.enable(21);if(k.push(H.mask),H.disableAll(),L.fog)H.enable(0);if(L.useFog)H.enable(1);if(L.flatShading)H.enable(2);if(L.logarithmicDepthBuffer)H.enable(3);if(L.reverseDepthBuffer)H.enable(4);if(L.skinning)H.enable(5);if(L.morphTargets)H.enable(6);if(L.morphNormals)H.enable(7);if(L.morphColors)H.enable(8);if(L.premultipliedAlpha)H.enable(9);if(L.shadowMapEnabled)H.enable(10);if(L.doubleSided)H.enable(11);if(L.flipSided)H.enable(12);if(L.useDepthPacking)H.enable(13);if(L.dithering)H.enable(14);if(L.transmission)H.enable(15);if(L.sheen)H.enable(16);if(L.opaque)H.enable(17);if(L.pointsUvs)H.enable(18);if(L.decodeVideoTexture)H.enable(19);if(L.decodeVideoTextureEmissive)H.enable(20);if(L.alphaToCoverage)H.enable(21);k.push(H.mask)}function _(k){let L=z[k.type],y;if(L){let b=r0[L];y=PZ.clone(b.uniforms)}else y=k.uniforms;return y}function x(k,L){let y;for(let b=0,d=G.length;b<d;b++){let m=G[b];if(m.cacheKey===L){y=m,++y.usedTimes;break}}if(y===void 0)y=new hH(J,L,k,Y),G.push(y);return y}function C(k){if(--k.usedTimes===0){let L=G.indexOf(k);G[L]=G[G.length-1],G.pop(),k.destroy()}}function P(k){K.remove(k)}function p(){K.dispose()}return{getParameters:V,getProgramCacheKey:E,getUniforms:_,acquireProgram:x,releaseProgram:C,releaseShaderCache:P,programs:G,dispose:p}}function bH(){let J=new WeakMap;function $(X){return J.has(X)}function Q(X){let H=J.get(X);if(H===void 0)H={},J.set(X,H);return H}function Z(X){J.delete(X)}function W(X,H,K){J.get(X)[H]=K}function Y(){J=new WeakMap}return{has:$,get:Q,remove:Z,update:W,dispose:Y}}function gH(J,$){if(J.groupOrder!==$.groupOrder)return J.groupOrder-$.groupOrder;else if(J.renderOrder!==$.renderOrder)return J.renderOrder-$.renderOrder;else if(J.material.id!==$.material.id)return J.material.id-$.material.id;else if(J.z!==$.z)return J.z-$.z;else return J.id-$.id}function t$(J,$){if(J.groupOrder!==$.groupOrder)return J.groupOrder-$.groupOrder;else if(J.renderOrder!==$.renderOrder)return J.renderOrder-$.renderOrder;else if(J.z!==$.z)return $.z-J.z;else return J.id-$.id}function e$(){let J=[],$=0,Q=[],Z=[],W=[];function Y(){$=0,Q.length=0,Z.length=0,W.length=0}function X(U,F,O,z,R,V){let E=J[$];if(E===void 0)E={id:U.id,object:U,geometry:F,material:O,groupOrder:z,renderOrder:U.renderOrder,z:R,group:V},J[$]=E;else E.id=U.id,E.object=U,E.geometry=F,E.material=O,E.groupOrder=z,E.renderOrder=U.renderOrder,E.z=R,E.group=V;return $++,E}function H(U,F,O,z,R,V){let E=X(U,F,O,z,R,V);if(O.transmission>0)Z.push(E);else if(O.transparent===!0)W.push(E);else Q.push(E)}function K(U,F,O,z,R,V){let E=X(U,F,O,z,R,V);if(O.transmission>0)Z.unshift(E);else if(O.transparent===!0)W.unshift(E);else Q.unshift(E)}function q(U,F){if(Q.length>1)Q.sort(U||gH);if(Z.length>1)Z.sort(F||t$);if(W.length>1)W.sort(F||t$)}function G(){for(let U=$,F=J.length;U<F;U++){let O=J[U];if(O.id===null)break;O.id=null,O.object=null,O.geometry=null,O.material=null,O.group=null}}return{opaque:Q,transmissive:Z,transparent:W,init:Y,push:H,unshift:K,finish:G,sort:q}}function pH(){let J=new WeakMap;function $(Z,W){let Y=J.get(Z),X;if(Y===void 0)X=new e$,J.set(Z,[X]);else if(W>=Y.length)X=new e$,Y.push(X);else X=Y[W];return X}function Q(){J=new WeakMap}return{get:$,dispose:Q}}function lH(){let J={};return{get:function($){if(J[$.id]!==void 0)return J[$.id];let Q;switch($.type){case"DirectionalLight":Q={direction:new A,color:new DJ};break;case"SpotLight":Q={position:new A,direction:new A,color:new DJ,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":Q={position:new A,color:new DJ,distance:0,decay:0};break;case"HemisphereLight":Q={direction:new A,skyColor:new DJ,groundColor:new DJ};break;case"RectAreaLight":Q={color:new DJ,position:new A,halfWidth:new A,halfHeight:new A};break}return J[$.id]=Q,Q}}}function uH(){let J={};return{get:function($){if(J[$.id]!==void 0)return J[$.id];let Q;switch($.type){case"DirectionalLight":Q={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new LJ};break;case"SpotLight":Q={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new LJ};break;case"PointLight":Q={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new LJ,shadowCameraNear:1,shadowCameraFar:1000};break}return J[$.id]=Q,Q}}}var mH=0;function dH(J,$){return($.castShadow?2:0)-(J.castShadow?2:0)+($.map?1:0)-(J.map?1:0)}function cH(J){let $=new lH,Q=uH(),Z={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let q=0;q<9;q++)Z.probe.push(new A);let W=new A,Y=new _J,X=new _J;function H(q){let G=0,U=0,F=0;for(let k=0;k<9;k++)Z.probe[k].set(0,0,0);let O=0,z=0,R=0,V=0,E=0,D=0,M=0,_=0,x=0,C=0,P=0;q.sort(dH);for(let k=0,L=q.length;k<L;k++){let y=q[k],b=y.color,d=y.intensity,m=y.distance,a=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)G+=b.r*d,U+=b.g*d,F+=b.b*d;else if(y.isLightProbe){for(let l=0;l<9;l++)Z.probe[l].addScaledVector(y.sh.coefficients[l],d);P++}else if(y.isDirectionalLight){let l=$.get(y);if(l.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let r=y.shadow,g=Q.get(y);g.shadowIntensity=r.intensity,g.shadowBias=r.bias,g.shadowNormalBias=r.normalBias,g.shadowRadius=r.radius,g.shadowMapSize=r.mapSize,Z.directionalShadow[O]=g,Z.directionalShadowMap[O]=a,Z.directionalShadowMatrix[O]=y.shadow.matrix,D++}Z.directional[O]=l,O++}else if(y.isSpotLight){let l=$.get(y);l.position.setFromMatrixPosition(y.matrixWorld),l.color.copy(b).multiplyScalar(d),l.distance=m,l.coneCos=Math.cos(y.angle),l.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),l.decay=y.decay,Z.spot[R]=l;let r=y.shadow;if(y.map){if(Z.spotLightMap[x]=y.map,x++,r.updateMatrices(y),y.castShadow)C++}if(Z.spotLightMatrix[R]=r.matrix,y.castShadow){let g=Q.get(y);g.shadowIntensity=r.intensity,g.shadowBias=r.bias,g.shadowNormalBias=r.normalBias,g.shadowRadius=r.radius,g.shadowMapSize=r.mapSize,Z.spotShadow[R]=g,Z.spotShadowMap[R]=a,_++}R++}else if(y.isRectAreaLight){let l=$.get(y);l.color.copy(b).multiplyScalar(d),l.halfWidth.set(y.width*0.5,0,0),l.halfHeight.set(0,y.height*0.5,0),Z.rectArea[V]=l,V++}else if(y.isPointLight){let l=$.get(y);if(l.color.copy(y.color).multiplyScalar(y.intensity),l.distance=y.distance,l.decay=y.decay,y.castShadow){let r=y.shadow,g=Q.get(y);g.shadowIntensity=r.intensity,g.shadowBias=r.bias,g.shadowNormalBias=r.normalBias,g.shadowRadius=r.radius,g.shadowMapSize=r.mapSize,g.shadowCameraNear=r.camera.near,g.shadowCameraFar=r.camera.far,Z.pointShadow[z]=g,Z.pointShadowMap[z]=a,Z.pointShadowMatrix[z]=y.shadow.matrix,M++}Z.point[z]=l,z++}else if(y.isHemisphereLight){let l=$.get(y);l.skyColor.copy(y.color).multiplyScalar(d),l.groundColor.copy(y.groundColor).multiplyScalar(d),Z.hemi[E]=l,E++}}if(V>0)if(J.has("OES_texture_float_linear")===!0)Z.rectAreaLTC1=QJ.LTC_FLOAT_1,Z.rectAreaLTC2=QJ.LTC_FLOAT_2;else Z.rectAreaLTC1=QJ.LTC_HALF_1,Z.rectAreaLTC2=QJ.LTC_HALF_2;Z.ambient[0]=G,Z.ambient[1]=U,Z.ambient[2]=F;let p=Z.hash;if(p.directionalLength!==O||p.pointLength!==z||p.spotLength!==R||p.rectAreaLength!==V||p.hemiLength!==E||p.numDirectionalShadows!==D||p.numPointShadows!==M||p.numSpotShadows!==_||p.numSpotMaps!==x||p.numLightProbes!==P)Z.directional.length=O,Z.spot.length=R,Z.rectArea.length=V,Z.point.length=z,Z.hemi.length=E,Z.directionalShadow.length=D,Z.directionalShadowMap.length=D,Z.pointShadow.length=M,Z.pointShadowMap.length=M,Z.spotShadow.length=_,Z.spotShadowMap.length=_,Z.directionalShadowMatrix.length=D,Z.pointShadowMatrix.length=M,Z.spotLightMatrix.length=_+x-C,Z.spotLightMap.length=x,Z.numSpotLightShadowsWithMaps=C,Z.numLightProbes=P,p.directionalLength=O,p.pointLength=z,p.spotLength=R,p.rectAreaLength=V,p.hemiLength=E,p.numDirectionalShadows=D,p.numPointShadows=M,p.numSpotShadows=_,p.numSpotMaps=x,p.numLightProbes=P,Z.version=mH++}function K(q,G){let U=0,F=0,O=0,z=0,R=0,V=G.matrixWorldInverse;for(let E=0,D=q.length;E<D;E++){let M=q[E];if(M.isDirectionalLight){let _=Z.directional[U];_.direction.setFromMatrixPosition(M.matrixWorld),W.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(W),_.direction.transformDirection(V),U++}else if(M.isSpotLight){let _=Z.spot[O];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(V),_.direction.setFromMatrixPosition(M.matrixWorld),W.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(W),_.direction.transformDirection(V),O++}else if(M.isRectAreaLight){let _=Z.rectArea[z];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(V),X.identity(),Y.copy(M.matrixWorld),Y.premultiply(V),X.extractRotation(Y),_.halfWidth.set(M.width*0.5,0,0),_.halfHeight.set(0,M.height*0.5,0),_.halfWidth.applyMatrix4(X),_.halfHeight.applyMatrix4(X),z++}else if(M.isPointLight){let _=Z.point[F];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(V),F++}else if(M.isHemisphereLight){let _=Z.hemi[R];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(V),R++}}}return{setup:H,setupView:K,state:Z}}function J5(J){let $=new cH(J),Q=[],Z=[];function W(G){q.camera=G,Q.length=0,Z.length=0}function Y(G){Q.push(G)}function X(G){Z.push(G)}function H(){$.setup(Q)}function K(G){$.setupView(Q,G)}let q={lightsArray:Q,shadowsArray:Z,camera:null,lights:$,transmissionRenderTarget:{}};return{init:W,state:q,setupLights:H,setupLightsView:K,pushLight:Y,pushShadow:X}}function nH(J){let $=new WeakMap;function Q(W,Y=0){let X=$.get(W),H;if(X===void 0)H=new J5(J),$.set(W,[H]);else if(Y>=X.length)H=new J5(J),X.push(H);else H=X[Y];return H}function Z(){$=new WeakMap}return{get:Q,dispose:Z}}class a5 extends v0{static get type(){return"MeshDepthMaterial"}constructor(J){super();this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(J)}copy(J){return super.copy(J),this.depthPacking=J.depthPacking,this.map=J.map,this.alphaMap=J.alphaMap,this.displacementMap=J.displacementMap,this.displacementScale=J.displacementScale,this.displacementBias=J.displacementBias,this.wireframe=J.wireframe,this.wireframeLinewidth=J.wireframeLinewidth,this}}class r5 extends v0{static get type(){return"MeshDistanceMaterial"}constructor(J){super();this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(J)}copy(J){return super.copy(J),this.map=J.map,this.alphaMap=J.alphaMap,this.displacementMap=J.displacementMap,this.displacementScale=J.displacementScale,this.displacementBias=J.displacementBias,this}}var sH=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oH=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function iH(J,$,Q){let Z=new L8,W=new LJ,Y=new LJ,X=new dJ,H=new a5({depthPacking:3201}),K=new r5,q={},G=Q.maxTextureSize,U={[0]:1,[1]:0,[2]:2},F=new q6({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new LJ},radius:{value:4}},vertexShader:sH,fragmentShader:oH}),O=F.clone();O.defines.HORIZONTAL_PASS=1;let z=new h0;z.setAttribute("position",new V0(new Float32Array([-1,-1,0.5,3,-1,0.5,-1,3,0.5]),3));let R=new D0(z,F),V=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let E=this.type;this.render=function(C,P,p){if(V.enabled===!1)return;if(V.autoUpdate===!1&&V.needsUpdate===!1)return;if(C.length===0)return;let k=J.getRenderTarget(),L=J.getActiveCubeFace(),y=J.getActiveMipmapLevel(),b=J.state;b.setBlending(0),b.buffers.color.setClear(1,1,1,1),b.buffers.depth.setTest(!0),b.setScissorTest(!1);let d=E!==3&&this.type===3,m=E===3&&this.type!==3;for(let a=0,l=C.length;a<l;a++){let r=C[a],g=r.shadow;if(g===void 0){console.warn("THREE.WebGLShadowMap:",r,"has no shadow.");continue}if(g.autoUpdate===!1&&g.needsUpdate===!1)continue;W.copy(g.mapSize);let HJ=g.getFrameExtents();if(W.multiply(HJ),Y.copy(g.mapSize),W.x>G||W.y>G){if(W.x>G)Y.x=Math.floor(G/HJ.x),W.x=Y.x*HJ.x,g.mapSize.x=Y.x;if(W.y>G)Y.y=Math.floor(G/HJ.y),W.y=Y.y*HJ.y,g.mapSize.y=Y.y}if(g.map===null||d===!0||m===!0){let PJ=this.type!==3?{minFilter:1003,magFilter:1003}:{};if(g.map!==null)g.map.dispose();g.map=new k6(W.x,W.y,PJ),g.map.texture.name=r.name+".shadowMap",g.camera.updateProjectionMatrix()}J.setRenderTarget(g.map),J.clear();let qJ=g.getViewportCount();for(let PJ=0;PJ<qJ;PJ++){let gJ=g.getViewport(PJ);X.set(Y.x*gJ.x,Y.y*gJ.y,Y.x*gJ.z,Y.y*gJ.w),b.viewport(X),g.updateMatrices(r,PJ),Z=g.getFrustum(),_(P,p,g.camera,r,this.type)}if(g.isPointLightShadow!==!0&&this.type===3)D(g,p);g.needsUpdate=!1}E=this.type,V.needsUpdate=!1,J.setRenderTarget(k,L,y)};function D(C,P){let p=$.update(R);if(F.defines.VSM_SAMPLES!==C.blurSamples)F.defines.VSM_SAMPLES=C.blurSamples,O.defines.VSM_SAMPLES=C.blurSamples,F.needsUpdate=!0,O.needsUpdate=!0;if(C.mapPass===null)C.mapPass=new k6(W.x,W.y);F.uniforms.shadow_pass.value=C.map.texture,F.uniforms.resolution.value=C.mapSize,F.uniforms.radius.value=C.radius,J.setRenderTarget(C.mapPass),J.clear(),J.renderBufferDirect(P,null,p,F,R,null),O.uniforms.shadow_pass.value=C.mapPass.texture,O.uniforms.resolution.value=C.mapSize,O.uniforms.radius.value=C.radius,J.setRenderTarget(C.map),J.clear(),J.renderBufferDirect(P,null,p,O,R,null)}function M(C,P,p,k){let L=null,y=p.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(y!==void 0)L=y;else if(L=p.isPointLight===!0?K:H,J.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){let b=L.uuid,d=P.uuid,m=q[b];if(m===void 0)m={},q[b]=m;let a=m[d];if(a===void 0)a=L.clone(),m[d]=a,P.addEventListener("dispose",x);L=a}if(L.visible=P.visible,L.wireframe=P.wireframe,k===3)L.side=P.shadowSide!==null?P.shadowSide:P.side;else L.side=P.shadowSide!==null?P.shadowSide:U[P.side];if(L.alphaMap=P.alphaMap,L.alphaTest=P.alphaTest,L.map=P.map,L.clipShadows=P.clipShadows,L.clippingPlanes=P.clippingPlanes,L.clipIntersection=P.clipIntersection,L.displacementMap=P.displacementMap,L.displacementScale=P.displacementScale,L.displacementBias=P.displacementBias,L.wireframeLinewidth=P.wireframeLinewidth,L.linewidth=P.linewidth,p.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let b=J.properties.get(L);b.light=p}return L}function _(C,P,p,k,L){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)){if((C.castShadow||C.receiveShadow&&L===3)&&(!C.frustumCulled||Z.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(p.matrixWorldInverse,C.matrixWorld);let d=$.update(C),m=C.material;if(Array.isArray(m)){let a=d.groups;for(let l=0,r=a.length;l<r;l++){let g=a[l],HJ=m[g.materialIndex];if(HJ&&HJ.visible){let qJ=M(C,HJ,k,L);C.onBeforeShadow(J,C,P,p,d,qJ,g),J.renderBufferDirect(p,null,d,qJ,C,g),C.onAfterShadow(J,C,P,p,d,qJ,g)}}}else if(m.visible){let a=M(C,m,k,L);C.onBeforeShadow(J,C,P,p,d,a,null),J.renderBufferDirect(p,null,d,a,C,null),C.onAfterShadow(J,C,P,p,d,a,null)}}}let b=C.children;for(let d=0,m=b.length;d<m;d++)_(b[d],P,p,k,L)}function x(C){C.target.removeEventListener("dispose",x);for(let p in q){let k=q[p],L=C.target.uuid;if(L in k)k[L].dispose(),delete k[L]}}}var aH={[0]:1,[2]:6,[4]:7,[3]:5,[1]:0,[6]:2,[7]:4,[5]:3};function rH(J,$){function Q(){let T=!1,t=new dJ,c=null,s=new dJ(0,0,0,0);return{setMask:function(KJ){if(c!==KJ&&!T)J.colorMask(KJ,KJ,KJ,KJ),c=KJ},setLocked:function(KJ){T=KJ},setClear:function(KJ,YJ,vJ,X0,R0){if(R0===!0)KJ*=X0,YJ*=X0,vJ*=X0;if(t.set(KJ,YJ,vJ,X0),s.equals(t)===!1)J.clearColor(KJ,YJ,vJ,X0),s.copy(t)},reset:function(){T=!1,c=null,s.set(-1,0,0,0)}}}function Z(){let T=!1,t=!1,c=null,s=null,KJ=null;return{setReversed:function(YJ){if(t!==YJ){let vJ=$.get("EXT_clip_control");if(t)vJ.clipControlEXT(vJ.LOWER_LEFT_EXT,vJ.ZERO_TO_ONE_EXT);else vJ.clipControlEXT(vJ.LOWER_LEFT_EXT,vJ.NEGATIVE_ONE_TO_ONE_EXT);let X0=KJ;KJ=null,this.setClear(X0)}t=YJ},getReversed:function(){return t},setTest:function(YJ){if(YJ)ZJ(J.DEPTH_TEST);else wJ(J.DEPTH_TEST)},setMask:function(YJ){if(c!==YJ&&!T)J.depthMask(YJ),c=YJ},setFunc:function(YJ){if(t)YJ=aH[YJ];if(s!==YJ){switch(YJ){case 0:J.depthFunc(J.NEVER);break;case 1:J.depthFunc(J.ALWAYS);break;case 2:J.depthFunc(J.LESS);break;case 3:J.depthFunc(J.LEQUAL);break;case 4:J.depthFunc(J.EQUAL);break;case 5:J.depthFunc(J.GEQUAL);break;case 6:J.depthFunc(J.GREATER);break;case 7:J.depthFunc(J.NOTEQUAL);break;default:J.depthFunc(J.LEQUAL)}s=YJ}},setLocked:function(YJ){T=YJ},setClear:function(YJ){if(KJ!==YJ){if(t)YJ=1-YJ;J.clearDepth(YJ),KJ=YJ}},reset:function(){T=!1,c=null,s=null,KJ=null,t=!1}}}function W(){let T=!1,t=null,c=null,s=null,KJ=null,YJ=null,vJ=null,X0=null,R0=null;return{setTest:function(cJ){if(!T)if(cJ)ZJ(J.STENCIL_TEST);else wJ(J.STENCIL_TEST)},setMask:function(cJ){if(t!==cJ&&!T)J.stencilMask(cJ),t=cJ},setFunc:function(cJ,J6,o0){if(c!==cJ||s!==J6||KJ!==o0)J.stencilFunc(cJ,J6,o0),c=cJ,s=J6,KJ=o0},setOp:function(cJ,J6,o0){if(YJ!==cJ||vJ!==J6||X0!==o0)J.stencilOp(cJ,J6,o0),YJ=cJ,vJ=J6,X0=o0},setLocked:function(cJ){T=cJ},setClear:function(cJ){if(R0!==cJ)J.clearStencil(cJ),R0=cJ},reset:function(){T=!1,t=null,c=null,s=null,KJ=null,YJ=null,vJ=null,X0=null,R0=null}}}let Y=new Q,X=new Z,H=new W,K=new WeakMap,q=new WeakMap,G={},U={},F=new WeakMap,O=[],z=null,R=!1,V=null,E=null,D=null,M=null,_=null,x=null,C=null,P=new DJ(0,0,0),p=0,k=!1,L=null,y=null,b=null,d=null,m=null,a=J.getParameter(J.MAX_COMBINED_TEXTURE_IMAGE_UNITS),l=!1,r=0,g=J.getParameter(J.VERSION);if(g.indexOf("WebGL")!==-1)r=parseFloat(/^WebGL (\d)/.exec(g)[1]),l=r>=1;else if(g.indexOf("OpenGL ES")!==-1)r=parseFloat(/^OpenGL ES (\d)/.exec(g)[1]),l=r>=2;let HJ=null,qJ={},PJ=J.getParameter(J.SCISSOR_BOX),gJ=J.getParameter(J.VIEWPORT),n=new dJ().fromArray(PJ),e=new dJ().fromArray(gJ);function zJ(T,t,c,s){let KJ=new Uint8Array(4),YJ=J.createTexture();J.bindTexture(T,YJ),J.texParameteri(T,J.TEXTURE_MIN_FILTER,J.NEAREST),J.texParameteri(T,J.TEXTURE_MAG_FILTER,J.NEAREST);for(let vJ=0;vJ<c;vJ++)if(T===J.TEXTURE_3D||T===J.TEXTURE_2D_ARRAY)J.texImage3D(t,0,J.RGBA,1,1,s,0,J.RGBA,J.UNSIGNED_BYTE,KJ);else J.texImage2D(t+vJ,0,J.RGBA,1,1,0,J.RGBA,J.UNSIGNED_BYTE,KJ);return YJ}let BJ={};BJ[J.TEXTURE_2D]=zJ(J.TEXTURE_2D,J.TEXTURE_2D,1),BJ[J.TEXTURE_CUBE_MAP]=zJ(J.TEXTURE_CUBE_MAP,J.TEXTURE_CUBE_MAP_POSITIVE_X,6),BJ[J.TEXTURE_2D_ARRAY]=zJ(J.TEXTURE_2D_ARRAY,J.TEXTURE_2D_ARRAY,1,1),BJ[J.TEXTURE_3D]=zJ(J.TEXTURE_3D,J.TEXTURE_3D,1,1),Y.setClear(0,0,0,1),X.setClear(1),H.setClear(0),ZJ(J.DEPTH_TEST),X.setFunc(3),tJ(!1),VJ(1),ZJ(J.CULL_FACE),O0(0);function ZJ(T){if(G[T]!==!0)J.enable(T),G[T]=!0}function wJ(T){if(G[T]!==!1)J.disable(T),G[T]=!1}function aJ(T,t){if(U[T]!==t){if(J.bindFramebuffer(T,t),U[T]=t,T===J.DRAW_FRAMEBUFFER)U[J.FRAMEBUFFER]=t;if(T===J.FRAMEBUFFER)U[J.DRAW_FRAMEBUFFER]=t;return!0}return!1}function lJ(T,t){let c=O,s=!1;if(T){if(c=F.get(t),c===void 0)c=[],F.set(t,c);let KJ=T.textures;if(c.length!==KJ.length||c[0]!==J.COLOR_ATTACHMENT0){for(let YJ=0,vJ=KJ.length;YJ<vJ;YJ++)c[YJ]=J.COLOR_ATTACHMENT0+YJ;c.length=KJ.length,s=!0}}else if(c[0]!==J.BACK)c[0]=J.BACK,s=!0;if(s)J.drawBuffers(c)}function uJ(T){if(z!==T)return J.useProgram(T),z=T,!0;return!1}let E0={[100]:J.FUNC_ADD,[101]:J.FUNC_SUBTRACT,[102]:J.FUNC_REVERSE_SUBTRACT};E0[103]=J.MIN,E0[104]=J.MAX;let j={[200]:J.ZERO,[201]:J.ONE,[202]:J.SRC_COLOR,[204]:J.SRC_ALPHA,[210]:J.SRC_ALPHA_SATURATE,[208]:J.DST_COLOR,[206]:J.DST_ALPHA,[203]:J.ONE_MINUS_SRC_COLOR,[205]:J.ONE_MINUS_SRC_ALPHA,[209]:J.ONE_MINUS_DST_COLOR,[207]:J.ONE_MINUS_DST_ALPHA,[211]:J.CONSTANT_COLOR,[212]:J.ONE_MINUS_CONSTANT_COLOR,[213]:J.CONSTANT_ALPHA,[214]:J.ONE_MINUS_CONSTANT_ALPHA};function O0(T,t,c,s,KJ,YJ,vJ,X0,R0,cJ){if(T===0){if(R===!0)wJ(J.BLEND),R=!1;return}if(R===!1)ZJ(J.BLEND),R=!0;if(T!==5){if(T!==V||cJ!==k){if(E!==100||_!==100)J.blendEquation(J.FUNC_ADD),E=100,_=100;if(cJ)switch(T){case 1:J.blendFuncSeparate(J.ONE,J.ONE_MINUS_SRC_ALPHA,J.ONE,J.ONE_MINUS_SRC_ALPHA);break;case 2:J.blendFunc(J.ONE,J.ONE);break;case 3:J.blendFuncSeparate(J.ZERO,J.ONE_MINUS_SRC_COLOR,J.ZERO,J.ONE);break;case 4:J.blendFuncSeparate(J.ZERO,J.SRC_COLOR,J.ZERO,J.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",T);break}else switch(T){case 1:J.blendFuncSeparate(J.SRC_ALPHA,J.ONE_MINUS_SRC_ALPHA,J.ONE,J.ONE_MINUS_SRC_ALPHA);break;case 2:J.blendFunc(J.SRC_ALPHA,J.ONE);break;case 3:J.blendFuncSeparate(J.ZERO,J.ONE_MINUS_SRC_COLOR,J.ZERO,J.ONE);break;case 4:J.blendFunc(J.ZERO,J.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",T);break}D=null,M=null,x=null,C=null,P.set(0,0,0),p=0,V=T,k=cJ}return}if(KJ=KJ||t,YJ=YJ||c,vJ=vJ||s,t!==E||KJ!==_)J.blendEquationSeparate(E0[t],E0[KJ]),E=t,_=KJ;if(c!==D||s!==M||YJ!==x||vJ!==C)J.blendFuncSeparate(j[c],j[s],j[YJ],j[vJ]),D=c,M=s,x=YJ,C=vJ;if(X0.equals(P)===!1||R0!==p)J.blendColor(X0.r,X0.g,X0.b,R0),P.copy(X0),p=R0;V=T,k=!1}function rJ(T,t){T.side===2?wJ(J.CULL_FACE):ZJ(J.CULL_FACE);let c=T.side===1;if(t)c=!c;tJ(c),T.blending===1&&T.transparent===!1?O0(0):O0(T.blending,T.blendEquation,T.blendSrc,T.blendDst,T.blendEquationAlpha,T.blendSrcAlpha,T.blendDstAlpha,T.blendColor,T.blendAlpha,T.premultipliedAlpha),X.setFunc(T.depthFunc),X.setTest(T.depthTest),X.setMask(T.depthWrite),Y.setMask(T.colorWrite);let s=T.stencilWrite;if(H.setTest(s),s)H.setMask(T.stencilWriteMask),H.setFunc(T.stencilFunc,T.stencilRef,T.stencilFuncMask),H.setOp(T.stencilFail,T.stencilZFail,T.stencilZPass);MJ(T.polygonOffset,T.polygonOffsetFactor,T.polygonOffsetUnits),T.alphaToCoverage===!0?ZJ(J.SAMPLE_ALPHA_TO_COVERAGE):wJ(J.SAMPLE_ALPHA_TO_COVERAGE)}function tJ(T){if(L!==T){if(T)J.frontFace(J.CW);else J.frontFace(J.CCW);L=T}}function VJ(T){if(T!==0){if(ZJ(J.CULL_FACE),T!==y)if(T===1)J.cullFace(J.BACK);else if(T===2)J.cullFace(J.FRONT);else J.cullFace(J.FRONT_AND_BACK)}else wJ(J.CULL_FACE);y=T}function Y0(T){if(T!==b){if(l)J.lineWidth(T);b=T}}function MJ(T,t,c){if(T){if(ZJ(J.POLYGON_OFFSET_FILL),d!==t||m!==c)J.polygonOffset(t,c),d=t,m=c}else wJ(J.POLYGON_OFFSET_FILL)}function TJ(T){if(T)ZJ(J.SCISSOR_TEST);else wJ(J.SCISSOR_TEST)}function w(T){if(T===void 0)T=J.TEXTURE0+a-1;if(HJ!==T)J.activeTexture(T),HJ=T}function N(T,t,c){if(c===void 0)if(HJ===null)c=J.TEXTURE0+a-1;else c=HJ;let s=qJ[c];if(s===void 0)s={type:void 0,texture:void 0},qJ[c]=s;if(s.type!==T||s.texture!==t){if(HJ!==c)J.activeTexture(c),HJ=c;J.bindTexture(T,t||BJ[T]),s.type=T,s.texture=t}}function v(){let T=qJ[HJ];if(T!==void 0&&T.type!==void 0)J.bindTexture(T.type,null),T.type=void 0,T.texture=void 0}function o(){try{J.compressedTexImage2D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function i(){try{J.compressedTexImage3D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function u(){try{J.texSubImage2D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function kJ(){try{J.texSubImage3D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function WJ(){try{J.compressedTexSubImage2D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function UJ(){try{J.compressedTexSubImage3D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function IJ(){try{J.texStorage2D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function JJ(){try{J.texStorage3D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function GJ(){try{J.texImage2D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function xJ(){try{J.texImage3D.apply(J,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function CJ(T){if(n.equals(T)===!1)J.scissor(T.x,T.y,T.z,T.w),n.copy(T)}function FJ(T){if(e.equals(T)===!1)J.viewport(T.x,T.y,T.z,T.w),e.copy(T)}function SJ(T,t){let c=q.get(t);if(c===void 0)c=new WeakMap,q.set(t,c);let s=c.get(T);if(s===void 0)s=J.getUniformBlockIndex(t,T.name),c.set(T,s)}function fJ(T,t){let s=q.get(t).get(T);if(K.get(t)!==s)J.uniformBlockBinding(t,s,T.__bindingPointIndex),K.set(t,s)}function W0(){J.disable(J.BLEND),J.disable(J.CULL_FACE),J.disable(J.DEPTH_TEST),J.disable(J.POLYGON_OFFSET_FILL),J.disable(J.SCISSOR_TEST),J.disable(J.STENCIL_TEST),J.disable(J.SAMPLE_ALPHA_TO_COVERAGE),J.blendEquation(J.FUNC_ADD),J.blendFunc(J.ONE,J.ZERO),J.blendFuncSeparate(J.ONE,J.ZERO,J.ONE,J.ZERO),J.blendColor(0,0,0,0),J.colorMask(!0,!0,!0,!0),J.clearColor(0,0,0,0),J.depthMask(!0),J.depthFunc(J.LESS),X.setReversed(!1),J.clearDepth(1),J.stencilMask(4294967295),J.stencilFunc(J.ALWAYS,0,4294967295),J.stencilOp(J.KEEP,J.KEEP,J.KEEP),J.clearStencil(0),J.cullFace(J.BACK),J.frontFace(J.CCW),J.polygonOffset(0,0),J.activeTexture(J.TEXTURE0),J.bindFramebuffer(J.FRAMEBUFFER,null),J.bindFramebuffer(J.DRAW_FRAMEBUFFER,null),J.bindFramebuffer(J.READ_FRAMEBUFFER,null),J.useProgram(null),J.lineWidth(1),J.scissor(0,0,J.canvas.width,J.canvas.height),J.viewport(0,0,J.canvas.width,J.canvas.height),G={},HJ=null,qJ={},U={},F=new WeakMap,O=[],z=null,R=!1,V=null,E=null,D=null,M=null,_=null,x=null,C=null,P=new DJ(0,0,0),p=0,k=!1,L=null,y=null,b=null,d=null,m=null,n.set(0,0,J.canvas.width,J.canvas.height),e.set(0,0,J.canvas.width,J.canvas.height),Y.reset(),X.reset(),H.reset()}return{buffers:{color:Y,depth:X,stencil:H},enable:ZJ,disable:wJ,bindFramebuffer:aJ,drawBuffers:lJ,useProgram:uJ,setBlending:O0,setMaterial:rJ,setFlipSided:tJ,setCullFace:VJ,setLineWidth:Y0,setPolygonOffset:MJ,setScissorTest:TJ,activeTexture:w,bindTexture:N,unbindTexture:v,compressedTexImage2D:o,compressedTexImage3D:i,texImage2D:GJ,texImage3D:xJ,updateUBOMapping:SJ,uniformBlockBinding:fJ,texStorage2D:IJ,texStorage3D:JJ,texSubImage2D:u,texSubImage3D:kJ,compressedTexSubImage2D:WJ,compressedTexSubImage3D:UJ,scissor:CJ,viewport:FJ,reset:W0}}function $5(J,$,Q,Z){let W=tH(Z);switch(Q){case 1021:return J*$;case 1024:return J*$;case 1025:return J*$*2;case 1028:return J*$/W.components*W.byteLength;case 1029:return J*$/W.components*W.byteLength;case 1030:return J*$*2/W.components*W.byteLength;case 1031:return J*$*2/W.components*W.byteLength;case 1022:return J*$*3/W.components*W.byteLength;case 1023:return J*$*4/W.components*W.byteLength;case 1033:return J*$*4/W.components*W.byteLength;case 33776:case 33777:return Math.floor((J+3)/4)*Math.floor(($+3)/4)*8;case 33778:case 33779:return Math.floor((J+3)/4)*Math.floor(($+3)/4)*16;case 35841:case 35843:return Math.max(J,16)*Math.max($,8)/4;case 35840:case 35842:return Math.max(J,8)*Math.max($,8)/2;case 36196:case 37492:return Math.floor((J+3)/4)*Math.floor(($+3)/4)*8;case 37496:return Math.floor((J+3)/4)*Math.floor(($+3)/4)*16;case 37808:return Math.floor((J+3)/4)*Math.floor(($+3)/4)*16;case 37809:return Math.floor((J+4)/5)*Math.floor(($+3)/4)*16;case 37810:return Math.floor((J+4)/5)*Math.floor(($+4)/5)*16;case 37811:return Math.floor((J+5)/6)*Math.floor(($+4)/5)*16;case 37812:return Math.floor((J+5)/6)*Math.floor(($+5)/6)*16;case 37813:return Math.floor((J+7)/8)*Math.floor(($+4)/5)*16;case 37814:return Math.floor((J+7)/8)*Math.floor(($+5)/6)*16;case 37815:return Math.floor((J+7)/8)*Math.floor(($+7)/8)*16;case 37816:return Math.floor((J+9)/10)*Math.floor(($+4)/5)*16;case 37817:return Math.floor((J+9)/10)*Math.floor(($+5)/6)*16;case 37818:return Math.floor((J+9)/10)*Math.floor(($+7)/8)*16;case 37819:return Math.floor((J+9)/10)*Math.floor(($+9)/10)*16;case 37820:return Math.floor((J+11)/12)*Math.floor(($+9)/10)*16;case 37821:return Math.floor((J+11)/12)*Math.floor(($+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(J/4)*Math.ceil($/4)*16;case 36283:case 36284:return Math.ceil(J/4)*Math.ceil($/4)*8;case 36285:case 36286:return Math.ceil(J/4)*Math.ceil($/4)*16}throw Error(`Unable to determine texture byte length for ${Q} format.`)}function tH(J){switch(J){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${J}.`)}function eH(J,$,Q,Z,W,Y,X){let H=$.has("WEBGL_multisampled_render_to_texture")?$.get("WEBGL_multisampled_render_to_texture"):null,K=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),q=new LJ,G=new WeakMap,U,F=new WeakMap,O=!1;try{O=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(w){}function z(w,N){return O?new OffscreenCanvas(w,N):S7("canvas")}function R(w,N,v){let o=1,i=TJ(w);if(i.width>v||i.height>v)o=v/Math.max(i.width,i.height);if(o<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let u=Math.floor(o*i.width),kJ=Math.floor(o*i.height);if(U===void 0)U=z(u,kJ);let WJ=N?z(u,kJ):U;return WJ.width=u,WJ.height=kJ,WJ.getContext("2d").drawImage(w,0,0,u,kJ),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+i.width+"x"+i.height+") to ("+u+"x"+kJ+")."),WJ}else{if("data"in w)console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+i.width+"x"+i.height+").");return w}return w}function V(w){return w.generateMipmaps}function E(w){J.generateMipmap(w)}function D(w){if(w.isWebGLCubeRenderTarget)return J.TEXTURE_CUBE_MAP;if(w.isWebGL3DRenderTarget)return J.TEXTURE_3D;if(w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture)return J.TEXTURE_2D_ARRAY;return J.TEXTURE_2D}function M(w,N,v,o,i=!1){if(w!==null){if(J[w]!==void 0)return J[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let u=N;if(N===J.RED){if(v===J.FLOAT)u=J.R32F;if(v===J.HALF_FLOAT)u=J.R16F;if(v===J.UNSIGNED_BYTE)u=J.R8}if(N===J.RED_INTEGER){if(v===J.UNSIGNED_BYTE)u=J.R8UI;if(v===J.UNSIGNED_SHORT)u=J.R16UI;if(v===J.UNSIGNED_INT)u=J.R32UI;if(v===J.BYTE)u=J.R8I;if(v===J.SHORT)u=J.R16I;if(v===J.INT)u=J.R32I}if(N===J.RG){if(v===J.FLOAT)u=J.RG32F;if(v===J.HALF_FLOAT)u=J.RG16F;if(v===J.UNSIGNED_BYTE)u=J.RG8}if(N===J.RG_INTEGER){if(v===J.UNSIGNED_BYTE)u=J.RG8UI;if(v===J.UNSIGNED_SHORT)u=J.RG16UI;if(v===J.UNSIGNED_INT)u=J.RG32UI;if(v===J.BYTE)u=J.RG8I;if(v===J.SHORT)u=J.RG16I;if(v===J.INT)u=J.RG32I}if(N===J.RGB_INTEGER){if(v===J.UNSIGNED_BYTE)u=J.RGB8UI;if(v===J.UNSIGNED_SHORT)u=J.RGB16UI;if(v===J.UNSIGNED_INT)u=J.RGB32UI;if(v===J.BYTE)u=J.RGB8I;if(v===J.SHORT)u=J.RGB16I;if(v===J.INT)u=J.RGB32I}if(N===J.RGBA_INTEGER){if(v===J.UNSIGNED_BYTE)u=J.RGBA8UI;if(v===J.UNSIGNED_SHORT)u=J.RGBA16UI;if(v===J.UNSIGNED_INT)u=J.RGBA32UI;if(v===J.BYTE)u=J.RGBA8I;if(v===J.SHORT)u=J.RGBA16I;if(v===J.INT)u=J.RGBA32I}if(N===J.RGB){if(v===J.UNSIGNED_INT_5_9_9_9_REV)u=J.RGB9_E5}if(N===J.RGBA){let kJ=i?"linear":pJ.getTransfer(o);if(v===J.FLOAT)u=J.RGBA32F;if(v===J.HALF_FLOAT)u=J.RGBA16F;if(v===J.UNSIGNED_BYTE)u=kJ==="srgb"?J.SRGB8_ALPHA8:J.RGBA8;if(v===J.UNSIGNED_SHORT_4_4_4_4)u=J.RGBA4;if(v===J.UNSIGNED_SHORT_5_5_5_1)u=J.RGB5_A1}if(u===J.R16F||u===J.R32F||u===J.RG16F||u===J.RG32F||u===J.RGBA16F||u===J.RGBA32F)$.get("EXT_color_buffer_float");return u}function _(w,N){let v;if(w){if(N===null||N===1014||N===1020)v=J.DEPTH24_STENCIL8;else if(N===1015)v=J.DEPTH32F_STENCIL8;else if(N===1012)v=J.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")}else if(N===null||N===1014||N===1020)v=J.DEPTH_COMPONENT24;else if(N===1015)v=J.DEPTH_COMPONENT32F;else if(N===1012)v=J.DEPTH_COMPONENT16;return v}function x(w,N){if(V(w)===!0||w.isFramebufferTexture&&w.minFilter!==1003&&w.minFilter!==1006)return Math.log2(Math.max(N.width,N.height))+1;else if(w.mipmaps!==void 0&&w.mipmaps.length>0)return w.mipmaps.length;else if(w.isCompressedTexture&&Array.isArray(w.image))return N.mipmaps.length;else return 1}function C(w){let N=w.target;if(N.removeEventListener("dispose",C),p(N),N.isVideoTexture)G.delete(N)}function P(w){let N=w.target;N.removeEventListener("dispose",P),L(N)}function p(w){let N=Z.get(w);if(N.__webglInit===void 0)return;let v=w.source,o=F.get(v);if(o){let i=o[N.__cacheKey];if(i.usedTimes--,i.usedTimes===0)k(w);if(Object.keys(o).length===0)F.delete(v)}Z.remove(w)}function k(w){let N=Z.get(w);J.deleteTexture(N.__webglTexture);let v=w.source,o=F.get(v);delete o[N.__cacheKey],X.memory.textures--}function L(w){let N=Z.get(w);if(w.depthTexture)w.depthTexture.dispose(),Z.remove(w.depthTexture);if(w.isWebGLCubeRenderTarget)for(let o=0;o<6;o++){if(Array.isArray(N.__webglFramebuffer[o]))for(let i=0;i<N.__webglFramebuffer[o].length;i++)J.deleteFramebuffer(N.__webglFramebuffer[o][i]);else J.deleteFramebuffer(N.__webglFramebuffer[o]);if(N.__webglDepthbuffer)J.deleteRenderbuffer(N.__webglDepthbuffer[o])}else{if(Array.isArray(N.__webglFramebuffer))for(let o=0;o<N.__webglFramebuffer.length;o++)J.deleteFramebuffer(N.__webglFramebuffer[o]);else J.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer)J.deleteRenderbuffer(N.__webglDepthbuffer);if(N.__webglMultisampledFramebuffer)J.deleteFramebuffer(N.__webglMultisampledFramebuffer);if(N.__webglColorRenderbuffer){for(let o=0;o<N.__webglColorRenderbuffer.length;o++)if(N.__webglColorRenderbuffer[o])J.deleteRenderbuffer(N.__webglColorRenderbuffer[o])}if(N.__webglDepthRenderbuffer)J.deleteRenderbuffer(N.__webglDepthRenderbuffer)}let v=w.textures;for(let o=0,i=v.length;o<i;o++){let u=Z.get(v[o]);if(u.__webglTexture)J.deleteTexture(u.__webglTexture),X.memory.textures--;Z.remove(v[o])}Z.remove(w)}let y=0;function b(){y=0}function d(){let w=y;if(w>=W.maxTextures)console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+W.maxTextures);return y+=1,w}function m(w){let N=[];return N.push(w.wrapS),N.push(w.wrapT),N.push(w.wrapR||0),N.push(w.magFilter),N.push(w.minFilter),N.push(w.anisotropy),N.push(w.internalFormat),N.push(w.format),N.push(w.type),N.push(w.generateMipmaps),N.push(w.premultiplyAlpha),N.push(w.flipY),N.push(w.unpackAlignment),N.push(w.colorSpace),N.join()}function a(w,N){let v=Z.get(w);if(w.isVideoTexture)Y0(w);if(w.isRenderTargetTexture===!1&&w.version>0&&v.__version!==w.version){let o=w.image;if(o===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(o.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{e(v,w,N);return}}Q.bindTexture(J.TEXTURE_2D,v.__webglTexture,J.TEXTURE0+N)}function l(w,N){let v=Z.get(w);if(w.version>0&&v.__version!==w.version){e(v,w,N);return}Q.bindTexture(J.TEXTURE_2D_ARRAY,v.__webglTexture,J.TEXTURE0+N)}function r(w,N){let v=Z.get(w);if(w.version>0&&v.__version!==w.version){e(v,w,N);return}Q.bindTexture(J.TEXTURE_3D,v.__webglTexture,J.TEXTURE0+N)}function g(w,N){let v=Z.get(w);if(w.version>0&&v.__version!==w.version){zJ(v,w,N);return}Q.bindTexture(J.TEXTURE_CUBE_MAP,v.__webglTexture,J.TEXTURE0+N)}let HJ={[1000]:J.REPEAT,[1001]:J.CLAMP_TO_EDGE,[1002]:J.MIRRORED_REPEAT},qJ={[1003]:J.NEAREST,[1004]:J.NEAREST_MIPMAP_NEAREST,[1005]:J.NEAREST_MIPMAP_LINEAR,[1006]:J.LINEAR,[1007]:J.LINEAR_MIPMAP_NEAREST,[1008]:J.LINEAR_MIPMAP_LINEAR},PJ={[512]:J.NEVER,[519]:J.ALWAYS,[513]:J.LESS,[515]:J.LEQUAL,[514]:J.EQUAL,[518]:J.GEQUAL,[516]:J.GREATER,[517]:J.NOTEQUAL};function gJ(w,N){if(N.type===1015&&$.has("OES_texture_float_linear")===!1&&(N.magFilter===1006||N.magFilter===1007||N.magFilter===1005||N.magFilter===1008||N.minFilter===1006||N.minFilter===1007||N.minFilter===1005||N.minFilter===1008))console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.");if(J.texParameteri(w,J.TEXTURE_WRAP_S,HJ[N.wrapS]),J.texParameteri(w,J.TEXTURE_WRAP_T,HJ[N.wrapT]),w===J.TEXTURE_3D||w===J.TEXTURE_2D_ARRAY)J.texParameteri(w,J.TEXTURE_WRAP_R,HJ[N.wrapR]);if(J.texParameteri(w,J.TEXTURE_MAG_FILTER,qJ[N.magFilter]),J.texParameteri(w,J.TEXTURE_MIN_FILTER,qJ[N.minFilter]),N.compareFunction)J.texParameteri(w,J.TEXTURE_COMPARE_MODE,J.COMPARE_REF_TO_TEXTURE),J.texParameteri(w,J.TEXTURE_COMPARE_FUNC,PJ[N.compareFunction]);if($.has("EXT_texture_filter_anisotropic")===!0){if(N.magFilter===1003)return;if(N.minFilter!==1005&&N.minFilter!==1008)return;if(N.type===1015&&$.has("OES_texture_float_linear")===!1)return;if(N.anisotropy>1||Z.get(N).__currentAnisotropy){let v=$.get("EXT_texture_filter_anisotropic");J.texParameterf(w,v.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(N.anisotropy,W.getMaxAnisotropy())),Z.get(N).__currentAnisotropy=N.anisotropy}}}function n(w,N){let v=!1;if(w.__webglInit===void 0)w.__webglInit=!0,N.addEventListener("dispose",C);let o=N.source,i=F.get(o);if(i===void 0)i={},F.set(o,i);let u=m(N);if(u!==w.__cacheKey){if(i[u]===void 0)i[u]={texture:J.createTexture(),usedTimes:0},X.memory.textures++,v=!0;i[u].usedTimes++;let kJ=i[w.__cacheKey];if(kJ!==void 0){if(i[w.__cacheKey].usedTimes--,kJ.usedTimes===0)k(N)}w.__cacheKey=u,w.__webglTexture=i[u].texture}return v}function e(w,N,v){let o=J.TEXTURE_2D;if(N.isDataArrayTexture||N.isCompressedArrayTexture)o=J.TEXTURE_2D_ARRAY;if(N.isData3DTexture)o=J.TEXTURE_3D;let i=n(w,N),u=N.source;Q.bindTexture(o,w.__webglTexture,J.TEXTURE0+v);let kJ=Z.get(u);if(u.version!==kJ.__version||i===!0){Q.activeTexture(J.TEXTURE0+v);let WJ=pJ.getPrimaries(pJ.workingColorSpace),UJ=N.colorSpace===""?null:pJ.getPrimaries(N.colorSpace),IJ=N.colorSpace===""||WJ===UJ?J.NONE:J.BROWSER_DEFAULT_WEBGL;J.pixelStorei(J.UNPACK_FLIP_Y_WEBGL,N.flipY),J.pixelStorei(J.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),J.pixelStorei(J.UNPACK_ALIGNMENT,N.unpackAlignment),J.pixelStorei(J.UNPACK_COLORSPACE_CONVERSION_WEBGL,IJ);let JJ=R(N.image,!1,W.maxTextureSize);JJ=MJ(N,JJ);let GJ=Y.convert(N.format,N.colorSpace),xJ=Y.convert(N.type),CJ=M(N.internalFormat,GJ,xJ,N.colorSpace,N.isVideoTexture);gJ(o,N);let FJ,SJ=N.mipmaps,fJ=N.isVideoTexture!==!0,W0=kJ.__version===void 0||i===!0,T=u.dataReady,t=x(N,JJ);if(N.isDepthTexture){if(CJ=_(N.format===1027,N.type),W0)if(fJ)Q.texStorage2D(J.TEXTURE_2D,1,CJ,JJ.width,JJ.height);else Q.texImage2D(J.TEXTURE_2D,0,CJ,JJ.width,JJ.height,0,GJ,xJ,null)}else if(N.isDataTexture)if(SJ.length>0){if(fJ&&W0)Q.texStorage2D(J.TEXTURE_2D,t,CJ,SJ[0].width,SJ[0].height);for(let c=0,s=SJ.length;c<s;c++)if(FJ=SJ[c],fJ){if(T)Q.texSubImage2D(J.TEXTURE_2D,c,0,0,FJ.width,FJ.height,GJ,xJ,FJ.data)}else Q.texImage2D(J.TEXTURE_2D,c,CJ,FJ.width,FJ.height,0,GJ,xJ,FJ.data);N.generateMipmaps=!1}else if(fJ){if(W0)Q.texStorage2D(J.TEXTURE_2D,t,CJ,JJ.width,JJ.height);if(T)Q.texSubImage2D(J.TEXTURE_2D,0,0,0,JJ.width,JJ.height,GJ,xJ,JJ.data)}else Q.texImage2D(J.TEXTURE_2D,0,CJ,JJ.width,JJ.height,0,GJ,xJ,JJ.data);else if(N.isCompressedTexture)if(N.isCompressedArrayTexture){if(fJ&&W0)Q.texStorage3D(J.TEXTURE_2D_ARRAY,t,CJ,SJ[0].width,SJ[0].height,JJ.depth);for(let c=0,s=SJ.length;c<s;c++)if(FJ=SJ[c],N.format!==1023)if(GJ!==null)if(fJ){if(T)if(N.layerUpdates.size>0){let KJ=$5(FJ.width,FJ.height,N.format,N.type);for(let YJ of N.layerUpdates){let vJ=FJ.data.subarray(YJ*KJ/FJ.data.BYTES_PER_ELEMENT,(YJ+1)*KJ/FJ.data.BYTES_PER_ELEMENT);Q.compressedTexSubImage3D(J.TEXTURE_2D_ARRAY,c,0,0,YJ,FJ.width,FJ.height,1,GJ,vJ)}N.clearLayerUpdates()}else Q.compressedTexSubImage3D(J.TEXTURE_2D_ARRAY,c,0,0,0,FJ.width,FJ.height,JJ.depth,GJ,FJ.data)}else Q.compressedTexImage3D(J.TEXTURE_2D_ARRAY,c,CJ,FJ.width,FJ.height,JJ.depth,0,FJ.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(fJ){if(T)Q.texSubImage3D(J.TEXTURE_2D_ARRAY,c,0,0,0,FJ.width,FJ.height,JJ.depth,GJ,xJ,FJ.data)}else Q.texImage3D(J.TEXTURE_2D_ARRAY,c,CJ,FJ.width,FJ.height,JJ.depth,0,GJ,xJ,FJ.data)}else{if(fJ&&W0)Q.texStorage2D(J.TEXTURE_2D,t,CJ,SJ[0].width,SJ[0].height);for(let c=0,s=SJ.length;c<s;c++)if(FJ=SJ[c],N.format!==1023)if(GJ!==null)if(fJ){if(T)Q.compressedTexSubImage2D(J.TEXTURE_2D,c,0,0,FJ.width,FJ.height,GJ,FJ.data)}else Q.compressedTexImage2D(J.TEXTURE_2D,c,CJ,FJ.width,FJ.height,0,FJ.data);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(fJ){if(T)Q.texSubImage2D(J.TEXTURE_2D,c,0,0,FJ.width,FJ.height,GJ,xJ,FJ.data)}else Q.texImage2D(J.TEXTURE_2D,c,CJ,FJ.width,FJ.height,0,GJ,xJ,FJ.data)}else if(N.isDataArrayTexture)if(fJ){if(W0)Q.texStorage3D(J.TEXTURE_2D_ARRAY,t,CJ,JJ.width,JJ.height,JJ.depth);if(T)if(N.layerUpdates.size>0){let c=$5(JJ.width,JJ.height,N.format,N.type);for(let s of N.layerUpdates){let KJ=JJ.data.subarray(s*c/JJ.data.BYTES_PER_ELEMENT,(s+1)*c/JJ.data.BYTES_PER_ELEMENT);Q.texSubImage3D(J.TEXTURE_2D_ARRAY,0,0,0,s,JJ.width,JJ.height,1,GJ,xJ,KJ)}N.clearLayerUpdates()}else Q.texSubImage3D(J.TEXTURE_2D_ARRAY,0,0,0,0,JJ.width,JJ.height,JJ.depth,GJ,xJ,JJ.data)}else Q.texImage3D(J.TEXTURE_2D_ARRAY,0,CJ,JJ.width,JJ.height,JJ.depth,0,GJ,xJ,JJ.data);else if(N.isData3DTexture)if(fJ){if(W0)Q.texStorage3D(J.TEXTURE_3D,t,CJ,JJ.width,JJ.height,JJ.depth);if(T)Q.texSubImage3D(J.TEXTURE_3D,0,0,0,0,JJ.width,JJ.height,JJ.depth,GJ,xJ,JJ.data)}else Q.texImage3D(J.TEXTURE_3D,0,CJ,JJ.width,JJ.height,JJ.depth,0,GJ,xJ,JJ.data);else if(N.isFramebufferTexture){if(W0)if(fJ)Q.texStorage2D(J.TEXTURE_2D,t,CJ,JJ.width,JJ.height);else{let{width:c,height:s}=JJ;for(let KJ=0;KJ<t;KJ++)Q.texImage2D(J.TEXTURE_2D,KJ,CJ,c,s,0,GJ,xJ,null),c>>=1,s>>=1}}else if(SJ.length>0){if(fJ&&W0){let c=TJ(SJ[0]);Q.texStorage2D(J.TEXTURE_2D,t,CJ,c.width,c.height)}for(let c=0,s=SJ.length;c<s;c++)if(FJ=SJ[c],fJ){if(T)Q.texSubImage2D(J.TEXTURE_2D,c,0,0,GJ,xJ,FJ)}else Q.texImage2D(J.TEXTURE_2D,c,CJ,GJ,xJ,FJ);N.generateMipmaps=!1}else if(fJ){if(W0){let c=TJ(JJ);Q.texStorage2D(J.TEXTURE_2D,t,CJ,c.width,c.height)}if(T)Q.texSubImage2D(J.TEXTURE_2D,0,0,0,GJ,xJ,JJ)}else Q.texImage2D(J.TEXTURE_2D,0,CJ,GJ,xJ,JJ);if(V(N))E(o);if(kJ.__version=u.version,N.onUpdate)N.onUpdate(N)}w.__version=N.version}function zJ(w,N,v){if(N.image.length!==6)return;let o=n(w,N),i=N.source;Q.bindTexture(J.TEXTURE_CUBE_MAP,w.__webglTexture,J.TEXTURE0+v);let u=Z.get(i);if(i.version!==u.__version||o===!0){Q.activeTexture(J.TEXTURE0+v);let kJ=pJ.getPrimaries(pJ.workingColorSpace),WJ=N.colorSpace===""?null:pJ.getPrimaries(N.colorSpace),UJ=N.colorSpace===""||kJ===WJ?J.NONE:J.BROWSER_DEFAULT_WEBGL;J.pixelStorei(J.UNPACK_FLIP_Y_WEBGL,N.flipY),J.pixelStorei(J.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),J.pixelStorei(J.UNPACK_ALIGNMENT,N.unpackAlignment),J.pixelStorei(J.UNPACK_COLORSPACE_CONVERSION_WEBGL,UJ);let IJ=N.isCompressedTexture||N.image[0].isCompressedTexture,JJ=N.image[0]&&N.image[0].isDataTexture,GJ=[];for(let s=0;s<6;s++){if(!IJ&&!JJ)GJ[s]=R(N.image[s],!0,W.maxCubemapSize);else GJ[s]=JJ?N.image[s].image:N.image[s];GJ[s]=MJ(N,GJ[s])}let xJ=GJ[0],CJ=Y.convert(N.format,N.colorSpace),FJ=Y.convert(N.type),SJ=M(N.internalFormat,CJ,FJ,N.colorSpace),fJ=N.isVideoTexture!==!0,W0=u.__version===void 0||o===!0,T=i.dataReady,t=x(N,xJ);gJ(J.TEXTURE_CUBE_MAP,N);let c;if(IJ){if(fJ&&W0)Q.texStorage2D(J.TEXTURE_CUBE_MAP,t,SJ,xJ.width,xJ.height);for(let s=0;s<6;s++){c=GJ[s].mipmaps;for(let KJ=0;KJ<c.length;KJ++){let YJ=c[KJ];if(N.format!==1023)if(CJ!==null)if(fJ){if(T)Q.compressedTexSubImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ,0,0,YJ.width,YJ.height,CJ,YJ.data)}else Q.compressedTexImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ,SJ,YJ.width,YJ.height,0,YJ.data);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()");else if(fJ){if(T)Q.texSubImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ,0,0,YJ.width,YJ.height,CJ,FJ,YJ.data)}else Q.texImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ,SJ,YJ.width,YJ.height,0,CJ,FJ,YJ.data)}}}else{if(c=N.mipmaps,fJ&&W0){if(c.length>0)t++;let s=TJ(GJ[0]);Q.texStorage2D(J.TEXTURE_CUBE_MAP,t,SJ,s.width,s.height)}for(let s=0;s<6;s++)if(JJ){if(fJ){if(T)Q.texSubImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,0,0,GJ[s].width,GJ[s].height,CJ,FJ,GJ[s].data)}else Q.texImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,SJ,GJ[s].width,GJ[s].height,0,CJ,FJ,GJ[s].data);for(let KJ=0;KJ<c.length;KJ++){let vJ=c[KJ].image[s].image;if(fJ){if(T)Q.texSubImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ+1,0,0,vJ.width,vJ.height,CJ,FJ,vJ.data)}else Q.texImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ+1,SJ,vJ.width,vJ.height,0,CJ,FJ,vJ.data)}}else{if(fJ){if(T)Q.texSubImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,0,0,CJ,FJ,GJ[s])}else Q.texImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,SJ,CJ,FJ,GJ[s]);for(let KJ=0;KJ<c.length;KJ++){let YJ=c[KJ];if(fJ){if(T)Q.texSubImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ+1,0,0,CJ,FJ,YJ.image[s])}else Q.texImage2D(J.TEXTURE_CUBE_MAP_POSITIVE_X+s,KJ+1,SJ,CJ,FJ,YJ.image[s])}}}if(V(N))E(J.TEXTURE_CUBE_MAP);if(u.__version=i.version,N.onUpdate)N.onUpdate(N)}w.__version=N.version}function BJ(w,N,v,o,i,u){let kJ=Y.convert(v.format,v.colorSpace),WJ=Y.convert(v.type),UJ=M(v.internalFormat,kJ,WJ,v.colorSpace),IJ=Z.get(N),JJ=Z.get(v);if(JJ.__renderTarget=N,!IJ.__hasExternalTextures){let GJ=Math.max(1,N.width>>u),xJ=Math.max(1,N.height>>u);if(i===J.TEXTURE_3D||i===J.TEXTURE_2D_ARRAY)Q.texImage3D(i,u,UJ,GJ,xJ,N.depth,0,kJ,WJ,null);else Q.texImage2D(i,u,UJ,GJ,xJ,0,kJ,WJ,null)}if(Q.bindFramebuffer(J.FRAMEBUFFER,w),VJ(N))H.framebufferTexture2DMultisampleEXT(J.FRAMEBUFFER,o,i,JJ.__webglTexture,0,tJ(N));else if(i===J.TEXTURE_2D||i>=J.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=J.TEXTURE_CUBE_MAP_NEGATIVE_Z)J.framebufferTexture2D(J.FRAMEBUFFER,o,i,JJ.__webglTexture,u);Q.bindFramebuffer(J.FRAMEBUFFER,null)}function ZJ(w,N,v){if(J.bindRenderbuffer(J.RENDERBUFFER,w),N.depthBuffer){let o=N.depthTexture,i=o&&o.isDepthTexture?o.type:null,u=_(N.stencilBuffer,i),kJ=N.stencilBuffer?J.DEPTH_STENCIL_ATTACHMENT:J.DEPTH_ATTACHMENT,WJ=tJ(N);if(VJ(N))H.renderbufferStorageMultisampleEXT(J.RENDERBUFFER,WJ,u,N.width,N.height);else if(v)J.renderbufferStorageMultisample(J.RENDERBUFFER,WJ,u,N.width,N.height);else J.renderbufferStorage(J.RENDERBUFFER,u,N.width,N.height);J.framebufferRenderbuffer(J.FRAMEBUFFER,kJ,J.RENDERBUFFER,w)}else{let o=N.textures;for(let i=0;i<o.length;i++){let u=o[i],kJ=Y.convert(u.format,u.colorSpace),WJ=Y.convert(u.type),UJ=M(u.internalFormat,kJ,WJ,u.colorSpace),IJ=tJ(N);if(v&&VJ(N)===!1)J.renderbufferStorageMultisample(J.RENDERBUFFER,IJ,UJ,N.width,N.height);else if(VJ(N))H.renderbufferStorageMultisampleEXT(J.RENDERBUFFER,IJ,UJ,N.width,N.height);else J.renderbufferStorage(J.RENDERBUFFER,UJ,N.width,N.height)}}J.bindRenderbuffer(J.RENDERBUFFER,null)}function wJ(w,N){if(N&&N.isWebGLCubeRenderTarget)throw Error("Depth Texture with cube render targets is not supported");if(Q.bindFramebuffer(J.FRAMEBUFFER,w),!(N.depthTexture&&N.depthTexture.isDepthTexture))throw Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let o=Z.get(N.depthTexture);if(o.__renderTarget=N,!o.__webglTexture||N.depthTexture.image.width!==N.width||N.depthTexture.image.height!==N.height)N.depthTexture.image.width=N.width,N.depthTexture.image.height=N.height,N.depthTexture.needsUpdate=!0;a(N.depthTexture,0);let i=o.__webglTexture,u=tJ(N);if(N.depthTexture.format===1026)if(VJ(N))H.framebufferTexture2DMultisampleEXT(J.FRAMEBUFFER,J.DEPTH_ATTACHMENT,J.TEXTURE_2D,i,0,u);else J.framebufferTexture2D(J.FRAMEBUFFER,J.DEPTH_ATTACHMENT,J.TEXTURE_2D,i,0);else if(N.depthTexture.format===1027)if(VJ(N))H.framebufferTexture2DMultisampleEXT(J.FRAMEBUFFER,J.DEPTH_STENCIL_ATTACHMENT,J.TEXTURE_2D,i,0,u);else J.framebufferTexture2D(J.FRAMEBUFFER,J.DEPTH_STENCIL_ATTACHMENT,J.TEXTURE_2D,i,0);else throw Error("Unknown depthTexture format")}function aJ(w){let N=Z.get(w),v=w.isWebGLCubeRenderTarget===!0;if(N.__boundDepthTexture!==w.depthTexture){let o=w.depthTexture;if(N.__depthDisposeCallback)N.__depthDisposeCallback();if(o){let i=()=>{delete N.__boundDepthTexture,delete N.__depthDisposeCallback,o.removeEventListener("dispose",i)};o.addEventListener("dispose",i),N.__depthDisposeCallback=i}N.__boundDepthTexture=o}if(w.depthTexture&&!N.__autoAllocateDepthBuffer){if(v)throw Error("target.depthTexture not supported in Cube render targets");wJ(N.__webglFramebuffer,w)}else if(v){N.__webglDepthbuffer=[];for(let o=0;o<6;o++)if(Q.bindFramebuffer(J.FRAMEBUFFER,N.__webglFramebuffer[o]),N.__webglDepthbuffer[o]===void 0)N.__webglDepthbuffer[o]=J.createRenderbuffer(),ZJ(N.__webglDepthbuffer[o],w,!1);else{let i=w.stencilBuffer?J.DEPTH_STENCIL_ATTACHMENT:J.DEPTH_ATTACHMENT,u=N.__webglDepthbuffer[o];J.bindRenderbuffer(J.RENDERBUFFER,u),J.framebufferRenderbuffer(J.FRAMEBUFFER,i,J.RENDERBUFFER,u)}}else if(Q.bindFramebuffer(J.FRAMEBUFFER,N.__webglFramebuffer),N.__webglDepthbuffer===void 0)N.__webglDepthbuffer=J.createRenderbuffer(),ZJ(N.__webglDepthbuffer,w,!1);else{let o=w.stencilBuffer?J.DEPTH_STENCIL_ATTACHMENT:J.DEPTH_ATTACHMENT,i=N.__webglDepthbuffer;J.bindRenderbuffer(J.RENDERBUFFER,i),J.framebufferRenderbuffer(J.FRAMEBUFFER,o,J.RENDERBUFFER,i)}Q.bindFramebuffer(J.FRAMEBUFFER,null)}function lJ(w,N,v){let o=Z.get(w);if(N!==void 0)BJ(o.__webglFramebuffer,w,w.texture,J.COLOR_ATTACHMENT0,J.TEXTURE_2D,0);if(v!==void 0)aJ(w)}function uJ(w){let N=w.texture,v=Z.get(w),o=Z.get(N);w.addEventListener("dispose",P);let i=w.textures,u=w.isWebGLCubeRenderTarget===!0,kJ=i.length>1;if(!kJ){if(o.__webglTexture===void 0)o.__webglTexture=J.createTexture();o.__version=N.version,X.memory.textures++}if(u){v.__webglFramebuffer=[];for(let WJ=0;WJ<6;WJ++)if(N.mipmaps&&N.mipmaps.length>0){v.__webglFramebuffer[WJ]=[];for(let UJ=0;UJ<N.mipmaps.length;UJ++)v.__webglFramebuffer[WJ][UJ]=J.createFramebuffer()}else v.__webglFramebuffer[WJ]=J.createFramebuffer()}else{if(N.mipmaps&&N.mipmaps.length>0){v.__webglFramebuffer=[];for(let WJ=0;WJ<N.mipmaps.length;WJ++)v.__webglFramebuffer[WJ]=J.createFramebuffer()}else v.__webglFramebuffer=J.createFramebuffer();if(kJ)for(let WJ=0,UJ=i.length;WJ<UJ;WJ++){let IJ=Z.get(i[WJ]);if(IJ.__webglTexture===void 0)IJ.__webglTexture=J.createTexture(),X.memory.textures++}if(w.samples>0&&VJ(w)===!1){v.__webglMultisampledFramebuffer=J.createFramebuffer(),v.__webglColorRenderbuffer=[],Q.bindFramebuffer(J.FRAMEBUFFER,v.__webglMultisampledFramebuffer);for(let WJ=0;WJ<i.length;WJ++){let UJ=i[WJ];v.__webglColorRenderbuffer[WJ]=J.createRenderbuffer(),J.bindRenderbuffer(J.RENDERBUFFER,v.__webglColorRenderbuffer[WJ]);let IJ=Y.convert(UJ.format,UJ.colorSpace),JJ=Y.convert(UJ.type),GJ=M(UJ.internalFormat,IJ,JJ,UJ.colorSpace,w.isXRRenderTarget===!0),xJ=tJ(w);J.renderbufferStorageMultisample(J.RENDERBUFFER,xJ,GJ,w.width,w.height),J.framebufferRenderbuffer(J.FRAMEBUFFER,J.COLOR_ATTACHMENT0+WJ,J.RENDERBUFFER,v.__webglColorRenderbuffer[WJ])}if(J.bindRenderbuffer(J.RENDERBUFFER,null),w.depthBuffer)v.__webglDepthRenderbuffer=J.createRenderbuffer(),ZJ(v.__webglDepthRenderbuffer,w,!0);Q.bindFramebuffer(J.FRAMEBUFFER,null)}}if(u){Q.bindTexture(J.TEXTURE_CUBE_MAP,o.__webglTexture),gJ(J.TEXTURE_CUBE_MAP,N);for(let WJ=0;WJ<6;WJ++)if(N.mipmaps&&N.mipmaps.length>0)for(let UJ=0;UJ<N.mipmaps.length;UJ++)BJ(v.__webglFramebuffer[WJ][UJ],w,N,J.COLOR_ATTACHMENT0,J.TEXTURE_CUBE_MAP_POSITIVE_X+WJ,UJ);else BJ(v.__webglFramebuffer[WJ],w,N,J.COLOR_ATTACHMENT0,J.TEXTURE_CUBE_MAP_POSITIVE_X+WJ,0);if(V(N))E(J.TEXTURE_CUBE_MAP);Q.unbindTexture()}else if(kJ){for(let WJ=0,UJ=i.length;WJ<UJ;WJ++){let IJ=i[WJ],JJ=Z.get(IJ);if(Q.bindTexture(J.TEXTURE_2D,JJ.__webglTexture),gJ(J.TEXTURE_2D,IJ),BJ(v.__webglFramebuffer,w,IJ,J.COLOR_ATTACHMENT0+WJ,J.TEXTURE_2D,0),V(IJ))E(J.TEXTURE_2D)}Q.unbindTexture()}else{let WJ=J.TEXTURE_2D;if(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)WJ=w.isWebGL3DRenderTarget?J.TEXTURE_3D:J.TEXTURE_2D_ARRAY;if(Q.bindTexture(WJ,o.__webglTexture),gJ(WJ,N),N.mipmaps&&N.mipmaps.length>0)for(let UJ=0;UJ<N.mipmaps.length;UJ++)BJ(v.__webglFramebuffer[UJ],w,N,J.COLOR_ATTACHMENT0,WJ,UJ);else BJ(v.__webglFramebuffer,w,N,J.COLOR_ATTACHMENT0,WJ,0);if(V(N))E(WJ);Q.unbindTexture()}if(w.depthBuffer)aJ(w)}function E0(w){let N=w.textures;for(let v=0,o=N.length;v<o;v++){let i=N[v];if(V(i)){let u=D(w),kJ=Z.get(i).__webglTexture;Q.bindTexture(u,kJ),E(u),Q.unbindTexture()}}}let j=[],O0=[];function rJ(w){if(w.samples>0){if(VJ(w)===!1){let{textures:N,width:v,height:o}=w,i=J.COLOR_BUFFER_BIT,u=w.stencilBuffer?J.DEPTH_STENCIL_ATTACHMENT:J.DEPTH_ATTACHMENT,kJ=Z.get(w),WJ=N.length>1;if(WJ)for(let UJ=0;UJ<N.length;UJ++)Q.bindFramebuffer(J.FRAMEBUFFER,kJ.__webglMultisampledFramebuffer),J.framebufferRenderbuffer(J.FRAMEBUFFER,J.COLOR_ATTACHMENT0+UJ,J.RENDERBUFFER,null),Q.bindFramebuffer(J.FRAMEBUFFER,kJ.__webglFramebuffer),J.framebufferTexture2D(J.DRAW_FRAMEBUFFER,J.COLOR_ATTACHMENT0+UJ,J.TEXTURE_2D,null,0);Q.bindFramebuffer(J.READ_FRAMEBUFFER,kJ.__webglMultisampledFramebuffer),Q.bindFramebuffer(J.DRAW_FRAMEBUFFER,kJ.__webglFramebuffer);for(let UJ=0;UJ<N.length;UJ++){if(w.resolveDepthBuffer){if(w.depthBuffer)i|=J.DEPTH_BUFFER_BIT;if(w.stencilBuffer&&w.resolveStencilBuffer)i|=J.STENCIL_BUFFER_BIT}if(WJ){J.framebufferRenderbuffer(J.READ_FRAMEBUFFER,J.COLOR_ATTACHMENT0,J.RENDERBUFFER,kJ.__webglColorRenderbuffer[UJ]);let IJ=Z.get(N[UJ]).__webglTexture;J.framebufferTexture2D(J.DRAW_FRAMEBUFFER,J.COLOR_ATTACHMENT0,J.TEXTURE_2D,IJ,0)}if(J.blitFramebuffer(0,0,v,o,0,0,v,o,i,J.NEAREST),K===!0){if(j.length=0,O0.length=0,j.push(J.COLOR_ATTACHMENT0+UJ),w.depthBuffer&&w.resolveDepthBuffer===!1)j.push(u),O0.push(u),J.invalidateFramebuffer(J.DRAW_FRAMEBUFFER,O0);J.invalidateFramebuffer(J.READ_FRAMEBUFFER,j)}}if(Q.bindFramebuffer(J.READ_FRAMEBUFFER,null),Q.bindFramebuffer(J.DRAW_FRAMEBUFFER,null),WJ)for(let UJ=0;UJ<N.length;UJ++){Q.bindFramebuffer(J.FRAMEBUFFER,kJ.__webglMultisampledFramebuffer),J.framebufferRenderbuffer(J.FRAMEBUFFER,J.COLOR_ATTACHMENT0+UJ,J.RENDERBUFFER,kJ.__webglColorRenderbuffer[UJ]);let IJ=Z.get(N[UJ]).__webglTexture;Q.bindFramebuffer(J.FRAMEBUFFER,kJ.__webglFramebuffer),J.framebufferTexture2D(J.DRAW_FRAMEBUFFER,J.COLOR_ATTACHMENT0+UJ,J.TEXTURE_2D,IJ,0)}Q.bindFramebuffer(J.DRAW_FRAMEBUFFER,kJ.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&K){let N=w.stencilBuffer?J.DEPTH_STENCIL_ATTACHMENT:J.DEPTH_ATTACHMENT;J.invalidateFramebuffer(J.DRAW_FRAMEBUFFER,[N])}}}function tJ(w){return Math.min(W.maxSamples,w.samples)}function VJ(w){let N=Z.get(w);return w.samples>0&&$.has("WEBGL_multisampled_render_to_texture")===!0&&N.__useRenderToTexture!==!1}function Y0(w){let N=X.render.frame;if(G.get(w)!==N)G.set(w,N),w.update()}function MJ(w,N){let{colorSpace:v,format:o,type:i}=w;if(w.isCompressedTexture===!0||w.isVideoTexture===!0)return N;if(v!=="srgb-linear"&&v!=="")if(pJ.getTransfer(v)==="srgb"){if(o!==1023||i!==1009)console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.")}else console.error("THREE.WebGLTextures: Unsupported texture color space:",v);return N}function TJ(w){if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement)q.width=w.naturalWidth||w.width,q.height=w.naturalHeight||w.height;else if(typeof VideoFrame<"u"&&w instanceof VideoFrame)q.width=w.displayWidth,q.height=w.displayHeight;else q.width=w.width,q.height=w.height;return q}this.allocateTextureUnit=d,this.resetTextureUnits=b,this.setTexture2D=a,this.setTexture2DArray=l,this.setTexture3D=r,this.setTextureCube=g,this.rebindTextures=lJ,this.setupRenderTarget=uJ,this.updateRenderTargetMipmap=E0,this.updateMultisampleRenderTarget=rJ,this.setupDepthRenderbuffer=aJ,this.setupFrameBufferTexture=BJ,this.useMultisampledRTT=VJ}function J4(J,$){function Q(Z,W=""){let Y,X=pJ.getTransfer(W);if(Z===1009)return J.UNSIGNED_BYTE;if(Z===1017)return J.UNSIGNED_SHORT_4_4_4_4;if(Z===1018)return J.UNSIGNED_SHORT_5_5_5_1;if(Z===35902)return J.UNSIGNED_INT_5_9_9_9_REV;if(Z===1010)return J.BYTE;if(Z===1011)return J.SHORT;if(Z===1012)return J.UNSIGNED_SHORT;if(Z===1013)return J.INT;if(Z===1014)return J.UNSIGNED_INT;if(Z===1015)return J.FLOAT;if(Z===1016)return J.HALF_FLOAT;if(Z===1021)return J.ALPHA;if(Z===1022)return J.RGB;if(Z===1023)return J.RGBA;if(Z===1024)return J.LUMINANCE;if(Z===1025)return J.LUMINANCE_ALPHA;if(Z===1026)return J.DEPTH_COMPONENT;if(Z===1027)return J.DEPTH_STENCIL;if(Z===1028)return J.RED;if(Z===1029)return J.RED_INTEGER;if(Z===1030)return J.RG;if(Z===1031)return J.RG_INTEGER;if(Z===1033)return J.RGBA_INTEGER;if(Z===33776||Z===33777||Z===33778||Z===33779)if(X==="srgb")if(Y=$.get("WEBGL_compressed_texture_s3tc_srgb"),Y!==null){if(Z===33776)return Y.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(Z===33777)return Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(Z===33778)return Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(Z===33779)return Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(Y=$.get("WEBGL_compressed_texture_s3tc"),Y!==null){if(Z===33776)return Y.COMPRESSED_RGB_S3TC_DXT1_EXT;if(Z===33777)return Y.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(Z===33778)return Y.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(Z===33779)return Y.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(Z===35840||Z===35841||Z===35842||Z===35843)if(Y=$.get("WEBGL_compressed_texture_pvrtc"),Y!==null){if(Z===35840)return Y.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(Z===35841)return Y.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(Z===35842)return Y.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(Z===35843)return Y.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(Z===36196||Z===37492||Z===37496)if(Y=$.get("WEBGL_compressed_texture_etc"),Y!==null){if(Z===36196||Z===37492)return X==="srgb"?Y.COMPRESSED_SRGB8_ETC2:Y.COMPRESSED_RGB8_ETC2;if(Z===37496)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:Y.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(Z===37808||Z===37809||Z===37810||Z===37811||Z===37812||Z===37813||Z===37814||Z===37815||Z===37816||Z===37817||Z===37818||Z===37819||Z===37820||Z===37821)if(Y=$.get("WEBGL_compressed_texture_astc"),Y!==null){if(Z===37808)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:Y.COMPRESSED_RGBA_ASTC_4x4_KHR;if(Z===37809)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:Y.COMPRESSED_RGBA_ASTC_5x4_KHR;if(Z===37810)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:Y.COMPRESSED_RGBA_ASTC_5x5_KHR;if(Z===37811)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:Y.COMPRESSED_RGBA_ASTC_6x5_KHR;if(Z===37812)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:Y.COMPRESSED_RGBA_ASTC_6x6_KHR;if(Z===37813)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:Y.COMPRESSED_RGBA_ASTC_8x5_KHR;if(Z===37814)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:Y.COMPRESSED_RGBA_ASTC_8x6_KHR;if(Z===37815)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:Y.COMPRESSED_RGBA_ASTC_8x8_KHR;if(Z===37816)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:Y.COMPRESSED_RGBA_ASTC_10x5_KHR;if(Z===37817)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:Y.COMPRESSED_RGBA_ASTC_10x6_KHR;if(Z===37818)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:Y.COMPRESSED_RGBA_ASTC_10x8_KHR;if(Z===37819)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:Y.COMPRESSED_RGBA_ASTC_10x10_KHR;if(Z===37820)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:Y.COMPRESSED_RGBA_ASTC_12x10_KHR;if(Z===37821)return X==="srgb"?Y.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:Y.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(Z===36492||Z===36494||Z===36495)if(Y=$.get("EXT_texture_compression_bptc"),Y!==null){if(Z===36492)return X==="srgb"?Y.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:Y.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(Z===36494)return Y.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(Z===36495)return Y.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(Z===36283||Z===36284||Z===36285||Z===36286)if(Y=$.get("EXT_texture_compression_rgtc"),Y!==null){if(Z===36492)return Y.COMPRESSED_RED_RGTC1_EXT;if(Z===36284)return Y.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(Z===36285)return Y.COMPRESSED_RED_GREEN_RGTC2_EXT;if(Z===36286)return Y.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;if(Z===1020)return J.UNSIGNED_INT_24_8;return J[Z]!==void 0?J[Z]:null}return{convert:Q}}class t5 extends M0{constructor(J=[]){super();this.isArrayCamera=!0,this.cameras=J}}class d0 extends Z0{constructor(){super();this.isGroup=!0,this.type="Group"}}var $4={type:"move"};class E8{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){if(this._hand===null)this._hand=new d0,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1};return this._hand}getTargetRaySpace(){if(this._targetRay===null)this._targetRay=new d0,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A;return this._targetRay}getGripSpace(){if(this._grip===null)this._grip=new d0,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A;return this._grip}dispatchEvent(J){if(this._targetRay!==null)this._targetRay.dispatchEvent(J);if(this._grip!==null)this._grip.dispatchEvent(J);if(this._hand!==null)this._hand.dispatchEvent(J);return this}connect(J){if(J&&J.hand){let $=this._hand;if($)for(let Q of J.hand.values())this._getHandJoint($,Q)}return this.dispatchEvent({type:"connected",data:J}),this}disconnect(J){if(this.dispatchEvent({type:"disconnected",data:J}),this._targetRay!==null)this._targetRay.visible=!1;if(this._grip!==null)this._grip.visible=!1;if(this._hand!==null)this._hand.visible=!1;return this}update(J,$,Q){let Z=null,W=null,Y=null,X=this._targetRay,H=this._grip,K=this._hand;if(J&&$.session.visibilityState!=="visible-blurred"){if(K&&J.hand){Y=!0;for(let z of J.hand.values()){let R=$.getJointPose(z,Q),V=this._getHandJoint(K,z);if(R!==null)V.matrix.fromArray(R.transform.matrix),V.matrix.decompose(V.position,V.rotation,V.scale),V.matrixWorldNeedsUpdate=!0,V.jointRadius=R.radius;V.visible=R!==null}let q=K.joints["index-finger-tip"],G=K.joints["thumb-tip"],U=q.position.distanceTo(G.position),F=0.02,O=0.005;if(K.inputState.pinching&&U>F+O)K.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:J.handedness,target:this});else if(!K.inputState.pinching&&U<=F-O)K.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:J.handedness,target:this})}else if(H!==null&&J.gripSpace){if(W=$.getPose(J.gripSpace,Q),W!==null){if(H.matrix.fromArray(W.transform.matrix),H.matrix.decompose(H.position,H.rotation,H.scale),H.matrixWorldNeedsUpdate=!0,W.linearVelocity)H.hasLinearVelocity=!0,H.linearVelocity.copy(W.linearVelocity);else H.hasLinearVelocity=!1;if(W.angularVelocity)H.hasAngularVelocity=!0,H.angularVelocity.copy(W.angularVelocity);else H.hasAngularVelocity=!1}}if(X!==null){if(Z=$.getPose(J.targetRaySpace,Q),Z===null&&W!==null)Z=W;if(Z!==null){if(X.matrix.fromArray(Z.transform.matrix),X.matrix.decompose(X.position,X.rotation,X.scale),X.matrixWorldNeedsUpdate=!0,Z.linearVelocity)X.hasLinearVelocity=!0,X.linearVelocity.copy(Z.linearVelocity);else X.hasLinearVelocity=!1;if(Z.angularVelocity)X.hasAngularVelocity=!0,X.angularVelocity.copy(Z.angularVelocity);else X.hasAngularVelocity=!1;this.dispatchEvent($4)}}}if(X!==null)X.visible=Z!==null;if(H!==null)H.visible=W!==null;if(K!==null)K.visible=Y!==null;return this}_getHandJoint(J,$){if(J.joints[$.jointName]===void 0){let Q=new d0;Q.matrixAutoUpdate=!1,Q.visible=!1,J.joints[$.jointName]=Q,J.add(Q)}return J.joints[$.jointName]}}var Q4=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Z4=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class e5{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(J,$,Q){if(this.texture===null){let Z=new K0,W=J.properties.get(Z);if(W.__webglTexture=$.texture,$.depthNear!=Q.depthNear||$.depthFar!=Q.depthFar)this.depthNear=$.depthNear,this.depthFar=$.depthFar;this.texture=Z}}getMesh(J){if(this.texture!==null){if(this.mesh===null){let $=J.cameras[0].viewport,Q=new q6({vertexShader:Q4,fragmentShader:Z4,uniforms:{depthColor:{value:this.texture},depthWidth:{value:$.z},depthHeight:{value:$.w}}});this.mesh=new D0(new D8(20,20),Q)}}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class JQ extends C6{constructor(J,$){super();let Q=this,Z=null,W=1,Y=null,X="local-floor",H=1,K=null,q=null,G=null,U=null,F=null,O=null,z=new e5,R=$.getContextAttributes(),V=null,E=null,D=[],M=[],_=new LJ,x=null,C=new M0;C.viewport=new dJ;let P=new M0;P.viewport=new dJ;let p=[C,P],k=new t5,L=null,y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(n){let e=D[n];if(e===void 0)e=new E8,D[n]=e;return e.getTargetRaySpace()},this.getControllerGrip=function(n){let e=D[n];if(e===void 0)e=new E8,D[n]=e;return e.getGripSpace()},this.getHand=function(n){let e=D[n];if(e===void 0)e=new E8,D[n]=e;return e.getHandSpace()};function b(n){let e=M.indexOf(n.inputSource);if(e===-1)return;let zJ=D[e];if(zJ!==void 0)zJ.update(n.inputSource,n.frame,K||Y),zJ.dispatchEvent({type:n.type,data:n.inputSource})}function d(){Z.removeEventListener("select",b),Z.removeEventListener("selectstart",b),Z.removeEventListener("selectend",b),Z.removeEventListener("squeeze",b),Z.removeEventListener("squeezestart",b),Z.removeEventListener("squeezeend",b),Z.removeEventListener("end",d),Z.removeEventListener("inputsourceschange",m);for(let n=0;n<D.length;n++){let e=M[n];if(e===null)continue;M[n]=null,D[n].disconnect(e)}L=null,y=null,z.reset(),J.setRenderTarget(V),F=null,U=null,G=null,Z=null,E=null,gJ.stop(),Q.isPresenting=!1,J.setPixelRatio(x),J.setSize(_.width,_.height,!1),Q.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(n){if(W=n,Q.isPresenting===!0)console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(n){if(X=n,Q.isPresenting===!0)console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return K||Y},this.setReferenceSpace=function(n){K=n},this.getBaseLayer=function(){return U!==null?U:F},this.getBinding=function(){return G},this.getFrame=function(){return O},this.getSession=function(){return Z},this.setSession=async function(n){if(Z=n,Z!==null){if(V=J.getRenderTarget(),Z.addEventListener("select",b),Z.addEventListener("selectstart",b),Z.addEventListener("selectend",b),Z.addEventListener("squeeze",b),Z.addEventListener("squeezestart",b),Z.addEventListener("squeezeend",b),Z.addEventListener("end",d),Z.addEventListener("inputsourceschange",m),R.xrCompatible!==!0)await $.makeXRCompatible();if(x=J.getPixelRatio(),J.getSize(_),Z.renderState.layers===void 0){let e={antialias:R.antialias,alpha:!0,depth:R.depth,stencil:R.stencil,framebufferScaleFactor:W};F=new XRWebGLLayer(Z,$,e),Z.updateRenderState({baseLayer:F}),J.setPixelRatio(1),J.setSize(F.framebufferWidth,F.framebufferHeight,!1),E=new k6(F.framebufferWidth,F.framebufferHeight,{format:1023,type:1009,colorSpace:J.outputColorSpace,stencilBuffer:R.stencil})}else{let e=null,zJ=null,BJ=null;if(R.depth)BJ=R.stencil?$.DEPTH24_STENCIL8:$.DEPTH_COMPONENT24,e=R.stencil?1027:1026,zJ=R.stencil?1020:1014;let ZJ={colorFormat:$.RGBA8,depthFormat:BJ,scaleFactor:W};G=new XRWebGLBinding(Z,$),U=G.createProjectionLayer(ZJ),Z.updateRenderState({layers:[U]}),J.setPixelRatio(1),J.setSize(U.textureWidth,U.textureHeight,!1),E=new k6(U.textureWidth,U.textureHeight,{format:1023,type:1009,depthTexture:new P9(U.textureWidth,U.textureHeight,zJ,void 0,void 0,void 0,void 0,void 0,void 0,e),stencilBuffer:R.stencil,colorSpace:J.outputColorSpace,samples:R.antialias?4:0,resolveDepthBuffer:U.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(H),K=null,Y=await Z.requestReferenceSpace(X),gJ.setContext(Z),gJ.start(),Q.isPresenting=!0,Q.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(Z!==null)return Z.environmentBlendMode},this.getDepthTexture=function(){return z.getDepthTexture()};function m(n){for(let e=0;e<n.removed.length;e++){let zJ=n.removed[e],BJ=M.indexOf(zJ);if(BJ>=0)M[BJ]=null,D[BJ].disconnect(zJ)}for(let e=0;e<n.added.length;e++){let zJ=n.added[e],BJ=M.indexOf(zJ);if(BJ===-1){for(let wJ=0;wJ<D.length;wJ++)if(wJ>=M.length){M.push(zJ),BJ=wJ;break}else if(M[wJ]===null){M[wJ]=zJ,BJ=wJ;break}if(BJ===-1)break}let ZJ=D[BJ];if(ZJ)ZJ.connect(zJ)}}let a=new A,l=new A;function r(n,e,zJ){a.setFromMatrixPosition(e.matrixWorld),l.setFromMatrixPosition(zJ.matrixWorld);let BJ=a.distanceTo(l),ZJ=e.projectionMatrix.elements,wJ=zJ.projectionMatrix.elements,aJ=ZJ[14]/(ZJ[10]-1),lJ=ZJ[14]/(ZJ[10]+1),uJ=(ZJ[9]+1)/ZJ[5],E0=(ZJ[9]-1)/ZJ[5],j=(ZJ[8]-1)/ZJ[0],O0=(wJ[8]+1)/wJ[0],rJ=aJ*j,tJ=aJ*O0,VJ=BJ/(-j+O0),Y0=VJ*-j;if(e.matrixWorld.decompose(n.position,n.quaternion,n.scale),n.translateX(Y0),n.translateZ(VJ),n.matrixWorld.compose(n.position,n.quaternion,n.scale),n.matrixWorldInverse.copy(n.matrixWorld).invert(),ZJ[10]===-1)n.projectionMatrix.copy(e.projectionMatrix),n.projectionMatrixInverse.copy(e.projectionMatrixInverse);else{let MJ=aJ+VJ,TJ=lJ+VJ,w=rJ-Y0,N=tJ+(BJ-Y0),v=uJ*lJ/TJ*MJ,o=E0*lJ/TJ*MJ;n.projectionMatrix.makePerspective(w,N,v,o,MJ,TJ),n.projectionMatrixInverse.copy(n.projectionMatrix).invert()}}function g(n,e){if(e===null)n.matrixWorld.copy(n.matrix);else n.matrixWorld.multiplyMatrices(e.matrixWorld,n.matrix);n.matrixWorldInverse.copy(n.matrixWorld).invert()}this.updateCamera=function(n){if(Z===null)return;let{near:e,far:zJ}=n;if(z.texture!==null){if(z.depthNear>0)e=z.depthNear;if(z.depthFar>0)zJ=z.depthFar}if(k.near=P.near=C.near=e,k.far=P.far=C.far=zJ,L!==k.near||y!==k.far)Z.updateRenderState({depthNear:k.near,depthFar:k.far}),L=k.near,y=k.far;C.layers.mask=n.layers.mask|2,P.layers.mask=n.layers.mask|4,k.layers.mask=C.layers.mask|P.layers.mask;let BJ=n.parent,ZJ=k.cameras;g(k,BJ);for(let wJ=0;wJ<ZJ.length;wJ++)g(ZJ[wJ],BJ);if(ZJ.length===2)r(k,C,P);else k.projectionMatrix.copy(C.projectionMatrix);HJ(n,k,BJ)};function HJ(n,e,zJ){if(zJ===null)n.matrix.copy(e.matrixWorld);else n.matrix.copy(zJ.matrixWorld),n.matrix.invert(),n.matrix.multiply(e.matrixWorld);if(n.matrix.decompose(n.position,n.quaternion,n.scale),n.updateMatrixWorld(!0),n.projectionMatrix.copy(e.projectionMatrix),n.projectionMatrixInverse.copy(e.projectionMatrixInverse),n.isPerspectiveCamera)n.fov=U7*2*Math.atan(1/n.projectionMatrix.elements[5]),n.zoom=1}this.getCamera=function(){return k},this.getFoveation=function(){if(U===null&&F===null)return;return H},this.setFoveation=function(n){if(H=n,U!==null)U.fixedFoveation=n;if(F!==null&&F.fixedFoveation!==void 0)F.fixedFoveation=n},this.hasDepthSensing=function(){return z.texture!==null},this.getDepthSensingMesh=function(){return z.getMesh(k)};let qJ=null;function PJ(n,e){if(q=e.getViewerPose(K||Y),O=e,q!==null){let zJ=q.views;if(F!==null)J.setRenderTargetFramebuffer(E,F.framebuffer),J.setRenderTarget(E);let BJ=!1;if(zJ.length!==k.cameras.length)k.cameras.length=0,BJ=!0;for(let wJ=0;wJ<zJ.length;wJ++){let aJ=zJ[wJ],lJ=null;if(F!==null)lJ=F.getViewport(aJ);else{let E0=G.getViewSubImage(U,aJ);if(lJ=E0.viewport,wJ===0)J.setRenderTargetTextures(E,E0.colorTexture,U.ignoreDepthValues?void 0:E0.depthStencilTexture),J.setRenderTarget(E)}let uJ=p[wJ];if(uJ===void 0)uJ=new M0,uJ.layers.enable(wJ),uJ.viewport=new dJ,p[wJ]=uJ;if(uJ.matrix.fromArray(aJ.transform.matrix),uJ.matrix.decompose(uJ.position,uJ.quaternion,uJ.scale),uJ.projectionMatrix.fromArray(aJ.projectionMatrix),uJ.projectionMatrixInverse.copy(uJ.projectionMatrix).invert(),uJ.viewport.set(lJ.x,lJ.y,lJ.width,lJ.height),wJ===0)k.matrix.copy(uJ.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale);if(BJ===!0)k.cameras.push(uJ)}let ZJ=Z.enabledFeatures;if(ZJ&&ZJ.includes("depth-sensing")){let wJ=G.getDepthInformation(zJ[0]);if(wJ&&wJ.isValid&&wJ.texture)z.init(J,wJ,Z.renderState)}}for(let zJ=0;zJ<D.length;zJ++){let BJ=M[zJ],ZJ=D[zJ];if(BJ!==null&&ZJ!==void 0)ZJ.update(BJ,e,K||Y)}if(qJ)qJ(n,e);if(e.detectedPlanes)Q.dispatchEvent({type:"planesdetected",data:e});O=null}let gJ=new p5;gJ.setAnimationLoop(PJ),this.setAnimationLoop=function(n){qJ=n},this.dispose=function(){}}}var f6=new t0,W4=new _J;function Y4(J,$){function Q(V,E){if(V.matrixAutoUpdate===!0)V.updateMatrix();E.value.copy(V.matrix)}function Z(V,E){if(E.color.getRGB(V.fogColor.value,x5(J)),E.isFog)V.fogNear.value=E.near,V.fogFar.value=E.far;else if(E.isFogExp2)V.fogDensity.value=E.density}function W(V,E,D,M,_){if(E.isMeshBasicMaterial)Y(V,E);else if(E.isMeshLambertMaterial)Y(V,E);else if(E.isMeshToonMaterial)Y(V,E),U(V,E);else if(E.isMeshPhongMaterial)Y(V,E),G(V,E);else if(E.isMeshStandardMaterial){if(Y(V,E),F(V,E),E.isMeshPhysicalMaterial)O(V,E,_)}else if(E.isMeshMatcapMaterial)Y(V,E),z(V,E);else if(E.isMeshDepthMaterial)Y(V,E);else if(E.isMeshDistanceMaterial)Y(V,E),R(V,E);else if(E.isMeshNormalMaterial)Y(V,E);else if(E.isLineBasicMaterial){if(X(V,E),E.isLineDashedMaterial)H(V,E)}else if(E.isPointsMaterial)K(V,E,D,M);else if(E.isSpriteMaterial)q(V,E);else if(E.isShadowMaterial)V.color.value.copy(E.color),V.opacity.value=E.opacity;else if(E.isShaderMaterial)E.uniformsNeedUpdate=!1}function Y(V,E){if(V.opacity.value=E.opacity,E.color)V.diffuse.value.copy(E.color);if(E.emissive)V.emissive.value.copy(E.emissive).multiplyScalar(E.emissiveIntensity);if(E.map)V.map.value=E.map,Q(E.map,V.mapTransform);if(E.alphaMap)V.alphaMap.value=E.alphaMap,Q(E.alphaMap,V.alphaMapTransform);if(E.bumpMap){if(V.bumpMap.value=E.bumpMap,Q(E.bumpMap,V.bumpMapTransform),V.bumpScale.value=E.bumpScale,E.side===1)V.bumpScale.value*=-1}if(E.normalMap){if(V.normalMap.value=E.normalMap,Q(E.normalMap,V.normalMapTransform),V.normalScale.value.copy(E.normalScale),E.side===1)V.normalScale.value.negate()}if(E.displacementMap)V.displacementMap.value=E.displacementMap,Q(E.displacementMap,V.displacementMapTransform),V.displacementScale.value=E.displacementScale,V.displacementBias.value=E.displacementBias;if(E.emissiveMap)V.emissiveMap.value=E.emissiveMap,Q(E.emissiveMap,V.emissiveMapTransform);if(E.specularMap)V.specularMap.value=E.specularMap,Q(E.specularMap,V.specularMapTransform);if(E.alphaTest>0)V.alphaTest.value=E.alphaTest;let D=$.get(E),M=D.envMap,_=D.envMapRotation;if(M){if(V.envMap.value=M,f6.copy(_),f6.x*=-1,f6.y*=-1,f6.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1)f6.y*=-1,f6.z*=-1;V.envMapRotation.value.setFromMatrix4(W4.makeRotationFromEuler(f6)),V.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,V.reflectivity.value=E.reflectivity,V.ior.value=E.ior,V.refractionRatio.value=E.refractionRatio}if(E.lightMap)V.lightMap.value=E.lightMap,V.lightMapIntensity.value=E.lightMapIntensity,Q(E.lightMap,V.lightMapTransform);if(E.aoMap)V.aoMap.value=E.aoMap,V.aoMapIntensity.value=E.aoMapIntensity,Q(E.aoMap,V.aoMapTransform)}function X(V,E){if(V.diffuse.value.copy(E.color),V.opacity.value=E.opacity,E.map)V.map.value=E.map,Q(E.map,V.mapTransform)}function H(V,E){V.dashSize.value=E.dashSize,V.totalSize.value=E.dashSize+E.gapSize,V.scale.value=E.scale}function K(V,E,D,M){if(V.diffuse.value.copy(E.color),V.opacity.value=E.opacity,V.size.value=E.size*D,V.scale.value=M*0.5,E.map)V.map.value=E.map,Q(E.map,V.uvTransform);if(E.alphaMap)V.alphaMap.value=E.alphaMap,Q(E.alphaMap,V.alphaMapTransform);if(E.alphaTest>0)V.alphaTest.value=E.alphaTest}function q(V,E){if(V.diffuse.value.copy(E.color),V.opacity.value=E.opacity,V.rotation.value=E.rotation,E.map)V.map.value=E.map,Q(E.map,V.mapTransform);if(E.alphaMap)V.alphaMap.value=E.alphaMap,Q(E.alphaMap,V.alphaMapTransform);if(E.alphaTest>0)V.alphaTest.value=E.alphaTest}function G(V,E){V.specular.value.copy(E.specular),V.shininess.value=Math.max(E.shininess,0.0001)}function U(V,E){if(E.gradientMap)V.gradientMap.value=E.gradientMap}function F(V,E){if(V.metalness.value=E.metalness,E.metalnessMap)V.metalnessMap.value=E.metalnessMap,Q(E.metalnessMap,V.metalnessMapTransform);if(V.roughness.value=E.roughness,E.roughnessMap)V.roughnessMap.value=E.roughnessMap,Q(E.roughnessMap,V.roughnessMapTransform);if(E.envMap)V.envMapIntensity.value=E.envMapIntensity}function O(V,E,D){if(V.ior.value=E.ior,E.sheen>0){if(V.sheenColor.value.copy(E.sheenColor).multiplyScalar(E.sheen),V.sheenRoughness.value=E.sheenRoughness,E.sheenColorMap)V.sheenColorMap.value=E.sheenColorMap,Q(E.sheenColorMap,V.sheenColorMapTransform);if(E.sheenRoughnessMap)V.sheenRoughnessMap.value=E.sheenRoughnessMap,Q(E.sheenRoughnessMap,V.sheenRoughnessMapTransform)}if(E.clearcoat>0){if(V.clearcoat.value=E.clearcoat,V.clearcoatRoughness.value=E.clearcoatRoughness,E.clearcoatMap)V.clearcoatMap.value=E.clearcoatMap,Q(E.clearcoatMap,V.clearcoatMapTransform);if(E.clearcoatRoughnessMap)V.clearcoatRoughnessMap.value=E.clearcoatRoughnessMap,Q(E.clearcoatRoughnessMap,V.clearcoatRoughnessMapTransform);if(E.clearcoatNormalMap){if(V.clearcoatNormalMap.value=E.clearcoatNormalMap,Q(E.clearcoatNormalMap,V.clearcoatNormalMapTransform),V.clearcoatNormalScale.value.copy(E.clearcoatNormalScale),E.side===1)V.clearcoatNormalScale.value.negate()}}if(E.dispersion>0)V.dispersion.value=E.dispersion;if(E.iridescence>0){if(V.iridescence.value=E.iridescence,V.iridescenceIOR.value=E.iridescenceIOR,V.iridescenceThicknessMinimum.value=E.iridescenceThicknessRange[0],V.iridescenceThicknessMaximum.value=E.iridescenceThicknessRange[1],E.iridescenceMap)V.iridescenceMap.value=E.iridescenceMap,Q(E.iridescenceMap,V.iridescenceMapTransform);if(E.iridescenceThicknessMap)V.iridescenceThicknessMap.value=E.iridescenceThicknessMap,Q(E.iridescenceThicknessMap,V.iridescenceThicknessMapTransform)}if(E.transmission>0){if(V.transmission.value=E.transmission,V.transmissionSamplerMap.value=D.texture,V.transmissionSamplerSize.value.set(D.width,D.height),E.transmissionMap)V.transmissionMap.value=E.transmissionMap,Q(E.transmissionMap,V.transmissionMapTransform);if(V.thickness.value=E.thickness,E.thicknessMap)V.thicknessMap.value=E.thicknessMap,Q(E.thicknessMap,V.thicknessMapTransform);V.attenuationDistance.value=E.attenuationDistance,V.attenuationColor.value.copy(E.attenuationColor)}if(E.anisotropy>0){if(V.anisotropyVector.value.set(E.anisotropy*Math.cos(E.anisotropyRotation),E.anisotropy*Math.sin(E.anisotropyRotation)),E.anisotropyMap)V.anisotropyMap.value=E.anisotropyMap,Q(E.anisotropyMap,V.anisotropyMapTransform)}if(V.specularIntensity.value=E.specularIntensity,V.specularColor.value.copy(E.specularColor),E.specularColorMap)V.specularColorMap.value=E.specularColorMap,Q(E.specularColorMap,V.specularColorMapTransform);if(E.specularIntensityMap)V.specularIntensityMap.value=E.specularIntensityMap,Q(E.specularIntensityMap,V.specularIntensityMapTransform)}function z(V,E){if(E.matcap)V.matcap.value=E.matcap}function R(V,E){let D=$.get(E).light;V.referencePosition.value.setFromMatrixPosition(D.matrixWorld),V.nearDistance.value=D.shadow.camera.near,V.farDistance.value=D.shadow.camera.far}return{refreshFogUniforms:Z,refreshMaterialUniforms:W}}function X4(J,$,Q,Z){let W={},Y={},X=[],H=J.getParameter(J.MAX_UNIFORM_BUFFER_BINDINGS);function K(D,M){let _=M.program;Z.uniformBlockBinding(D,_)}function q(D,M){let _=W[D.id];if(_===void 0)z(D),_=G(D),W[D.id]=_,D.addEventListener("dispose",V);let x=M.program;Z.updateUBOMapping(D,x);let C=$.render.frame;if(Y[D.id]!==C)F(D),Y[D.id]=C}function G(D){let M=U();D.__bindingPointIndex=M;let _=J.createBuffer(),x=D.__size,C=D.usage;return J.bindBuffer(J.UNIFORM_BUFFER,_),J.bufferData(J.UNIFORM_BUFFER,x,C),J.bindBuffer(J.UNIFORM_BUFFER,null),J.bindBufferBase(J.UNIFORM_BUFFER,M,_),_}function U(){for(let D=0;D<H;D++)if(X.indexOf(D)===-1)return X.push(D),D;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function F(D){let M=W[D.id],_=D.uniforms,x=D.__cache;J.bindBuffer(J.UNIFORM_BUFFER,M);for(let C=0,P=_.length;C<P;C++){let p=Array.isArray(_[C])?_[C]:[_[C]];for(let k=0,L=p.length;k<L;k++){let y=p[k];if(O(y,C,k,x)===!0){let b=y.__offset,d=Array.isArray(y.value)?y.value:[y.value],m=0;for(let a=0;a<d.length;a++){let l=d[a],r=R(l);if(typeof l==="number"||typeof l==="boolean")y.__data[0]=l,J.bufferSubData(J.UNIFORM_BUFFER,b+m,y.__data);else if(l.isMatrix3)y.__data[0]=l.elements[0],y.__data[1]=l.elements[1],y.__data[2]=l.elements[2],y.__data[3]=0,y.__data[4]=l.elements[3],y.__data[5]=l.elements[4],y.__data[6]=l.elements[5],y.__data[7]=0,y.__data[8]=l.elements[6],y.__data[9]=l.elements[7],y.__data[10]=l.elements[8],y.__data[11]=0;else l.toArray(y.__data,m),m+=r.storage/Float32Array.BYTES_PER_ELEMENT}J.bufferSubData(J.UNIFORM_BUFFER,b,y.__data)}}}J.bindBuffer(J.UNIFORM_BUFFER,null)}function O(D,M,_,x){let C=D.value,P=M+"_"+_;if(x[P]===void 0){if(typeof C==="number"||typeof C==="boolean")x[P]=C;else x[P]=C.clone();return!0}else{let p=x[P];if(typeof C==="number"||typeof C==="boolean"){if(p!==C)return x[P]=C,!0}else if(p.equals(C)===!1)return p.copy(C),!0}return!1}function z(D){let M=D.uniforms,_=0,x=16;for(let P=0,p=M.length;P<p;P++){let k=Array.isArray(M[P])?M[P]:[M[P]];for(let L=0,y=k.length;L<y;L++){let b=k[L],d=Array.isArray(b.value)?b.value:[b.value];for(let m=0,a=d.length;m<a;m++){let l=d[m],r=R(l),g=_%x,HJ=g%r.boundary,qJ=g+HJ;if(_+=HJ,qJ!==0&&x-qJ<r.storage)_+=x-qJ;b.__data=new Float32Array(r.storage/Float32Array.BYTES_PER_ELEMENT),b.__offset=_,_+=r.storage}}}let C=_%x;if(C>0)_+=x-C;return D.__size=_,D.__cache={},this}function R(D){let M={boundary:0,storage:0};if(typeof D==="number"||typeof D==="boolean")M.boundary=4,M.storage=4;else if(D.isVector2)M.boundary=8,M.storage=8;else if(D.isVector3||D.isColor)M.boundary=16,M.storage=12;else if(D.isVector4)M.boundary=16,M.storage=16;else if(D.isMatrix3)M.boundary=48,M.storage=48;else if(D.isMatrix4)M.boundary=64,M.storage=64;else if(D.isTexture)console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.");else console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",D);return M}function V(D){let M=D.target;M.removeEventListener("dispose",V);let _=X.indexOf(M.__bindingPointIndex);X.splice(_,1),J.deleteBuffer(W[M.id]),delete W[M.id],delete Y[M.id]}function E(){for(let D in W)J.deleteBuffer(W[D]);X=[],W={},Y={}}return{bind:K,update:q,dispose:E}}class A9{constructor(J={}){let{canvas:$=GZ(),context:Q=null,depth:Z=!0,stencil:W=!1,alpha:Y=!1,antialias:X=!1,premultipliedAlpha:H=!0,preserveDrawingBuffer:K=!1,powerPreference:q="default",failIfMajorPerformanceCaveat:G=!1,reverseDepthBuffer:U=!1}=J;this.isWebGLRenderer=!0;let F;if(Q!==null){if(typeof WebGLRenderingContext<"u"&&Q instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");F=Q.getContextAttributes().alpha}else F=Y;let O=new Uint32Array(4),z=new Int32Array(4),R=null,V=null,E=[],D=[];this.domElement=$,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace="srgb",this.toneMapping=0,this.toneMappingExposure=1;let M=this,_=!1,x=0,C=0,P=null,p=-1,k=null,L=new dJ,y=new dJ,b=null,d=new DJ(0),m=0,a=$.width,l=$.height,r=1,g=null,HJ=null,qJ=new dJ(0,0,a,l),PJ=new dJ(0,0,a,l),gJ=!1,n=new L8,e=!1,zJ=!1,BJ=new _J,ZJ=new _J,wJ=new A,aJ=new dJ,lJ={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},uJ=!1;function E0(){return P===null?r:1}let j=Q;function O0(B,S){return $.getContext(B,S)}try{let B={alpha:!0,depth:Z,stencil:W,antialias:X,premultipliedAlpha:H,preserveDrawingBuffer:K,powerPreference:q,failIfMajorPerformanceCaveat:G};if("setAttribute"in $)$.setAttribute("data-engine","three.js r170");if($.addEventListener("webglcontextlost",c,!1),$.addEventListener("webglcontextrestored",s,!1),$.addEventListener("webglcontextcreationerror",KJ,!1),j===null){if(j=O0("webgl2",B),j===null)if(O0("webgl2"))throw Error("Error creating WebGL context with your selected attributes.");else throw Error("Error creating WebGL context.")}}catch(B){throw console.error("THREE.WebGLRenderer: "+B.message),B}let rJ,tJ,VJ,Y0,MJ,TJ,w,N,v,o,i,u,kJ,WJ,UJ,IJ,JJ,GJ,xJ,CJ,FJ,SJ,fJ,W0;function T(){if(rJ=new LX(j),rJ.init(),SJ=new J4(j,rJ),tJ=new RX(j,rJ,J,SJ),VJ=new rH(j,rJ),tJ.reverseDepthBuffer&&U)VJ.buffers.depth.setReversed(!0);Y0=new CX(j),MJ=new bH,TJ=new eH(j,rJ,VJ,MJ,tJ,SJ,Y0),w=new zX(M),N=new kX(M),v=new jZ(j),fJ=new EX(j,v),o=new DX(j,v,Y0,fJ),i=new PX(j,o,v,Y0),xJ=new _X(j,tJ,TJ),IJ=new NX(MJ),u=new xH(M,w,N,rJ,tJ,fJ,IJ),kJ=new Y4(M,MJ),WJ=new pH,UJ=new nH(rJ),GJ=new VX(M,w,N,VJ,i,F,H),JJ=new iH(M,i,tJ),W0=new X4(j,Y0,tJ,VJ),CJ=new OX(j,rJ,Y0),FJ=new wX(j,rJ,Y0),Y0.programs=u.programs,M.capabilities=tJ,M.extensions=rJ,M.properties=MJ,M.renderLists=WJ,M.shadowMap=JJ,M.state=VJ,M.info=Y0}T();let t=new JQ(M,j);this.xr=t,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){let B=rJ.get("WEBGL_lose_context");if(B)B.loseContext()},this.forceContextRestore=function(){let B=rJ.get("WEBGL_lose_context");if(B)B.restoreContext()},this.getPixelRatio=function(){return r},this.setPixelRatio=function(B){if(B===void 0)return;r=B,this.setSize(a,l,!1)},this.getSize=function(B){return B.set(a,l)},this.setSize=function(B,S,h=!0){if(t.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}if(a=B,l=S,$.width=Math.floor(B*r),$.height=Math.floor(S*r),h===!0)$.style.width=B+"px",$.style.height=S+"px";this.setViewport(0,0,B,S)},this.getDrawingBufferSize=function(B){return B.set(a*r,l*r).floor()},this.setDrawingBufferSize=function(B,S,h){a=B,l=S,r=h,$.width=Math.floor(B*h),$.height=Math.floor(S*h),this.setViewport(0,0,B,S)},this.getCurrentViewport=function(B){return B.copy(L)},this.getViewport=function(B){return B.copy(qJ)},this.setViewport=function(B,S,h,f){if(B.isVector4)qJ.set(B.x,B.y,B.z,B.w);else qJ.set(B,S,h,f);VJ.viewport(L.copy(qJ).multiplyScalar(r).round())},this.getScissor=function(B){return B.copy(PJ)},this.setScissor=function(B,S,h,f){if(B.isVector4)PJ.set(B.x,B.y,B.z,B.w);else PJ.set(B,S,h,f);VJ.scissor(y.copy(PJ).multiplyScalar(r).round())},this.getScissorTest=function(){return gJ},this.setScissorTest=function(B){VJ.setScissorTest(gJ=B)},this.setOpaqueSort=function(B){g=B},this.setTransparentSort=function(B){HJ=B},this.getClearColor=function(B){return B.copy(GJ.getClearColor())},this.setClearColor=function(){GJ.setClearColor.apply(GJ,arguments)},this.getClearAlpha=function(){return GJ.getClearAlpha()},this.setClearAlpha=function(){GJ.setClearAlpha.apply(GJ,arguments)},this.clear=function(B=!0,S=!0,h=!0){let f=0;if(B){let I=!1;if(P!==null){let $J=P.texture.format;I=$J===1033||$J===1031||$J===1029}if(I){let $J=P.texture.type,XJ=$J===1009||$J===1014||$J===1012||$J===1020||$J===1017||$J===1018,EJ=GJ.getClearColor(),OJ=GJ.getClearAlpha(),AJ=EJ.r,jJ=EJ.g,RJ=EJ.b;if(XJ)O[0]=AJ,O[1]=jJ,O[2]=RJ,O[3]=OJ,j.clearBufferuiv(j.COLOR,0,O);else z[0]=AJ,z[1]=jJ,z[2]=RJ,z[3]=OJ,j.clearBufferiv(j.COLOR,0,z)}else f|=j.COLOR_BUFFER_BIT}if(S)f|=j.DEPTH_BUFFER_BIT;if(h)f|=j.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295);j.clear(f)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){$.removeEventListener("webglcontextlost",c,!1),$.removeEventListener("webglcontextrestored",s,!1),$.removeEventListener("webglcontextcreationerror",KJ,!1),WJ.dispose(),UJ.dispose(),MJ.dispose(),w.dispose(),N.dispose(),i.dispose(),fJ.dispose(),W0.dispose(),u.dispose(),t.dispose(),t.removeEventListener("sessionstart",o0),t.removeEventListener("sessionend",W$),I6.stop()};function c(B){B.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function s(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;let B=Y0.autoReset,S=JJ.enabled,h=JJ.autoUpdate,f=JJ.needsUpdate,I=JJ.type;T(),Y0.autoReset=B,JJ.enabled=S,JJ.autoUpdate=h,JJ.needsUpdate=f,JJ.type=I}function KJ(B){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",B.statusMessage)}function YJ(B){let S=B.target;S.removeEventListener("dispose",YJ),vJ(S)}function vJ(B){X0(B),MJ.remove(B)}function X0(B){let S=MJ.get(B).programs;if(S!==void 0){if(S.forEach(function(h){u.releaseProgram(h)}),B.isShaderMaterial)u.releaseShaderCache(B)}}this.renderBufferDirect=function(B,S,h,f,I,$J){if(S===null)S=lJ;let XJ=I.isMesh&&I.matrixWorld.determinant()<0,EJ=cQ(B,S,h,f,I);VJ.setMaterial(f,XJ);let OJ=h.index,AJ=1;if(f.wireframe===!0){if(OJ=o.getWireframeAttribute(h),OJ===void 0)return;AJ=2}let jJ=h.drawRange,RJ=h.attributes.position,mJ=jJ.start*AJ,J0=(jJ.start+jJ.count)*AJ;if($J!==null)mJ=Math.max(mJ,$J.start*AJ),J0=Math.min(J0,($J.start+$J.count)*AJ);if(OJ!==null)mJ=Math.max(mJ,0),J0=Math.min(J0,OJ.count);else if(RJ!==void 0&&RJ!==null)mJ=Math.max(mJ,0),J0=Math.min(J0,RJ.count);let $0=J0-mJ;if($0<0||$0===1/0)return;fJ.setup(I,f,EJ,h,OJ);let w0,nJ=CJ;if(OJ!==null)w0=v.get(OJ),nJ=FJ,nJ.setIndex(w0);if(I.isMesh)if(f.wireframe===!0)VJ.setLineWidth(f.wireframeLinewidth*E0()),nJ.setMode(j.LINES);else nJ.setMode(j.TRIANGLES);else if(I.isLine){let NJ=f.linewidth;if(NJ===void 0)NJ=1;if(VJ.setLineWidth(NJ*E0()),I.isLineSegments)nJ.setMode(j.LINES);else if(I.isLineLoop)nJ.setMode(j.LINE_LOOP);else nJ.setMode(j.LINE_STRIP)}else if(I.isPoints)nJ.setMode(j.POINTS);else if(I.isSprite)nJ.setMode(j.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)nJ.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(!rJ.get("WEBGL_multi_draw")){let{_multiDrawStarts:NJ,_multiDrawCounts:$6,_multiDrawCount:sJ}=I,b0=OJ?v.get(OJ).bytesPerElement:1,o6=MJ.get(f).currentProgram.getUniforms();for(let P0=0;P0<sJ;P0++)o6.setValue(j,"_gl_DrawID",P0),nJ.render(NJ[P0]/b0,$6[P0])}else nJ.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else if(I.isInstancedMesh)nJ.renderInstances(mJ,$0,I.count);else if(h.isInstancedBufferGeometry){let NJ=h._maxInstanceCount!==void 0?h._maxInstanceCount:1/0,$6=Math.min(h.instanceCount,NJ);nJ.renderInstances(mJ,$0,$6)}else nJ.render(mJ,$0)};function R0(B,S,h){if(B.transparent===!0&&B.side===2&&B.forceSinglePass===!1)B.side=1,B.needsUpdate=!0,p7(B,S,h),B.side=0,B.needsUpdate=!0,p7(B,S,h),B.side=2;else p7(B,S,h)}this.compile=function(B,S,h=null){if(h===null)h=B;if(V=UJ.get(h),V.init(S),D.push(V),h.traverseVisible(function(I){if(I.isLight&&I.layers.test(S.layers)){if(V.pushLight(I),I.castShadow)V.pushShadow(I)}}),B!==h)B.traverseVisible(function(I){if(I.isLight&&I.layers.test(S.layers)){if(V.pushLight(I),I.castShadow)V.pushShadow(I)}});V.setupLights();let f=new Set;return B.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;let $J=I.material;if($J)if(Array.isArray($J))for(let XJ=0;XJ<$J.length;XJ++){let EJ=$J[XJ];R0(EJ,h,I),f.add(EJ)}else R0($J,h,I),f.add($J)}),D.pop(),V=null,f},this.compileAsync=function(B,S,h=null){let f=this.compile(B,S,h);return new Promise((I)=>{function $J(){if(f.forEach(function(XJ){if(MJ.get(XJ).currentProgram.isReady())f.delete(XJ)}),f.size===0){I(B);return}setTimeout($J,10)}if(rJ.get("KHR_parallel_shader_compile")!==null)$J();else setTimeout($J,10)})};let cJ=null;function J6(B){if(cJ)cJ(B)}function o0(){I6.stop()}function W$(){I6.start()}let I6=new p5;if(I6.setAnimationLoop(J6),typeof self<"u")I6.setContext(self);this.setAnimationLoop=function(B){cJ=B,t.setAnimationLoop(B),B===null?I6.stop():I6.start()},t.addEventListener("sessionstart",o0),t.addEventListener("sessionend",W$),this.render=function(B,S){if(S!==void 0&&S.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;if(B.matrixWorldAutoUpdate===!0)B.updateMatrixWorld();if(S.parent===null&&S.matrixWorldAutoUpdate===!0)S.updateMatrixWorld();if(t.enabled===!0&&t.isPresenting===!0){if(t.cameraAutoUpdate===!0)t.updateCamera(S);S=t.getCamera()}if(B.isScene===!0)B.onBeforeRender(M,B,S,P);if(V=UJ.get(B,D.length),V.init(S),D.push(V),ZJ.multiplyMatrices(S.projectionMatrix,S.matrixWorldInverse),n.setFromProjectionMatrix(ZJ),zJ=this.localClippingEnabled,e=IJ.init(this.clippingPlanes,zJ),R=WJ.get(B,E.length),R.init(),E.push(R),t.enabled===!0&&t.isPresenting===!0){let $J=M.xr.getDepthSensingMesh();if($J!==null)v8($J,S,-1/0,M.sortObjects)}if(v8(B,S,0,M.sortObjects),R.finish(),M.sortObjects===!0)R.sort(g,HJ);if(uJ=t.enabled===!1||t.isPresenting===!1||t.hasDepthSensing()===!1,uJ)GJ.addToRenderList(R,B);if(this.info.render.frame++,e===!0)IJ.beginShadows();let h=V.state.shadowsArray;if(JJ.render(h,B,S),e===!0)IJ.endShadows();if(this.info.autoReset===!0)this.info.reset();let{opaque:f,transmissive:I}=R;if(V.setupLights(),S.isArrayCamera){let $J=S.cameras;if(I.length>0)for(let XJ=0,EJ=$J.length;XJ<EJ;XJ++){let OJ=$J[XJ];X$(f,I,B,OJ)}if(uJ)GJ.render(B);for(let XJ=0,EJ=$J.length;XJ<EJ;XJ++){let OJ=$J[XJ];Y$(R,B,OJ,OJ.viewport)}}else{if(I.length>0)X$(f,I,B,S);if(uJ)GJ.render(B);Y$(R,B,S)}if(P!==null)TJ.updateMultisampleRenderTarget(P),TJ.updateRenderTargetMipmap(P);if(B.isScene===!0)B.onAfterRender(M,B,S);if(fJ.resetDefaultState(),p=-1,k=null,D.pop(),D.length>0){if(V=D[D.length-1],e===!0)IJ.setGlobalState(M.clippingPlanes,V.state.camera)}else V=null;if(E.pop(),E.length>0)R=E[E.length-1];else R=null};function v8(B,S,h,f){if(B.visible===!1)return;if(B.layers.test(S.layers)){if(B.isGroup)h=B.renderOrder;else if(B.isLOD){if(B.autoUpdate===!0)B.update(S)}else if(B.isLight){if(V.pushLight(B),B.castShadow)V.pushShadow(B)}else if(B.isSprite){if(!B.frustumCulled||n.intersectsSprite(B)){if(f)aJ.setFromMatrixPosition(B.matrixWorld).applyMatrix4(ZJ);let XJ=i.update(B),EJ=B.material;if(EJ.visible)R.push(B,XJ,EJ,h,aJ.z,null)}}else if(B.isMesh||B.isLine||B.isPoints){if(!B.frustumCulled||n.intersectsObject(B)){let XJ=i.update(B),EJ=B.material;if(f){if(B.boundingSphere!==void 0){if(B.boundingSphere===null)B.computeBoundingSphere();aJ.copy(B.boundingSphere.center)}else{if(XJ.boundingSphere===null)XJ.computeBoundingSphere();aJ.copy(XJ.boundingSphere.center)}aJ.applyMatrix4(B.matrixWorld).applyMatrix4(ZJ)}if(Array.isArray(EJ)){let OJ=XJ.groups;for(let AJ=0,jJ=OJ.length;AJ<jJ;AJ++){let RJ=OJ[AJ],mJ=EJ[RJ.materialIndex];if(mJ&&mJ.visible)R.push(B,XJ,mJ,h,aJ.z,RJ)}}else if(EJ.visible)R.push(B,XJ,EJ,h,aJ.z,null)}}}let $J=B.children;for(let XJ=0,EJ=$J.length;XJ<EJ;XJ++)v8($J[XJ],S,h,f)}function Y$(B,S,h,f){let{opaque:I,transmissive:$J,transparent:XJ}=B;if(V.setupLightsView(h),e===!0)IJ.setGlobalState(M.clippingPlanes,h);if(f)VJ.viewport(L.copy(f));if(I.length>0)g7(I,S,h);if($J.length>0)g7($J,S,h);if(XJ.length>0)g7(XJ,S,h);VJ.buffers.depth.setTest(!0),VJ.buffers.depth.setMask(!0),VJ.buffers.color.setMask(!0),VJ.setPolygonOffset(!1)}function X$(B,S,h,f){if((h.isScene===!0?h.overrideMaterial:null)!==null)return;if(V.state.transmissionRenderTarget[f.id]===void 0)V.state.transmissionRenderTarget[f.id]=new k6(1,1,{generateMipmaps:!0,type:rJ.has("EXT_color_buffer_half_float")||rJ.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:W,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:pJ.workingColorSpace});let $J=V.state.transmissionRenderTarget[f.id],XJ=f.viewport||L;$J.setSize(XJ.z,XJ.w);let EJ=M.getRenderTarget();if(M.setRenderTarget($J),M.getClearColor(d),m=M.getClearAlpha(),m<1)M.setClearColor(16777215,0.5);if(M.clear(),uJ)GJ.render(h);let OJ=M.toneMapping;M.toneMapping=0;let AJ=f.viewport;if(f.viewport!==void 0)f.viewport=void 0;if(V.setupLightsView(f),e===!0)IJ.setGlobalState(M.clippingPlanes,f);if(g7(B,h,f),TJ.updateMultisampleRenderTarget($J),TJ.updateRenderTargetMipmap($J),rJ.has("WEBGL_multisampled_render_to_texture")===!1){let jJ=!1;for(let RJ=0,mJ=S.length;RJ<mJ;RJ++){let J0=S[RJ],$0=J0.object,w0=J0.geometry,nJ=J0.material,NJ=J0.group;if(nJ.side===2&&$0.layers.test(f.layers)){let $6=nJ.side;nJ.side=1,nJ.needsUpdate=!0,H$($0,h,f,w0,nJ,NJ),nJ.side=$6,nJ.needsUpdate=!0,jJ=!0}}if(jJ===!0)TJ.updateMultisampleRenderTarget($J),TJ.updateRenderTargetMipmap($J)}if(M.setRenderTarget(EJ),M.setClearColor(d,m),AJ!==void 0)f.viewport=AJ;M.toneMapping=OJ}function g7(B,S,h){let f=S.isScene===!0?S.overrideMaterial:null;for(let I=0,$J=B.length;I<$J;I++){let XJ=B[I],EJ=XJ.object,OJ=XJ.geometry,AJ=f===null?XJ.material:f,jJ=XJ.group;if(EJ.layers.test(h.layers))H$(EJ,S,h,OJ,AJ,jJ)}}function H$(B,S,h,f,I,$J){if(B.onBeforeRender(M,S,h,f,I,$J),B.modelViewMatrix.multiplyMatrices(h.matrixWorldInverse,B.matrixWorld),B.normalMatrix.getNormalMatrix(B.modelViewMatrix),I.onBeforeRender(M,S,h,f,B,$J),I.transparent===!0&&I.side===2&&I.forceSinglePass===!1)I.side=1,I.needsUpdate=!0,M.renderBufferDirect(h,S,f,I,B,$J),I.side=0,I.needsUpdate=!0,M.renderBufferDirect(h,S,f,I,B,$J),I.side=2;else M.renderBufferDirect(h,S,f,I,B,$J);B.onAfterRender(M,S,h,f,I,$J)}function p7(B,S,h){if(S.isScene!==!0)S=lJ;let f=MJ.get(B),I=V.state.lights,$J=V.state.shadowsArray,XJ=I.state.version,EJ=u.getParameters(B,I.state,$J,S,h),OJ=u.getProgramCacheKey(EJ),AJ=f.programs;if(f.environment=B.isMeshStandardMaterial?S.environment:null,f.fog=S.fog,f.envMap=(B.isMeshStandardMaterial?N:w).get(B.envMap||f.environment),f.envMapRotation=f.environment!==null&&B.envMap===null?S.environmentRotation:B.envMapRotation,AJ===void 0)B.addEventListener("dispose",YJ),AJ=new Map,f.programs=AJ;let jJ=AJ.get(OJ);if(jJ!==void 0){if(f.currentProgram===jJ&&f.lightsStateVersion===XJ)return q$(B,EJ),jJ}else EJ.uniforms=u.getUniforms(B),B.onBeforeCompile(EJ,M),jJ=u.acquireProgram(EJ,OJ),AJ.set(OJ,jJ),f.uniforms=EJ.uniforms;let RJ=f.uniforms;if(!B.isShaderMaterial&&!B.isRawShaderMaterial||B.clipping===!0)RJ.clippingPlanes=IJ.uniform;if(q$(B,EJ),f.needsLights=sQ(B),f.lightsStateVersion=XJ,f.needsLights)RJ.ambientLightColor.value=I.state.ambient,RJ.lightProbe.value=I.state.probe,RJ.directionalLights.value=I.state.directional,RJ.directionalLightShadows.value=I.state.directionalShadow,RJ.spotLights.value=I.state.spot,RJ.spotLightShadows.value=I.state.spotShadow,RJ.rectAreaLights.value=I.state.rectArea,RJ.ltc_1.value=I.state.rectAreaLTC1,RJ.ltc_2.value=I.state.rectAreaLTC2,RJ.pointLights.value=I.state.point,RJ.pointLightShadows.value=I.state.pointShadow,RJ.hemisphereLights.value=I.state.hemi,RJ.directionalShadowMap.value=I.state.directionalShadowMap,RJ.directionalShadowMatrix.value=I.state.directionalShadowMatrix,RJ.spotShadowMap.value=I.state.spotShadowMap,RJ.spotLightMatrix.value=I.state.spotLightMatrix,RJ.spotLightMap.value=I.state.spotLightMap,RJ.pointShadowMap.value=I.state.pointShadowMap,RJ.pointShadowMatrix.value=I.state.pointShadowMatrix;return f.currentProgram=jJ,f.uniformsList=null,jJ}function K$(B){if(B.uniformsList===null){let S=B.currentProgram.getUniforms();B.uniformsList=I7.seqWithValue(S.seq,B.uniforms)}return B.uniformsList}function q$(B,S){let h=MJ.get(B);h.outputColorSpace=S.outputColorSpace,h.batching=S.batching,h.batchingColor=S.batchingColor,h.instancing=S.instancing,h.instancingColor=S.instancingColor,h.instancingMorph=S.instancingMorph,h.skinning=S.skinning,h.morphTargets=S.morphTargets,h.morphNormals=S.morphNormals,h.morphColors=S.morphColors,h.morphTargetsCount=S.morphTargetsCount,h.numClippingPlanes=S.numClippingPlanes,h.numIntersection=S.numClipIntersection,h.vertexAlphas=S.vertexAlphas,h.vertexTangents=S.vertexTangents,h.toneMapping=S.toneMapping}function cQ(B,S,h,f,I){if(S.isScene!==!0)S=lJ;TJ.resetTextureUnits();let $J=S.fog,XJ=f.isMeshStandardMaterial?S.environment:null,EJ=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:"srgb-linear",OJ=(f.isMeshStandardMaterial?N:w).get(f.envMap||XJ),AJ=f.vertexColors===!0&&!!h.attributes.color&&h.attributes.color.itemSize===4,jJ=!!h.attributes.tangent&&(!!f.normalMap||f.anisotropy>0),RJ=!!h.morphAttributes.position,mJ=!!h.morphAttributes.normal,J0=!!h.morphAttributes.color,$0=0;if(f.toneMapped){if(P===null||P.isXRRenderTarget===!0)$0=M.toneMapping}let w0=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,nJ=w0!==void 0?w0.length:0,NJ=MJ.get(f),$6=V.state.lights;if(e===!0){if(zJ===!0||B!==k){let j0=B===k&&f.id===p;IJ.setState(f,B,j0)}}let sJ=!1;if(f.version===NJ.__version){if(NJ.needsLights&&NJ.lightsStateVersion!==$6.state.version)sJ=!0;else if(NJ.outputColorSpace!==EJ)sJ=!0;else if(I.isBatchedMesh&&NJ.batching===!1)sJ=!0;else if(!I.isBatchedMesh&&NJ.batching===!0)sJ=!0;else if(I.isBatchedMesh&&NJ.batchingColor===!0&&I.colorTexture===null)sJ=!0;else if(I.isBatchedMesh&&NJ.batchingColor===!1&&I.colorTexture!==null)sJ=!0;else if(I.isInstancedMesh&&NJ.instancing===!1)sJ=!0;else if(!I.isInstancedMesh&&NJ.instancing===!0)sJ=!0;else if(I.isSkinnedMesh&&NJ.skinning===!1)sJ=!0;else if(!I.isSkinnedMesh&&NJ.skinning===!0)sJ=!0;else if(I.isInstancedMesh&&NJ.instancingColor===!0&&I.instanceColor===null)sJ=!0;else if(I.isInstancedMesh&&NJ.instancingColor===!1&&I.instanceColor!==null)sJ=!0;else if(I.isInstancedMesh&&NJ.instancingMorph===!0&&I.morphTexture===null)sJ=!0;else if(I.isInstancedMesh&&NJ.instancingMorph===!1&&I.morphTexture!==null)sJ=!0;else if(NJ.envMap!==OJ)sJ=!0;else if(f.fog===!0&&NJ.fog!==$J)sJ=!0;else if(NJ.numClippingPlanes!==void 0&&(NJ.numClippingPlanes!==IJ.numPlanes||NJ.numIntersection!==IJ.numIntersection))sJ=!0;else if(NJ.vertexAlphas!==AJ)sJ=!0;else if(NJ.vertexTangents!==jJ)sJ=!0;else if(NJ.morphTargets!==RJ)sJ=!0;else if(NJ.morphNormals!==mJ)sJ=!0;else if(NJ.morphColors!==J0)sJ=!0;else if(NJ.toneMapping!==$0)sJ=!0;else if(NJ.morphTargetsCount!==nJ)sJ=!0}else sJ=!0,NJ.__version=f.version;let b0=NJ.currentProgram;if(sJ===!0)b0=p7(f,S,I);let o6=!1,P0=!1,R7=!1,Q0=b0.getUniforms(),i0=NJ.uniforms;if(VJ.useProgram(b0.program))o6=!0,P0=!0,R7=!0;if(f.id!==p)p=f.id,P0=!0;if(o6||k!==B){if(VJ.buffers.depth.getReversed())BJ.copy(B.projectionMatrix),FZ(BJ),VZ(BJ),Q0.setValue(j,"projectionMatrix",BJ);else Q0.setValue(j,"projectionMatrix",B.projectionMatrix);Q0.setValue(j,"viewMatrix",B.matrixWorldInverse);let F6=Q0.map.cameraPosition;if(F6!==void 0)F6.setValue(j,wJ.setFromMatrixPosition(B.matrixWorld));if(tJ.logarithmicDepthBuffer)Q0.setValue(j,"logDepthBufFC",2/(Math.log(B.far+1)/Math.LN2));if(f.isMeshPhongMaterial||f.isMeshToonMaterial||f.isMeshLambertMaterial||f.isMeshBasicMaterial||f.isMeshStandardMaterial||f.isShaderMaterial)Q0.setValue(j,"isOrthographic",B.isOrthographicCamera===!0);if(k!==B)k=B,P0=!0,R7=!0}if(I.isSkinnedMesh){Q0.setOptional(j,I,"bindMatrix"),Q0.setOptional(j,I,"bindMatrixInverse");let j0=I.skeleton;if(j0){if(j0.boneTexture===null)j0.computeBoneTexture();Q0.setValue(j,"boneTexture",j0.boneTexture,TJ)}}if(I.isBatchedMesh){if(Q0.setOptional(j,I,"batchingTexture"),Q0.setValue(j,"batchingTexture",I._matricesTexture,TJ),Q0.setOptional(j,I,"batchingIdTexture"),Q0.setValue(j,"batchingIdTexture",I._indirectTexture,TJ),Q0.setOptional(j,I,"batchingColorTexture"),I._colorsTexture!==null)Q0.setValue(j,"batchingColorTexture",I._colorsTexture,TJ)}let N7=h.morphAttributes;if(N7.position!==void 0||N7.normal!==void 0||N7.color!==void 0)xJ.update(I,h,b0);if(P0||NJ.receiveShadow!==I.receiveShadow)NJ.receiveShadow=I.receiveShadow,Q0.setValue(j,"receiveShadow",I.receiveShadow);if(f.isMeshGouraudMaterial&&f.envMap!==null)i0.envMap.value=OJ,i0.flipEnvMap.value=OJ.isCubeTexture&&OJ.isRenderTargetTexture===!1?-1:1;if(f.isMeshStandardMaterial&&f.envMap===null&&S.environment!==null)i0.envMapIntensity.value=S.environmentIntensity;if(P0){if(Q0.setValue(j,"toneMappingExposure",M.toneMappingExposure),NJ.needsLights)nQ(i0,R7);if($J&&f.fog===!0)kJ.refreshFogUniforms(i0,$J);kJ.refreshMaterialUniforms(i0,f,r,l,V.state.transmissionRenderTarget[B.id]),I7.upload(j,K$(NJ),i0,TJ)}if(f.isShaderMaterial&&f.uniformsNeedUpdate===!0)I7.upload(j,K$(NJ),i0,TJ),f.uniformsNeedUpdate=!1;if(f.isSpriteMaterial)Q0.setValue(j,"center",I.center);if(Q0.setValue(j,"modelViewMatrix",I.modelViewMatrix),Q0.setValue(j,"normalMatrix",I.normalMatrix),Q0.setValue(j,"modelMatrix",I.matrixWorld),f.isShaderMaterial||f.isRawShaderMaterial){let j0=f.uniformsGroups;for(let F6=0,V6=j0.length;F6<V6;F6++){let G$=j0[F6];W0.update(G$,b0),W0.bind(G$,b0)}}return b0}function nQ(B,S){B.ambientLightColor.needsUpdate=S,B.lightProbe.needsUpdate=S,B.directionalLights.needsUpdate=S,B.directionalLightShadows.needsUpdate=S,B.pointLights.needsUpdate=S,B.pointLightShadows.needsUpdate=S,B.spotLights.needsUpdate=S,B.spotLightShadows.needsUpdate=S,B.rectAreaLights.needsUpdate=S,B.hemisphereLights.needsUpdate=S}function sQ(B){return B.isMeshLambertMaterial||B.isMeshToonMaterial||B.isMeshPhongMaterial||B.isMeshStandardMaterial||B.isShadowMaterial||B.isShaderMaterial&&B.lights===!0}if(this.getActiveCubeFace=function(){return x},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(B,S,h){MJ.get(B.texture).__webglTexture=S,MJ.get(B.depthTexture).__webglTexture=h;let f=MJ.get(B);if(f.__hasExternalTextures=!0,f.__autoAllocateDepthBuffer=h===void 0,!f.__autoAllocateDepthBuffer){if(rJ.has("WEBGL_multisampled_render_to_texture")===!0)console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),f.__useRenderToTexture=!1}},this.setRenderTargetFramebuffer=function(B,S){let h=MJ.get(B);h.__webglFramebuffer=S,h.__useDefaultFramebuffer=S===void 0},this.setRenderTarget=function(B,S=0,h=0){P=B,x=S,C=h;let f=!0,I=null,$J=!1,XJ=!1;if(B){let OJ=MJ.get(B);if(OJ.__useDefaultFramebuffer!==void 0)VJ.bindFramebuffer(j.FRAMEBUFFER,null),f=!1;else if(OJ.__webglFramebuffer===void 0)TJ.setupRenderTarget(B);else if(OJ.__hasExternalTextures)TJ.rebindTextures(B,MJ.get(B.texture).__webglTexture,MJ.get(B.depthTexture).__webglTexture);else if(B.depthBuffer){let RJ=B.depthTexture;if(OJ.__boundDepthTexture!==RJ){if(RJ!==null&&MJ.has(RJ)&&(B.width!==RJ.image.width||B.height!==RJ.image.height))throw Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");TJ.setupDepthRenderbuffer(B)}}let AJ=B.texture;if(AJ.isData3DTexture||AJ.isDataArrayTexture||AJ.isCompressedArrayTexture)XJ=!0;let jJ=MJ.get(B).__webglFramebuffer;if(B.isWebGLCubeRenderTarget){if(Array.isArray(jJ[S]))I=jJ[S][h];else I=jJ[S];$J=!0}else if(B.samples>0&&TJ.useMultisampledRTT(B)===!1)I=MJ.get(B).__webglMultisampledFramebuffer;else if(Array.isArray(jJ))I=jJ[h];else I=jJ;L.copy(B.viewport),y.copy(B.scissor),b=B.scissorTest}else L.copy(qJ).multiplyScalar(r).floor(),y.copy(PJ).multiplyScalar(r).floor(),b=gJ;if(VJ.bindFramebuffer(j.FRAMEBUFFER,I)&&f)VJ.drawBuffers(B,I);if(VJ.viewport(L),VJ.scissor(y),VJ.setScissorTest(b),$J){let OJ=MJ.get(B.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_CUBE_MAP_POSITIVE_X+S,OJ.__webglTexture,h)}else if(XJ){let OJ=MJ.get(B.texture),AJ=S||0;j.framebufferTextureLayer(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,OJ.__webglTexture,h||0,AJ)}p=-1},this.readRenderTargetPixels=function(B,S,h,f,I,$J,XJ){if(!(B&&B.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let EJ=MJ.get(B).__webglFramebuffer;if(B.isWebGLCubeRenderTarget&&XJ!==void 0)EJ=EJ[XJ];if(EJ){VJ.bindFramebuffer(j.FRAMEBUFFER,EJ);try{let OJ=B.texture,AJ=OJ.format,jJ=OJ.type;if(!tJ.textureFormatReadable(AJ)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tJ.textureTypeReadable(jJ)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}if(S>=0&&S<=B.width-f&&(h>=0&&h<=B.height-I))j.readPixels(S,h,f,I,SJ.convert(AJ),SJ.convert(jJ),$J)}finally{let OJ=P!==null?MJ.get(P).__webglFramebuffer:null;VJ.bindFramebuffer(j.FRAMEBUFFER,OJ)}}},this.readRenderTargetPixelsAsync=async function(B,S,h,f,I,$J,XJ){if(!(B&&B.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let EJ=MJ.get(B).__webglFramebuffer;if(B.isWebGLCubeRenderTarget&&XJ!==void 0)EJ=EJ[XJ];if(EJ){let OJ=B.texture,AJ=OJ.format,jJ=OJ.type;if(!tJ.textureFormatReadable(AJ))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tJ.textureTypeReadable(jJ))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(S>=0&&S<=B.width-f&&(h>=0&&h<=B.height-I)){VJ.bindFramebuffer(j.FRAMEBUFFER,EJ);let RJ=j.createBuffer();j.bindBuffer(j.PIXEL_PACK_BUFFER,RJ),j.bufferData(j.PIXEL_PACK_BUFFER,$J.byteLength,j.STREAM_READ),j.readPixels(S,h,f,I,SJ.convert(AJ),SJ.convert(jJ),0);let mJ=P!==null?MJ.get(P).__webglFramebuffer:null;VJ.bindFramebuffer(j.FRAMEBUFFER,mJ);let J0=j.fenceSync(j.SYNC_GPU_COMMANDS_COMPLETE,0);return j.flush(),await UZ(j,J0,4),j.bindBuffer(j.PIXEL_PACK_BUFFER,RJ),j.getBufferSubData(j.PIXEL_PACK_BUFFER,0,$J),j.deleteBuffer(RJ),j.deleteSync(J0),$J}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(B,S=null,h=0){if(B.isTexture!==!0)_7("WebGLRenderer: copyFramebufferToTexture function signature has changed."),S=arguments[0]||null,B=arguments[1];let f=Math.pow(2,-h),I=Math.floor(B.image.width*f),$J=Math.floor(B.image.height*f),XJ=S!==null?S.x:0,EJ=S!==null?S.y:0;TJ.setTexture2D(B,0),j.copyTexSubImage2D(j.TEXTURE_2D,h,0,0,XJ,EJ,I,$J),VJ.unbindTexture()},this.copyTextureToTexture=function(B,S,h=null,f=null,I=0){if(B.isTexture!==!0)_7("WebGLRenderer: copyTextureToTexture function signature has changed."),f=arguments[0]||null,B=arguments[1],S=arguments[2],I=arguments[3]||0,h=null;let $J,XJ,EJ,OJ,AJ,jJ,RJ,mJ,J0,$0=B.isCompressedTexture?B.mipmaps[I]:B.image;if(h!==null)$J=h.max.x-h.min.x,XJ=h.max.y-h.min.y,EJ=h.isBox3?h.max.z-h.min.z:1,OJ=h.min.x,AJ=h.min.y,jJ=h.isBox3?h.min.z:0;else $J=$0.width,XJ=$0.height,EJ=$0.depth||1,OJ=0,AJ=0,jJ=0;if(f!==null)RJ=f.x,mJ=f.y,J0=f.z;else RJ=0,mJ=0,J0=0;let w0=SJ.convert(S.format),nJ=SJ.convert(S.type),NJ;if(S.isData3DTexture)TJ.setTexture3D(S,0),NJ=j.TEXTURE_3D;else if(S.isDataArrayTexture||S.isCompressedArrayTexture)TJ.setTexture2DArray(S,0),NJ=j.TEXTURE_2D_ARRAY;else TJ.setTexture2D(S,0),NJ=j.TEXTURE_2D;j.pixelStorei(j.UNPACK_FLIP_Y_WEBGL,S.flipY),j.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),j.pixelStorei(j.UNPACK_ALIGNMENT,S.unpackAlignment);let $6=j.getParameter(j.UNPACK_ROW_LENGTH),sJ=j.getParameter(j.UNPACK_IMAGE_HEIGHT),b0=j.getParameter(j.UNPACK_SKIP_PIXELS),o6=j.getParameter(j.UNPACK_SKIP_ROWS),P0=j.getParameter(j.UNPACK_SKIP_IMAGES);j.pixelStorei(j.UNPACK_ROW_LENGTH,$0.width),j.pixelStorei(j.UNPACK_IMAGE_HEIGHT,$0.height),j.pixelStorei(j.UNPACK_SKIP_PIXELS,OJ),j.pixelStorei(j.UNPACK_SKIP_ROWS,AJ),j.pixelStorei(j.UNPACK_SKIP_IMAGES,jJ);let R7=B.isDataArrayTexture||B.isData3DTexture,Q0=S.isDataArrayTexture||S.isData3DTexture;if(B.isRenderTargetTexture||B.isDepthTexture){let i0=MJ.get(B),N7=MJ.get(S),j0=MJ.get(i0.__renderTarget),F6=MJ.get(N7.__renderTarget);VJ.bindFramebuffer(j.READ_FRAMEBUFFER,j0.__webglFramebuffer),VJ.bindFramebuffer(j.DRAW_FRAMEBUFFER,F6.__webglFramebuffer);for(let V6=0;V6<EJ;V6++){if(R7)j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,MJ.get(B).__webglTexture,I,jJ+V6);if(B.isDepthTexture){if(Q0)j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,MJ.get(S).__webglTexture,I,J0+V6);j.blitFramebuffer(OJ,AJ,$J,XJ,RJ,mJ,$J,XJ,j.DEPTH_BUFFER_BIT,j.NEAREST)}else if(Q0)j.copyTexSubImage3D(NJ,I,RJ,mJ,J0+V6,OJ,AJ,$J,XJ);else j.copyTexSubImage2D(NJ,I,RJ,mJ,J0+V6,OJ,AJ,$J,XJ)}VJ.bindFramebuffer(j.READ_FRAMEBUFFER,null),VJ.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else if(Q0)if(B.isDataTexture||B.isData3DTexture)j.texSubImage3D(NJ,I,RJ,mJ,J0,$J,XJ,EJ,w0,nJ,$0.data);else if(S.isCompressedArrayTexture)j.compressedTexSubImage3D(NJ,I,RJ,mJ,J0,$J,XJ,EJ,w0,$0.data);else j.texSubImage3D(NJ,I,RJ,mJ,J0,$J,XJ,EJ,w0,nJ,$0);else if(B.isDataTexture)j.texSubImage2D(j.TEXTURE_2D,I,RJ,mJ,$J,XJ,w0,nJ,$0.data);else if(B.isCompressedTexture)j.compressedTexSubImage2D(j.TEXTURE_2D,I,RJ,mJ,$0.width,$0.height,w0,$0.data);else j.texSubImage2D(j.TEXTURE_2D,I,RJ,mJ,$J,XJ,w0,nJ,$0);if(j.pixelStorei(j.UNPACK_ROW_LENGTH,$6),j.pixelStorei(j.UNPACK_IMAGE_HEIGHT,sJ),j.pixelStorei(j.UNPACK_SKIP_PIXELS,b0),j.pixelStorei(j.UNPACK_SKIP_ROWS,o6),j.pixelStorei(j.UNPACK_SKIP_IMAGES,P0),I===0&&S.generateMipmaps)j.generateMipmap(NJ);VJ.unbindTexture()},this.copyTextureToTexture3D=function(B,S,h=null,f=null,I=0){if(B.isTexture!==!0)_7("WebGLRenderer: copyTextureToTexture3D function signature has changed."),h=arguments[0]||null,f=arguments[1]||null,B=arguments[2],S=arguments[3],I=arguments[4]||0;return _7('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(B,S,h,f,I)},this.initRenderTarget=function(B){if(MJ.get(B).__webglFramebuffer===void 0)TJ.setupRenderTarget(B)},this.initTexture=function(B){if(B.isCubeTexture)TJ.setTextureCube(B,0);else if(B.isData3DTexture)TJ.setTexture3D(B,0);else if(B.isDataArrayTexture||B.isCompressedArrayTexture)TJ.setTexture2DArray(B,0);else TJ.setTexture2D(B,0);VJ.unbindTexture()},this.resetState=function(){x=0,C=0,P=null,VJ.reset(),fJ.reset()},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2000}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(J){this._outputColorSpace=J;let $=this.getContext();$.drawingBufferColorspace=pJ._getDrawingBufferColorSpace(J),$.unpackColorSpace=pJ._getUnpackColorSpace()}}class T9 extends Z0{constructor(){super();if(this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new t0,this.environmentIntensity=1,this.environmentRotation=new t0,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(J,$){if(super.copy(J,$),J.background!==null)this.background=J.background.clone();if(J.environment!==null)this.environment=J.environment.clone();if(J.fog!==null)this.fog=J.fog.clone();if(this.backgroundBlurriness=J.backgroundBlurriness,this.backgroundIntensity=J.backgroundIntensity,this.backgroundRotation.copy(J.backgroundRotation),this.environmentIntensity=J.environmentIntensity,this.environmentRotation.copy(J.environmentRotation),J.overrideMaterial!==null)this.overrideMaterial=J.overrideMaterial.clone();return this.matrixAutoUpdate=J.matrixAutoUpdate,this}toJSON(J){let $=super.toJSON(J);if(this.fog!==null)$.object.fog=this.fog.toJSON();if(this.backgroundBlurriness>0)$.object.backgroundBlurriness=this.backgroundBlurriness;if(this.backgroundIntensity!==1)$.object.backgroundIntensity=this.backgroundIntensity;if($.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1)$.object.environmentIntensity=this.environmentIntensity;return $.object.environmentRotation=this.environmentRotation.toArray(),$}}class C8{constructor(J,$){this.isInterleavedBuffer=!0,this.array=J,this.stride=$,this.count=J!==void 0?J.length/$:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=c0()}onUploadCallback(){}set needsUpdate(J){if(J===!0)this.version++}setUsage(J){return this.usage=J,this}addUpdateRange(J,$){this.updateRanges.push({start:J,count:$})}clearUpdateRanges(){this.updateRanges.length=0}copy(J){return this.array=new J.array.constructor(J.array),this.count=J.count,this.stride=J.stride,this.usage=J.usage,this}copyAt(J,$,Q){J*=this.stride,Q*=$.stride;for(let Z=0,W=this.stride;Z<W;Z++)this.array[J+Z]=$.array[Q+Z];return this}set(J,$=0){return this.array.set(J,$),this}clone(J){if(J.arrayBuffers===void 0)J.arrayBuffers={};if(this.array.buffer._uuid===void 0)this.array.buffer._uuid=c0();if(J.arrayBuffers[this.array.buffer._uuid]===void 0)J.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer;let $=new this.array.constructor(J.arrayBuffers[this.array.buffer._uuid]),Q=new this.constructor($,this.stride);return Q.setUsage(this.usage),Q}onUpload(J){return this.onUploadCallback=J,this}toJSON(J){if(J.arrayBuffers===void 0)J.arrayBuffers={};if(this.array.buffer._uuid===void 0)this.array.buffer._uuid=c0();if(J.arrayBuffers[this.array.buffer._uuid]===void 0)J.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer));return{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}var k0=new A;class v7{constructor(J,$,Q,Z=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=J,this.itemSize=$,this.offset=Q,this.normalized=Z}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(J){this.data.needsUpdate=J}applyMatrix4(J){for(let $=0,Q=this.data.count;$<Q;$++)k0.fromBufferAttribute(this,$),k0.applyMatrix4(J),this.setXYZ($,k0.x,k0.y,k0.z);return this}applyNormalMatrix(J){for(let $=0,Q=this.count;$<Q;$++)k0.fromBufferAttribute(this,$),k0.applyNormalMatrix(J),this.setXYZ($,k0.x,k0.y,k0.z);return this}transformDirection(J){for(let $=0,Q=this.count;$<Q;$++)k0.fromBufferAttribute(this,$),k0.transformDirection(J),this.setXYZ($,k0.x,k0.y,k0.z);return this}getComponent(J,$){let Q=this.array[J*this.data.stride+this.offset+$];if(this.normalized)Q=u0(Q,this.array);return Q}setComponent(J,$,Q){if(this.normalized)Q=iJ(Q,this.array);return this.data.array[J*this.data.stride+this.offset+$]=Q,this}setX(J,$){if(this.normalized)$=iJ($,this.array);return this.data.array[J*this.data.stride+this.offset]=$,this}setY(J,$){if(this.normalized)$=iJ($,this.array);return this.data.array[J*this.data.stride+this.offset+1]=$,this}setZ(J,$){if(this.normalized)$=iJ($,this.array);return this.data.array[J*this.data.stride+this.offset+2]=$,this}setW(J,$){if(this.normalized)$=iJ($,this.array);return this.data.array[J*this.data.stride+this.offset+3]=$,this}getX(J){let $=this.data.array[J*this.data.stride+this.offset];if(this.normalized)$=u0($,this.array);return $}getY(J){let $=this.data.array[J*this.data.stride+this.offset+1];if(this.normalized)$=u0($,this.array);return $}getZ(J){let $=this.data.array[J*this.data.stride+this.offset+2];if(this.normalized)$=u0($,this.array);return $}getW(J){let $=this.data.array[J*this.data.stride+this.offset+3];if(this.normalized)$=u0($,this.array);return $}setXY(J,$,Q){if(J=J*this.data.stride+this.offset,this.normalized)$=iJ($,this.array),Q=iJ(Q,this.array);return this.data.array[J+0]=$,this.data.array[J+1]=Q,this}setXYZ(J,$,Q,Z){if(J=J*this.data.stride+this.offset,this.normalized)$=iJ($,this.array),Q=iJ(Q,this.array),Z=iJ(Z,this.array);return this.data.array[J+0]=$,this.data.array[J+1]=Q,this.data.array[J+2]=Z,this}setXYZW(J,$,Q,Z,W){if(J=J*this.data.stride+this.offset,this.normalized)$=iJ($,this.array),Q=iJ(Q,this.array),Z=iJ(Z,this.array),W=iJ(W,this.array);return this.data.array[J+0]=$,this.data.array[J+1]=Q,this.data.array[J+2]=Z,this.data.array[J+3]=W,this}clone(J){if(J===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let $=[];for(let Q=0;Q<this.count;Q++){let Z=Q*this.data.stride+this.offset;for(let W=0;W<this.itemSize;W++)$.push(this.data.array[Z+W])}return new V0(new this.array.constructor($),this.itemSize,this.normalized)}else{if(J.interleavedBuffers===void 0)J.interleavedBuffers={};if(J.interleavedBuffers[this.data.uuid]===void 0)J.interleavedBuffers[this.data.uuid]=this.data.clone(J);return new v7(J.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}}toJSON(J){if(J===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let $=[];for(let Q=0;Q<this.count;Q++){let Z=Q*this.data.stride+this.offset;for(let W=0;W<this.itemSize;W++)$.push(this.data.array[Z+W])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:$,normalized:this.normalized}}else{if(J.interleavedBuffers===void 0)J.interleavedBuffers={};if(J.interleavedBuffers[this.data.uuid]===void 0)J.interleavedBuffers[this.data.uuid]=this.data.toJSON(J);return{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}}var Q5=new A,Z5=new dJ,W5=new dJ,H4=new A,Y5=new _J,H8=new A,H9=new C0,X5=new _J,K9=new _6;class I9 extends D0{constructor(J,$){super(J,$);this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new _J,this.bindMatrixInverse=new _J,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let J=this.geometry;if(this.boundingBox===null)this.boundingBox=new S0;this.boundingBox.makeEmpty();let $=J.getAttribute("position");for(let Q=0;Q<$.count;Q++)this.getVertexPosition(Q,H8),this.boundingBox.expandByPoint(H8)}computeBoundingSphere(){let J=this.geometry;if(this.boundingSphere===null)this.boundingSphere=new C0;this.boundingSphere.makeEmpty();let $=J.getAttribute("position");for(let Q=0;Q<$.count;Q++)this.getVertexPosition(Q,H8),this.boundingSphere.expandByPoint(H8)}copy(J,$){if(super.copy(J,$),this.bindMode=J.bindMode,this.bindMatrix.copy(J.bindMatrix),this.bindMatrixInverse.copy(J.bindMatrixInverse),this.skeleton=J.skeleton,J.boundingBox!==null)this.boundingBox=J.boundingBox.clone();if(J.boundingSphere!==null)this.boundingSphere=J.boundingSphere.clone();return this}raycast(J,$){let Q=this.material,Z=this.matrixWorld;if(Q===void 0)return;if(this.boundingSphere===null)this.computeBoundingSphere();if(H9.copy(this.boundingSphere),H9.applyMatrix4(Z),J.ray.intersectsSphere(H9)===!1)return;if(X5.copy(Z).invert(),K9.copy(J.ray).applyMatrix4(X5),this.boundingBox!==null){if(K9.intersectsBox(this.boundingBox)===!1)return}this._computeIntersections(J,$,K9)}getVertexPosition(J,$){return super.getVertexPosition(J,$),this.applyBoneTransform(J,$),$}bind(J,$){if(this.skeleton=J,$===void 0)this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),$=this.matrixWorld;this.bindMatrix.copy($),this.bindMatrixInverse.copy($).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let J=new dJ,$=this.geometry.attributes.skinWeight;for(let Q=0,Z=$.count;Q<Z;Q++){J.fromBufferAttribute($,Q);let W=1/J.manhattanLength();if(W!==1/0)J.multiplyScalar(W);else J.set(1,0,0,0);$.setXYZW(Q,J.x,J.y,J.z,J.w)}}updateMatrixWorld(J){if(super.updateMatrixWorld(J),this.bindMode==="attached")this.bindMatrixInverse.copy(this.matrixWorld).invert();else if(this.bindMode==="detached")this.bindMatrixInverse.copy(this.bindMatrix).invert();else console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(J,$){let Q=this.skeleton,Z=this.geometry;Z5.fromBufferAttribute(Z.attributes.skinIndex,J),W5.fromBufferAttribute(Z.attributes.skinWeight,J),Q5.copy($).applyMatrix4(this.bindMatrix),$.set(0,0,0);for(let W=0;W<4;W++){let Y=W5.getComponent(W);if(Y!==0){let X=Z5.getComponent(W);Y5.multiplyMatrices(Q.bones[X].matrixWorld,Q.boneInverses[X]),$.addScaledVector(H4.copy(Q5).applyMatrix4(Y5),Y)}}return $.applyMatrix4(this.bindMatrixInverse)}}class _8 extends Z0{constructor(){super();this.isBone=!0,this.type="Bone"}}class S9 extends K0{constructor(J=null,$=1,Q=1,Z,W,Y,X,H,K=1003,q=1003,G,U){super(null,Y,X,H,K,q,Z,W,G,U);this.isDataTexture=!0,this.image={data:J,width:$,height:Q},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}var H5=new _J,K4=new _J;class P8{constructor(J=[],$=[]){this.uuid=c0(),this.bones=J.slice(0),this.boneInverses=$,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let J=this.bones,$=this.boneInverses;if(this.boneMatrices=new Float32Array(J.length*16),$.length===0)this.calculateInverses();else if(J.length!==$.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let Q=0,Z=this.bones.length;Q<Z;Q++)this.boneInverses.push(new _J)}}calculateInverses(){this.boneInverses.length=0;for(let J=0,$=this.bones.length;J<$;J++){let Q=new _J;if(this.bones[J])Q.copy(this.bones[J].matrixWorld).invert();this.boneInverses.push(Q)}}pose(){for(let J=0,$=this.bones.length;J<$;J++){let Q=this.bones[J];if(Q)Q.matrixWorld.copy(this.boneInverses[J]).invert()}for(let J=0,$=this.bones.length;J<$;J++){let Q=this.bones[J];if(Q){if(Q.parent&&Q.parent.isBone)Q.matrix.copy(Q.parent.matrixWorld).invert(),Q.matrix.multiply(Q.matrixWorld);else Q.matrix.copy(Q.matrixWorld);Q.matrix.decompose(Q.position,Q.quaternion,Q.scale)}}}update(){let J=this.bones,$=this.boneInverses,Q=this.boneMatrices,Z=this.boneTexture;for(let W=0,Y=J.length;W<Y;W++){let X=J[W]?J[W].matrixWorld:K4;H5.multiplyMatrices(X,$[W]),H5.toArray(Q,W*16)}if(Z!==null)Z.needsUpdate=!0}clone(){return new P8(this.bones,this.boneInverses)}computeBoneTexture(){let J=Math.sqrt(this.bones.length*4);J=Math.ceil(J/4)*4,J=Math.max(J,4);let $=new Float32Array(J*J*4);$.set(this.boneMatrices);let Q=new S9($,J,J,1023,1015);return Q.needsUpdate=!0,this.boneMatrices=$,this.boneTexture=Q,this}getBoneByName(J){for(let $=0,Q=this.bones.length;$<Q;$++){let Z=this.bones[$];if(Z.name===J)return Z}return}dispose(){if(this.boneTexture!==null)this.boneTexture.dispose(),this.boneTexture=null}fromJSON(J,$){this.uuid=J.uuid;for(let Q=0,Z=J.bones.length;Q<Z;Q++){let W=J.bones[Q],Y=$[W];if(Y===void 0)console.warn("THREE.Skeleton: No bone found with UUID:",W),Y=new _8;this.bones.push(Y),this.boneInverses.push(new _J().fromArray(J.boneInverses[Q]))}return this.init(),this}toJSON(){let J={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};J.uuid=this.uuid;let $=this.bones,Q=this.boneInverses;for(let Z=0,W=$.length;Z<W;Z++){let Y=$[Z];J.bones.push(Y.uuid);let X=Q[Z];J.boneInverses.push(X.toArray())}return J}}class V7 extends V0{constructor(J,$,Q,Z=1){super(J,$,Q);this.isInstancedBufferAttribute=!0,this.meshPerAttribute=Z}copy(J){return super.copy(J),this.meshPerAttribute=J.meshPerAttribute,this}toJSON(){let J=super.toJSON();return J.meshPerAttribute=this.meshPerAttribute,J.isInstancedBufferAttribute=!0,J}}var K7=new _J,K5=new _J,K8=[],q5=new S0,q4=new _J,L7=new D0,D7=new C0;class j9 extends D0{constructor(J,$,Q){super(J,$);this.isInstancedMesh=!0,this.instanceMatrix=new V7(new Float32Array(Q*16),16),this.instanceColor=null,this.morphTexture=null,this.count=Q,this.boundingBox=null,this.boundingSphere=null;for(let Z=0;Z<Q;Z++)this.setMatrixAt(Z,q4)}computeBoundingBox(){let J=this.geometry,$=this.count;if(this.boundingBox===null)this.boundingBox=new S0;if(J.boundingBox===null)J.computeBoundingBox();this.boundingBox.makeEmpty();for(let Q=0;Q<$;Q++)this.getMatrixAt(Q,K7),q5.copy(J.boundingBox).applyMatrix4(K7),this.boundingBox.union(q5)}computeBoundingSphere(){let J=this.geometry,$=this.count;if(this.boundingSphere===null)this.boundingSphere=new C0;if(J.boundingSphere===null)J.computeBoundingSphere();this.boundingSphere.makeEmpty();for(let Q=0;Q<$;Q++)this.getMatrixAt(Q,K7),D7.copy(J.boundingSphere).applyMatrix4(K7),this.boundingSphere.union(D7)}copy(J,$){if(super.copy(J,$),this.instanceMatrix.copy(J.instanceMatrix),J.morphTexture!==null)this.morphTexture=J.morphTexture.clone();if(J.instanceColor!==null)this.instanceColor=J.instanceColor.clone();if(this.count=J.count,J.boundingBox!==null)this.boundingBox=J.boundingBox.clone();if(J.boundingSphere!==null)this.boundingSphere=J.boundingSphere.clone();return this}getColorAt(J,$){$.fromArray(this.instanceColor.array,J*3)}getMatrixAt(J,$){$.fromArray(this.instanceMatrix.array,J*16)}getMorphAt(J,$){let Q=$.morphTargetInfluences,Z=this.morphTexture.source.data.data,W=Q.length+1,Y=J*W+1;for(let X=0;X<Q.length;X++)Q[X]=Z[Y+X]}raycast(J,$){let Q=this.matrixWorld,Z=this.count;if(L7.geometry=this.geometry,L7.material=this.material,L7.material===void 0)return;if(this.boundingSphere===null)this.computeBoundingSphere();if(D7.copy(this.boundingSphere),D7.applyMatrix4(Q),J.ray.intersectsSphere(D7)===!1)return;for(let W=0;W<Z;W++){this.getMatrixAt(W,K7),K5.multiplyMatrices(Q,K7),L7.matrixWorld=K5,L7.raycast(J,K8);for(let Y=0,X=K8.length;Y<X;Y++){let H=K8[Y];H.instanceId=W,H.object=this,$.push(H)}K8.length=0}}setColorAt(J,$){if(this.instanceColor===null)this.instanceColor=new V7(new Float32Array(this.instanceMatrix.count*3).fill(1),3);$.toArray(this.instanceColor.array,J*3)}setMatrixAt(J,$){$.toArray(this.instanceMatrix.array,J*16)}setMorphAt(J,$){let Q=$.morphTargetInfluences,Z=Q.length+1;if(this.morphTexture===null)this.morphTexture=new S9(new Float32Array(Z*this.count),Z,this.count,1028,1015);let W=this.morphTexture.source.data.data,Y=0;for(let K=0;K<Q.length;K++)Y+=Q[K];let X=this.geometry.morphTargetsRelative?1:1-Y,H=Z*J;W[H]=X,W.set(Q,H+1)}updateMorphTargets(){}dispose(){if(this.dispatchEvent({type:"dispose"}),this.morphTexture!==null)this.morphTexture.dispose(),this.morphTexture=null;return this}}class A8 extends v0{static get type(){return"LineBasicMaterial"}constructor(J){super();this.isLineBasicMaterial=!0,this.color=new DJ(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(J)}copy(J){return super.copy(J),this.color.copy(J.color),this.map=J.map,this.linewidth=J.linewidth,this.linecap=J.linecap,this.linejoin=J.linejoin,this.fog=J.fog,this}}var O8=new A,R8=new A,G5=new _J,w7=new _6,q8=new C0,q9=new A,U5=new A;class h7 extends Z0{constructor(J=new h0,$=new A8){super();this.isLine=!0,this.type="Line",this.geometry=J,this.material=$,this.updateMorphTargets()}copy(J,$){return super.copy(J,$),this.material=Array.isArray(J.material)?J.material.slice():J.material,this.geometry=J.geometry,this}computeLineDistances(){let J=this.geometry;if(J.index===null){let $=J.attributes.position,Q=[0];for(let Z=1,W=$.count;Z<W;Z++)O8.fromBufferAttribute($,Z-1),R8.fromBufferAttribute($,Z),Q[Z]=Q[Z-1],Q[Z]+=O8.distanceTo(R8);J.setAttribute("lineDistance",new n0(Q,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(J,$){let Q=this.geometry,Z=this.matrixWorld,W=J.params.Line.threshold,Y=Q.drawRange;if(Q.boundingSphere===null)Q.computeBoundingSphere();if(q8.copy(Q.boundingSphere),q8.applyMatrix4(Z),q8.radius+=W,J.ray.intersectsSphere(q8)===!1)return;G5.copy(Z).invert(),w7.copy(J.ray).applyMatrix4(G5);let X=W/((this.scale.x+this.scale.y+this.scale.z)/3),H=X*X,K=this.isLineSegments?2:1,q=Q.index,U=Q.attributes.position;if(q!==null){let F=Math.max(0,Y.start),O=Math.min(q.count,Y.start+Y.count);for(let z=F,R=O-1;z<R;z+=K){let V=q.getX(z),E=q.getX(z+1),D=G8(this,J,w7,H,V,E);if(D)$.push(D)}if(this.isLineLoop){let z=q.getX(O-1),R=q.getX(F),V=G8(this,J,w7,H,z,R);if(V)$.push(V)}}else{let F=Math.max(0,Y.start),O=Math.min(U.count,Y.start+Y.count);for(let z=F,R=O-1;z<R;z+=K){let V=G8(this,J,w7,H,z,z+1);if(V)$.push(V)}if(this.isLineLoop){let z=G8(this,J,w7,H,O-1,F);if(z)$.push(z)}}}updateMorphTargets(){let $=this.geometry.morphAttributes,Q=Object.keys($);if(Q.length>0){let Z=$[Q[0]];if(Z!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let W=0,Y=Z.length;W<Y;W++){let X=Z[W].name||String(W);this.morphTargetInfluences.push(0),this.morphTargetDictionary[X]=W}}}}}function G8(J,$,Q,Z,W,Y){let X=J.geometry.attributes.position;if(O8.fromBufferAttribute(X,W),R8.fromBufferAttribute(X,Y),Q.distanceSqToSegment(O8,R8,q9,U5)>Z)return;q9.applyMatrix4(J.matrixWorld);let K=$.ray.origin.distanceTo(q9);if(K<$.near||K>$.far)return;return{distance:K,point:U5.clone().applyMatrix4(J.matrixWorld),index:W,face:null,faceIndex:null,barycoord:null,object:J}}var F5=new A,V5=new A;class y9 extends h7{constructor(J,$){super(J,$);this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let J=this.geometry;if(J.index===null){let $=J.attributes.position,Q=[];for(let Z=0,W=$.count;Z<W;Z+=2)F5.fromBufferAttribute($,Z),V5.fromBufferAttribute($,Z+1),Q[Z]=Z===0?0:Q[Z-1],Q[Z+1]=Q[Z]+F5.distanceTo(V5);J.setAttribute("lineDistance",new n0(Q,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class v9 extends h7{constructor(J,$){super(J,$);this.isLineLoop=!0,this.type="LineLoop"}}class T8 extends v0{static get type(){return"PointsMaterial"}constructor(J){super();this.isPointsMaterial=!0,this.color=new DJ(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(J)}copy(J){return super.copy(J),this.color.copy(J.color),this.map=J.map,this.alphaMap=J.alphaMap,this.size=J.size,this.sizeAttenuation=J.sizeAttenuation,this.fog=J.fog,this}}var E5=new _J,E9=new _6,U8=new C0,F8=new A;class h9 extends Z0{constructor(J=new h0,$=new T8){super();this.isPoints=!0,this.type="Points",this.geometry=J,this.material=$,this.updateMorphTargets()}copy(J,$){return super.copy(J,$),this.material=Array.isArray(J.material)?J.material.slice():J.material,this.geometry=J.geometry,this}raycast(J,$){let Q=this.geometry,Z=this.matrixWorld,W=J.params.Points.threshold,Y=Q.drawRange;if(Q.boundingSphere===null)Q.computeBoundingSphere();if(U8.copy(Q.boundingSphere),U8.applyMatrix4(Z),U8.radius+=W,J.ray.intersectsSphere(U8)===!1)return;E5.copy(Z).invert(),E9.copy(J.ray).applyMatrix4(E5);let X=W/((this.scale.x+this.scale.y+this.scale.z)/3),H=X*X,K=Q.index,G=Q.attributes.position;if(K!==null){let U=Math.max(0,Y.start),F=Math.min(K.count,Y.start+Y.count);for(let O=U,z=F;O<z;O++){let R=K.getX(O);F8.fromBufferAttribute(G,R),O5(F8,R,H,Z,J,$,this)}}else{let U=Math.max(0,Y.start),F=Math.min(G.count,Y.start+Y.count);for(let O=U,z=F;O<z;O++)F8.fromBufferAttribute(G,O),O5(F8,O,H,Z,J,$,this)}}updateMorphTargets(){let $=this.geometry.morphAttributes,Q=Object.keys($);if(Q.length>0){let Z=$[Q[0]];if(Z!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let W=0,Y=Z.length;W<Y;W++){let X=Z[W].name||String(W);this.morphTargetInfluences.push(0),this.morphTargetDictionary[X]=W}}}}}function O5(J,$,Q,Z,W,Y,X){let H=E9.distanceSqToPoint(J);if(H<Q){let K=new A;E9.closestPointToPoint(J,K),K.applyMatrix4(Z);let q=W.ray.origin.distanceTo(K);if(q<W.near||q>W.far)return;Y.push({distance:q,distanceToRay:Math.sqrt(H),point:K,index:$,face:null,faceIndex:null,barycoord:null,object:X})}}class u6 extends v0{static get type(){return"MeshStandardMaterial"}constructor(J){super();this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new DJ(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new DJ(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new LJ(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new t0,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(J)}copy(J){return super.copy(J),this.defines={STANDARD:""},this.color.copy(J.color),this.roughness=J.roughness,this.metalness=J.metalness,this.map=J.map,this.lightMap=J.lightMap,this.lightMapIntensity=J.lightMapIntensity,this.aoMap=J.aoMap,this.aoMapIntensity=J.aoMapIntensity,this.emissive.copy(J.emissive),this.emissiveMap=J.emissiveMap,this.emissiveIntensity=J.emissiveIntensity,this.bumpMap=J.bumpMap,this.bumpScale=J.bumpScale,this.normalMap=J.normalMap,this.normalMapType=J.normalMapType,this.normalScale.copy(J.normalScale),this.displacementMap=J.displacementMap,this.displacementScale=J.displacementScale,this.displacementBias=J.displacementBias,this.roughnessMap=J.roughnessMap,this.metalnessMap=J.metalnessMap,this.alphaMap=J.alphaMap,this.envMap=J.envMap,this.envMapRotation.copy(J.envMapRotation),this.envMapIntensity=J.envMapIntensity,this.wireframe=J.wireframe,this.wireframeLinewidth=J.wireframeLinewidth,this.wireframeLinecap=J.wireframeLinecap,this.wireframeLinejoin=J.wireframeLinejoin,this.flatShading=J.flatShading,this.fog=J.fog,this}}class f0 extends u6{static get type(){return"MeshPhysicalMaterial"}constructor(J){super();this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new LJ(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return N0(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function($){this.ior=(1+0.4*$)/(1-0.4*$)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new DJ(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new DJ(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new DJ(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(J)}get anisotropy(){return this._anisotropy}set anisotropy(J){if(this._anisotropy>0!==J>0)this.version++;this._anisotropy=J}get clearcoat(){return this._clearcoat}set clearcoat(J){if(this._clearcoat>0!==J>0)this.version++;this._clearcoat=J}get iridescence(){return this._iridescence}set iridescence(J){if(this._iridescence>0!==J>0)this.version++;this._iridescence=J}get dispersion(){return this._dispersion}set dispersion(J){if(this._dispersion>0!==J>0)this.version++;this._dispersion=J}get sheen(){return this._sheen}set sheen(J){if(this._sheen>0!==J>0)this.version++;this._sheen=J}get transmission(){return this._transmission}set transmission(J){if(this._transmission>0!==J>0)this.version++;this._transmission=J}copy(J){return super.copy(J),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=J.anisotropy,this.anisotropyRotation=J.anisotropyRotation,this.anisotropyMap=J.anisotropyMap,this.clearcoat=J.clearcoat,this.clearcoatMap=J.clearcoatMap,this.clearcoatRoughness=J.clearcoatRoughness,this.clearcoatRoughnessMap=J.clearcoatRoughnessMap,this.clearcoatNormalMap=J.clearcoatNormalMap,this.clearcoatNormalScale.copy(J.clearcoatNormalScale),this.dispersion=J.dispersion,this.ior=J.ior,this.iridescence=J.iridescence,this.iridescenceMap=J.iridescenceMap,this.iridescenceIOR=J.iridescenceIOR,this.iridescenceThicknessRange=[...J.iridescenceThicknessRange],this.iridescenceThicknessMap=J.iridescenceThicknessMap,this.sheen=J.sheen,this.sheenColor.copy(J.sheenColor),this.sheenColorMap=J.sheenColorMap,this.sheenRoughness=J.sheenRoughness,this.sheenRoughnessMap=J.sheenRoughnessMap,this.transmission=J.transmission,this.transmissionMap=J.transmissionMap,this.thickness=J.thickness,this.thicknessMap=J.thicknessMap,this.attenuationDistance=J.attenuationDistance,this.attenuationColor.copy(J.attenuationColor),this.specularIntensity=J.specularIntensity,this.specularIntensityMap=J.specularIntensityMap,this.specularColor.copy(J.specularColor),this.specularColorMap=J.specularColorMap,this}}function V8(J,$,Q){if(!J||!Q&&J.constructor===$)return J;if(typeof $.BYTES_PER_ELEMENT==="number")return new $(J);return Array.prototype.slice.call(J)}function G4(J){return ArrayBuffer.isView(J)&&!(J instanceof DataView)}function U4(J){function $(W,Y){return J[W]-J[Y]}let Q=J.length,Z=Array(Q);for(let W=0;W!==Q;++W)Z[W]=W;return Z.sort($),Z}function R5(J,$,Q){let Z=J.length,W=new J.constructor(Z);for(let Y=0,X=0;X!==Z;++Y){let H=Q[Y]*$;for(let K=0;K!==$;++K)W[X++]=J[H+K]}return W}function $Q(J,$,Q,Z){let W=1,Y=J[0];while(Y!==void 0&&Y[Z]===void 0)Y=J[W++];if(Y===void 0)return;let X=Y[Z];if(X===void 0)return;if(Array.isArray(X))do{if(X=Y[Z],X!==void 0)$.push(Y.time),Q.push.apply(Q,X);Y=J[W++]}while(Y!==void 0);else if(X.toArray!==void 0)do{if(X=Y[Z],X!==void 0)$.push(Y.time),X.toArray(Q,Q.length);Y=J[W++]}while(Y!==void 0);else do{if(X=Y[Z],X!==void 0)$.push(Y.time),Q.push(X);Y=J[W++]}while(Y!==void 0)}class m6{constructor(J,$,Q,Z){this.parameterPositions=J,this._cachedIndex=0,this.resultBuffer=Z!==void 0?Z:new $.constructor(Q),this.sampleValues=$,this.valueSize=Q,this.settings=null,this.DefaultSettings_={}}evaluate(J){let $=this.parameterPositions,Q=this._cachedIndex,Z=$[Q],W=$[Q-1];Q:{J:{let Y;$:{Z:if(!(J<Z)){for(let X=Q+2;;){if(Z===void 0){if(J<W)break Z;return Q=$.length,this._cachedIndex=Q,this.copySampleValue_(Q-1)}if(Q===X)break;if(W=Z,Z=$[++Q],J<Z)break J}Y=$.length;break $}if(!(J>=W)){let X=$[1];if(J<X)Q=2,W=X;for(let H=Q-2;;){if(W===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(Q===H)break;if(Z=W,W=$[--Q-1],J>=W)break J}Y=Q,Q=0;break $}break Q}while(Q<Y){let X=Q+Y>>>1;if(J<$[X])Y=X;else Q=X+1}if(Z=$[Q],W=$[Q-1],W===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(Z===void 0)return Q=$.length,this._cachedIndex=Q,this.copySampleValue_(Q-1)}this._cachedIndex=Q,this.intervalChanged_(Q,W,Z)}return this.interpolate_(Q,W,J,Z)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(J){let $=this.resultBuffer,Q=this.sampleValues,Z=this.valueSize,W=J*Z;for(let Y=0;Y!==Z;++Y)$[Y]=Q[W+Y];return $}interpolate_(){throw Error("call to abstract method")}intervalChanged_(){}}class QQ extends m6{constructor(J,$,Q,Z){super(J,$,Q,Z);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(J,$,Q){let Z=this.parameterPositions,W=J-2,Y=J+1,X=Z[W],H=Z[Y];if(X===void 0)switch(this.getSettings_().endingStart){case 2401:W=J,X=2*$-Q;break;case 2402:W=Z.length-2,X=$+Z[W]-Z[W+1];break;default:W=J,X=Q}if(H===void 0)switch(this.getSettings_().endingEnd){case 2401:Y=J,H=2*Q-$;break;case 2402:Y=1,H=Q+Z[1]-Z[0];break;default:Y=J-1,H=$}let K=(Q-$)*0.5,q=this.valueSize;this._weightPrev=K/($-X),this._weightNext=K/(H-Q),this._offsetPrev=W*q,this._offsetNext=Y*q}interpolate_(J,$,Q,Z){let W=this.resultBuffer,Y=this.sampleValues,X=this.valueSize,H=J*X,K=H-X,q=this._offsetPrev,G=this._offsetNext,U=this._weightPrev,F=this._weightNext,O=(Q-$)/(Z-$),z=O*O,R=z*O,V=-U*R+2*U*z-U*O,E=(1+U)*R+(-1.5-2*U)*z+(-0.5+U)*O+1,D=(-1-F)*R+(1.5+F)*z+0.5*O,M=F*R-F*z;for(let _=0;_!==X;++_)W[_]=V*Y[q+_]+E*Y[K+_]+D*Y[H+_]+M*Y[G+_];return W}}class ZQ extends m6{constructor(J,$,Q,Z){super(J,$,Q,Z)}interpolate_(J,$,Q,Z){let W=this.resultBuffer,Y=this.sampleValues,X=this.valueSize,H=J*X,K=H-X,q=(Q-$)/(Z-$),G=1-q;for(let U=0;U!==X;++U)W[U]=Y[K+U]*G+Y[H+U]*q;return W}}class WQ extends m6{constructor(J,$,Q,Z){super(J,$,Q,Z)}interpolate_(J){return this.copySampleValue_(J-1)}}class s0{constructor(J,$,Q,Z){if(J===void 0)throw Error("THREE.KeyframeTrack: track name is undefined");if($===void 0||$.length===0)throw Error("THREE.KeyframeTrack: no keyframes in track named "+J);this.name=J,this.times=V8($,this.TimeBufferType),this.values=V8(Q,this.ValueBufferType),this.setInterpolation(Z||this.DefaultInterpolation)}static toJSON(J){let $=J.constructor,Q;if($.toJSON!==this.toJSON)Q=$.toJSON(J);else{Q={name:J.name,times:V8(J.times,Array),values:V8(J.values,Array)};let Z=J.getInterpolation();if(Z!==J.DefaultInterpolation)Q.interpolation=Z}return Q.type=J.ValueTypeName,Q}InterpolantFactoryMethodDiscrete(J){return new WQ(this.times,this.values,this.getValueSize(),J)}InterpolantFactoryMethodLinear(J){return new ZQ(this.times,this.values,this.getValueSize(),J)}InterpolantFactoryMethodSmooth(J){return new QQ(this.times,this.values,this.getValueSize(),J)}setInterpolation(J){let $;switch(J){case 2300:$=this.InterpolantFactoryMethodDiscrete;break;case 2301:$=this.InterpolantFactoryMethodLinear;break;case 2302:$=this.InterpolantFactoryMethodSmooth;break}if($===void 0){let Q="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(J!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(Q);return console.warn("THREE.KeyframeTrack:",Q),this}return this.createInterpolant=$,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302}}getValueSize(){return this.values.length/this.times.length}shift(J){if(J!==0){let $=this.times;for(let Q=0,Z=$.length;Q!==Z;++Q)$[Q]+=J}return this}scale(J){if(J!==1){let $=this.times;for(let Q=0,Z=$.length;Q!==Z;++Q)$[Q]*=J}return this}trim(J,$){let Q=this.times,Z=Q.length,W=0,Y=Z-1;while(W!==Z&&Q[W]<J)++W;while(Y!==-1&&Q[Y]>$)--Y;if(++Y,W!==0||Y!==Z){if(W>=Y)Y=Math.max(Y,1),W=Y-1;let X=this.getValueSize();this.times=Q.slice(W,Y),this.values=this.values.slice(W*X,Y*X)}return this}validate(){let J=!0,$=this.getValueSize();if($-Math.floor($)!==0)console.error("THREE.KeyframeTrack: Invalid value size in track.",this),J=!1;let Q=this.times,Z=this.values,W=Q.length;if(W===0)console.error("THREE.KeyframeTrack: Track is empty.",this),J=!1;let Y=null;for(let X=0;X!==W;X++){let H=Q[X];if(typeof H==="number"&&isNaN(H)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,X,H),J=!1;break}if(Y!==null&&Y>H){console.error("THREE.KeyframeTrack: Out of order keys.",this,X,H,Y),J=!1;break}Y=H}if(Z!==void 0){if(G4(Z))for(let X=0,H=Z.length;X!==H;++X){let K=Z[X];if(isNaN(K)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,X,K),J=!1;break}}}return J}optimize(){let J=this.times.slice(),$=this.values.slice(),Q=this.getValueSize(),Z=this.getInterpolation()===2302,W=J.length-1,Y=1;for(let X=1;X<W;++X){let H=!1,K=J[X],q=J[X+1];if(K!==q&&(X!==1||K!==J[0]))if(!Z){let G=X*Q,U=G-Q,F=G+Q;for(let O=0;O!==Q;++O){let z=$[G+O];if(z!==$[U+O]||z!==$[F+O]){H=!0;break}}}else H=!0;if(H){if(X!==Y){J[Y]=J[X];let G=X*Q,U=Y*Q;for(let F=0;F!==Q;++F)$[U+F]=$[G+F]}++Y}}if(W>0){J[Y]=J[W];for(let X=W*Q,H=Y*Q,K=0;K!==Q;++K)$[H+K]=$[X+K];++Y}if(Y!==J.length)this.times=J.slice(0,Y),this.values=$.slice(0,Y*Q);else this.times=J,this.values=$;return this}clone(){let J=this.times.slice(),$=this.values.slice(),Z=new this.constructor(this.name,J,$);return Z.createInterpolant=this.createInterpolant,Z}}s0.prototype.TimeBufferType=Float32Array;s0.prototype.ValueBufferType=Float32Array;s0.prototype.DefaultInterpolation=2301;class d6 extends s0{constructor(J,$,Q){super(J,$,Q)}}d6.prototype.ValueTypeName="bool";d6.prototype.ValueBufferType=Array;d6.prototype.DefaultInterpolation=2300;d6.prototype.InterpolantFactoryMethodLinear=void 0;d6.prototype.InterpolantFactoryMethodSmooth=void 0;class f9 extends s0{}f9.prototype.ValueTypeName="color";class L6 extends s0{}L6.prototype.ValueTypeName="number";class YQ extends m6{constructor(J,$,Q,Z){super(J,$,Q,Z)}interpolate_(J,$,Q,Z){let W=this.resultBuffer,Y=this.sampleValues,X=this.valueSize,H=(Q-$)/(Z-$),K=J*X;for(let q=K+X;K!==q;K+=4)I0.slerpFlat(W,0,Y,K-X,Y,K,H);return W}}class P6 extends s0{InterpolantFactoryMethodLinear(J){return new YQ(this.times,this.values,this.getValueSize(),J)}}P6.prototype.ValueTypeName="quaternion";P6.prototype.InterpolantFactoryMethodSmooth=void 0;class c6 extends s0{constructor(J,$,Q){super(J,$,Q)}}c6.prototype.ValueTypeName="string";c6.prototype.ValueBufferType=Array;c6.prototype.DefaultInterpolation=2300;c6.prototype.InterpolantFactoryMethodLinear=void 0;c6.prototype.InterpolantFactoryMethodSmooth=void 0;class D6 extends s0{}D6.prototype.ValueTypeName="vector";class x9{constructor(J="",$=-1,Q=[],Z=2500){if(this.name=J,this.tracks=Q,this.duration=$,this.blendMode=Z,this.uuid=c0(),this.duration<0)this.resetDuration()}static parse(J){let $=[],Q=J.tracks,Z=1/(J.fps||1);for(let Y=0,X=Q.length;Y!==X;++Y)$.push(V4(Q[Y]).scale(Z));let W=new this(J.name,J.duration,$,J.blendMode);return W.uuid=J.uuid,W}static toJSON(J){let $=[],Q=J.tracks,Z={name:J.name,duration:J.duration,tracks:$,uuid:J.uuid,blendMode:J.blendMode};for(let W=0,Y=Q.length;W!==Y;++W)$.push(s0.toJSON(Q[W]));return Z}static CreateFromMorphTargetSequence(J,$,Q,Z){let W=$.length,Y=[];for(let X=0;X<W;X++){let H=[],K=[];H.push((X+W-1)%W,X,(X+1)%W),K.push(0,1,0);let q=U4(H);if(H=R5(H,1,q),K=R5(K,1,q),!Z&&H[0]===0)H.push(W),K.push(K[0]);Y.push(new L6(".morphTargetInfluences["+$[X].name+"]",H,K).scale(1/Q))}return new this(J,-1,Y)}static findByName(J,$){let Q=J;if(!Array.isArray(J)){let Z=J;Q=Z.geometry&&Z.geometry.animations||Z.animations}for(let Z=0;Z<Q.length;Z++)if(Q[Z].name===$)return Q[Z];return null}static CreateClipsFromMorphTargetSequences(J,$,Q){let Z={},W=/^([\w-]*?)([\d]+)$/;for(let X=0,H=J.length;X<H;X++){let K=J[X],q=K.name.match(W);if(q&&q.length>1){let G=q[1],U=Z[G];if(!U)Z[G]=U=[];U.push(K)}}let Y=[];for(let X in Z)Y.push(this.CreateFromMorphTargetSequence(X,Z[X],$,Q));return Y}static parseAnimation(J,$){if(!J)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let Q=function(G,U,F,O,z){if(F.length!==0){let R=[],V=[];if($Q(F,R,V,O),R.length!==0)z.push(new G(U,R,V))}},Z=[],W=J.name||"default",Y=J.fps||30,X=J.blendMode,H=J.length||-1,K=J.hierarchy||[];for(let G=0;G<K.length;G++){let U=K[G].keys;if(!U||U.length===0)continue;if(U[0].morphTargets){let F={},O;for(O=0;O<U.length;O++)if(U[O].morphTargets)for(let z=0;z<U[O].morphTargets.length;z++)F[U[O].morphTargets[z]]=-1;for(let z in F){let R=[],V=[];for(let E=0;E!==U[O].morphTargets.length;++E){let D=U[O];R.push(D.time),V.push(D.morphTarget===z?1:0)}Z.push(new L6(".morphTargetInfluence["+z+"]",R,V))}H=F.length*Y}else{let F=".bones["+$[G].name+"]";Q(D6,F+".position",U,"pos",Z),Q(P6,F+".quaternion",U,"rot",Z),Q(D6,F+".scale",U,"scl",Z)}}if(Z.length===0)return null;return new this(W,H,Z,X)}resetDuration(){let J=this.tracks,$=0;for(let Q=0,Z=J.length;Q!==Z;++Q){let W=this.tracks[Q];$=Math.max($,W.times[W.times.length-1])}return this.duration=$,this}trim(){for(let J=0;J<this.tracks.length;J++)this.tracks[J].trim(0,this.duration);return this}validate(){let J=!0;for(let $=0;$<this.tracks.length;$++)J=J&&this.tracks[$].validate();return J}optimize(){for(let J=0;J<this.tracks.length;J++)this.tracks[J].optimize();return this}clone(){let J=[];for(let $=0;$<this.tracks.length;$++)J.push(this.tracks[$].clone());return new this.constructor(this.name,this.duration,J,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function F4(J){switch(J.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return L6;case"vector":case"vector2":case"vector3":case"vector4":return D6;case"color":return f9;case"quaternion":return P6;case"bool":case"boolean":return d6;case"string":return c6}throw Error("THREE.KeyframeTrack: Unsupported typeName: "+J)}function V4(J){if(J.type===void 0)throw Error("THREE.KeyframeTrack: track type undefined, can not parse");let $=F4(J.type);if(J.times===void 0){let Q=[],Z=[];$Q(J.keys,Q,Z,"value"),J.times=Q,J.values=Z}if($.parse!==void 0)return $.parse(J);else return new $(J.name,J.times,J.values,J.interpolation)}var M6={enabled:!1,files:{},add:function(J,$){if(this.enabled===!1)return;this.files[J]=$},get:function(J){if(this.enabled===!1)return;return this.files[J]},remove:function(J){delete this.files[J]},clear:function(){this.files={}}};class XQ{constructor(J,$,Q){let Z=this,W=!1,Y=0,X=0,H=void 0,K=[];this.onStart=void 0,this.onLoad=J,this.onProgress=$,this.onError=Q,this.itemStart=function(q){if(X++,W===!1){if(Z.onStart!==void 0)Z.onStart(q,Y,X)}W=!0},this.itemEnd=function(q){if(Y++,Z.onProgress!==void 0)Z.onProgress(q,Y,X);if(Y===X){if(W=!1,Z.onLoad!==void 0)Z.onLoad()}},this.itemError=function(q){if(Z.onError!==void 0)Z.onError(q)},this.resolveURL=function(q){if(H)return H(q);return q},this.setURLModifier=function(q){return H=q,this},this.addHandler=function(q,G){return K.push(q,G),this},this.removeHandler=function(q){let G=K.indexOf(q);if(G!==-1)K.splice(G,2);return this},this.getHandler=function(q){for(let G=0,U=K.length;G<U;G+=2){let F=K[G],O=K[G+1];if(F.global)F.lastIndex=0;if(F.test(q))return O}return null}}}var E4=new XQ;class A6{constructor(J){this.manager=J!==void 0?J:E4,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(J,$){let Q=this;return new Promise(function(Z,W){Q.load(J,Z,$,W)})}parse(){}setCrossOrigin(J){return this.crossOrigin=J,this}setWithCredentials(J){return this.withCredentials=J,this}setPath(J){return this.path=J,this}setResourcePath(J){return this.resourcePath=J,this}setRequestHeader(J){return this.requestHeader=J,this}}A6.DEFAULT_MATERIAL_NAME="__DEFAULT";var H6={};class HQ extends Error{constructor(J,$){super(J);this.response=$}}class I8 extends A6{constructor(J){super(J)}load(J,$,Q,Z){if(J===void 0)J="";if(this.path!==void 0)J=this.path+J;J=this.manager.resolveURL(J);let W=M6.get(J);if(W!==void 0)return this.manager.itemStart(J),setTimeout(()=>{if($)$(W);this.manager.itemEnd(J)},0),W;if(H6[J]!==void 0){H6[J].push({onLoad:$,onProgress:Q,onError:Z});return}H6[J]=[],H6[J].push({onLoad:$,onProgress:Q,onError:Z});let Y=new Request(J,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),X=this.mimeType,H=this.responseType;fetch(Y).then((K)=>{if(K.status===200||K.status===0){if(K.status===0)console.warn("THREE.FileLoader: HTTP Status 0 received.");if(typeof ReadableStream>"u"||K.body===void 0||K.body.getReader===void 0)return K;let q=H6[J],G=K.body.getReader(),U=K.headers.get("X-File-Size")||K.headers.get("Content-Length"),F=U?parseInt(U):0,O=F!==0,z=0,R=new ReadableStream({start(V){E();function E(){G.read().then(({done:D,value:M})=>{if(D)V.close();else{z+=M.byteLength;let _=new ProgressEvent("progress",{lengthComputable:O,loaded:z,total:F});for(let x=0,C=q.length;x<C;x++){let P=q[x];if(P.onProgress)P.onProgress(_)}V.enqueue(M),E()}},(D)=>{V.error(D)})}}});return new Response(R)}else throw new HQ(`fetch for "${K.url}" responded with ${K.status}: ${K.statusText}`,K)}).then((K)=>{switch(H){case"arraybuffer":return K.arrayBuffer();case"blob":return K.blob();case"document":return K.text().then((q)=>{return new DOMParser().parseFromString(q,X)});case"json":return K.json();default:if(X===void 0)return K.text();else{let G=/charset="?([^;"\s]*)"?/i.exec(X),U=G&&G[1]?G[1].toLowerCase():void 0,F=new TextDecoder(U);return K.arrayBuffer().then((O)=>F.decode(O))}}}).then((K)=>{M6.add(J,K);let q=H6[J];delete H6[J];for(let G=0,U=q.length;G<U;G++){let F=q[G];if(F.onLoad)F.onLoad(K)}}).catch((K)=>{let q=H6[J];if(q===void 0)throw this.manager.itemError(J),K;delete H6[J];for(let G=0,U=q.length;G<U;G++){let F=q[G];if(F.onError)F.onError(K)}this.manager.itemError(J)}).finally(()=>{this.manager.itemEnd(J)}),this.manager.itemStart(J)}setResponseType(J){return this.responseType=J,this}setMimeType(J){return this.mimeType=J,this}}class KQ extends A6{constructor(J){super(J)}load(J,$,Q,Z){if(this.path!==void 0)J=this.path+J;J=this.manager.resolveURL(J);let W=this,Y=M6.get(J);if(Y!==void 0)return W.manager.itemStart(J),setTimeout(function(){if($)$(Y);W.manager.itemEnd(J)},0),Y;let X=S7("img");function H(){if(q(),M6.add(J,this),$)$(this);W.manager.itemEnd(J)}function K(G){if(q(),Z)Z(G);W.manager.itemError(J),W.manager.itemEnd(J)}function q(){X.removeEventListener("load",H,!1),X.removeEventListener("error",K,!1)}if(X.addEventListener("load",H,!1),X.addEventListener("error",K,!1),J.slice(0,5)!=="data:"){if(this.crossOrigin!==void 0)X.crossOrigin=this.crossOrigin}return W.manager.itemStart(J),X.src=J,X}}class b9 extends A6{constructor(J){super(J)}load(J,$,Q,Z){let W=new K0,Y=new KQ(this.manager);return Y.setCrossOrigin(this.crossOrigin),Y.setPath(this.path),Y.load(J,function(X){if(W.image=X,W.needsUpdate=!0,$!==void 0)$(W)},Q,Z),W}}class f7 extends Z0{constructor(J,$=1){super();this.isLight=!0,this.type="Light",this.color=new DJ(J),this.intensity=$}dispose(){}copy(J,$){return super.copy(J,$),this.color.copy(J.color),this.intensity=J.intensity,this}toJSON(J){let $=super.toJSON(J);if($.object.color=this.color.getHex(),$.object.intensity=this.intensity,this.groundColor!==void 0)$.object.groundColor=this.groundColor.getHex();if(this.distance!==void 0)$.object.distance=this.distance;if(this.angle!==void 0)$.object.angle=this.angle;if(this.decay!==void 0)$.object.decay=this.decay;if(this.penumbra!==void 0)$.object.penumbra=this.penumbra;if(this.shadow!==void 0)$.object.shadow=this.shadow.toJSON();if(this.target!==void 0)$.object.target=this.target.uuid;return $}}class g9 extends f7{constructor(J,$,Q){super(J,Q);this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Z0.DEFAULT_UP),this.updateMatrix(),this.groundColor=new DJ($)}copy(J,$){return super.copy(J,$),this.groundColor.copy(J.groundColor),this}}var G9=new _J,N5=new A,z5=new A;class S8{constructor(J){this.camera=J,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new LJ(512,512),this.map=null,this.mapPass=null,this.matrix=new _J,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new L8,this._frameExtents=new LJ(1,1),this._viewportCount=1,this._viewports=[new dJ(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(J){let $=this.camera,Q=this.matrix;N5.setFromMatrixPosition(J.matrixWorld),$.position.copy(N5),z5.setFromMatrixPosition(J.target.matrixWorld),$.lookAt(z5),$.updateMatrixWorld(),G9.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),this._frustum.setFromProjectionMatrix(G9),Q.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1),Q.multiply(G9)}getViewport(J){return this._viewports[J]}getFrameExtents(){return this._frameExtents}dispose(){if(this.map)this.map.dispose();if(this.mapPass)this.mapPass.dispose()}copy(J){return this.camera=J.camera.clone(),this.intensity=J.intensity,this.bias=J.bias,this.radius=J.radius,this.mapSize.copy(J.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let J={};if(this.intensity!==1)J.intensity=this.intensity;if(this.bias!==0)J.bias=this.bias;if(this.normalBias!==0)J.normalBias=this.normalBias;if(this.radius!==1)J.radius=this.radius;if(this.mapSize.x!==512||this.mapSize.y!==512)J.mapSize=this.mapSize.toArray();return J.camera=this.camera.toJSON(!1).object,delete J.camera.matrix,J}}class qQ extends S8{constructor(){super(new M0(50,1,0.5,500));this.isSpotLightShadow=!0,this.focus=1}updateMatrices(J){let $=this.camera,Q=U7*2*J.angle*this.focus,Z=this.mapSize.width/this.mapSize.height,W=J.distance||$.far;if(Q!==$.fov||Z!==$.aspect||W!==$.far)$.fov=Q,$.aspect=Z,$.far=W,$.updateProjectionMatrix();super.updateMatrices(J)}copy(J){return super.copy(J),this.focus=J.focus,this}}class p9 extends f7{constructor(J,$,Q=0,Z=Math.PI/3,W=0,Y=2){super(J,$);this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Z0.DEFAULT_UP),this.updateMatrix(),this.target=new Z0,this.distance=Q,this.angle=Z,this.penumbra=W,this.decay=Y,this.map=null,this.shadow=new qQ}get power(){return this.intensity*Math.PI}set power(J){this.intensity=J/Math.PI}dispose(){this.shadow.dispose()}copy(J,$){return super.copy(J,$),this.distance=J.distance,this.angle=J.angle,this.penumbra=J.penumbra,this.decay=J.decay,this.target=J.target.clone(),this.shadow=J.shadow.clone(),this}}var B5=new _J,C7=new A,U9=new A;class GQ extends S8{constructor(){super(new M0(90,1,0.5,500));this.isPointLightShadow=!0,this._frameExtents=new LJ(4,2),this._viewportCount=6,this._viewports=[new dJ(2,1,1,1),new dJ(0,1,1,1),new dJ(3,1,1,1),new dJ(1,1,1,1),new dJ(3,0,1,1),new dJ(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(J,$=0){let Q=this.camera,Z=this.matrix,W=J.distance||Q.far;if(W!==Q.far)Q.far=W,Q.updateProjectionMatrix();C7.setFromMatrixPosition(J.matrixWorld),Q.position.copy(C7),U9.copy(Q.position),U9.add(this._cubeDirections[$]),Q.up.copy(this._cubeUps[$]),Q.lookAt(U9),Q.updateMatrixWorld(),Z.makeTranslation(-C7.x,-C7.y,-C7.z),B5.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),this._frustum.setFromProjectionMatrix(B5)}}class l9 extends f7{constructor(J,$,Q=0,Z=2){super(J,$);this.isPointLight=!0,this.type="PointLight",this.distance=Q,this.decay=Z,this.shadow=new GQ}get power(){return this.intensity*4*Math.PI}set power(J){this.intensity=J/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(J,$){return super.copy(J,$),this.distance=J.distance,this.decay=J.decay,this.shadow=J.shadow.clone(),this}}class UQ extends S8{constructor(){super(new l6(-5,5,5,-5,0.5,500));this.isDirectionalLightShadow=!0}}class x7 extends f7{constructor(J,$){super(J,$);this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Z0.DEFAULT_UP),this.updateMatrix(),this.target=new Z0,this.shadow=new UQ}dispose(){this.shadow.dispose()}copy(J){return super.copy(J),this.target=J.target.clone(),this.shadow=J.shadow.clone(),this}}class n6{static decodeText(J){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(J);let $="";for(let Q=0,Z=J.length;Q<Z;Q++)$+=String.fromCharCode(J[Q]);try{return decodeURIComponent(escape($))}catch(Q){return $}}static extractUrlBase(J){let $=J.lastIndexOf("/");if($===-1)return"./";return J.slice(0,$+1)}static resolveURL(J,$){if(typeof J!=="string"||J==="")return"";if(/^https?:\/\//i.test($)&&/^\//.test(J))$=$.replace(/(^https?:\/\/[^\/]+).*/i,"$1");if(/^(https?:)?\/\//i.test(J))return J;if(/^data:.*,.*$/i.test(J))return J;if(/^blob:.*$/i.test(J))return J;return $+J}}class u9 extends A6{constructor(J){super(J);if(this.isImageBitmapLoader=!0,typeof createImageBitmap>"u")console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported.");if(typeof fetch>"u")console.warn("THREE.ImageBitmapLoader: fetch() not supported.");this.options={premultiplyAlpha:"none"}}setOptions(J){return this.options=J,this}load(J,$,Q,Z){if(J===void 0)J="";if(this.path!==void 0)J=this.path+J;J=this.manager.resolveURL(J);let W=this,Y=M6.get(J);if(Y!==void 0){if(W.manager.itemStart(J),Y.then){Y.then((K)=>{if($)$(K);W.manager.itemEnd(J)}).catch((K)=>{if(Z)Z(K)});return}return setTimeout(function(){if($)$(Y);W.manager.itemEnd(J)},0),Y}let X={};X.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",X.headers=this.requestHeader;let H=fetch(J,X).then(function(K){return K.blob()}).then(function(K){return createImageBitmap(K,Object.assign(W.options,{colorSpaceConversion:"none"}))}).then(function(K){if(M6.add(J,K),$)$(K);return W.manager.itemEnd(J),K}).catch(function(K){if(Z)Z(K);M6.remove(J),W.manager.itemError(J),W.manager.itemEnd(J)});M6.add(J,H),W.manager.itemStart(J)}}var m9="\\[\\]\\.:\\/",O4=new RegExp("["+m9+"]","g"),d9="[^"+m9+"]",R4="[^"+m9.replace("\\.","")+"]",N4=/((?:WC+[\/:])*)/.source.replace("WC",d9),z4=/(WCOD+)?/.source.replace("WCOD",R4),B4=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",d9),M4=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",d9),k4=new RegExp("^"+N4+z4+B4+M4+"$"),L4=["material","materials","bones","map"];class FQ{constructor(J,$,Q){let Z=Q||oJ.parseTrackName($);this._targetGroup=J,this._bindings=J.subscribe_($,Z)}getValue(J,$){this.bind();let Q=this._targetGroup.nCachedObjects_,Z=this._bindings[Q];if(Z!==void 0)Z.getValue(J,$)}setValue(J,$){let Q=this._bindings;for(let Z=this._targetGroup.nCachedObjects_,W=Q.length;Z!==W;++Z)Q[Z].setValue(J,$)}bind(){let J=this._bindings;for(let $=this._targetGroup.nCachedObjects_,Q=J.length;$!==Q;++$)J[$].bind()}unbind(){let J=this._bindings;for(let $=this._targetGroup.nCachedObjects_,Q=J.length;$!==Q;++$)J[$].unbind()}}class oJ{constructor(J,$,Q){this.path=$,this.parsedPath=Q||oJ.parseTrackName($),this.node=oJ.findNode(J,this.parsedPath.nodeName),this.rootNode=J,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(J,$,Q){if(!(J&&J.isAnimationObjectGroup))return new oJ(J,$,Q);else return new oJ.Composite(J,$,Q)}static sanitizeNodeName(J){return J.replace(/\s/g,"_").replace(O4,"")}static parseTrackName(J){let $=k4.exec(J);if($===null)throw Error("PropertyBinding: Cannot parse trackName: "+J);let Q={nodeName:$[2],objectName:$[3],objectIndex:$[4],propertyName:$[5],propertyIndex:$[6]},Z=Q.nodeName&&Q.nodeName.lastIndexOf(".");if(Z!==void 0&&Z!==-1){let W=Q.nodeName.substring(Z+1);if(L4.indexOf(W)!==-1)Q.nodeName=Q.nodeName.substring(0,Z),Q.objectName=W}if(Q.propertyName===null||Q.propertyName.length===0)throw Error("PropertyBinding: can not parse propertyName from trackName: "+J);return Q}static findNode(J,$){if($===void 0||$===""||$==="."||$===-1||$===J.name||$===J.uuid)return J;if(J.skeleton){let Q=J.skeleton.getBoneByName($);if(Q!==void 0)return Q}if(J.children){let Q=function(W){for(let Y=0;Y<W.length;Y++){let X=W[Y];if(X.name===$||X.uuid===$)return X;let H=Q(X.children);if(H)return H}return null},Z=Q(J.children);if(Z)return Z}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(J,$){J[$]=this.targetObject[this.propertyName]}_getValue_array(J,$){let Q=this.resolvedProperty;for(let Z=0,W=Q.length;Z!==W;++Z)J[$++]=Q[Z]}_getValue_arrayElement(J,$){J[$]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(J,$){this.resolvedProperty.toArray(J,$)}_setValue_direct(J,$){this.targetObject[this.propertyName]=J[$]}_setValue_direct_setNeedsUpdate(J,$){this.targetObject[this.propertyName]=J[$],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(J,$){this.targetObject[this.propertyName]=J[$],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(J,$){let Q=this.resolvedProperty;for(let Z=0,W=Q.length;Z!==W;++Z)Q[Z]=J[$++]}_setValue_array_setNeedsUpdate(J,$){let Q=this.resolvedProperty;for(let Z=0,W=Q.length;Z!==W;++Z)Q[Z]=J[$++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(J,$){let Q=this.resolvedProperty;for(let Z=0,W=Q.length;Z!==W;++Z)Q[Z]=J[$++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(J,$){this.resolvedProperty[this.propertyIndex]=J[$]}_setValue_arrayElement_setNeedsUpdate(J,$){this.resolvedProperty[this.propertyIndex]=J[$],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(J,$){this.resolvedProperty[this.propertyIndex]=J[$],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(J,$){this.resolvedProperty.fromArray(J,$)}_setValue_fromArray_setNeedsUpdate(J,$){this.resolvedProperty.fromArray(J,$),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(J,$){this.resolvedProperty.fromArray(J,$),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(J,$){this.bind(),this.getValue(J,$)}_setValue_unbound(J,$){this.bind(),this.setValue(J,$)}bind(){let J=this.node,$=this.parsedPath,Q=$.objectName,Z=$.propertyName,W=$.propertyIndex;if(!J)J=oJ.findNode(this.rootNode,$.nodeName),this.node=J;if(this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!J){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(Q){let K=$.objectIndex;switch(Q){case"materials":if(!J.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!J.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}J=J.material.materials;break;case"bones":if(!J.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}J=J.skeleton.bones;for(let q=0;q<J.length;q++)if(J[q].name===K){K=q;break}break;case"map":if("map"in J){J=J.map;break}if(!J.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!J.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}J=J.material.map;break;default:if(J[Q]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}J=J[Q]}if(K!==void 0){if(J[K]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,J);return}J=J[K]}}let Y=J[Z];if(Y===void 0){let K=$.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+K+"."+Z+" but it wasn't found.",J);return}let X=this.Versioning.None;if(this.targetObject=J,J.needsUpdate!==void 0)X=this.Versioning.NeedsUpdate;else if(J.matrixWorldNeedsUpdate!==void 0)X=this.Versioning.MatrixWorldNeedsUpdate;let H=this.BindingType.Direct;if(W!==void 0){if(Z==="morphTargetInfluences"){if(!J.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!J.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}if(J.morphTargetDictionary[W]!==void 0)W=J.morphTargetDictionary[W]}H=this.BindingType.ArrayElement,this.resolvedProperty=Y,this.propertyIndex=W}else if(Y.fromArray!==void 0&&Y.toArray!==void 0)H=this.BindingType.HasFromToArray,this.resolvedProperty=Y;else if(Array.isArray(Y))H=this.BindingType.EntireArray,this.resolvedProperty=Y;else this.propertyName=Z;this.getValue=this.GetterByBindingType[H],this.setValue=this.SetterByBindingTypeAndVersioning[H][X]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}oJ.Composite=FQ;oJ.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};oJ.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};oJ.prototype.GetterByBindingType=[oJ.prototype._getValue_direct,oJ.prototype._getValue_array,oJ.prototype._getValue_arrayElement,oJ.prototype._getValue_toArray];oJ.prototype.SetterByBindingTypeAndVersioning=[[oJ.prototype._setValue_direct,oJ.prototype._setValue_direct_setNeedsUpdate,oJ.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[oJ.prototype._setValue_array,oJ.prototype._setValue_array_setNeedsUpdate,oJ.prototype._setValue_array_setMatrixWorldNeedsUpdate],[oJ.prototype._setValue_arrayElement,oJ.prototype._setValue_arrayElement_setNeedsUpdate,oJ.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[oJ.prototype._setValue_fromArray,oJ.prototype._setValue_fromArray_setNeedsUpdate,oJ.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var n4=new Float32Array(1);var M5=new _J;class c9{constructor(J,$,Q=0,Z=1/0){this.ray=new _6(J,$),this.near=Q,this.far=Z,this.camera=null,this.layers=new k8,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(J,$){this.ray.set(J,$)}setFromCamera(J,$){if($.isPerspectiveCamera)this.ray.origin.setFromMatrixPosition($.matrixWorld),this.ray.direction.set(J.x,J.y,0.5).unproject($).sub(this.ray.origin).normalize(),this.camera=$;else if($.isOrthographicCamera)this.ray.origin.set(J.x,J.y,($.near+$.far)/($.near-$.far)).unproject($),this.ray.direction.set(0,0,-1).transformDirection($.matrixWorld),this.camera=$;else console.error("THREE.Raycaster: Unsupported camera type: "+$.type)}setFromXRController(J){return M5.identity().extractRotation(J.matrixWorld),this.ray.origin.setFromMatrixPosition(J.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(M5),this}intersectObject(J,$=!0,Q=[]){return O9(J,this,Q,$),Q.sort(k5),Q}intersectObjects(J,$=!0,Q=[]){for(let Z=0,W=J.length;Z<W;Z++)O9(J[Z],this,Q,$);return Q.sort(k5),Q}}function k5(J,$){return J.distance-$.distance}function O9(J,$,Q,Z){let W=!0;if(J.layers.test($.layers)){if(J.raycast($,Q)===!1)W=!1}if(W===!0&&Z===!0){let Y=J.children;for(let X=0,H=Y.length;X<H;X++)O9(Y[X],$,Q,!0)}}class j8{constructor(J=1,$=0,Q=0){return this.radius=J,this.phi=$,this.theta=Q,this}set(J,$,Q){return this.radius=J,this.phi=$,this.theta=Q,this}copy(J){return this.radius=J.radius,this.phi=J.phi,this.theta=J.theta,this}makeSafe(){return this.phi=Math.max(0.000001,Math.min(Math.PI-0.000001,this.phi)),this}setFromVector3(J){return this.setFromCartesianCoords(J.x,J.y,J.z)}setFromCartesianCoords(J,$,Q){if(this.radius=Math.sqrt(J*J+$*$+Q*Q),this.radius===0)this.theta=0,this.phi=0;else this.theta=Math.atan2(J,Q),this.phi=Math.acos(N0($/this.radius,-1,1));return this}clone(){return new this.constructor().copy(this)}}class n9 extends C6{constructor(J,$=null){super();this.object=J,this.domElement=$,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}if(typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));if(typeof window<"u")if(window.__THREE__)console.warn("WARNING: Multiple instances of Three.js being imported.");else window.__THREE__="170";var VQ={type:"change"},o9={type:"start"},OQ={type:"end"},y8=new _6,EQ=new a0,D4=Math.cos(70*M8.DEG2RAD),U0=new A,_0=2*Math.PI,eJ={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},s9=0.000001;class i9 extends n9{constructor(J,$=null){super(J,$);if(this.state=eJ.NONE,this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=0.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:g6.ROTATE,MIDDLE:g6.DOLLY,RIGHT:g6.PAN},this.touches={ONE:p6.ROTATE,TWO:p6.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new I0,this._lastTargetPosition=new A,this._quat=new I0().setFromUnitVectors(J.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new j8,this._sphericalDelta=new j8,this._scale=1,this._panOffset=new A,this._rotateStart=new LJ,this._rotateEnd=new LJ,this._rotateDelta=new LJ,this._panStart=new LJ,this._panEnd=new LJ,this._panDelta=new LJ,this._dollyStart=new LJ,this._dollyEnd=new LJ,this._dollyDelta=new LJ,this._dollyDirection=new A,this._mouse=new LJ,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=C4.bind(this),this._onPointerDown=w4.bind(this),this._onPointerUp=_4.bind(this),this._onContextMenu=y4.bind(this),this._onMouseWheel=T4.bind(this),this._onKeyDown=I4.bind(this),this._onTouchStart=S4.bind(this),this._onTouchMove=j4.bind(this),this._onMouseDown=P4.bind(this),this._onMouseMove=A4.bind(this),this._interceptControlDown=v4.bind(this),this._interceptControlUp=h4.bind(this),this.domElement!==null)this.connect();this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(J){J.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=J}stopListenToKeyEvents(){if(this._domElementKeyEvents!==null)this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(VQ),this.update(),this.state=eJ.NONE}update(J=null){let $=this.object.position;if(U0.copy($).sub(this.target),U0.applyQuaternion(this._quat),this._spherical.setFromVector3(U0),this.autoRotate&&this.state===eJ.NONE)this._rotateLeft(this._getAutoRotationAngle(J));if(this.enableDamping)this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor;else this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi;let Q=this.minAzimuthAngle,Z=this.maxAzimuthAngle;if(isFinite(Q)&&isFinite(Z)){if(Q<-Math.PI)Q+=_0;else if(Q>Math.PI)Q-=_0;if(Z<-Math.PI)Z+=_0;else if(Z>Math.PI)Z-=_0;if(Q<=Z)this._spherical.theta=Math.max(Q,Math.min(Z,this._spherical.theta));else this._spherical.theta=this._spherical.theta>(Q+Z)/2?Math.max(Q,this._spherical.theta):Math.min(Z,this._spherical.theta)}if(this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0)this.target.addScaledVector(this._panOffset,this.dampingFactor);else this.target.add(this._panOffset);this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let W=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let Y=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),W=Y!=this._spherical.radius}if(U0.setFromSpherical(this._spherical),U0.applyQuaternion(this._quatInverse),$.copy(this.target).add(U0),this.object.lookAt(this.target),this.enableDamping===!0)this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor);else this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0);if(this.zoomToCursor&&this._performCursorZoom){let Y=null;if(this.object.isPerspectiveCamera){let X=U0.length();Y=this._clampDistance(X*this._scale);let H=X-Y;this.object.position.addScaledVector(this._dollyDirection,H),this.object.updateMatrixWorld(),W=!!H}else if(this.object.isOrthographicCamera){let X=new A(this._mouse.x,this._mouse.y,0);X.unproject(this.object);let H=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),W=H!==this.object.zoom;let K=new A(this._mouse.x,this._mouse.y,0);K.unproject(this.object),this.object.position.sub(K).add(X),this.object.updateMatrixWorld(),Y=U0.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;if(Y!==null)if(this.screenSpacePanning)this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(Y).add(this.object.position);else if(y8.origin.copy(this.object.position),y8.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(y8.direction))<D4)this.object.lookAt(this.target);else EQ.setFromNormalAndCoplanarPoint(this.object.up,this.target),y8.intersectPlane(EQ,this.target)}else if(this.object.isOrthographicCamera){let Y=this.object.zoom;if(this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),Y!==this.object.zoom)this.object.updateProjectionMatrix(),W=!0}if(this._scale=1,this._performCursorZoom=!1,W||this._lastPosition.distanceToSquared(this.object.position)>s9||8*(1-this._lastQuaternion.dot(this.object.quaternion))>s9||this._lastTargetPosition.distanceToSquared(this.target)>s9)return this.dispatchEvent(VQ),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0;return!1}_getAutoRotationAngle(J){if(J!==null)return _0/60*this.autoRotateSpeed*J;else return _0/60/60*this.autoRotateSpeed}_getZoomScale(J){let $=Math.abs(J*0.01);return Math.pow(0.95,this.zoomSpeed*$)}_rotateLeft(J){this._sphericalDelta.theta-=J}_rotateUp(J){this._sphericalDelta.phi-=J}_panLeft(J,$){U0.setFromMatrixColumn($,0),U0.multiplyScalar(-J),this._panOffset.add(U0)}_panUp(J,$){if(this.screenSpacePanning===!0)U0.setFromMatrixColumn($,1);else U0.setFromMatrixColumn($,0),U0.crossVectors(this.object.up,U0);U0.multiplyScalar(J),this._panOffset.add(U0)}_pan(J,$){let Q=this.domElement;if(this.object.isPerspectiveCamera){let Z=this.object.position;U0.copy(Z).sub(this.target);let W=U0.length();W*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*J*W/Q.clientHeight,this.object.matrix),this._panUp(2*$*W/Q.clientHeight,this.object.matrix)}else if(this.object.isOrthographicCamera)this._panLeft(J*(this.object.right-this.object.left)/this.object.zoom/Q.clientWidth,this.object.matrix),this._panUp($*(this.object.top-this.object.bottom)/this.object.zoom/Q.clientHeight,this.object.matrix);else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1}_dollyOut(J){if(this.object.isPerspectiveCamera||this.object.isOrthographicCamera)this._scale/=J;else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1}_dollyIn(J){if(this.object.isPerspectiveCamera||this.object.isOrthographicCamera)this._scale*=J;else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1}_updateZoomParameters(J,$){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let Q=this.domElement.getBoundingClientRect(),Z=J-Q.left,W=$-Q.top,Y=Q.width,X=Q.height;this._mouse.x=Z/Y*2-1,this._mouse.y=-(W/X)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(J){return Math.max(this.minDistance,Math.min(this.maxDistance,J))}_handleMouseDownRotate(J){this._rotateStart.set(J.clientX,J.clientY)}_handleMouseDownDolly(J){this._updateZoomParameters(J.clientX,J.clientX),this._dollyStart.set(J.clientX,J.clientY)}_handleMouseDownPan(J){this._panStart.set(J.clientX,J.clientY)}_handleMouseMoveRotate(J){this._rotateEnd.set(J.clientX,J.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let $=this.domElement;this._rotateLeft(_0*this._rotateDelta.x/$.clientHeight),this._rotateUp(_0*this._rotateDelta.y/$.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(J){if(this._dollyEnd.set(J.clientX,J.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0)this._dollyOut(this._getZoomScale(this._dollyDelta.y));else if(this._dollyDelta.y<0)this._dollyIn(this._getZoomScale(this._dollyDelta.y));this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(J){this._panEnd.set(J.clientX,J.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(J){if(this._updateZoomParameters(J.clientX,J.clientY),J.deltaY<0)this._dollyIn(this._getZoomScale(J.deltaY));else if(J.deltaY>0)this._dollyOut(this._getZoomScale(J.deltaY));this.update()}_handleKeyDown(J){let $=!1;switch(J.code){case this.keys.UP:if(J.ctrlKey||J.metaKey||J.shiftKey)this._rotateUp(_0*this.rotateSpeed/this.domElement.clientHeight);else this._pan(0,this.keyPanSpeed);$=!0;break;case this.keys.BOTTOM:if(J.ctrlKey||J.metaKey||J.shiftKey)this._rotateUp(-_0*this.rotateSpeed/this.domElement.clientHeight);else this._pan(0,-this.keyPanSpeed);$=!0;break;case this.keys.LEFT:if(J.ctrlKey||J.metaKey||J.shiftKey)this._rotateLeft(_0*this.rotateSpeed/this.domElement.clientHeight);else this._pan(this.keyPanSpeed,0);$=!0;break;case this.keys.RIGHT:if(J.ctrlKey||J.metaKey||J.shiftKey)this._rotateLeft(-_0*this.rotateSpeed/this.domElement.clientHeight);else this._pan(-this.keyPanSpeed,0);$=!0;break}if($)J.preventDefault(),this.update()}_handleTouchStartRotate(J){if(this._pointers.length===1)this._rotateStart.set(J.pageX,J.pageY);else{let $=this._getSecondPointerPosition(J),Q=0.5*(J.pageX+$.x),Z=0.5*(J.pageY+$.y);this._rotateStart.set(Q,Z)}}_handleTouchStartPan(J){if(this._pointers.length===1)this._panStart.set(J.pageX,J.pageY);else{let $=this._getSecondPointerPosition(J),Q=0.5*(J.pageX+$.x),Z=0.5*(J.pageY+$.y);this._panStart.set(Q,Z)}}_handleTouchStartDolly(J){let $=this._getSecondPointerPosition(J),Q=J.pageX-$.x,Z=J.pageY-$.y,W=Math.sqrt(Q*Q+Z*Z);this._dollyStart.set(0,W)}_handleTouchStartDollyPan(J){if(this.enableZoom)this._handleTouchStartDolly(J);if(this.enablePan)this._handleTouchStartPan(J)}_handleTouchStartDollyRotate(J){if(this.enableZoom)this._handleTouchStartDolly(J);if(this.enableRotate)this._handleTouchStartRotate(J)}_handleTouchMoveRotate(J){if(this._pointers.length==1)this._rotateEnd.set(J.pageX,J.pageY);else{let Q=this._getSecondPointerPosition(J),Z=0.5*(J.pageX+Q.x),W=0.5*(J.pageY+Q.y);this._rotateEnd.set(Z,W)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let $=this.domElement;this._rotateLeft(_0*this._rotateDelta.x/$.clientHeight),this._rotateUp(_0*this._rotateDelta.y/$.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(J){if(this._pointers.length===1)this._panEnd.set(J.pageX,J.pageY);else{let $=this._getSecondPointerPosition(J),Q=0.5*(J.pageX+$.x),Z=0.5*(J.pageY+$.y);this._panEnd.set(Q,Z)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(J){let $=this._getSecondPointerPosition(J),Q=J.pageX-$.x,Z=J.pageY-$.y,W=Math.sqrt(Q*Q+Z*Z);this._dollyEnd.set(0,W),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let Y=(J.pageX+$.x)*0.5,X=(J.pageY+$.y)*0.5;this._updateZoomParameters(Y,X)}_handleTouchMoveDollyPan(J){if(this.enableZoom)this._handleTouchMoveDolly(J);if(this.enablePan)this._handleTouchMovePan(J)}_handleTouchMoveDollyRotate(J){if(this.enableZoom)this._handleTouchMoveDolly(J);if(this.enableRotate)this._handleTouchMoveRotate(J)}_addPointer(J){this._pointers.push(J.pointerId)}_removePointer(J){delete this._pointerPositions[J.pointerId];for(let $=0;$<this._pointers.length;$++)if(this._pointers[$]==J.pointerId){this._pointers.splice($,1);return}}_isTrackingPointer(J){for(let $=0;$<this._pointers.length;$++)if(this._pointers[$]==J.pointerId)return!0;return!1}_trackPointer(J){let $=this._pointerPositions[J.pointerId];if($===void 0)$=new LJ,this._pointerPositions[J.pointerId]=$;$.set(J.pageX,J.pageY)}_getSecondPointerPosition(J){let $=J.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[$]}_customWheelEvent(J){let $=J.deltaMode,Q={clientX:J.clientX,clientY:J.clientY,deltaY:J.deltaY};switch($){case 1:Q.deltaY*=16;break;case 2:Q.deltaY*=100;break}if(J.ctrlKey&&!this._controlActive)Q.deltaY*=10;return Q}}function w4(J){if(this.enabled===!1)return;if(this._pointers.length===0)this.domElement.setPointerCapture(J.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp);if(this._isTrackingPointer(J))return;if(this._addPointer(J),J.pointerType==="touch")this._onTouchStart(J);else this._onMouseDown(J)}function C4(J){if(this.enabled===!1)return;if(J.pointerType==="touch")this._onTouchMove(J);else this._onMouseMove(J)}function _4(J){switch(this._removePointer(J),this._pointers.length){case 0:this.domElement.releasePointerCapture(J.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(OQ),this.state=eJ.NONE;break;case 1:let $=this._pointers[0],Q=this._pointerPositions[$];this._onTouchStart({pointerId:$,pageX:Q.x,pageY:Q.y});break}}function P4(J){let $;switch(J.button){case 0:$=this.mouseButtons.LEFT;break;case 1:$=this.mouseButtons.MIDDLE;break;case 2:$=this.mouseButtons.RIGHT;break;default:$=-1}switch($){case g6.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(J),this.state=eJ.DOLLY;break;case g6.ROTATE:if(J.ctrlKey||J.metaKey||J.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(J),this.state=eJ.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(J),this.state=eJ.ROTATE}break;case g6.PAN:if(J.ctrlKey||J.metaKey||J.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(J),this.state=eJ.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(J),this.state=eJ.PAN}break;default:this.state=eJ.NONE}if(this.state!==eJ.NONE)this.dispatchEvent(o9)}function A4(J){switch(this.state){case eJ.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(J);break;case eJ.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(J);break;case eJ.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(J);break}}function T4(J){if(this.enabled===!1||this.enableZoom===!1||this.state!==eJ.NONE)return;J.preventDefault(),this.dispatchEvent(o9),this._handleMouseWheel(this._customWheelEvent(J)),this.dispatchEvent(OQ)}function I4(J){if(this.enabled===!1||this.enablePan===!1)return;this._handleKeyDown(J)}function S4(J){switch(this._trackPointer(J),this._pointers.length){case 1:switch(this.touches.ONE){case p6.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(J),this.state=eJ.TOUCH_ROTATE;break;case p6.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(J),this.state=eJ.TOUCH_PAN;break;default:this.state=eJ.NONE}break;case 2:switch(this.touches.TWO){case p6.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(J),this.state=eJ.TOUCH_DOLLY_PAN;break;case p6.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(J),this.state=eJ.TOUCH_DOLLY_ROTATE;break;default:this.state=eJ.NONE}break;default:this.state=eJ.NONE}if(this.state!==eJ.NONE)this.dispatchEvent(o9)}function j4(J){switch(this._trackPointer(J),this.state){case eJ.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(J),this.update();break;case eJ.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(J),this.update();break;case eJ.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(J),this.update();break;case eJ.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(J),this.update();break;default:this.state=eJ.NONE}}function y4(J){if(this.enabled===!1)return;J.preventDefault()}function v4(J){if(J.key==="Control")this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0})}function h4(J){if(J.key==="Control")this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0})}function a9(J,$){if($===S5)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),J;if($===j7||$===B8){let Q=J.getIndex();if(Q===null){let X=[],H=J.getAttribute("position");if(H!==void 0){for(let K=0;K<H.count;K++)X.push(K);J.setIndex(X),Q=J.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),J}let Z=Q.count-2,W=[];if($===j7)for(let X=1;X<=Z;X++)W.push(Q.getX(0)),W.push(Q.getX(X)),W.push(Q.getX(X+1));else for(let X=0;X<Z;X++)if(X%2===0)W.push(Q.getX(X)),W.push(Q.getX(X+1)),W.push(Q.getX(X+2));else W.push(Q.getX(X+2)),W.push(Q.getX(X+1)),W.push(Q.getX(X));if(W.length/3!==Z)console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let Y=J.clone();return Y.setIndex(W),Y.clearGroups(),Y}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",$),J}class Q$ extends A6{constructor(J){super(J);this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function($){return new DQ($)}),this.register(function($){return new wQ($)}),this.register(function($){return new yQ($)}),this.register(function($){return new vQ($)}),this.register(function($){return new hQ($)}),this.register(function($){return new _Q($)}),this.register(function($){return new PQ($)}),this.register(function($){return new AQ($)}),this.register(function($){return new TQ($)}),this.register(function($){return new LQ($)}),this.register(function($){return new IQ($)}),this.register(function($){return new CQ($)}),this.register(function($){return new jQ($)}),this.register(function($){return new SQ($)}),this.register(function($){return new MQ($)}),this.register(function($){return new fQ($)}),this.register(function($){return new xQ($)})}load(J,$,Q,Z){let W=this,Y;if(this.resourcePath!=="")Y=this.resourcePath;else if(this.path!==""){let K=n6.extractUrlBase(J);Y=n6.resolveURL(K,this.path)}else Y=n6.extractUrlBase(J);this.manager.itemStart(J);let X=function(K){if(Z)Z(K);else console.error(K);W.manager.itemError(J),W.manager.itemEnd(J)},H=new I8(this.manager);H.setPath(this.path),H.setResponseType("arraybuffer"),H.setRequestHeader(this.requestHeader),H.setWithCredentials(this.withCredentials),H.load(J,function(K){try{W.parse(K,Y,function(q){$(q),W.manager.itemEnd(J)},X)}catch(q){X(q)}},Q,X)}setDRACOLoader(J){return this.dracoLoader=J,this}setKTX2Loader(J){return this.ktx2Loader=J,this}setMeshoptDecoder(J){return this.meshoptDecoder=J,this}register(J){if(this.pluginCallbacks.indexOf(J)===-1)this.pluginCallbacks.push(J);return this}unregister(J){if(this.pluginCallbacks.indexOf(J)!==-1)this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(J),1);return this}parse(J,$,Q,Z){let W,Y={},X={},H=new TextDecoder;if(typeof J==="string")W=JSON.parse(J);else if(J instanceof ArrayBuffer)if(H.decode(new Uint8Array(J,0,4))===bQ){try{Y[bJ.KHR_BINARY_GLTF]=new gQ(J)}catch(G){if(Z)Z(G);return}W=JSON.parse(Y[bJ.KHR_BINARY_GLTF].content)}else W=JSON.parse(H.decode(J));else W=J;if(W.asset===void 0||W.asset.version[0]<2){if(Z)Z(Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let K=new dQ(W,{path:$||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});K.fileLoader.setRequestHeader(this.requestHeader);for(let q=0;q<this.pluginCallbacks.length;q++){let G=this.pluginCallbacks[q](K);if(!G.name)console.error("THREE.GLTFLoader: Invalid plugin found: missing name");X[G.name]=G,Y[G.name]=!0}if(W.extensionsUsed)for(let q=0;q<W.extensionsUsed.length;++q){let G=W.extensionsUsed[q],U=W.extensionsRequired||[];switch(G){case bJ.KHR_MATERIALS_UNLIT:Y[G]=new kQ;break;case bJ.KHR_DRACO_MESH_COMPRESSION:Y[G]=new pQ(W,this.dracoLoader);break;case bJ.KHR_TEXTURE_TRANSFORM:Y[G]=new lQ;break;case bJ.KHR_MESH_QUANTIZATION:Y[G]=new uQ;break;default:if(U.indexOf(G)>=0&&X[G]===void 0)console.warn('THREE.GLTFLoader: Unknown extension "'+G+'".')}}K.setExtensions(Y),K.setPlugins(X),K.parse(Q,Z)}parseAsync(J,$){let Q=this;return new Promise(function(Z,W){Q.parse(J,$,Z,W)})}}function f4(){let J={};return{get:function($){return J[$]},add:function($,Q){J[$]=Q},remove:function($){delete J[$]},removeAll:function(){J={}}}}var bJ={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class MQ{constructor(J){this.parser=J,this.name=bJ.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let J=this.parser,$=this.parser.json.nodes||[];for(let Q=0,Z=$.length;Q<Z;Q++){let W=$[Q];if(W.extensions&&W.extensions[this.name]&&W.extensions[this.name].light!==void 0)J._addNodeRef(this.cache,W.extensions[this.name].light)}}_loadLight(J){let $=this.parser,Q="light:"+J,Z=$.cache.get(Q);if(Z)return Z;let W=$.json,H=((W.extensions&&W.extensions[this.name]||{}).lights||[])[J],K,q=new DJ(16777215);if(H.color!==void 0)q.setRGB(H.color[0],H.color[1],H.color[2],e0);let G=H.range!==void 0?H.range:0;switch(H.type){case"directional":K=new x7(q),K.target.position.set(0,0,-1),K.add(K.target);break;case"point":K=new l9(q),K.distance=G;break;case"spot":K=new p9(q),K.distance=G,H.spot=H.spot||{},H.spot.innerConeAngle=H.spot.innerConeAngle!==void 0?H.spot.innerConeAngle:0,H.spot.outerConeAngle=H.spot.outerConeAngle!==void 0?H.spot.outerConeAngle:Math.PI/4,K.angle=H.spot.outerConeAngle,K.penumbra=1-H.spot.innerConeAngle/H.spot.outerConeAngle,K.target.position.set(0,0,-1),K.add(K.target);break;default:throw Error("THREE.GLTFLoader: Unexpected light type: "+H.type)}if(K.position.set(0,0,0),K.decay=2,U6(K,H),H.intensity!==void 0)K.intensity=H.intensity;return K.name=$.createUniqueName(H.name||"light_"+J),Z=Promise.resolve(K),$.cache.add(Q,Z),Z}getDependency(J,$){if(J!=="light")return;return this._loadLight($)}createNodeAttachment(J){let $=this,Q=this.parser,W=Q.json.nodes[J],X=(W.extensions&&W.extensions[this.name]||{}).light;if(X===void 0)return null;return this._loadLight(X).then(function(H){return Q._getNodeRef($.cache,X,H)})}}class kQ{constructor(){this.name=bJ.KHR_MATERIALS_UNLIT}getMaterialType(){return G6}extendParams(J,$,Q){let Z=[];J.color=new DJ(1,1,1),J.opacity=1;let W=$.pbrMetallicRoughness;if(W){if(Array.isArray(W.baseColorFactor)){let Y=W.baseColorFactor;J.color.setRGB(Y[0],Y[1],Y[2],e0),J.opacity=Y[3]}if(W.baseColorTexture!==void 0)Z.push(Q.assignTexture(J,"map",W.baseColorTexture,w6))}return Promise.all(Z)}}class LQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(J,$){let Z=this.parser.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=Z.extensions[this.name].emissiveStrength;if(W!==void 0)$.emissiveIntensity=W;return Promise.resolve()}}class DQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_CLEARCOAT}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if(Y.clearcoatFactor!==void 0)$.clearcoat=Y.clearcoatFactor;if(Y.clearcoatTexture!==void 0)W.push(Q.assignTexture($,"clearcoatMap",Y.clearcoatTexture));if(Y.clearcoatRoughnessFactor!==void 0)$.clearcoatRoughness=Y.clearcoatRoughnessFactor;if(Y.clearcoatRoughnessTexture!==void 0)W.push(Q.assignTexture($,"clearcoatRoughnessMap",Y.clearcoatRoughnessTexture));if(Y.clearcoatNormalTexture!==void 0){if(W.push(Q.assignTexture($,"clearcoatNormalMap",Y.clearcoatNormalTexture)),Y.clearcoatNormalTexture.scale!==void 0){let X=Y.clearcoatNormalTexture.scale;$.clearcoatNormalScale=new LJ(X,X)}}return Promise.all(W)}}class wQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_DISPERSION}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Z=this.parser.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=Z.extensions[this.name];return $.dispersion=W.dispersion!==void 0?W.dispersion:0,Promise.resolve()}}class CQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_IRIDESCENCE}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if(Y.iridescenceFactor!==void 0)$.iridescence=Y.iridescenceFactor;if(Y.iridescenceTexture!==void 0)W.push(Q.assignTexture($,"iridescenceMap",Y.iridescenceTexture));if(Y.iridescenceIor!==void 0)$.iridescenceIOR=Y.iridescenceIor;if($.iridescenceThicknessRange===void 0)$.iridescenceThicknessRange=[100,400];if(Y.iridescenceThicknessMinimum!==void 0)$.iridescenceThicknessRange[0]=Y.iridescenceThicknessMinimum;if(Y.iridescenceThicknessMaximum!==void 0)$.iridescenceThicknessRange[1]=Y.iridescenceThicknessMaximum;if(Y.iridescenceThicknessTexture!==void 0)W.push(Q.assignTexture($,"iridescenceThicknessMap",Y.iridescenceThicknessTexture));return Promise.all(W)}}class _Q{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_SHEEN}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[];$.sheenColor=new DJ(0,0,0),$.sheenRoughness=0,$.sheen=1;let Y=Z.extensions[this.name];if(Y.sheenColorFactor!==void 0){let X=Y.sheenColorFactor;$.sheenColor.setRGB(X[0],X[1],X[2],e0)}if(Y.sheenRoughnessFactor!==void 0)$.sheenRoughness=Y.sheenRoughnessFactor;if(Y.sheenColorTexture!==void 0)W.push(Q.assignTexture($,"sheenColorMap",Y.sheenColorTexture,w6));if(Y.sheenRoughnessTexture!==void 0)W.push(Q.assignTexture($,"sheenRoughnessMap",Y.sheenRoughnessTexture));return Promise.all(W)}}class PQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_TRANSMISSION}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if(Y.transmissionFactor!==void 0)$.transmission=Y.transmissionFactor;if(Y.transmissionTexture!==void 0)W.push(Q.assignTexture($,"transmissionMap",Y.transmissionTexture));return Promise.all(W)}}class AQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_VOLUME}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if($.thickness=Y.thicknessFactor!==void 0?Y.thicknessFactor:0,Y.thicknessTexture!==void 0)W.push(Q.assignTexture($,"thicknessMap",Y.thicknessTexture));$.attenuationDistance=Y.attenuationDistance||1/0;let X=Y.attenuationColor||[1,1,1];return $.attenuationColor=new DJ().setRGB(X[0],X[1],X[2],e0),Promise.all(W)}}class TQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_IOR}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Z=this.parser.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=Z.extensions[this.name];return $.ior=W.ior!==void 0?W.ior:1.5,Promise.resolve()}}class IQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_SPECULAR}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if($.specularIntensity=Y.specularFactor!==void 0?Y.specularFactor:1,Y.specularTexture!==void 0)W.push(Q.assignTexture($,"specularIntensityMap",Y.specularTexture));let X=Y.specularColorFactor||[1,1,1];if($.specularColor=new DJ().setRGB(X[0],X[1],X[2],e0),Y.specularColorTexture!==void 0)W.push(Q.assignTexture($,"specularColorMap",Y.specularColorTexture,w6));return Promise.all(W)}}class SQ{constructor(J){this.parser=J,this.name=bJ.EXT_MATERIALS_BUMP}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if($.bumpScale=Y.bumpFactor!==void 0?Y.bumpFactor:1,Y.bumpTexture!==void 0)W.push(Q.assignTexture($,"bumpMap",Y.bumpTexture));return Promise.all(W)}}class jQ{constructor(J){this.parser=J,this.name=bJ.KHR_MATERIALS_ANISOTROPY}getMaterialType(J){let Q=this.parser.json.materials[J];if(!Q.extensions||!Q.extensions[this.name])return null;return f0}extendMaterialParams(J,$){let Q=this.parser,Z=Q.json.materials[J];if(!Z.extensions||!Z.extensions[this.name])return Promise.resolve();let W=[],Y=Z.extensions[this.name];if(Y.anisotropyStrength!==void 0)$.anisotropy=Y.anisotropyStrength;if(Y.anisotropyRotation!==void 0)$.anisotropyRotation=Y.anisotropyRotation;if(Y.anisotropyTexture!==void 0)W.push(Q.assignTexture($,"anisotropyMap",Y.anisotropyTexture));return Promise.all(W)}}class yQ{constructor(J){this.parser=J,this.name=bJ.KHR_TEXTURE_BASISU}loadTexture(J){let $=this.parser,Q=$.json,Z=Q.textures[J];if(!Z.extensions||!Z.extensions[this.name])return null;let W=Z.extensions[this.name],Y=$.options.ktx2Loader;if(!Y)if(Q.extensionsRequired&&Q.extensionsRequired.indexOf(this.name)>=0)throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");else return null;return $.loadTextureImage(J,W.source,Y)}}class vQ{constructor(J){this.parser=J,this.name=bJ.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(J){let $=this.name,Q=this.parser,Z=Q.json,W=Z.textures[J];if(!W.extensions||!W.extensions[$])return null;let Y=W.extensions[$],X=Z.images[Y.source],H=Q.textureLoader;if(X.uri){let K=Q.options.manager.getHandler(X.uri);if(K!==null)H=K}return this.detectSupport().then(function(K){if(K)return Q.loadTextureImage(J,Y.source,H);if(Z.extensionsRequired&&Z.extensionsRequired.indexOf($)>=0)throw Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return Q.loadTexture(J)})}detectSupport(){if(!this.isSupported)this.isSupported=new Promise(function(J){let $=new Image;$.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",$.onload=$.onerror=function(){J($.height===1)}});return this.isSupported}}class hQ{constructor(J){this.parser=J,this.name=bJ.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(J){let $=this.name,Q=this.parser,Z=Q.json,W=Z.textures[J];if(!W.extensions||!W.extensions[$])return null;let Y=W.extensions[$],X=Z.images[Y.source],H=Q.textureLoader;if(X.uri){let K=Q.options.manager.getHandler(X.uri);if(K!==null)H=K}return this.detectSupport().then(function(K){if(K)return Q.loadTextureImage(J,Y.source,H);if(Z.extensionsRequired&&Z.extensionsRequired.indexOf($)>=0)throw Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return Q.loadTexture(J)})}detectSupport(){if(!this.isSupported)this.isSupported=new Promise(function(J){let $=new Image;$.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",$.onload=$.onerror=function(){J($.height===1)}});return this.isSupported}}class fQ{constructor(J){this.name=bJ.EXT_MESHOPT_COMPRESSION,this.parser=J}loadBufferView(J){let $=this.parser.json,Q=$.bufferViews[J];if(Q.extensions&&Q.extensions[this.name]){let Z=Q.extensions[this.name],W=this.parser.getDependency("buffer",Z.buffer),Y=this.parser.options.meshoptDecoder;if(!Y||!Y.supported)if($.extensionsRequired&&$.extensionsRequired.indexOf(this.name)>=0)throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");else return null;return W.then(function(X){let H=Z.byteOffset||0,K=Z.byteLength||0,q=Z.count,G=Z.byteStride,U=new Uint8Array(X,H,K);if(Y.decodeGltfBufferAsync)return Y.decodeGltfBufferAsync(q,G,U,Z.mode,Z.filter).then(function(F){return F.buffer});else return Y.ready.then(function(){let F=new ArrayBuffer(q*G);return Y.decodeGltfBuffer(new Uint8Array(F),q,G,U,Z.mode,Z.filter),F})})}else return null}}class xQ{constructor(J){this.name=bJ.EXT_MESH_GPU_INSTANCING,this.parser=J}createNodeMesh(J){let $=this.parser.json,Q=$.nodes[J];if(!Q.extensions||!Q.extensions[this.name]||Q.mesh===void 0)return null;let Z=$.meshes[Q.mesh];for(let K of Z.primitives)if(K.mode!==x0.TRIANGLES&&K.mode!==x0.TRIANGLE_STRIP&&K.mode!==x0.TRIANGLE_FAN&&K.mode!==void 0)return null;let Y=Q.extensions[this.name].attributes,X=[],H={};for(let K in Y)X.push(this.parser.getDependency("accessor",Y[K]).then((q)=>{return H[K]=q,H[K]}));if(X.length<1)return null;return X.push(this.parser.createNodeMesh(J)),Promise.all(X).then((K)=>{let q=K.pop(),G=q.isGroup?q.children:[q],U=K[0].count,F=[];for(let O of G){let z=new _J,R=new A,V=new I0,E=new A(1,1,1),D=new j9(O.geometry,O.material,U);for(let M=0;M<U;M++){if(H.TRANSLATION)R.fromBufferAttribute(H.TRANSLATION,M);if(H.ROTATION)V.fromBufferAttribute(H.ROTATION,M);if(H.SCALE)E.fromBufferAttribute(H.SCALE,M);D.setMatrixAt(M,z.compose(R,V,E))}for(let M in H)if(M==="_COLOR_0"){let _=H[M];D.instanceColor=new V7(_.array,_.itemSize,_.normalized)}else if(M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE")O.geometry.setAttribute(M,H[M]);Z0.prototype.copy.call(D,O),this.parser.assignFinalMaterial(D),F.push(D)}if(q.isGroup)return q.clear(),q.add(...F),q;return F[0]})}}var bQ="glTF",b7=12,RQ={JSON:1313821514,BIN:5130562};class gQ{constructor(J){this.name=bJ.KHR_BINARY_GLTF,this.content=null,this.body=null;let $=new DataView(J,0,b7),Q=new TextDecoder;if(this.header={magic:Q.decode(new Uint8Array(J.slice(0,4))),version:$.getUint32(4,!0),length:$.getUint32(8,!0)},this.header.magic!==bQ)throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");else if(this.header.version<2)throw Error("THREE.GLTFLoader: Legacy binary file detected.");let Z=this.header.length-b7,W=new DataView(J,b7),Y=0;while(Y<Z){let X=W.getUint32(Y,!0);Y+=4;let H=W.getUint32(Y,!0);if(Y+=4,H===RQ.JSON){let K=new Uint8Array(J,b7+Y,X);this.content=Q.decode(K)}else if(H===RQ.BIN){let K=b7+Y;this.body=J.slice(K,K+X)}Y+=X}if(this.content===null)throw Error("THREE.GLTFLoader: JSON content not found.")}}class pQ{constructor(J,$){if(!$)throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=bJ.KHR_DRACO_MESH_COMPRESSION,this.json=J,this.dracoLoader=$,this.dracoLoader.preload()}decodePrimitive(J,$){let Q=this.json,Z=this.dracoLoader,W=J.extensions[this.name].bufferView,Y=J.extensions[this.name].attributes,X={},H={},K={};for(let q in Y){let G=J$[q]||q.toLowerCase();X[G]=Y[q]}for(let q in J.attributes){let G=J$[q]||q.toLowerCase();if(Y[q]!==void 0){let U=Q.accessors[J.attributes[q]],F=O7[U.componentType];K[G]=F.name,H[G]=U.normalized===!0}}return $.getDependency("bufferView",W).then(function(q){return new Promise(function(G,U){Z.decodeDracoFile(q,function(F){for(let O in F.attributes){let z=F.attributes[O],R=H[O];if(R!==void 0)z.normalized=R}G(F)},X,K,e0,U)})})}}class lQ{constructor(){this.name=bJ.KHR_TEXTURE_TRANSFORM}extendTexture(J,$){if(($.texCoord===void 0||$.texCoord===J.channel)&&$.offset===void 0&&$.rotation===void 0&&$.scale===void 0)return J;if(J=J.clone(),$.texCoord!==void 0)J.channel=$.texCoord;if($.offset!==void 0)J.offset.fromArray($.offset);if($.rotation!==void 0)J.rotation=$.rotation;if($.scale!==void 0)J.repeat.fromArray($.scale);return J.needsUpdate=!0,J}}class uQ{constructor(){this.name=bJ.KHR_MESH_QUANTIZATION}}class Z$ extends m6{constructor(J,$,Q,Z){super(J,$,Q,Z)}copySampleValue_(J){let $=this.resultBuffer,Q=this.sampleValues,Z=this.valueSize,W=J*Z*3+Z;for(let Y=0;Y!==Z;Y++)$[Y]=Q[W+Y];return $}interpolate_(J,$,Q,Z){let W=this.resultBuffer,Y=this.sampleValues,X=this.valueSize,H=X*2,K=X*3,q=Z-$,G=(Q-$)/q,U=G*G,F=U*G,O=J*K,z=O-K,R=-2*F+3*U,V=F-U,E=1-R,D=V-U+G;for(let M=0;M!==X;M++){let _=Y[z+M+X],x=Y[z+M+H]*q,C=Y[O+M+X],P=Y[O+M]*q;W[M]=E*_+D*x+R*C+V*P}return W}}var x4=new I0;class mQ extends Z${interpolate_(J,$,Q,Z){let W=super.interpolate_(J,$,Q,Z);return x4.fromArray(W).normalize().toArray(W),W}}var x0={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},O7={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},NQ={9728:R9,9729:z8,9984:P5,9985:T5,9986:A5,9987:N9},zQ={33071:C5,33648:_5,10497:N8},r9={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},J$={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},T6={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},b4={CUBICSPLINE:void 0,LINEAR:z9,STEP:I5},t9={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function g4(J){if(J.DefaultMaterial===void 0)J.DefaultMaterial=new u6({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:L5});return J.DefaultMaterial}function s6(J,$,Q){for(let Z in Q.extensions)if(J[Z]===void 0)$.userData.gltfExtensions=$.userData.gltfExtensions||{},$.userData.gltfExtensions[Z]=Q.extensions[Z]}function U6(J,$){if($.extras!==void 0)if(typeof $.extras==="object")Object.assign(J.userData,$.extras);else console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+$.extras)}function p4(J,$,Q){let Z=!1,W=!1,Y=!1;for(let q=0,G=$.length;q<G;q++){let U=$[q];if(U.POSITION!==void 0)Z=!0;if(U.NORMAL!==void 0)W=!0;if(U.COLOR_0!==void 0)Y=!0;if(Z&&W&&Y)break}if(!Z&&!W&&!Y)return Promise.resolve(J);let X=[],H=[],K=[];for(let q=0,G=$.length;q<G;q++){let U=$[q];if(Z){let F=U.POSITION!==void 0?Q.getDependency("accessor",U.POSITION):J.attributes.position;X.push(F)}if(W){let F=U.NORMAL!==void 0?Q.getDependency("accessor",U.NORMAL):J.attributes.normal;H.push(F)}if(Y){let F=U.COLOR_0!==void 0?Q.getDependency("accessor",U.COLOR_0):J.attributes.color;K.push(F)}}return Promise.all([Promise.all(X),Promise.all(H),Promise.all(K)]).then(function(q){let G=q[0],U=q[1],F=q[2];if(Z)J.morphAttributes.position=G;if(W)J.morphAttributes.normal=U;if(Y)J.morphAttributes.color=F;return J.morphTargetsRelative=!0,J})}function l4(J,$){if(J.updateMorphTargets(),$.weights!==void 0)for(let Q=0,Z=$.weights.length;Q<Z;Q++)J.morphTargetInfluences[Q]=$.weights[Q];if($.extras&&Array.isArray($.extras.targetNames)){let Q=$.extras.targetNames;if(J.morphTargetInfluences.length===Q.length){J.morphTargetDictionary={};for(let Z=0,W=Q.length;Z<W;Z++)J.morphTargetDictionary[Q[Z]]=Z}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function u4(J){let $,Q=J.extensions&&J.extensions[bJ.KHR_DRACO_MESH_COMPRESSION];if(Q)$="draco:"+Q.bufferView+":"+Q.indices+":"+e9(Q.attributes);else $=J.indices+":"+e9(J.attributes)+":"+J.mode;if(J.targets!==void 0)for(let Z=0,W=J.targets.length;Z<W;Z++)$+=":"+e9(J.targets[Z]);return $}function e9(J){let $="",Q=Object.keys(J).sort();for(let Z=0,W=Q.length;Z<W;Z++)$+=Q[Z]+":"+J[Q[Z]]+";";return $}function $$(J){switch(J){case Int8Array:return 0.007874015748031496;case Uint8Array:return 0.00392156862745098;case Int16Array:return 0.00003051850947599719;case Uint16Array:return 0.000015259021896696422;default:throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function m4(J){if(J.search(/\.jpe?g($|\?)/i)>0||J.search(/^data\:image\/jpeg/)===0)return"image/jpeg";if(J.search(/\.webp($|\?)/i)>0||J.search(/^data\:image\/webp/)===0)return"image/webp";if(J.search(/\.ktx2($|\?)/i)>0||J.search(/^data\:image\/ktx2/)===0)return"image/ktx2";return"image/png"}var d4=new _J;class dQ{constructor(J={},$={}){this.json=J,this.extensions={},this.plugins={},this.options=$,this.cache=new f4,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let Q=!1,Z=-1,W=!1,Y=-1;if(typeof navigator<"u"){let X=navigator.userAgent;Q=/^((?!chrome|android).)*safari/i.test(X)===!0;let H=X.match(/Version\/(\d+)/);Z=Q&&H?parseInt(H[1],10):-1,W=X.indexOf("Firefox")>-1,Y=W?X.match(/Firefox\/([0-9]+)\./)[1]:-1}if(typeof createImageBitmap>"u"||Q&&Z<17||W&&Y<98)this.textureLoader=new b9(this.options.manager);else this.textureLoader=new u9(this.options.manager);if(this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new I8(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials")this.fileLoader.setWithCredentials(!0)}setExtensions(J){this.extensions=J}setPlugins(J){this.plugins=J}parse(J,$){let Q=this,Z=this.json,W=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(Y){return Y._markDefs&&Y._markDefs()}),Promise.all(this._invokeAll(function(Y){return Y.beforeRoot&&Y.beforeRoot()})).then(function(){return Promise.all([Q.getDependencies("scene"),Q.getDependencies("animation"),Q.getDependencies("camera")])}).then(function(Y){let X={scene:Y[0][Z.scene||0],scenes:Y[0],animations:Y[1],cameras:Y[2],asset:Z.asset,parser:Q,userData:{}};return s6(W,X,Z),U6(X,Z),Promise.all(Q._invokeAll(function(H){return H.afterRoot&&H.afterRoot(X)})).then(function(){for(let H of X.scenes)H.updateMatrixWorld();J(X)})}).catch($)}_markDefs(){let J=this.json.nodes||[],$=this.json.skins||[],Q=this.json.meshes||[];for(let Z=0,W=$.length;Z<W;Z++){let Y=$[Z].joints;for(let X=0,H=Y.length;X<H;X++)J[Y[X]].isBone=!0}for(let Z=0,W=J.length;Z<W;Z++){let Y=J[Z];if(Y.mesh!==void 0){if(this._addNodeRef(this.meshCache,Y.mesh),Y.skin!==void 0)Q[Y.mesh].isSkinnedMesh=!0}if(Y.camera!==void 0)this._addNodeRef(this.cameraCache,Y.camera)}}_addNodeRef(J,$){if($===void 0)return;if(J.refs[$]===void 0)J.refs[$]=J.uses[$]=0;J.refs[$]++}_getNodeRef(J,$,Q){if(J.refs[$]<=1)return Q;let Z=Q.clone(),W=(Y,X)=>{let H=this.associations.get(Y);if(H!=null)this.associations.set(X,H);for(let[K,q]of Y.children.entries())W(q,X.children[K])};return W(Q,Z),Z.name+="_instance_"+J.uses[$]++,Z}_invokeOne(J){let $=Object.values(this.plugins);$.push(this);for(let Q=0;Q<$.length;Q++){let Z=J($[Q]);if(Z)return Z}return null}_invokeAll(J){let $=Object.values(this.plugins);$.unshift(this);let Q=[];for(let Z=0;Z<$.length;Z++){let W=J($[Z]);if(W)Q.push(W)}return Q}getDependency(J,$){let Q=J+":"+$,Z=this.cache.get(Q);if(!Z){switch(J){case"scene":Z=this.loadScene($);break;case"node":Z=this._invokeOne(function(W){return W.loadNode&&W.loadNode($)});break;case"mesh":Z=this._invokeOne(function(W){return W.loadMesh&&W.loadMesh($)});break;case"accessor":Z=this.loadAccessor($);break;case"bufferView":Z=this._invokeOne(function(W){return W.loadBufferView&&W.loadBufferView($)});break;case"buffer":Z=this.loadBuffer($);break;case"material":Z=this._invokeOne(function(W){return W.loadMaterial&&W.loadMaterial($)});break;case"texture":Z=this._invokeOne(function(W){return W.loadTexture&&W.loadTexture($)});break;case"skin":Z=this.loadSkin($);break;case"animation":Z=this._invokeOne(function(W){return W.loadAnimation&&W.loadAnimation($)});break;case"camera":Z=this.loadCamera($);break;default:if(Z=this._invokeOne(function(W){return W!=this&&W.getDependency&&W.getDependency(J,$)}),!Z)throw Error("Unknown type: "+J);break}this.cache.add(Q,Z)}return Z}getDependencies(J){let $=this.cache.get(J);if(!$){let Q=this,Z=this.json[J+(J==="mesh"?"es":"s")]||[];$=Promise.all(Z.map(function(W,Y){return Q.getDependency(J,Y)})),this.cache.add(J,$)}return $}loadBuffer(J){let $=this.json.buffers[J],Q=this.fileLoader;if($.type&&$.type!=="arraybuffer")throw Error("THREE.GLTFLoader: "+$.type+" buffer type is not supported.");if($.uri===void 0&&J===0)return Promise.resolve(this.extensions[bJ.KHR_BINARY_GLTF].body);let Z=this.options;return new Promise(function(W,Y){Q.load(n6.resolveURL($.uri,Z.path),W,void 0,function(){Y(Error('THREE.GLTFLoader: Failed to load buffer "'+$.uri+'".'))})})}loadBufferView(J){let $=this.json.bufferViews[J];return this.getDependency("buffer",$.buffer).then(function(Q){let Z=$.byteLength||0,W=$.byteOffset||0;return Q.slice(W,W+Z)})}loadAccessor(J){let $=this,Q=this.json,Z=this.json.accessors[J];if(Z.bufferView===void 0&&Z.sparse===void 0){let Y=r9[Z.type],X=O7[Z.componentType],H=Z.normalized===!0,K=new X(Z.count*Y);return Promise.resolve(new V0(K,Y,H))}let W=[];if(Z.bufferView!==void 0)W.push(this.getDependency("bufferView",Z.bufferView));else W.push(null);if(Z.sparse!==void 0)W.push(this.getDependency("bufferView",Z.sparse.indices.bufferView)),W.push(this.getDependency("bufferView",Z.sparse.values.bufferView));return Promise.all(W).then(function(Y){let X=Y[0],H=r9[Z.type],K=O7[Z.componentType],q=K.BYTES_PER_ELEMENT,G=q*H,U=Z.byteOffset||0,F=Z.bufferView!==void 0?Q.bufferViews[Z.bufferView].byteStride:void 0,O=Z.normalized===!0,z,R;if(F&&F!==G){let V=Math.floor(U/F),E="InterleavedBuffer:"+Z.bufferView+":"+Z.componentType+":"+V+":"+Z.count,D=$.cache.get(E);if(!D)z=new K(X,V*F,Z.count*F/q),D=new C8(z,F/q),$.cache.add(E,D);R=new v7(D,H,U%F/q,O)}else{if(X===null)z=new K(Z.count*H);else z=new K(X,U,Z.count*H);R=new V0(z,H,O)}if(Z.sparse!==void 0){let V=r9.SCALAR,E=O7[Z.sparse.indices.componentType],D=Z.sparse.indices.byteOffset||0,M=Z.sparse.values.byteOffset||0,_=new E(Y[1],D,Z.sparse.count*V),x=new K(Y[2],M,Z.sparse.count*H);if(X!==null)R=new V0(R.array.slice(),R.itemSize,R.normalized);R.normalized=!1;for(let C=0,P=_.length;C<P;C++){let p=_[C];if(R.setX(p,x[C*H]),H>=2)R.setY(p,x[C*H+1]);if(H>=3)R.setZ(p,x[C*H+2]);if(H>=4)R.setW(p,x[C*H+3]);if(H>=5)throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}R.normalized=O}return R})}loadTexture(J){let $=this.json,Q=this.options,W=$.textures[J].source,Y=$.images[W],X=this.textureLoader;if(Y.uri){let H=Q.manager.getHandler(Y.uri);if(H!==null)X=H}return this.loadTextureImage(J,W,X)}loadTextureImage(J,$,Q){let Z=this,W=this.json,Y=W.textures[J],X=W.images[$],H=(X.uri||X.bufferView)+":"+Y.sampler;if(this.textureCache[H])return this.textureCache[H];let K=this.loadImageSource($,Q).then(function(q){if(q.flipY=!1,q.name=Y.name||X.name||"",q.name===""&&typeof X.uri==="string"&&X.uri.startsWith("data:image/")===!1)q.name=X.uri;let U=(W.samplers||{})[Y.sampler]||{};return q.magFilter=NQ[U.magFilter]||z8,q.minFilter=NQ[U.minFilter]||N9,q.wrapS=zQ[U.wrapS]||N8,q.wrapT=zQ[U.wrapT]||N8,q.generateMipmaps=!q.isCompressedTexture&&q.minFilter!==R9&&q.minFilter!==z8,Z.associations.set(q,{textures:J}),q}).catch(function(){return null});return this.textureCache[H]=K,K}loadImageSource(J,$){let Q=this,Z=this.json,W=this.options;if(this.sourceCache[J]!==void 0)return this.sourceCache[J].then((G)=>G.clone());let Y=Z.images[J],X=self.URL||self.webkitURL,H=Y.uri||"",K=!1;if(Y.bufferView!==void 0)H=Q.getDependency("bufferView",Y.bufferView).then(function(G){K=!0;let U=new Blob([G],{type:Y.mimeType});return H=X.createObjectURL(U),H});else if(Y.uri===void 0)throw Error("THREE.GLTFLoader: Image "+J+" is missing URI and bufferView");let q=Promise.resolve(H).then(function(G){return new Promise(function(U,F){let O=U;if($.isImageBitmapLoader===!0)O=function(z){let R=new K0(z);R.needsUpdate=!0,U(R)};$.load(n6.resolveURL(G,W.path),O,void 0,F)})}).then(function(G){if(K===!0)X.revokeObjectURL(H);return U6(G,Y),G.userData.mimeType=Y.mimeType||m4(Y.uri),G}).catch(function(G){throw console.error("THREE.GLTFLoader: Couldn't load texture",H),G});return this.sourceCache[J]=q,q}assignTexture(J,$,Q,Z){let W=this;return this.getDependency("texture",Q.index).then(function(Y){if(!Y)return null;if(Q.texCoord!==void 0&&Q.texCoord>0)Y=Y.clone(),Y.channel=Q.texCoord;if(W.extensions[bJ.KHR_TEXTURE_TRANSFORM]){let X=Q.extensions!==void 0?Q.extensions[bJ.KHR_TEXTURE_TRANSFORM]:void 0;if(X){let H=W.associations.get(Y);Y=W.extensions[bJ.KHR_TEXTURE_TRANSFORM].extendTexture(Y,X),W.associations.set(Y,H)}}if(Z!==void 0)Y.colorSpace=Z;return J[$]=Y,Y})}assignFinalMaterial(J){let{geometry:$,material:Q}=J,Z=$.attributes.tangent===void 0,W=$.attributes.color!==void 0,Y=$.attributes.normal===void 0;if(J.isPoints){let X="PointsMaterial:"+Q.uuid,H=this.cache.get(X);if(!H)H=new T8,v0.prototype.copy.call(H,Q),H.color.copy(Q.color),H.map=Q.map,H.sizeAttenuation=!1,this.cache.add(X,H);Q=H}else if(J.isLine){let X="LineBasicMaterial:"+Q.uuid,H=this.cache.get(X);if(!H)H=new A8,v0.prototype.copy.call(H,Q),H.color.copy(Q.color),H.map=Q.map,this.cache.add(X,H);Q=H}if(Z||W||Y){let X="ClonedMaterial:"+Q.uuid+":";if(Z)X+="derivative-tangents:";if(W)X+="vertex-colors:";if(Y)X+="flat-shading:";let H=this.cache.get(X);if(!H){if(H=Q.clone(),W)H.vertexColors=!0;if(Y)H.flatShading=!0;if(Z){if(H.normalScale)H.normalScale.y*=-1;if(H.clearcoatNormalScale)H.clearcoatNormalScale.y*=-1}this.cache.add(X,H),this.associations.set(H,this.associations.get(Q))}Q=H}J.material=Q}getMaterialType(){return u6}loadMaterial(J){let $=this,Q=this.json,Z=this.extensions,W=Q.materials[J],Y,X={},H=W.extensions||{},K=[];if(H[bJ.KHR_MATERIALS_UNLIT]){let G=Z[bJ.KHR_MATERIALS_UNLIT];Y=G.getMaterialType(),K.push(G.extendParams(X,W,$))}else{let G=W.pbrMetallicRoughness||{};if(X.color=new DJ(1,1,1),X.opacity=1,Array.isArray(G.baseColorFactor)){let U=G.baseColorFactor;X.color.setRGB(U[0],U[1],U[2],e0),X.opacity=U[3]}if(G.baseColorTexture!==void 0)K.push($.assignTexture(X,"map",G.baseColorTexture,w6));if(X.metalness=G.metallicFactor!==void 0?G.metallicFactor:1,X.roughness=G.roughnessFactor!==void 0?G.roughnessFactor:1,G.metallicRoughnessTexture!==void 0)K.push($.assignTexture(X,"metalnessMap",G.metallicRoughnessTexture)),K.push($.assignTexture(X,"roughnessMap",G.metallicRoughnessTexture));Y=this._invokeOne(function(U){return U.getMaterialType&&U.getMaterialType(J)}),K.push(Promise.all(this._invokeAll(function(U){return U.extendMaterialParams&&U.extendMaterialParams(J,X)})))}if(W.doubleSided===!0)X.side=D5;let q=W.alphaMode||t9.OPAQUE;if(q===t9.BLEND)X.transparent=!0,X.depthWrite=!1;else if(X.transparent=!1,q===t9.MASK)X.alphaTest=W.alphaCutoff!==void 0?W.alphaCutoff:0.5;if(W.normalTexture!==void 0&&Y!==G6){if(K.push($.assignTexture(X,"normalMap",W.normalTexture)),X.normalScale=new LJ(1,1),W.normalTexture.scale!==void 0){let G=W.normalTexture.scale;X.normalScale.set(G,G)}}if(W.occlusionTexture!==void 0&&Y!==G6){if(K.push($.assignTexture(X,"aoMap",W.occlusionTexture)),W.occlusionTexture.strength!==void 0)X.aoMapIntensity=W.occlusionTexture.strength}if(W.emissiveFactor!==void 0&&Y!==G6){let G=W.emissiveFactor;X.emissive=new DJ().setRGB(G[0],G[1],G[2],e0)}if(W.emissiveTexture!==void 0&&Y!==G6)K.push($.assignTexture(X,"emissiveMap",W.emissiveTexture,w6));return Promise.all(K).then(function(){let G=new Y(X);if(W.name)G.name=W.name;if(U6(G,W),$.associations.set(G,{materials:J}),W.extensions)s6(Z,G,W);return G})}createUniqueName(J){let $=oJ.sanitizeNodeName(J||"");if($ in this.nodeNamesUsed)return $+"_"+ ++this.nodeNamesUsed[$];else return this.nodeNamesUsed[$]=0,$}loadGeometries(J){let $=this,Q=this.extensions,Z=this.primitiveCache;function W(X){return Q[bJ.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(X,$).then(function(H){return BQ(H,X,$)})}let Y=[];for(let X=0,H=J.length;X<H;X++){let K=J[X],q=u4(K),G=Z[q];if(G)Y.push(G.promise);else{let U;if(K.extensions&&K.extensions[bJ.KHR_DRACO_MESH_COMPRESSION])U=W(K);else U=BQ(new h0,K,$);Z[q]={primitive:K,promise:U},Y.push(U)}}return Promise.all(Y)}loadMesh(J){let $=this,Q=this.json,Z=this.extensions,W=Q.meshes[J],Y=W.primitives,X=[];for(let H=0,K=Y.length;H<K;H++){let q=Y[H].material===void 0?g4(this.cache):this.getDependency("material",Y[H].material);X.push(q)}return X.push($.loadGeometries(Y)),Promise.all(X).then(function(H){let K=H.slice(0,H.length-1),q=H[H.length-1],G=[];for(let F=0,O=q.length;F<O;F++){let z=q[F],R=Y[F],V,E=K[F];if(R.mode===x0.TRIANGLES||R.mode===x0.TRIANGLE_STRIP||R.mode===x0.TRIANGLE_FAN||R.mode===void 0){if(V=W.isSkinnedMesh===!0?new I9(z,E):new D0(z,E),V.isSkinnedMesh===!0)V.normalizeSkinWeights();if(R.mode===x0.TRIANGLE_STRIP)V.geometry=a9(V.geometry,B8);else if(R.mode===x0.TRIANGLE_FAN)V.geometry=a9(V.geometry,j7)}else if(R.mode===x0.LINES)V=new y9(z,E);else if(R.mode===x0.LINE_STRIP)V=new h7(z,E);else if(R.mode===x0.LINE_LOOP)V=new v9(z,E);else if(R.mode===x0.POINTS)V=new h9(z,E);else throw Error("THREE.GLTFLoader: Primitive mode unsupported: "+R.mode);if(Object.keys(V.geometry.morphAttributes).length>0)l4(V,W);if(V.name=$.createUniqueName(W.name||"mesh_"+J),U6(V,W),R.extensions)s6(Z,V,R);$.assignFinalMaterial(V),G.push(V)}for(let F=0,O=G.length;F<O;F++)$.associations.set(G[F],{meshes:J,primitives:F});if(G.length===1){if(W.extensions)s6(Z,G[0],W);return G[0]}let U=new d0;if(W.extensions)s6(Z,U,W);$.associations.set(U,{meshes:J});for(let F=0,O=G.length;F<O;F++)U.add(G[F]);return U})}loadCamera(J){let $,Q=this.json.cameras[J],Z=Q[Q.type];if(!Z){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}if(Q.type==="perspective")$=new M0(M8.radToDeg(Z.yfov),Z.aspectRatio||1,Z.znear||1,Z.zfar||2000000);else if(Q.type==="orthographic")$=new l6(-Z.xmag,Z.xmag,Z.ymag,-Z.ymag,Z.znear,Z.zfar);if(Q.name)$.name=this.createUniqueName(Q.name);return U6($,Q),Promise.resolve($)}loadSkin(J){let $=this.json.skins[J],Q=[];for(let Z=0,W=$.joints.length;Z<W;Z++)Q.push(this._loadNodeShallow($.joints[Z]));if($.inverseBindMatrices!==void 0)Q.push(this.getDependency("accessor",$.inverseBindMatrices));else Q.push(null);return Promise.all(Q).then(function(Z){let W=Z.pop(),Y=Z,X=[],H=[];for(let K=0,q=Y.length;K<q;K++){let G=Y[K];if(G){X.push(G);let U=new _J;if(W!==null)U.fromArray(W.array,K*16);H.push(U)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',$.joints[K])}return new P8(X,H)})}loadAnimation(J){let $=this.json,Q=this,Z=$.animations[J],W=Z.name?Z.name:"animation_"+J,Y=[],X=[],H=[],K=[],q=[];for(let G=0,U=Z.channels.length;G<U;G++){let F=Z.channels[G],O=Z.samplers[F.sampler],z=F.target,R=z.node,V=Z.parameters!==void 0?Z.parameters[O.input]:O.input,E=Z.parameters!==void 0?Z.parameters[O.output]:O.output;if(z.node===void 0)continue;Y.push(this.getDependency("node",R)),X.push(this.getDependency("accessor",V)),H.push(this.getDependency("accessor",E)),K.push(O),q.push(z)}return Promise.all([Promise.all(Y),Promise.all(X),Promise.all(H),Promise.all(K),Promise.all(q)]).then(function(G){let U=G[0],F=G[1],O=G[2],z=G[3],R=G[4],V=[];for(let E=0,D=U.length;E<D;E++){let M=U[E],_=F[E],x=O[E],C=z[E],P=R[E];if(M===void 0)continue;if(M.updateMatrix)M.updateMatrix();let p=Q._createAnimationTracks(M,_,x,C,P);if(p)for(let k=0;k<p.length;k++)V.push(p[k])}return new x9(W,void 0,V)})}createNodeMesh(J){let $=this.json,Q=this,Z=$.nodes[J];if(Z.mesh===void 0)return null;return Q.getDependency("mesh",Z.mesh).then(function(W){let Y=Q._getNodeRef(Q.meshCache,Z.mesh,W);if(Z.weights!==void 0)Y.traverse(function(X){if(!X.isMesh)return;for(let H=0,K=Z.weights.length;H<K;H++)X.morphTargetInfluences[H]=Z.weights[H]});return Y})}loadNode(J){let $=this.json,Q=this,Z=$.nodes[J],W=Q._loadNodeShallow(J),Y=[],X=Z.children||[];for(let K=0,q=X.length;K<q;K++)Y.push(Q.getDependency("node",X[K]));let H=Z.skin===void 0?Promise.resolve(null):Q.getDependency("skin",Z.skin);return Promise.all([W,Promise.all(Y),H]).then(function(K){let q=K[0],G=K[1],U=K[2];if(U!==null)q.traverse(function(F){if(!F.isSkinnedMesh)return;F.bind(U,d4)});for(let F=0,O=G.length;F<O;F++)q.add(G[F]);return q})}_loadNodeShallow(J){let $=this.json,Q=this.extensions,Z=this;if(this.nodeCache[J]!==void 0)return this.nodeCache[J];let W=$.nodes[J],Y=W.name?Z.createUniqueName(W.name):"",X=[],H=Z._invokeOne(function(K){return K.createNodeMesh&&K.createNodeMesh(J)});if(H)X.push(H);if(W.camera!==void 0)X.push(Z.getDependency("camera",W.camera).then(function(K){return Z._getNodeRef(Z.cameraCache,W.camera,K)}));return Z._invokeAll(function(K){return K.createNodeAttachment&&K.createNodeAttachment(J)}).forEach(function(K){X.push(K)}),this.nodeCache[J]=Promise.all(X).then(function(K){let q;if(W.isBone===!0)q=new _8;else if(K.length>1)q=new d0;else if(K.length===1)q=K[0];else q=new Z0;if(q!==K[0])for(let G=0,U=K.length;G<U;G++)q.add(K[G]);if(W.name)q.userData.name=W.name,q.name=Y;if(U6(q,W),W.extensions)s6(Q,q,W);if(W.matrix!==void 0){let G=new _J;G.fromArray(W.matrix),q.applyMatrix4(G)}else{if(W.translation!==void 0)q.position.fromArray(W.translation);if(W.rotation!==void 0)q.quaternion.fromArray(W.rotation);if(W.scale!==void 0)q.scale.fromArray(W.scale)}if(!Z.associations.has(q))Z.associations.set(q,{});return Z.associations.get(q).nodes=J,q}),this.nodeCache[J]}loadScene(J){let $=this.extensions,Q=this.json.scenes[J],Z=this,W=new d0;if(Q.name)W.name=Z.createUniqueName(Q.name);if(U6(W,Q),Q.extensions)s6($,W,Q);let Y=Q.nodes||[],X=[];for(let H=0,K=Y.length;H<K;H++)X.push(Z.getDependency("node",Y[H]));return Promise.all(X).then(function(H){for(let q=0,G=H.length;q<G;q++)W.add(H[q]);let K=(q)=>{let G=new Map;for(let[U,F]of Z.associations)if(U instanceof v0||U instanceof K0)G.set(U,F);return q.traverse((U)=>{let F=Z.associations.get(U);if(F!=null)G.set(U,F)}),G};return Z.associations=K(W),W})}_createAnimationTracks(J,$,Q,Z,W){let Y=[],X=J.name?J.name:J.uuid,H=[];if(T6[W.path]===T6.weights)J.traverse(function(U){if(U.morphTargetInfluences)H.push(U.name?U.name:U.uuid)});else H.push(X);let K;switch(T6[W.path]){case T6.weights:K=L6;break;case T6.rotation:K=P6;break;case T6.position:case T6.scale:K=D6;break;default:switch(Q.itemSize){case 1:K=L6;break;case 2:case 3:default:K=D6;break}break}let q=Z.interpolation!==void 0?b4[Z.interpolation]:z9,G=this._getArrayFromAccessor(Q);for(let U=0,F=H.length;U<F;U++){let O=new K(H[U]+"."+T6[W.path],$.array,G,q);if(Z.interpolation==="CUBICSPLINE")this._createCubicSplineTrackInterpolant(O);Y.push(O)}return Y}_getArrayFromAccessor(J){let $=J.array;if(J.normalized){let Q=$$($.constructor),Z=new Float32Array($.length);for(let W=0,Y=$.length;W<Y;W++)Z[W]=$[W]*Q;$=Z}return $}_createCubicSplineTrackInterpolant(J){J.createInterpolant=function(Q){return new(this instanceof P6?mQ:Z$)(this.times,this.values,this.getValueSize()/3,Q)},J.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function c4(J,$,Q){let Z=$.attributes,W=new S0;if(Z.POSITION!==void 0){let H=Q.json.accessors[Z.POSITION],K=H.min,q=H.max;if(K!==void 0&&q!==void 0){if(W.set(new A(K[0],K[1],K[2]),new A(q[0],q[1],q[2])),H.normalized){let G=$$(O7[H.componentType]);W.min.multiplyScalar(G),W.max.multiplyScalar(G)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let Y=$.targets;if(Y!==void 0){let H=new A,K=new A;for(let q=0,G=Y.length;q<G;q++){let U=Y[q];if(U.POSITION!==void 0){let F=Q.json.accessors[U.POSITION],O=F.min,z=F.max;if(O!==void 0&&z!==void 0){if(K.setX(Math.max(Math.abs(O[0]),Math.abs(z[0]))),K.setY(Math.max(Math.abs(O[1]),Math.abs(z[1]))),K.setZ(Math.max(Math.abs(O[2]),Math.abs(z[2]))),F.normalized){let R=$$(O7[F.componentType]);K.multiplyScalar(R)}H.max(K)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}W.expandByVector(H)}J.boundingBox=W;let X=new C0;W.getCenter(X.center),X.radius=W.min.distanceTo(W.max)/2,J.boundingSphere=X}function BQ(J,$,Q){let Z=$.attributes,W=[];function Y(X,H){return Q.getDependency("accessor",X).then(function(K){J.setAttribute(H,K)})}for(let X in Z){let H=J$[X]||X.toLowerCase();if(H in J.attributes)continue;W.push(Y(Z[X],H))}if($.indices!==void 0&&!J.index){let X=Q.getDependency("accessor",$.indices).then(function(H){J.setIndex(H)});W.push(X)}if(pJ.workingColorSpace!==e0&&"COLOR_0"in Z)console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${pJ.workingColorSpace}" not supported.`);return U6(J,$),c4(J,$,Q),Promise.all(W).then(function(){return $.targets!==void 0?p4(J,$.targets,Q):J})}globalThis.CAD3D={Scene:T9,Group:d0,Vector2:LJ,Vector3:A,Box3:S0,Matrix4:_J,Sphere:C0,Color:DJ,DirectionalLight:x7,HemisphereLight:g9,WebGLRenderer:A9,OrthographicCamera:l6,Raycaster:c9,MeshStandardMaterial:u6,SRGBColorSpace:w6,NoToneMapping:w5,OrbitControls:i9,GLTFLoader:Q$};})();
