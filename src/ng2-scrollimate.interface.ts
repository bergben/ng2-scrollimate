export interface State {
    method: string;
    value?: number;
    state?: string;
    sizes?: string;
    class?: string;
    setAtLastChance?: boolean;
    setAtLastChanceTopPx?: number;
    setAtLastChanceBottomPx?: number;
    [propName: string]: any;
}
export interface Options {
    currentState: string;
    states: State[];
}
