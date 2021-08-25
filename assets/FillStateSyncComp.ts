// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import StateSyncComp from 'StateSyncComp'
@ccclass
export default class FillStateSyncComp extends StateSyncComp {

    // onLoad () {}

    start () {
        window.stcomp = this;
        this.syncData = {step: 1, param: 4}
    }

    // update (dt) {}
}
