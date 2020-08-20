import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../customcss/custom.css';
const LOG = 0;

class GRID extends Component {
    state = {
        board: [],
        userEntered : [],
        unsolved : true
    }

    /** building the grid during mounting phase of the component*/
    componentDidMount(){
        this.buildGrid();
    }

    /**Setting up empty grid*/
    buildGrid = () => {
        var mark = new Array(9);
        var a = new Array(9);
        for (var i = 0; i < a.length; ++i) {
            a[i] = new Array(9);
            mark[i] = new Array(9);
            for (var j = 0; j < a[i].length; ++j) {
                a[i][j] = { r: i, c: j, v: 0 };
                mark[i][j] = false;
            }
        }
        this.setState({ board: a ,userEntered : mark,unsolved:true});
    };

    resetGrid = ()=>{
        var grid = this.state.board;
        var mark = this.state.userEntered;
        for(var r = 0;r < 9;++r){
            for(var c = 0;c < 9;++c){
                grid[r][c].v = 0;
                mark[r][c] = false;
            }
        }
        this.setState({board : grid,userEntered:mark,unsolved:true});
    };
    /**This method handle Incrementing the value of cell from 1 to 9
     * 0->cell is not filled
     * (1-9)->only values cell can keep
    */
    handleIncr = (cell) => {
        // console.log(cell);
        var a = this.state.board;
        var mark = this.state.userEntered;
        a[cell.r][cell.c].v = (a[cell.r][cell.c].v + 1) % 10;
        if(this.state.unsolved === true){
            mark[cell.r][cell.c] = (a[cell.r][cell.c].v===0?false:true)//mark this cell as userEntered
        }
        this.setState({ board: a ,userEntered:mark});
    };

    notifyError = ()=>{
        if(this.validateSudoku(this.state.board)===false){
            toast.error("Puzzle is invalid!",{position:toast.POSITION.TOP_LEFT,autoClose:2000});
        }
    };

    updateValueOnChange = (event)=>{
        /**If any new value is inputted by the user, then this function will come in effect*/
        var row = event.target.dataset.rw;
        var col = event.target.dataset.cl;
        var new_val =  event.target.value;
        // console.log(row + " " + col + " "+ new_val);
        var a = this.state.board;
        var mark = this.state.userEntered;
        a[row][col].v = new_val;
        if(this.state.unsolved === true){
            mark[row][col] = (a[row][col].v===0?false:true)//mark this cell as userEntered
        }
        
        event.target.value = new_val;//we update the value the target value to new value here
        this.setState({ board: a ,userEntered:mark});
    };

    updateValueOnFocus = (event)=>{
        //when object gets focus
        // console.log("onFocus called " + event.target.dataset);
        /**
         * Store the previous value of the element in data-value and reset the value of the element
         */
        event.target.dataset.value = event.target.value;
        event.target.value = '';
    };

    updateValueOnBlur = (event)=>{
        //when object loses focus
        // console.log("onBlur called " + event.target.dataset);
        //If there is now new value inputted and the elemen loses focus then we restore the previous value for it
        if(event.target.value === ''){
            event.target.value = event.target.dataset.value;
        }
    };

    showgrid() {
        const { board } = this.state;
        var self = this;
        // console.log(self);
        // console.log(self.state.board);
        return (
            <React.Fragment>
                <div id='grid' className="nav justify-content-center bg-white">
                    {
                        (
                            // IMIF->rows
                            function () {
                                // console.log(self);
                                var rows = new Array(0);
                                for (var i = 0; i < board.length; ++i) {
                                    var row = 'r' + (i + 1);
                                    // console.log(row);
                                    rows.push(
                                        <div id={row} key={row} className="d-inline-block p-2 m-0.2   text-white">
                                            {
                                                (
                                                    // IMIF->columns
                                                    function (rid) {
                                                        // console.log(self);
                                                        var cols = new Array(0);
                                                        for (var cid = 0; cid < board[rid].length; ++cid) {
                                                            var col = rid + "" + cid;
                                                            // console.log(col);
                                                            //<button className={classesBtn} onClick={() => self.handleIncr(cell)}>{val}</button>

                                                            let cell = self.state.board[rid][cid];
                                                            var val  = self.state.board[rid][cid].v;
                                                            let classesBtn = 'btn text-white';
                                                            let classesCell = "border border-black text-white p-2 m-0.2 "+(self.state.userEntered[rid][cid]===true?"bg-dark":"bg-info");
                                                    
                                                            cols.push(
                                                                <div id={col} key={col} className={classesCell}>
                                                                    <input size="1" key = {cell} className = {classesBtn} onChange={self.updateValueOnChange} onFocus = {self.updateValueOnFocus} onBlur={self.updateValueOnBlur}  data-rw={rid} data-cl={cid} value={val} type="number" min="0" max="9" placeholder="0"/>
                                                                </div>
                                                            );
                                                        }
                                                        return cols;
                                                    }(i)
                                                )
                                            }
                                        </div>
                                    )
                                }
                                return rows;
                            }()
                        )
                    }
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <main className='container' onLoad = {this.buildGrid}>
                    {this.showgrid()}
                </main>
                <div className="nav justify-content-center bg-white">
                    <button className='btn btn-info m-1 sm' onClick={this.resetGrid}>Reset Puzzle</button>
                    <button className='btn btn-success m-1 sm' onClick={()=>{this.solveGrid();this.notifyError()}}>Solve Puzzle</button>
                    <ToastContainer/>
                </div>
            </React.Fragment>
        );
    };

    valuesCheck(grid,N){
        for (var row = 0; row < N; ++row) {
            var cnt = new Array(N + 1);
            for (var i = 0; i < N + 1; ++i) cnt[i] = 0;
            for (var col = 0; col < N; ++col) {
                var val = grid[row][col].v;
                if(val < 0 || val > 9) return 0;
            }
        }
        return 1;
    };

    RowCheck(grid, N) {
        for (var row = 0; row < N; ++row) {
            var cnt = new Array(N + 1);
            for (var i = 0; i < N + 1; ++i) cnt[i] = 0;
            for (var col = 0; col < N; ++col) {
                var val = grid[row][col].v;
                if (val !== 0) {
                    cnt[val] += 1;
                    if (cnt[val] > 1) return 0;
                }
            }
        }
        return 1;
    };


    ColCheck(grid, N) {
        for (var col = 0; col < N; ++col) {
            var cnt = new Array(N + 1);
            for (var i = 0; i < N + 1; ++i) cnt[i] = 0;
            for (var row = 0; row < N; ++row) {
                var val = grid[row][col].v;
                if (val !== 0) {
                    cnt[val] += 1;
                    if (cnt[val] > 1) return 0;
                }
            }
        }
        return 1;
    };

    CellCheck(grid, N) {
        var dp = new Array(3);
        for (var i = 0; i < 3; ++i) {
            dp[i] = new Array(3);
            for (var j = 0; j < 3; ++j) {
                dp[i][j] = new Array(N + 1);
                for (var k = 0; k < N + 1; ++k)
                    dp[i][j][k] = 0;
            }
        }
        for (var row = 0; row < N; ++row) {
            for (var col = 0; col < N; ++col) {
                var val = grid[row][col].v;
                if (val !== 0) {
                    var r = Math.floor(row / 3);
                    var c = Math.floor(col / 3);
                    dp[r][c][val]++;
                    // console.log(r + " " + c + " " + val +" "+  dp[r][c][val]);
                    if (dp[r][c][val] > 1) return 0;
                }
            }
        }
        return 1;
    };


    /**To do the validation of the grid*/
    validateSudoku(grid) {
        // console.log(grid);
        const N = grid.length;
        /**Row Checks*/
        if(this.valuesCheck(grid,N) === 0) return false;
        if (this.RowCheck(grid, N) === 0) return false;
        if (LOG === 1)
            console.log("RowCheck : pass");
        /**Col Checks*/
        if (this.ColCheck(grid, N) === 0) return false;
        if (LOG === 1)
            console.log("ColCheck : pass");
        /**Cell Checks*/
        if (this.CellCheck(grid, N) === 0) return false;
        if (LOG === 1)
            console.log("CellCheck : pass");
        return true;
    };


    fillGrid(grid, row, col, N) {
        //for curren row-r
        if (LOG === 1)
            console.log(row + " " + col + " " + N);
        if (row === N) {
            for (var r = 0; r < N; ++r) {
                var line = "";
                for (var c = 0; c < N; ++c) {
                    line += grid[r][c].v + " ";
                }
                if (LOG === 1)
                    console.log(r + "# : " + line);
            }
            return true;
        }
        var next_row;
        var next_col;
        if (grid[row][col].v === 0) {
            // console.log("Yes");
            for (var val = 1; val <= 9; ++val) {
                grid[row][col].v = val;
                if (this.validateSudoku(grid) === true) {
                    // console.log(val +" Yes");
                    next_col = (col + 1) % N;
                    next_row = row + (next_col === 0 ? 1 : 0);
                    if (this.fillGrid(grid, next_row, next_col, N)) {
                        return true;
                    }
                }
                grid[row][col].v = 0;
            }
        }
        else {
            next_col = (col + 1) % N;
            next_row = row + (next_col === 0 ? 1 : 0);
            if (this.fillGrid(grid, next_row, next_col, N)) {
                return true;
            }
        }
        return false;
    }

    solveGrid = () => {
        // console.log(this.state.board);
        if (LOG === 1)
            console.log("Solving Puzzle....");
        var grid = this.state.board;
        var ok_fill = this.fillGrid(grid, 0, 0, grid.length) === true ? 1 : 0;
        var ok_grid = this.validateSudoku(grid) === true ? 1 : 0;
        if (ok_grid === 0 || ok_fill === 0) {
            // window.alert("Invalid puzzle!");
            return (<span>Invalid Puzzle!</span>);
        }
        else {
            if (LOG === 1)
                console.log("Sudoku is " + (ok_fill === true ? "solved" : "Impossible"));
            this.setState({ board: grid , unsolved:false})
        }    // console.log(grid);
        return (<span>Puzzle Solved</span>);
        // console.log(this.state.board);
        // console.log("Grid is "+(this.validateSudoku(grid)===true?"valid":"invalid"));
    };
}

export default GRID;