// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import StateSyncComp from 'StateSyncComp'
import {eduStateSync, IStateSyncComp} from 'EduStateSync';

enum SELECT_STEP {
    ready = 'ready',
    show_answer = 'show_answer'
}

@ccclass
export default class NewClass extends StateSyncComp {

    onLoad() {
        super.onLoad();
        this.syncData = {
            step: SELECT_STEP.ready,
            items: {},
            curSelect: '',
        }
        this.curStep = SELECT_STEP.ready;
        eduStateSync.on('add_select_item', this.addSelectItem, this);
        eduStateSync.on(SELECT_STEP.show_answer, this.showAnswer, this);
    }

    onDestroy() {
        super.onDestroy();
        eduStateSync.off('add_select_item', this.addSelectItem, this);
        eduStateSync.off(SELECT_STEP.show_answer, this.showAnswer, this);
    }

    showAnswer(id){
        this.syncData.curSelect = id;
        this.syncData.step = SELECT_STEP.show_answer;
        this.dataSync();
    }

    addSelectItem(item) {
        this.syncData.items[item.id] = !!item.isRight;
        this.dataSync();
    }

    onDataUpdate(data) {
        super.onDataUpdate(data);
        this.stateUpdate();
    }

    stateUpdate() {
        switch (this.syncData.step) {
            case SELECT_STEP.show_answer:
                break;
        }
        this.curStep = this.syncData.step;
        eduStateSync.emit(`${this.syncData.step}_ret`, this.syncData.curSelect);
    }

    start() {

    }

    // update (dt) {}
}
