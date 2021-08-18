import {GameConfig} from 'GameConfig';
import {GameDB} from 'GameDB';
import {eduGame} from 'EduGame';
import {IStateSync, StateSyncEvent} from "IStateSync";

/**
 * 在 iframe 可能发送或者收到的事件
 */
export enum IframeEvents {
    Init = "Init",
    AttributesUpdate = "AttributesUpdate",
    SetAttributes = "SetAttributes",
    RegisterMagixEvent = "RegisterMagixEvent",
    RemoveMagixEvent = "RemoveMagixEvent",
    RemoveAllMagixEvent = "RemoveAllMagixEvent",
    RoomStateChanged = "RoomStateChanged",
    DispatchMagixEvent = "DispatchMagixEvent",
    ReciveMagixEvent = "ReciveMagixEvent",
    NextPage = "NextPage",
    PrevPage = "PrevPage",
    SDKCreate = "SDKCreate",
    OnCreate = "OnCreate",
    SetPage = "SetPage",
    GetAttributes = "GetAttributes",
    Ready = "Ready",
    Destory = "Destory",
    StartCreate = "StartCreate",
    WrapperDidUpdate = "WrapperDidUpdate",
    DispayIframe = "DispayIframe",
    HideIframe = "HideIframe",
    PageTo = 'PageTo'
}

/**
 * 白板目前会用到的
 */
export enum AgoraEvents {
    //切换页面
    AgoraPageChanged = "AgoraPageChanged",
}

class AgoraWhiteBoard extends cc.EventTarget implements IStateSync {
    constructor() {
        super();
        this.registerEvent();
    }

    sdkCreate(): void {
        this.postMessage(IframeEvents.SDKCreate);
    }

    init(): void {
        this.postMessage(IframeEvents.Init);
    }

    nextPage(): void {
        this.postMessage(IframeEvents.NextPage);
    }

    prevPage(): void {
        this.postMessage(IframeEvents.PrevPage);
    }

    pageTo(page: number): void {
        this.postMessage(IframeEvents.PageTo, page);
    }

    setTotalPages(page: number): void {
        this.postMessage(IframeEvents.SetPage, page);
    }

    postMessage(name: string, obj?: any): void {
        parent.postMessage({
            kind: name,
            payload: obj
        }, "*");
    }

    syncState(data: any): void {
        this.postMessage(IframeEvents.SetAttributes, data);
    }

    private registerEvent() {
        //监听iframe过来的事件
        window.addEventListener("message", this.onMessage.bind(this));
        //监听 eduGame 初始化事件
        eduGame.addEventListener(eduGame.Event.OnInitialize, this.onInit.bind(this));
        //监听 eduGame 的页面切换事件
        eduGame.addEventListener(eduGame.Event.OnPageSwitch, this.onPageChanged.bind(this));
    }

    onPageChanged(info) {
        let [cur, total] = GameConfig.getPagePositionInfo(info.page.id);
        this.pageTo(cur);
    }

    onInit() {
        let pageInfo = GameConfig.getBeginPage();
        let [cur, total] = GameConfig.getPagePositionInfo(pageInfo.id);
        this.setTotalPages(total);
        this.on(StateSyncEvent.PageChange, this.handlePageChanged, this);
        this.init();
    }

    handlePageChanged(info) {
        let page = GameDB.curPageInfo;
        if (page.lesson) {
            let jumpPage = page.lesson.pages[info.index];
            if (jumpPage && GameDB.curPageInfo.id !== jumpPage.id) {
                eduGame.goPageByID(jumpPage.id);
            }
        }
    }

    private onMessage(event) {
        console.log('receive event ', event);
        let data = event.data;
        let payload = data.payload;
        switch (data.kind) {
            case IframeEvents.Init:
                break;
            case IframeEvents.RoomStateChanged:
                if (payload.sceneState) {
                    let sceneState = payload.sceneState;
                    this.emit(StateSyncEvent.PageChange, sceneState);
                }
                break;
            case IframeEvents.AttributesUpdate:
                console.log('onMessage AttributesUpdate', payload);
                this.emit(StateSyncEvent.StateUpdate, payload);
                break;
            default:
                break;
        }
    }
}

export let agoraWhiteBoard = new AgoraWhiteBoard();

