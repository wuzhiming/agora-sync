// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import EduElementAbstract from 'EduElementAbstract';
import {eduStateSync, IStateSyncComp} from './EduStateSync';

@ccclass('StateSyncComp')
export default class StateSyncComp extends EduElementAbstract implements IStateSyncComp {
    syncData: any = {};

    getId(): string {
        return this.id;
    }

    onLoad() {
        eduStateSync.registerStateSyncData(this);
    }

    onDestroy() {
        eduStateSync.unRegisterStateSyncData(this);
    }

    async onDataUpdate(data) {
        this.syncData = data;
    }
}
