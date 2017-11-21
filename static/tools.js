import config from '../static/configs';
import drawFunc from '../static/func';

function Tools (){
    this.type = '';
    this.wrap = '';
    this.config = config;
    this.draw = drawFunc;
}
Tools.prototype.config = function(options){
    this.type = options.type || '';
    this.wrap = typeof options['wrap']==='string'?document.querySelector(options['wrap']):options['wrap'];
}
Tools.prototype.setType = function(type){
    this.type = type;
}
Tools.prototype.setWrap = function(wrap){
    this.wrap = typeof wrap==='string'?document.querySelector(wrap):wrap;
}
Tools.prototype.getBaseConfig = function(){
    let config = this.config;
    return {config};
}
Tools.prototype.getOptions = function(){
    let type = this.type;
    let wrap = this.wrap;
    return {type,wrap};
}
Tools.prototype.getCurrentType = function(){
    return this.type;
}
Tools.prototype.draw = function(newConfig){
    this.draw[type](newConfig);
}

export default new Tools();