// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {eduGame} from 'EduGame';
import GameBackground from 'GameBackground';
@ccclass
export default class AgoraScene extends cc.Component {

    onLoad () {
        this.node.addComponent(GameBackground);
        let node = eduGame.init();
        this.node.addChild(node);
    }

    start () {

    }

    // update (dt) {}
}
