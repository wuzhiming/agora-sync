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
    _pageLoaded = false;

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

    async setAttributes(obj: any) {
        return new Promise((resolve, reject) => {
            this.once(StateSyncEvent.AttributesUpdate, (data) => {
                resolve(data);
            });
            this.postMessage(IframeEvents.SetAttributes, obj);
        });
    }

    async getAttributes() {
        return new Promise((resolve, reject) => {
            this.once(StateSyncEvent.GetAttributes, (data) => {
                resolve(data);
            })
            this.postMessage(IframeEvents.GetAttributes);
        });
    }

    compStateUpdate(compId: string) {
        this.postMessage(IframeEvents.DispatchMagixEvent, {
            event: StateSyncEvent.CompStateUpdate,
            payload: compId,
        });
    }

    setCurPage(page) {
        this.setAttributes({curPage: page});
    }

    postMessage(name: string, obj?: any): void {
        console.log('post message', name, obj);
        parent.postMessage({
            kind: name,
            payload: obj
        }, "*");
    }

    private registerEvent() {
        //监听iframe过来的事件
        window.addEventListener("message", this.onMessage.bind(this));
        //注册 自定义 事件 ，组件状态更新
        this.postMessage(IframeEvents.RegisterMagixEvent, StateSyncEvent.CompStateUpdate);
        //监听 eduGame 初始化事件
        eduGame.addEventListener(eduGame.Event.OnInitialize, this.onInit.bind(this));
        //监听 eduGame 的页面切换事件
        eduGame.addEventListener(eduGame.Event.OnPageSwitch, this.onPageChanged.bind(this));

        this.once(StateSyncEvent.GetAttributes, this._initPage, this);
    }

    onPageChanged(info) {
        if (!this._pageLoaded) {
            this._pageLoaded = true;
            return;
        }
        let [cur, total] = GameConfig.getPagePositionInfo(info.page.id);
        this.setCurPage(info.page.id);
        this.pageTo(cur);
    }

    onInit() {
        this.getAttributes();

        this.on(StateSyncEvent.PageChange, this.handlePageChanged, this);
    }

    private _initPage(info) {
        let pageId = info.curPage
        if (!pageId) {
            let pageInfo = GameConfig.getBeginPage();
            pageId = pageInfo.id;
            this.setCurPage(pageId);
        }
        let [cur, total] = GameConfig.getPagePositionInfo(pageId);
        this.setTotalPages(total);
        eduGame.goPageByID(pageId);
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
        console.log('receive event ', event.data);
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
                this.emit(StateSyncEvent.AttributesUpdate, payload);
                break;
            case IframeEvents.ReciveMagixEvent:
                if (payload.event === StateSyncEvent.CompStateUpdate) {
                    this.emit(StateSyncEvent.CompStateUpdate, payload.payload, payload);
                }
                break;
            case IframeEvents.GetAttributes:
                this.emit(StateSyncEvent.GetAttributes, payload);
                break;
            default:
                break;
        }
    }
}


export let agoraWhiteBoard = new AgoraWhiteBoard();

