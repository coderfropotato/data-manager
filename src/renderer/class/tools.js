import drawFunc from '@/class/func';

function Tools (){
    this.type = '';
    this.wrap = '';
    this.drawFunc = drawFunc;
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
Tools.prototype.getOptions = function(){
    let type = this.type;
    let wrap = this.wrap;
    return {type,wrap};
}
Tools.prototype.getCurrentType = function(){
    return this.type;
}
Tools.prototype.draw = function(data,newConfig){
    this.drawFunc[this.type](data,newConfig,this.wrap);
}

export default new Tools();