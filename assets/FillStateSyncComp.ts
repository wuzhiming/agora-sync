// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {eduStateSync} from "./stateSync/EduStateSync";

const {ccclass, property} = cc._decorator;
import StateSyncComp from 'StateSyncComp'
import {eduStateSync, IStateSyncComp} from 'EduStateSync';

enum FILL_STEP {
    ready = 'ready',
    show_num = 'show_num',
    show_anim = 'show_anim',
    show_result = 'show_result',
    close_result = 'close_result',
}

@ccclass
export default class FillStateSyncComp extends StateSyncComp {


    static FillStateSync: FillStateSyncComp = null;
    numberKeyboard: cc.Node = null;

    onLoad() {
        super.onLoad();
        FillStateSyncComp.FillStateSync = this;
        eduStateSync.on('show_num', this.showNumberPad, this);
        eduStateSync.on('show_anim', this.numberClick, this);
        eduStateSync.on('show_result', this.showResult, this);
        eduStateSync.on('close_result', this.closeResult, this);
    }

    onDestroy() {
        super.onDestroy();
        eduStateSync.off('show_num', this.showNumberPad, this);
        eduStateSync.off('show_anim', this.numberClick, this);
        eduStateSync.off('show_result', this.showResult, this);
        eduStateSync.off('close_result', this.closeResult, this);
    }

    start() {
        this.curStep = FILL_STEP.ready;
        window.stcomp = this;
        this.syncData = {step: FILL_STEP.ready, num: 4}
    }

    onDataUpdate(data) {
        super.onDataUpdate(data);
        this.stateUpdate();
    }


    stateUpdate() {
        if (this.syncData.step === this.curStep) {
            return;
        }

        switch (this.syncData.step) {
            case FILL_STEP.ready:
                break;
            case FILL_STEP.show_num:
                break;
            case FILL_STEP.show_anim:
                break;
            case FILL_STEP.show_result:
                break;
        }

        this.curStep = this.syncData.step;
        eduStateSync.emit(this.syncData.step + '_ret', this.syncData);
    }

    showNumberPad() {
        this.syncData.step = FILL_STEP.show_num;
        this.dataSync();
    }

    numberClick(num) {
        this.syncData.step = FILL_STEP.show_anim;
        this.syncData.num = num;
        this.dataSync();
    }

    showResult() {
        this.syncData.step = FILL_STEP.show_result;
        this.dataSync();
    }

    closeResult() {
        this.syncData.step = FILL_STEP.close_result;
        this.dataSync();
    }

    // update (dt) {}
}
