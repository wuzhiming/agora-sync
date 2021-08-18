export interface IStateSync {
    init(): void;

    syncState(data: any): void;

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
