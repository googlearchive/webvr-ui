export class AbstractButtonDom {
    constructor(){
        this.domElement = undefined;

    }

    onClick(func){
        this.onClickBinding = func;
    }

    setTitle(text, error = false) {
    }

    setDescription(text) {
    }
}