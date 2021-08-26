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
        this.syncInstance.on(StateSyncEvent.CompStateUpdate, this.onStateUpdate, this);
    }

    onStateUpdate(compId) {
        this.syncInstance.getAttributes().then(data => {
            if (data.hasOwnProperty(compId)) {
                this.emit(`data-update-${compId}`, data[compId]);
            }
        });
    }

    /**
     * 把当前的数据同步到服务端
     */
    async syncChanges(comp: IStateSyncComp) {
        //todo:提交数据更新
        let compId = comp.getId();
        if (!compId) {
            return console.warn('component id not found!');
        }
        if (!comp.syncData) {
            return console.warn('syncData not found');
        }
        this.syncList[compId] = comp.syncData;

        let data = {};
        data[compId] = comp.syncData;
        //更新组件状态数据
        await this.syncInstance.setAttributes(data);
        //发送组件更新状态消息
        this.syncInstance.compStateUpdate(compId);

        this.onStateUpdate(compId);
    }

}

export let eduStateSync = new EduStateSync();
globalThis.eduStateSync = eduStateSync;
