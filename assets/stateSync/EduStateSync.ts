import {IStateSync, StateSyncEvent} from "./IStateSync";
import {agoraWhiteBoard} from './AgoraWhiteBoard';
import EduElementAbstract from 'EduElementAbstract';

/**
 * 状态同步组件需要接入的接口
 */
export interface IStateSyncComp {
    syncData: any;

    getId(): string;

    onDataUpdate(data);
}

class EduStateSync extends cc.EventTarget {
    syncInstance: IStateSync;
    syncList = {};

    constructor() {
        super();
        this._initSyncInstance();
    }

    /**
     *
     * 需要根据平台去判断下使用哪个平台进行对接
     */
    private _initSyncInstance() {
        //todo:需要根据平台去判断是哪个同步的实例（这里偷懒直接使用声网白板的）
        this.syncInstance = agoraWhiteBoard;
        this._initEvent();
    }

    private _initEvent() {
        this.syncInstance.on(StateSyncEvent.StateUpdate, this.onStateUpdate, this);
    }

    onStateUpdate(data) {
        console.log('----onStateUpdate', data);

        //todo:需要做个diff，这样才能准确知道哪个有改动AttributesUpdate
        if (!data.ice) return;
        let iceData = data.ice;
        let compId = data.ice.changeId;
        this.syncList = iceData.data;
        if (this.syncList[iceData.changeId]) {
            this.emit(`data-update-${compId}`,this.syncList[compId]);
        }
    }

    /**
     * 把当前的数据同步到服务端
     */
    syncChanges(comp: IStateSyncComp) {
        //todo:提交数据更新
        let compId = comp.getId();
        if (!compId) {
            return console.warn('component id not found!');
        }
        if (!comp.syncData) {
            return console.warn('syncData not found');
        }
        this.syncList[compId] = comp.syncData;

        this.commitDataUpdate(compId);
    }

    commitDataUpdate(compId: string) {
        let commitData = {
            changeId: compId,
            data: this.syncList,
        };
        const uploadData = {
            ice:commitData,
        }

        this.syncInstance.setAttributes(uploadData);
    }
}

export let eduStateSync = new EduStateSync();
globalThis.eduStateSync = eduStateSync;
