export interface IStateSync {
    init(): void;

    setAttributes(data: any): void;

    nextPage(): void;

    prevPage(): void;

    pageTo(page: number): void;

    setTotalPages(page: number): void;

    on(...args);
}
export enum StateSyncEvent {
    PageChange ,
    StateUpdate
}
