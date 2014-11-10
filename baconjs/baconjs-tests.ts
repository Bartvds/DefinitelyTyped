/// <reference path="baconjs.d.ts" />
/// <reference path="../node/node.d.ts" />

//TODO test jquery

import BaconNodeModule = require('baconjs');
import BaconNode = BaconNodeModule.Bacon
import BaconAMD = require('bacon');

// test exports
var bc: typeof Bacon;
bc = BaconNode;
bc = BaconAMD;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Foo {
    foo: string = '';
}

class Bar {
    bar: string = '';
}

var num: number = 0;
var str: string = '';
var bool: boolean = false;;
var x: any;

var obj: Object = null;
var foo: Foo = null;
var bar: Bar = null;

var fooArr: Foo[] = null;
var barArr: Bar[] = null;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Event
var numEvent: Bacon.Event<number> = null;
var strEvent: Bacon.Event<string> = null;
var boolEvent: Bacon.Event<boolean> = null;

var anyEvent: Bacon.Event<any> = null;
var fooEvent: Bacon.Event<Foo> = null;
var barEvent: Bacon.Event<Bar> = null;

var anyArrEvent: Bacon.Event<any[]> = null;
var fooArrEvent: Bacon.Event<Foo[]> = null;
var barArrEvent: Bacon.Event<Bar[]> = null;

var anyEventArr: Bacon.Event<any>[] = null;
var fooEventArr: Bacon.Event<Foo>[] = null;
var barEventArr: Bacon.Event<Bar>[] = null;


// EventStream
var numStream: Bacon.IEventStream<number> = null;
var strStream: Bacon.IEventStream<string> = null;
var boolStream: Bacon.IEventStream<boolean> = null;

var anyStream: Bacon.IEventStream<any> = null;
var fooStream: Bacon.IEventStream<Foo> = null;
var barStream: Bacon.IEventStream<Bar> = null;

var anyArrStream: Bacon.IEventStream<any[]> = null;
var fooArrStream: Bacon.IEventStream<Foo[]> = null;
var barArrStream: Bacon.IEventStream<Bar[]> = null;


// Property
var numProperty: Bacon.IProperty<number> = null;
var strProperty: Bacon.IProperty<string> = null;
var boolProperty: Bacon.IProperty<boolean> = null;

var anyProperty: Bacon.IProperty<any> = null;
var fooProperty: Bacon.IProperty<Foo> = null;
var barProperty: Bacon.IProperty<Bar> = null;

var anyArrProperty: Bacon.IProperty<any[]> = null;
var fooArrProperty: Bacon.IProperty<Foo[]> = null;
var barArrProperty: Bacon.IProperty<Bar[]> = null;


// Observable
var numObservable: Bacon.Observable<number> = null;
var strObservable: Bacon.Observable<string> = null;
var boolObservable: Bacon.Observable<boolean> = null;

var anyObservable: Bacon.Observable<any> = null;
var fooObservable: Bacon.Observable<Foo> = null;
var barObservable: Bacon.Observable<Bar> = null;

var anyArrObservable: Bacon.Observable<any[]> = null;
var fooArrObservable: Bacon.Observable<Foo[]> = null;
var barArrObservable: Bacon.Observable<Bar[]> = null;

var fooPromise: Bacon.IThenable = null;
var emitter: NodeJS.EventEmitter = null;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

fooStream = Bacon.fromPromise(fooPromise);
fooStream = Bacon.fromPromise(fooPromise, bool);

fooStream = Bacon.fromEventTarget<Foo>(emitter, str);
fooStream = Bacon.fromEventTarget(emitter, str, (value: any) => {
    return foo;
});

fooStream = Bacon.fromCallback((callback) => {
    callback(foo);
});
fooStream = Bacon.fromCallback(obj, str);
fooStream = Bacon.fromCallback(obj, str, bar);

fooStream = Bacon.fromNodeCallback((callback) => {
    callback(null, foo);
});
fooStream = Bacon.fromNodeCallback((callback) => {
    callback(null, null);
});
fooStream = Bacon.fromNodeCallback<Foo>(obj, str);
fooStream = Bacon.fromNodeCallback<Foo>(obj, str, bar);

fooStream = Bacon.fromPoll(num, () => {
    return new Bacon.Next(foo);
});

fooStream = Bacon.once(foo);
fooStream = Bacon.once(new Bacon.Error(str));

fooStream = Bacon.fromArray(fooArr);
fooStream = Bacon.interval(num, foo);
fooStream = Bacon.sequentially(num, fooArr);
fooStream = Bacon.repeatedly(num, fooArr);
fooStream = Bacon.never<Foo>();
fooStream = Bacon.later(num, foo);

fooStream = Bacon.fromBinder((sink) => {
    sink(fooEventArr)
});
fooStream = Bacon.fromBinder((sink) => {
    sink(fooEvent)
});
fooStream = Bacon.fromBinder((sink) => {
    sink(foo);
});
fooStream = Bacon.fromBinder((sink) => {
    sink(foo);
    sink(Bacon.more);
});
fooStream = Bacon.fromBinder((sink) => {
    sink(foo);
    sink(Bacon.noMore);
});

fooStream = Bacon.constant<T>(foo): IProperty<T>;

fooStream = Bacon.combineAsArray<T>(streams: Observable<T>[]): IProperty<T>;
fooStream = Bacon.combineAsArray<T>(streams: any[]): IProperty<T>;

fooStream = Bacon.combineWith<T, R>(f: (...values: T[]) => R, ...streams: Observable<T>[]): IProperty<R>;
fooStream = Bacon.combineWith<T, R>(f: (...values: any[]) => R, ...streams: any[]): IProperty<R>;

fooStream = Bacon.combineTemplate<T>(template: Object): IProperty<T>;

fooStream = Bacon.mergeAll<T>(streams);
Bacon.mergeAll(streams: IEventStream<any>): IEventStream<any>;

fooStream = Bacon.zipAsArray<T>(streams[]);
fooStream = Bacon.zipAsArray(streams: IEventStream<any>[]): IEventStream<any>;

fooStream = Bacon.zipWith<T, R>(streams[], f: (...values: T[]) => R): IEventStream<R>;
fooStream = Bacon.zipWith<R>(streams: IEventStream<any>[], f: (...values: any[]) => R): IEventStream<R>;

fooStream = Bacon.onValues<T>(...args: any[]);

// {retries: nummber, ...}
fooStream = Bacon.retry<T>(param: Object);

fooStream = Bacon.when<T>(...params: any[]);
fooStream = Bacon.update<T>(initial: T, ...params: any[]): IProperty <T>;
