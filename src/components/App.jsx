import React, { Component } from 'react';
import GRID from './grid';
const max = function (x, y) {
    return x > y ? x : y;
};

class App extends Component {
    state = {
        total: 0,
        counters: [
            { id: 1, value: 0 },
            { id: 2, value: 0 },
            { id: 3, value: 0 },
        ]
    };



    handleDelete = (counter) => {
        // console.log("Event handler called." + counterId);
        const counters = this.state.counters.filter((c) => c.id !== counter.id);
        this.setState({
            counters: counters,
            total: max(this.state.total - counter.value, 0),
        });
    };

    handlePlus = (counter) => {
        // console.log("plus : " + counter.id + " " + counter.value);
        const index = this.state.counters.indexOf(counter);
        const counters = this.state.counters;
        counters[index].value++;
        this.setState({ counters: counters, total: this.state.total + 1 });
    };

    handleMinus = (counter) => {
        // console.log("minus : " + counter.id + " " + counter.value);
        const index = this.state.counters.indexOf(counter);
        const counters = this.state.counters;
        const diff = counter.value === 0 ? 0 : 1;
        counters[index].value = counters[index].value - diff;
        this.setState({
            counters: counters,
            total: max(this.state.total - diff, 0),
        });
    };

    handleReset = (reset) => {
        // console.log(reset);
        var arr = this.state.counters;
        arr = arr.map((c) => {
            c.value = 0;
            return c;
        });
        // console.log(arr);
        this.setState({ counters: arr, total: 0 });
    };

    render() {
        return (
            <React.Fragment>
                    <GRID/>
            </React.Fragment>
        );
    }
}

export default App;