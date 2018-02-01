import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action, useStrict, runInAction } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

useStrict(true)

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
class AppState {
    @observable timer = 0;

    constructor() {
        setInterval(() => {
            runInAction("add one",() => {
                this.timer += 1;
            })
        }, 1000);
    }

    @action
    resetTimer = () => {
        this.timer = 0;
    }

    @action
    set100 = async () => {
        await delay(3000)
        runInAction("sync set 100",() => {
            this.timer = 100
        })
    }
}

@inject((stores: any) => {
    const appState = stores.appState as AppState
    return {
        set100: appState.set100,
        resetTimer: appState.resetTimer,
        timer: appState.timer
    }
})
class TimerView extends React.Component<any, {}> {
    render() {
        return (
            <>
            <button onClick={this.onReset}>
                Seconds passed: {this.props.timer}
            </button>
            <button onClick={this.onSet100}>
                set 100
                </button>
            <DevTools />
            </>
        );
    }

    onReset = () => {
        this.props.resetTimer();
    }

    onSet100 = () => {
        this.props.set100();
    }
};

const appState = new AppState();

class Root extends React.Component<any, {}>{
    render() {
        return (
            <Provider appState={appState}>
                <TimerView />
            </Provider>
        )
    }
}
ReactDOM.render(<Root />, document.getElementById('root'));
