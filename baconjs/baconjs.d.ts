
declare module Bacon {
    export interface IThenable<R> {
        then<U>(onFulfilled: (value: R) => IThenable<U>, onRejected: (error: any) => IThenable<U>): IThenable<U>;
        then<U>(onFulfilled: (value: R) => IThenable<U>, onRejected?: (error: any) => U): IThenable<U>;
        then<U>(onFulfilled: (value: R) => U, onRejected: (error: any) => IThenable<U>): IThenable<U>;
        then<U>(onFulfilled?: (value: R) => U, onRejected?: (error: any) => U): IThenable<U>;
    }

    export interface IEventEmmiter {
        on(type: string, handler: Function): void;
    }

    interface IBinderOpaque {
        // nothing
    }

    interface IUnsubscribe {
        (): void;
    }

    interface IQuery {
        asIEventStream<T>(eventName: string): Bacon.IEventStream<T>;
    }

    //TODO apply "Function Construction rules" to observer

    var more: IBinderOpaque;
    var noMore: IBinderOpaque;
    var version: string;

    var $: IQuery;
    var _: IUtil;

    function fromPromise<T>(promise: IThenable<T>, abort?: boolean): IEventStream<T>;

    function fromEventTarget<T>(target: IEventEmmiter, eventName: string , eventTransformer?: (value: any) => T): IEventStream<T>;

    function fromCallback<T>(f: (callback: (value: T) => void) => void): IEventStream<T>;
    function fromCallback<T>(object: Object, methodName: string, ...args: any[]): IEventStream<T>;

    function fromNodeCallback<T>(f: (callback: (err: any, value: T) => void) => void): IEventStream<T>;
    function fromNodeCallback<T>(object: Object, methodName: string, ...args: any[]): IEventStream<T>;

    function fromPoll<T>(interval: number, f: () => Event<T>): IEventStream<T>;

    function once<T>(value: T): IEventStream<T>;
    function once<T>(value: Error): IEventStream<T>;

    function fromArray<T>(values: T[]): IEventStream<T>;
    function interval<T>(interval: number, value: T): IEventStream<T>;
    function sequentially<T>(interval: number, values: T[]): IEventStream<T>;
    function repeatedly<T>(interval: number, values: T[]): IEventStream<T>;
    function never<T>(): IEventStream<T>;
    function later<T>(delay: number, value: T): IEventStream<T>;

    function fromBinder<T>(subscribe: (sink: (value: Event<T>[]) => void) => void): IEventStream<T>;
    function fromBinder<T>(subscribe: (sink: (value: Event<T>) => void) => void): IEventStream<T>;
    function fromBinder<T>(subscribe: (sink: (value: T) => void) => void): IEventStream<T>;
    function fromBinder<T>(subscribe: (sink: (value: IBinderOpaque) => void) => void): IEventStream<T>;

    function constant<T>(value: T): IProperty<T>;

    function combineAsArray<T>(streams: Observable<T>[]): IProperty<T>;
    function combineAsArray<T>(streams: any[]): IProperty<T>;

    function combineWith<T, R>(f: (...values: T[]) => R, ...streams: Observable<T>[]): IProperty<R>;
    function combineWith<T, R>(f: (...values: any[]) => R, ...streams: any[]): IProperty<R>;

    function combineTemplate<T>(template: Object): IProperty<T>;

    function mergeAll<T>(streams: IEventStream<T>): IEventStream<T>;
    function mergeAll(streams: IEventStream<any>): IEventStream<any>;

    function zipAsArray<T>(streams: IEventStream<T>[]): IEventStream<T>;
    function zipAsArray(streams: IEventStream<any>[]): IEventStream<any>;

    function zipWith<T, R>(streams: IEventStream<T>[], f: (...values: T[]) => R): IEventStream<R>;
    function zipWith<R>(streams: IEventStream<any>[], f: (...values: any[]) => R): IEventStream<R>;

    function onValues<T>(...args: any[]): IEventStream<T>;

    // {retries: nummber, ...}
    function retry<T>(param: Object): IEventStream<T>;

    function when<T>(...params: any[]): IEventStream<T>;
    function update<T>(initial: T, ...params: any[]): IProperty <T>;

    // should be an interface

    interface Observable<T> extends IObservable<T, Observable<T>> {

    }

    interface IObservable<T, K> {
        subscribe(f: (value: Event<T>) => void): IUnsubscribe;

        onValue(f: (value: T) => void): IUnsubscribe;
        onValues(f: (...values: T[]) => void): IUnsubscribe;

        onError(f: (value: Error) => void): IUnsubscribe;
        onEnd(f: () => void): IUnsubscribe;

        map<R>(f: (value: T) => R): K;
        map<R>(prop: string): K;
        map<R>(value: T): K;

        mapError(f: (value: Error) => T): void;
        errors(): IEventStream<T>;
        skipErrors(): void;

        mapEnd(f: () => T): void;
        mapEnd(value: T): void;
        mapEnd(): void;

        filter(f: (value: T) => boolean): K;
        filter(prop: string): K;
        filter(value: boolean): K;

        takeWhile(f: () => boolean): K;
        takeWhile(prop: string): K;

        take(amount: number): K;

        takeUntil<R>(stream: IEventStream<R>): K;

        skip(amount: number): void;

        delay(delay: number): K;
        throttle(delay: number): K;
        debounce(delay: number): K;
        debounceImmediate(delay: number): K;
        bufferingThrottle(minimumInterval: number): K;

        doAction(f: (value: T) => void): K;

        not(): K;

        flatMap<R>(f: (value: T) => Observable<R>): IEventStream<R>;
        flatMap<R>(f: (value: T) => R): IEventStream<R>;
        flatMap<R>(f: Observable<R>): IEventStream<R>;

        flatMapLatest<R>(f: (value: T) => Observable<R>): IEventStream<R>;
        flatMapLatest<R>(f: (value: T) => R): IEventStream<R>;
        flatMapLatest<R>(f: Observable<R>): IEventStream<R>;

        flatMapFirst<R>(f: (value: T) => Observable<R>): IEventStream<R>;
        flatMapFirst<R>(f: (value: T) => R): IEventStream<R>;
        flatMapFirst<R>(f: Observable<R>): IEventStream<R>;

        flatMapWithConcurrencyLimit<R>(limit: number, f: (value: T) => Observable<R>): IEventStream<R>;
        flatMapWithConcurrencyLimit<R>(limit: number, f: (value: T) => R): IEventStream<R>;
        flatMapWithConcurrencyLimit<R>(limit: number, f: Observable<R>): IEventStream<R>;

        flatMapConcat<R>(f: (value: T) => Observable<R>): IEventStream<R>;
        flatMapConcat<R>(f: (value: T) => R): IEventStream<R>;
        flatMapConcat<R>(f: Observable<R>): IEventStream<R>;

        scan<R>(seed: R, f: (value: T) => R): IProperty<R>;
        scan<R>(seed: R, method: string): IProperty<R>;

        fold<R>(seed: R, f: (value: T) => R): IProperty<R>;
        fold<R>(seed: R, method: string): IProperty<R>;
        reduce<R>(seed: R, f: (value: T) => R): IProperty<R>;
        reduce<R>(seed: R, method: string): IProperty<R>;

        diff<R>(start: T, f: (a: T, b: T) => R): IProperty<R>;

        zip<U, R>(other: Observable<U>, f: (a: T, b: U) => R): IEventStream<R>;

        slidingWindow(max: number, min?: number): IProperty<T[]>;

        log(...args: any[]): K;

        combine<U, R>(other: Observable<U>, f: (a: T, b: U) => R): IProperty<R>;
        combine<U, R>(other: Observable<U>, method: string): IProperty<R>;

        withStateMachine<R>(initState: R, f: (sum: R, event: Event<T>) => any[]): K;

        decode<R>(mapping: Object): IProperty<R>;
        awaiting<U>(other: Observable<U>): IProperty<boolean>;

        endOnError(): K;
        endOnError(f: (error: Error) => boolean): K;
        endOnError(prop: string): K;

        withHandler(f: (event: Event<T>) => T): K;

        name(newName: string): void;
        withDescription(...param: string[]): void;

        toString(): string;
        inspect(): string;

        deps(): Observable<any>[];
    }

    interface EventStream<T> {
        new(): IEventStream<T>;
    }

    interface IEventStream<T> extends IObservable<T, IEventStream<T>>  {
        skipDuplicates(isEqual?: (a: T, b: T) => boolean): IEventStream<T>;

        concat(otherStream: IEventStream<T>):  IEventStream<T>;
        concat<U>(otherStream: IEventStream<U>):  IEventStream<any>;

        merge(otherStream: IEventStream<T>):  IEventStream<T>;
        merge<U>(otherStream: IEventStream<U>):  IEventStream<any>;

        holdWhen<U>(valve: IEventStream<U>):  IEventStream<T>;

        startWith(value: T): IEventStream<T>;

        skipWhile(f: () => boolean): IEventStream<T>;
        skipWhile<U>(IProperty: IProperty<U>): IEventStream<T>;

        skipUntil<U>(stream2: IEventStream<U>): IEventStream<T>;

        bufferWithTime(delay: number): IEventStream<T[]>;
        bufferWithTime(f: (release:() => void) => void): IEventStream<T[]>;
        bufferWithCount(count: number): IEventStream<T[]>;
        bufferWithTimeOrCount(delay: number, count: number): IEventStream<T[]>;

        toIProperty(initialValue?: T): IProperty<T>;
    }

    interface Property<T> {
        new(): IProperty<T>;
    }

    interface IProperty<T> extends IObservable<T, IProperty<T>> {
        toIEventStream(): IEventStream<T>;

        assign(obj: Object, method: string, ...param: any[]): void;

        sample(interval: number): IEventStream<T>;
        sampledBy<U>(stream: IEventStream<U>): IEventStream<T>;
        sampledBy<U>(IProperty: IProperty<U>): IProperty<T>;

        sampledBy<U, R>(stream: Observable<U>, f: (a: T, b: U) => R): IProperty<R>;
        sampledBy<U, R>(stream: Observable<U>, method: string): IProperty<R>;

        skipDuplicates(isEqual?: (a: T, b: T) => boolean): IProperty<T>;

        changes(): IEventStream<T>;

        and<U>(other: IProperty<U>): IProperty<boolean>;
        or<U>(other: IProperty<U>): IProperty<boolean>;

        startWith(value: T): IProperty<T>;
    }

    interface Bus<T> {
        new(): IBus<T>;
    }

    interface IBus<T> extends IEventStream<T> {
        push(value: T): void;
        end(): void;
        // error or string?
        error(e: string): void;

        plug(stream: IEventStream<T>): () => void;
    }

    class Event<T> {
        isInitial(): boolean;
        isNext(): boolean;
        isEnd(): boolean;

        value(): T;
        hasValue(): boolean;
    }

    class Initial<T> extends Event<T> {
        constructor(value: T);
        constructor(f: () => T);
    }

    class Next<T> extends Event<T> {
        constructor(value: T);
        constructor(f: () => T);
    }

    class End<T> extends Event<T> {
    }

    class Error extends Event<any> {
        constructor(message: string);
        error: string;
    }

    interface IUtil {
        indexOf<T>(xs:T[], value:T): number;
        indexWhere<T>(xs:T[], f:(value:T) => boolean): number;
        head<T>(xs:T[]): T;
        always<T>(x:T): T;
        negate<T>(f:Function): T;
        empty<T>(xs:T[]): boolean;
        tail<T>(xs:T[]): T;
        filter<T>(f:(value:T) => boolean, xs:T[]): T[];
        map<T, R>(f:(value:T) => R, xs:T[]): R[];
        each<T, R>(xs:T[], f:(key:number, value:T) => R): R[];
        each(xs:Object, f:(key:string, value:any) => any): Object;
        toArray<T>(xs:T[]): T[];
        toArray(xs:Object): any[];
        contains<T>(xs:T[], x:T): boolean;
        id<T>(x:T): T;
        last<T>(xs:T[]): T;
        all<T>(xs:T[], f:(value:T) => boolean): boolean;
        any<T>(xs:T[], f:(value:T) => boolean): boolean;
        without<T>(x:T, xs:T[]): T[];
        remove<T>(x:T, xs:T[]): T[];
        fold<T, R>(xs:T[], seed:R, f:(seed:R, value:T) => void): R;
        flatMap<T, R>(f:(x:T) => R, xs:any[]): R[];
        cached<T>(f:Function): T;
        toString(obj:any): string;
    }
}

// node
declare module 'baconjs' {
    export var Bacon: typeof Bacon;
}

// bower
declare module 'bacon' {
    export = Bacon;
}

interface JQueryStatic {
    asIEventStream<T>(eventName: string): Bacon.IEventStream<T>;
}

interface ZeptoStatic {
    asIEventStream<T>(eventName: string): Bacon.IEventStream<T>;
}
