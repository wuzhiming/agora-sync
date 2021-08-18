import {IStateSync, StateSyncEvent} from "./IStateSync";
import {agoraWhiteBoard} from './AgoraWhiteBoard';
import EduElementAbstract from 'EduElementAbstract';

export interface IStateEvent {
    key: string;
    callback: Function,
}

export interface IStateSyncComp {
    syncData: any;

    getId(): string;

    onDataUpdate(data): Promise<void>;
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
        //todo:下发到数据有更新的组件
    }

    /**
     * 把当前的数据同步到服务端
     */
    async syncChanges(comp: IStateSyncComp) {
        //todo:提交数据更新
    }

    registerStateSyncData(comp: IStateSyncComp) {
        if (!this.syncList[comp.getId()]) {
            this.syncList[comp.getId()] = [];
        }
        this.syncList[comp.getId()].push(comp);
    }

    unRegisterStateSyncData(comp: IStateSyncComp) {
        delete this.syncList[comp.getId()];
    }
}

export let eduStateSync = new EduStateSync();
globalThis.eduStateSync = eduStateSync;
