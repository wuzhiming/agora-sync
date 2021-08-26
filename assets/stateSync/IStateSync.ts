export interface IStateSync {
    init();

    setAttributes(data: any);

    nextPage();

    prevPage();

    pageTo(page: number);

    setTotalPages(page: number);

    compStateUpdate(compId);

    getAttributes();

    setAttributes(attr: any);

    on(...args);
    once(...args);
    off(...args);
}

export enum StateSyncEvent {
    PageChange = 'PageChange',
    StateUpdate = 'StateUpdate',
    //组件状态更新事件
    CompStateUpdate = 'CompStateUpdate',
    //获取状态
    GetAttributes = 'GetAttributes',
    AttributesUpdate = 'AttributesUpdate',
}
